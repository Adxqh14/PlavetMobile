// ==========================================
// Servicio para el módulo de Talleres
// Conecta con: /api/v1/talleres
// ==========================================

import { apiClient } from "../../../../lib/api";
import type { PaginatedResponse, ApiResponse } from "../../../../lib/api";
import type { Taller, CreateTallerData, TallerQueryParams } from "../types";

const mapTaller = (d: any): Taller => ({
  id: String(d.id),
  nombre: d.nombre ?? "",
  codigo_taller: d.codigo_taller ?? "",
  id_familia: d.id_familia ?? "",
  codigo_titulo: d.codigo_titulo ?? "",
  horas_pasantia: Number(d.horas_pasantia ?? 0),
  estado: d.estado 
    ? d.estado.charAt(0).toUpperCase() + d.estado.slice(1).toLowerCase()
    : "Activo",
  familia_nombre: d.familia_nombre ?? undefined,
});

export const talleresService = {
  getAll: async (params?: TallerQueryParams): Promise<PaginatedResponse<Taller>> => {
    const queryParams: Record<string, string | number | boolean> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 100,
    };
    if (params?.search) queryParams.search = params.search;

    // El backend tiene default 'activo' en el DTO, así que si no enviamos estado filtra solo activos.
    // Cuando queremos todos, enviamos estado="" (string vacío): el repositorio hace `if (params.estado)`
    // que es falsy para "", por lo que omite el WHERE y devuelve todos los registros.
    if (params?.estado && params.estado !== "todos") {
      queryParams.estado = params.estado.toLowerCase();
    } else {
      queryParams.estado = "";
    }

    const response = await apiClient.get<any>("/api/v1/talleres", queryParams);
    // Backend devuelve { success, data: [...], pagination: {...} }
    const items: any[] = Array.isArray(response.data) ? response.data : [];

    return {
      success: response.success ?? true,
      data: items.map(mapTaller),
      pagination: response.pagination ?? {
        page: queryParams.page as number,
        pageSize: queryParams.pageSize as number,
        total: items.length,
        totalPages: 1,
      },
    };
  },

  getById: async (id: string): Promise<ApiResponse<Taller>> => {
    const response = await apiClient.get<any>(`/api/v1/talleres/${id}`);
    return {
      success: response.success ?? true,
      data: mapTaller(response.data || response),
    };
  },

  create: async (data: CreateTallerData): Promise<ApiResponse<Taller>> => {
    const payload: Record<string, any> = {
      nombre: data.nombre,
      codigo_titulo: data.codigo_titulo,
      codigo_taller: data.codigo_taller,
      horas_pasantia: data.horas_pasantia,
    };
    if (data.id_familia) {
      payload.id_familia = data.id_familia;
    } else {
      if (data.familia_nombre) payload.familia_nombre = data.familia_nombre;
      if (data.familia_codigo) payload.familia_codigo = data.familia_codigo;
    }

    const response = await apiClient.post<any>("/api/v1/talleres", payload);
    return {
      success: response.success ?? true,
      data: mapTaller(response.data || response),
      message: response.message,
    };
  },

  update: async (id: string, data: Partial<CreateTallerData>): Promise<ApiResponse<Taller>> => {
    const payload: Record<string, any> = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.codigo_titulo !== undefined) payload.codigo_titulo = data.codigo_titulo;
    if (data.codigo_taller !== undefined) payload.codigo_taller = data.codigo_taller;
    if (data.horas_pasantia !== undefined) payload.horas_pasantia = data.horas_pasantia;
    if (data.estado !== undefined) payload.estado = data.estado.toLowerCase();
    if (data.id_familia !== undefined) payload.id_familia = data.id_familia;

    const response = await apiClient.put<any>(`/api/v1/talleres/${id}`, payload);
    return {
      success: response.success ?? true,
      data: mapTaller(response.data || response),
      message: response.message,
    };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<any>(`/api/v1/talleres/${id}`);
    return {
      success: response.success ?? true,
      data: undefined,
    };
  },
};
