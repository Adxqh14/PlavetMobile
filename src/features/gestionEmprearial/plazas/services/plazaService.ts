import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Plaza, CreatePlazaData, PlazaQueryParams } from "../types";
import { centroTrabajoService } from "../../centroDeTrabajo/services/centroTrabajoService";
import { talleresService } from "../../../gestionAcademica/talleres/services/talleresService";

// Cache de diccionarios para evitar peticiones repetitivas
let centrosCache: Map<number, string> | null = null;
let talleresCache: Map<string, string> | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60000; // 1 minuto

async function updateCaches() {
  const now = Date.now();
  if (centrosCache && talleresCache && now - lastCacheUpdate < CACHE_TTL) return;

  try {
    const [centrosRes, talleresRes] = await Promise.all([
      centroTrabajoService.getAll({ pageSize: 500 }),
      talleresService.getAll({ pageSize: 500 })
    ]);

    centrosCache = new Map(centrosRes.data.map(c => [Number(c.id), c.name]));
    talleresCache = new Map(talleresRes.data.map(t => [String(t.id), t.nombre]));
    lastCacheUpdate = now;
  } catch (err) {
    console.error("Error actualizando caches en plazaService:", err);
    centrosCache = centrosCache || new Map();
    talleresCache = talleresCache || new Map();
  }
}

// Adaptador backend → frontend
const mapPlaza = (b: any): Plaza => {
  const centroNombre = centrosCache?.get(Number(b.empresaId)) || centrosCache?.get(Number(b.id_centro_trabajo)) || "Sin centro";
  const idTallerRaw = String(b.id_taller || b.taller || "");
  const tallerNombre = talleresCache?.get(idTallerRaw) || (b.taller && typeof b.taller === 'object' ? b.taller.nombre : b.taller) || "Taller #" + idTallerRaw;

  return {
    id: b.id,
    nombre: tallerNombre,
    centro: centroNombre,
    empresaId: b.empresaId ?? b.id_centro_trabajo ?? undefined,
    idTaller: idTallerRaw,
    titulo: b.titulo || tallerNombre,
    genero: b.genero === "Ambos" ? "Indistinto" : (b.genero as any) || "Indistinto",
    estado:
      b.estado === "Activa" || b.estado === "Disponible" ? "Activa" : b.estado === "Ocupada" ? "Ocupada" : "Inhabilitada",
    descripcion: b.observacion || "",
    fechaCreacion: b.fecha_creacion || b.fechaCreacion
      ? new Date(b.fecha_creacion || b.fechaCreacion).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    taller: tallerNombre,
    cupoTotal: b.cupoTotal ?? b.cantidad ?? 0,
    cupoOcupado: b.cupoOcupado ?? b.cupo_ocupado ?? 0,
  };
};

export const plazaService = {
  fetchPlazasPaginated: async (
    params: PlazaQueryParams = {}
  ): Promise<PaginatedResponse<Plaza>> => {
    await updateCaches();

    const query: Record<string, string | number | boolean> = {
      page: params.page || 1,
      pageSize: params.pageSize || 15,
    };
    if (params.search) query.search = params.search;
    if (params.estado && params.estado !== "todos") query.estado = params.estado;
    if (params.taller && params.taller !== "todos") query.id_taller = params.taller;

    const response = await apiClient.get<any>("/api/plazas", query);
    
    const resultData = response.data || response;
    const items = Array.isArray(resultData) ? resultData : (resultData.data || []);
    
    return {
      success: true,
      data: items.map(mapPlaza),
      pagination: response.pagination || {
        page: params.page || 1,
        pageSize: params.pageSize || 15,
        total: items.length,
        totalPages: 1
      }
    };
  },

  fetchPlazaById: async (id: number): Promise<ApiResponse<Plaza>> => {
    await updateCaches();
    const response = await apiClient.get<any>(`/api/plazas/${id}`);
    const data = response.data || response;
    return {
      success: true,
      data: mapPlaza(data)
    };
  },

  createPlaza: async (data: CreatePlazaData): Promise<ApiResponse<Plaza>> => {
    const payload: Record<string, any> = {
      empresaId: Number(data.empresaId),
      taller: String(data.idTaller || data.taller), // Enviamos el ID como string
      cupoTotal: Math.max(1, Number(data.cupoTotal ?? 1)),
    };

    const response = await apiClient.post<any>("/api/plazas", payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapPlaza(resultData)
    };
  },

  updatePlazaApi: async (plaza: Plaza): Promise<ApiResponse<Plaza>> => {
    const payload: Record<string, any> = {};
    if (plaza.empresaId !== undefined && plaza.empresaId !== null) {
      payload.empresaId = Number(plaza.empresaId);
    }
    
    // IMPORTANTE: El backend espera 'taller' como un string numérico (ID)
    if (plaza.idTaller) {
        payload.taller = String(plaza.idTaller);
    } else if (plaza.taller && !isNaN(Number(plaza.taller))) {
        payload.taller = String(plaza.taller);
    }
    
    if (plaza.cupoTotal !== undefined && plaza.cupoTotal !== null) {
      payload.cupoTotal = Math.max(1, Number(plaza.cupoTotal));
    }

    // El backend no permite enviar 'estado' en el DTO de actualización general
    // Si se requiere cambiar el estado, se deben usar los endpoints específicos (como DELETE para cancelar)

    const response = await apiClient.patch<any>(
      `/api/plazas/${plaza.id}`,
      payload
    );
    const resultData = response.data || response;
    return {
      success: true,
      data: mapPlaza(resultData)
    };
  },

  deletePlazaApi: async (id: number): Promise<ApiResponse<void>> => {
    await apiClient.delete(`/api/plazas/${id}`);
    return { success: true, data: undefined };
  }
};

export const fetchPlazasPaginated = plazaService.fetchPlazasPaginated;
export const fetchPlazaById = plazaService.fetchPlazaById;
export const createPlaza = plazaService.createPlaza;
export const updatePlazaApi = plazaService.updatePlazaApi;
export const deletePlazaApi = plazaService.deletePlazaApi;
export async function fetchPlazas(params: PlazaQueryParams = {}): Promise<Plaza[]> {
  const res = await plazaService.fetchPlazasPaginated(params);
  return res.data;
}
