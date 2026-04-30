import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";
import { apiClient, API_BASE_URL } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import { centroTrabajoService } from "../../centroDeTrabajo/services/centroTrabajoService";

const ENDPOINT = "/api/tutores-institucionales";

// Adaptador: backend entity → frontend Tutor
const mapTutor = (b: any, centrosMap?: Map<number, string>): Tutor => ({
  id: b.id,
  nombre: b.nombre || "",
  apellido: b.apellido || "",
  email: b.contacto?.email || "",
  telefono: b.contacto?.telefono || "",
  idCentroTrabajo: b.id_centro_trabajo ?? null,
  nombreCentroTrabajo: b.id_centro_trabajo && centrosMap
    ? centrosMap.get(b.id_centro_trabajo) || undefined
    : undefined,
  estado: b.estado === "Activo" ? "Activo" : "Inactivo",
  fechaCreacion: b.fecha_creacion
    ? new Date(b.fecha_creacion).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
});

// Cache de centros de trabajo
let centrosCache: Map<number, string> | null = null;
let centrosCacheTime = 0;
const CACHE_TTL = 60000; // 1 min

async function getCentrosMap(): Promise<Map<number, string>> {
  const now = Date.now();
  if (centrosCache && now - centrosCacheTime < CACHE_TTL) return centrosCache;
  try {
    const res = await centroTrabajoService.getAll({ pageSize: 200 });
    centrosCache = new Map(res.data.map((c) => [Number(c.id), c.name]));
    centrosCacheTime = now;
  } catch {
    centrosCache = centrosCache || new Map();
  }
  return centrosCache;
}

export const tutorService = {
  getTutoresPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: { search?: string; estado?: string }
  ): Promise<PaginatedResponse<Tutor>> => {
    const queryParams: Record<string, string | number | boolean> = {
      page,
      pageSize,
    };
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.estado && filters.estado !== "todos")
      queryParams.estado = filters.estado;

    const [response, centrosMap] = await Promise.all([
      apiClient.get<PaginatedResponse<any>>(ENDPOINT, queryParams),
      getCentrosMap(),
    ]);

    return {
      ...response,
      data: response.data.map((b: any) => mapTutor(b, centrosMap)),
    };
  },

  getTutorById: async (id: number): Promise<Tutor> => {
    const response = await apiClient.get<ApiResponse<any>>(
      `${ENDPOINT}/${id}`
    );
    return mapTutor(response.data);
  },

  createTutor: async (data: CreateTutorData): Promise<Tutor> => {
    const response = await apiClient.post<ApiResponse<any>>(ENDPOINT, {
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      correo: data.correo || undefined,
      idCentroTrabajo: data.idCentroTrabajo || undefined,
    });
    return mapTutor(response.data);
  },

  updateTutor: async (
    id: number,
    data: UpdateTutorData
  ): Promise<Tutor> => {
    const payload: Record<string, any> = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.apellido !== undefined) payload.apellido = data.apellido;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.correo !== undefined) payload.correo = data.correo;
    if (data.idCentroTrabajo !== undefined)
      payload.idCentroTrabajo = data.idCentroTrabajo;

    const response = await apiClient.put<ApiResponse<any>>(
      `${ENDPOINT}/${id}`,
      payload
    );
    return mapTutor(response.data);
  },

  deleteTutor: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  restoreTutor: async (id: number): Promise<Tutor> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `${ENDPOINT}/${id}/restore`,
      {}
    );
    return mapTutor(response.data);
  },

  permanentlyDeleteTutor: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}/permanent`);
  },

  exportTutoresToCSV: async (filters?: {
    estado?: string;
  }): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.estado && filters.estado !== "todos")
      params.append("estado", filters.estado);

    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINT}/export?${params}`,
      {
        method: "GET",
        headers: {
          Accept: "text/csv",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.blob();
  },
};
