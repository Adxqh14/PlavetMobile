import { apiClient } from "@/lib/api";
import type { PaginatedResponse, ApiResponse } from "@/lib/api";
import type { Asistencia, AsistenciaFormData, PasantiaSearchResult } from "../types";

const BASE = "/api/v1/asistencia-pasantia";
const PASANTIAS_BASE = "/api/v1/pasantias";

export const asistenciaService = {
  getAll: (params?: { search?: string; page?: number; pageSize?: number }) =>
    apiClient.get<PaginatedResponse<Asistencia>>(BASE, params),

  create: (data: AsistenciaFormData) =>
    apiClient.post<ApiResponse<Asistencia>>(BASE, {
      id_pasantia: data.id_pasantia,
      id_estudiante: data.id_estudiante,
      fecha: data.fecha,
      hora_entrada: data.hora_entrada || undefined,
      hora_salida: data.hora_salida || undefined,
      horas: data.horas,
      asistencia: data.asistencia,
    }),

  searchPasantias: (search: string) =>
    apiClient.get<PaginatedResponse<PasantiaSearchResult>>(PASANTIAS_BASE, {
      search,
      pageSize: 10,
    }),
};
