import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Plaza, CreatePlazaData, PlazaQueryParams } from "../types";
import { centroTrabajoService } from "../../centroDeTrabajo/services/centroTrabajoService";
import { talleresService } from "../../../gestionAcademica/talleres/services/talleresService";

const ENDPOINT = "/api/v1/plazas";

// Cache con claves string (UUID) para centros y talleres
let centrosCache: Map<string, string> | null = null;
let talleresCache: Map<string, string> | null = null;
let lastCacheUpdate = 0;
const CACHE_TTL = 60000; // 1 minuto

async function updateCaches() {
  const now = Date.now();
  if (centrosCache && talleresCache && now - lastCacheUpdate < CACHE_TTL) return;

  try {
    const [centrosRes, talleresRes] = await Promise.all([
      centroTrabajoService.getAll({ pageSize: 500 }),
      talleresService.getAll({ pageSize: 500 }),
    ]);

    // IDs son UUIDs (strings), no convertir a number
    centrosCache = new Map(centrosRes.data.map((c) => [String(c.id), c.name]));
    talleresCache = new Map(talleresRes.data.map((t) => [String(t.id), t.nombre]));
    lastCacheUpdate = now;
  } catch (err) {
    console.error("Error actualizando caches en plazaService:", err);
    centrosCache = centrosCache || new Map();
    talleresCache = talleresCache || new Map();
  }
}

