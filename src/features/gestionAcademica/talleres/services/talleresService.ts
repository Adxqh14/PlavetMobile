// ==========================================
// Servicio para el módulo de Talleres
// Conecta con: /api/talleres
// ==========================================

import { apiClient } from "../../../../lib/api";
import type { PaginatedResponse, ApiResponse } from "../../../../lib/api";
import type { Taller, CreateTallerData, TallerQueryParams } from "../types";

export const talleresService = {
  /**
   * Obtener todos los talleres con filtros y paginación
   */
  getAll: async (params?: TallerQueryParams): Promise<PaginatedResponse<Taller>> => {
    const queryParams: Record<string, string | number | boolean> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 100,
    };

    if (params?.search) queryParams.search = params.search;
    
    // Normalizar estado para el backend (usualmente Activo/Inactivo con mayúscula)
    if (params?.estado && params.estado !== "todos") {
      const estado = params.estado.toLowerCase() === "activo" ? "Activo" : 
                    params.estado.toLowerCase() === "inactivo" ? "Inactivo" : params.estado;
      queryParams.estado = estado;
    }

    const response = await apiClient.get<any>("/api/talleres", queryParams);
    
    // El backend devuelve { success: true, data: [...], pagination: {...} } 
    // o a veces el objeto directamente. Manejamos ambos casos.
    const resultData = response.data || response;
    const items = Array.isArray(resultData) ? resultData : (resultData.data || []);

    return {
      success: true,
      data: items,
      pagination: response.pagination || {
        page: queryParams.page as number,
        pageSize: queryParams.pageSize as number,
        total: items.length,
        totalPages: 1
      }
    };
  },

  /**
   * Obtener un taller por ID
   */
  getById: async (id: number): Promise<ApiResponse<Taller>> => {
    const response = await apiClient.get<any>(`/api/talleres/${id}`);
    return {
      success: true,
      data: response.data || response
    };
  },

  /**
   * Crear un nuevo taller
   */
  create: async (data: CreateTallerData): Promise<ApiResponse<Taller>> => {
    return apiClient.post<ApiResponse<Taller>>("/api/talleres", data);
  },

  /**
   * Actualizar un taller existente
   */
  update: async (id: number, data: Partial<CreateTallerData>): Promise<ApiResponse<Taller>> => {
    return apiClient.put<ApiResponse<Taller>>(`/api/talleres/${id}`, data);
  },

  /**
   * Eliminar un taller
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/api/talleres/${id}`);
  },
};
