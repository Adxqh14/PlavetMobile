import { apiClient } from "@/lib/api";
import type { PaginatedResponse, ApiResponse } from "@/lib/api";
import type {
  Visita,
  VisitaFormData,
  TutorResult,
  CentroResult,
  EstudianteResult,
} from "../types";

const BASE = "/api/v1/programar-visita";

export const visitaService = {
  getAll: (params?: { search?: string; estado?: string; page?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<Visita>>(BASE, params),

  create: (data: VisitaFormData) =>
    apiClient.post<ApiResponse<Visita>>(BASE, {
      id_tutor: data.id_tutor,
      id_centro_trabajo: data.id_centro_trabajo,
      motivo: data.motivo,
      fecha: data.fecha,
      hora: data.hora || undefined,
      observacion: data.observacion || undefined,
      estado: data.estado,
      estudiantes: data.estudiantes,
    }),

  searchTutores: (search: string) =>
    apiClient.get<PaginatedResponse<TutorResult>>("/api/v1/tutores-academicos", {
      search,
      pageSize: 10,
    }),

  searchCentros: (search: string) =>
    apiClient.get<PaginatedResponse<CentroResult>>("/api/v1/centros-trabajo", {
      search,
      pageSize: 10,
    }),

  searchEstudiantes: (search: string, id_taller?: string) =>
    apiClient.get<PaginatedResponse<EstudianteResult>>("/api/v1/estudiantes", {
      search,
      pageSize: 10,
      ...(id_taller ? { id_taller } : {}),
    }),
};