// Adaptador backend → frontend
// El backend devuelve: id_centro_trabajo (UUID), id_taller (UUID), cantidad
const mapPlaza = (b: any): Plaza => {
  const centroId = String(b.id_centro_trabajo || b.empresaId || "");
  const tallerId = String(b.id_taller || b.taller || "");

  const centroNombre =
    centrosCache?.get(centroId) ||
    (b.centro_trabajo && typeof b.centro_trabajo === "object"
      ? b.centro_trabajo.nombre
      : undefined) ||
    "Sin centro";

  const tallerNombre =
    talleresCache?.get(tallerId) ||
    (b.taller && typeof b.taller === "object" ? b.taller.nombre : undefined) ||
    `Taller #${tallerId}`;

  const generoMap: Record<string, Plaza["genero"]> = {
    m: "Masculino",
    f: "Femenino",
    indefinido: "Indistinto",
    ambos: "Indistinto",
  };

  return {
    id: b.id,
    nombre: tallerNombre,
    centro: centroNombre,
    empresaId: centroId || undefined,
    idTaller: tallerId,
    titulo: b.titulo || tallerNombre,
    genero: generoMap[(b.genero || "indefinido").toLowerCase()] || "Indistinto",
    estado:
      b.estado === "activa" || b.estado === "Activa" || b.estado === "Disponible"
        ? "Activa"
        : b.estado === "completa" || b.estado === "Ocupada"
        ? "Ocupada"
        : "Inhabilitada", // inactiva, cancelada, etc.
    descripcion: b.observacion || b.descripcion || "",
    fechaCreacion:
      b.fecha_creacion || b.fechaCreacion
        ? new Date(b.fecha_creacion || b.fechaCreacion).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    taller: tallerNombre,
    cupoTotal: b.cantidad ?? b.cupoTotal ?? b.cupo_total ?? 0,
    cupoOcupado: b.cupo_ocupado ?? b.cupoOcupado ?? 0,
    cantidadPersonas: b.cantidad ?? b.cupoTotal ?? b.cupo_total ?? 0,
    edadMinima: b.edad_minima ?? b.edadMinima ?? undefined,
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
    // String vacío "" es falsy en el repositorio → devuelve todos sin filtrar por estado
    query.estado = (params.estado && params.estado !== "todos") ? params.estado : "";
    if (params.taller && params.taller !== "todos") query.id_taller = params.taller;

    const response = await apiClient.get<any>(ENDPOINT, query);

    const resultData = response.data || response;
    const items = Array.isArray(resultData) ? resultData : resultData.data || [];

    return {
      success: true,
      data: items.map(mapPlaza),
      pagination: response.pagination || {
        page: params.page || 1,
        pageSize: params.pageSize || 15,
        total: items.length,
        totalPages: 1,
      },
    };
  },

  fetchPlazaById: async (id: number | string): Promise<ApiResponse<Plaza>> => {
    await updateCaches();
    const response = await apiClient.get<any>(`${ENDPOINT}/${id}`);
    const data = response.data || response;
    return {
      success: true,
      data: mapPlaza(data),
    };
  },

  createPlaza: async (data: CreatePlazaData): Promise<ApiResponse<Plaza>> => {
    const generoMap: Record<string, string> = {
      Indistinto: "indefinido",
      Masculino: "m",
      Femenino: "f",
    };

    const payload: Record<string, any> = {
      nombre_plaza: data.nombre,
      centro_trabajo_nombre: data.centro,
      cantidad: Math.max(1, Number(data.cantidadPersonas ?? data.cupoTotal ?? 1)),
    };

    // taller_nombre es requerido por el DTO; id_taller es opcional (mejora la búsqueda)
    payload.taller_nombre = data.taller || "";
    if (data.idTaller) payload.id_taller = data.idTaller;

    if (data.edadMinima) payload.edad_minima = Number(data.edadMinima);
    if (data.genero) payload.genero = generoMap[data.genero] || "indefinido";
    if (data.descripcion) payload.observacion = data.descripcion;

    const response = await apiClient.post<any>(ENDPOINT, payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapPlaza(resultData),
    };
  },

  updatePlazaApi: async (plaza: Plaza): Promise<ApiResponse<Plaza>> => {
    // UpdatePlazaDto extiende PartialType(CreatePlazaDto) + estado
    // Campos válidos: id_centro_trabajo, id_taller, cantidad, edad_minima, genero, observacion, estado
    const payload: Record<string, any> = {};

    if (plaza.empresaId !== undefined && plaza.empresaId !== null) {
      payload.id_centro_trabajo = String(plaza.empresaId);
    }

    if (plaza.idTaller) {
      payload.id_taller = String(plaza.idTaller);
    } else if (plaza.taller && !plaza.taller.includes(" ")) {
      // Solo usar como ID si parece un UUID (sin espacios)
      payload.id_taller = String(plaza.taller);
    }

    const cantidad = plaza.cantidadPersonas ?? plaza.cupoTotal;
    if (cantidad !== undefined && cantidad !== null) {
      payload.cantidad = Math.max(1, Number(cantidad));
    }

    if (plaza.descripcion) payload.observacion = plaza.descripcion;

    const generoMap: Record<string, string> = {
      Indistinto: "indefinido",
      Masculino: "m",
      Femenino: "f",
    };
    if (plaza.genero) payload.genero = generoMap[plaza.genero] || "indefinido";

    const estadoMap: Record<string, string> = {
      Activa: "activa",
      Ocupada: "completa",
      Inhabilitada: "inactiva",
    };
    if (plaza.estado) payload.estado = estadoMap[plaza.estado] || plaza.estado.toLowerCase();

    const response = await apiClient.patch<any>(`${ENDPOINT}/${plaza.id}`, payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapPlaza(resultData),
    };
  },

  deletePlazaApi: async (id: number | string): Promise<ApiResponse<void>> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
    return { success: true, data: undefined };
  },
};

export const fetchPlazasPaginated = plazaService.fetchPlazasPaginated.bind(plazaService);
export const fetchPlazaById = plazaService.fetchPlazaById.bind(plazaService);
export const createPlaza = plazaService.createPlaza.bind(plazaService);
export const updatePlazaApi = plazaService.updatePlazaApi.bind(plazaService);
export const deletePlazaApi = plazaService.deletePlazaApi.bind(plazaService);

export async function fetchPlazas(params: PlazaQueryParams = {}): Promise<Plaza[]> {
  const res = await plazaService.fetchPlazasPaginated(params);
  return res.data;
}
