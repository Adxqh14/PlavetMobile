import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type {
  Pasantia,
  PasantiaStats,
  CreatePasantiaPayload,
  UpdatePasantiaPayload,
  CentroTrabajo,
  Plaza,
  TutorEmpresarial,
  EstudianteBackend,
} from "../types";

const BASE = "/api/v1/pasantias";

export const pasantiaService = {
  // ── Pasantías CRUD ──────────────────────────────────────────────────────────

  getAll: async (params?: {
    search?: string;
    estado?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Pasantia>> => {
    const query: Record<string, string | number> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 15,
    };
    if (params?.search) query.search = params.search;
    if (params?.estado && params.estado !== "todos") query.estado = params.estado;
    return apiClient.get<PaginatedResponse<Pasantia>>(BASE, query);
  },

  getById: async (id: string): Promise<ApiResponse<Pasantia>> =>
    apiClient.get<ApiResponse<Pasantia>>(`${BASE}/${id}`),

  create: async (data: CreatePasantiaPayload): Promise<ApiResponse<Pasantia>> =>
    apiClient.post<ApiResponse<Pasantia>>(BASE, data),

  update: async (id: string, data: UpdatePasantiaPayload): Promise<ApiResponse<Pasantia>> =>
    apiClient.patch<ApiResponse<Pasantia>>(`${BASE}/${id}`, data),

  delete: async (id: string): Promise<void> =>
    apiClient.delete<void>(`${BASE}/${id}`),

  getStats: async (): Promise<ApiResponse<PasantiaStats>> =>
    apiClient.get<ApiResponse<PasantiaStats>>(`${BASE}/stats`),

  // ── Related entities ────────────────────────────────────────────────────────

  getCentrosTrabajo: async (search?: string): Promise<PaginatedResponse<CentroTrabajo>> =>
    apiClient.get<PaginatedResponse<CentroTrabajo>>("/api/v1/centros-trabajo", {
      pageSize: 100,
      ...(search ? { search } : {}),
    }),

  getPlazasByCentro: async (id_centro_trabajo: string): Promise<PaginatedResponse<Plaza>> =>
    apiClient.get<PaginatedResponse<Plaza>>("/api/v1/plazas", {
      id_centro_trabajo,
      pageSize: 100,
      estado: "activa",
    }),

  // Fetch all tutores; filter by centro client-side (no server-side filter by centro)
  getTutores: async (): Promise<PaginatedResponse<TutorEmpresarial>> =>
    apiClient.get<PaginatedResponse<TutorEmpresarial>>("/api/v1/tutores-empresariales", {
      pageSize: 200,
    }),

  getEstudiantes: async (search?: string): Promise<PaginatedResponse<EstudianteBackend>> =>
    apiClient.get<PaginatedResponse<EstudianteBackend>>("/api/v1/estudiantes", {
      pageSize: 50,
      ...(search ? { search } : {}),
    }),
};
