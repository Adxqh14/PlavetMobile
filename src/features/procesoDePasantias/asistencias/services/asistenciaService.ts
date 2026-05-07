import { apiClient } from "@/lib/api";
import type { PaginatedResponse, ApiResponse } from "@/lib/api";
import type { Asistencia, AsistenciaFormData, PasantiaSearchResult } from "../types";

const BASE = "/api/v1/asistencia-pasantia";
const PASANTIAS_BASE = "/api/v1/pasantias";

export const asistenciaService = {
  getAll: (params?: { search?: string; page?: number; pageSize?: number; id_taller?: string }) => {
    // id_taller is not accepted by this endpoint — strip it before sending
    const { id_taller: _ignored, ...safeParams } = params ?? {};
    return apiClient.get<PaginatedResponse<Asistencia>>(BASE, safeParams);
  },

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

  searchPasantias: async (search: string, centroTrabajoId?: string) => {
    const result = await apiClient.get<PaginatedResponse<PasantiaSearchResult>>(PASANTIAS_BASE, {
      search,
      pageSize: 20,
    });
    if (!centroTrabajoId) return result;
    return {
      ...result,
      data: (result.data ?? []).filter(p => p.centro_trabajo?.id === centroTrabajoId),
    };
  },

  /** Fetches all pasantias and filters client-side by centro_trabajo id */
  getPasantiasByCentro: async (centroTrabajoId: string): Promise<PaginatedResponse<PasantiaSearchResult>> => {
    const result = await apiClient.get<PaginatedResponse<PasantiaSearchResult>>(PASANTIAS_BASE, {
      pageSize: 500,
    });
    return {
      ...result,
      data: (result.data ?? []).filter(p => p.centro_trabajo?.id === centroTrabajoId),
    };
  },
};
