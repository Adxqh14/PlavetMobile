import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Vinculador, VinculadorFormData } from "../types";

// Mapea la respuesta del backend al tipo frontend
// El backend anida datos personales dentro de "perfil"
const mapVinculador = (backendData: any): Vinculador => {
  return {
    id: backendData.id || "",
    nombre: backendData.perfil?.nombre || backendData.nombre || "",
    apellido: backendData.perfil?.apellido || backendData.apellido || "",
    cedula: backendData.perfil?.cedula || backendData.cedula || "",
    email: backendData.perfil?.email_contacto || backendData.email || "",
    telefono: backendData.perfil?.telefono || backendData.telefono || "",
    estado: backendData.estado === "activo" ? "activo" : "inactivo",
    fecha_creacion: backendData.fecha_creacion || "",
    deleted_at: backendData.deleted_at ?? null,
  };
};

export const vinculadoresService = {
  getAll: async (params?: {
    search?: string;
    estado?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Vinculador>> => {
    const queryParams: Record<string, string | number | boolean> = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 15,
    };
    if (params?.search) queryParams.search = params.search;
    if (params?.estado) {
      queryParams.estado = params.estado === "todos" ? "" : params.estado;
    }

    const response = await apiClient.get<PaginatedResponse<any>>(
      "/api/v1/vinculadores",
      queryParams
    );

    return {
      ...response,
      data: response.data.map(mapVinculador),
    };
  },

  getById: async (id: string): Promise<Vinculador> => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/v1/vinculadores/${id}`
    );
    return mapVinculador(response.data);
  },

  create: async (data: VinculadorFormData): Promise<Vinculador> => {
    const payload = {
      nombre: data.nombre,
      apellido: data.apellido,
      cedula: data.cedula,
      telefono: data.telefono,
      email: data.email,
    };
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/v1/vinculadores",
      payload
    );
    return mapVinculador(response.data);
  },

  update: async (
    id: string,
    data: Partial<VinculadorFormData> & { estado?: string }
  ): Promise<Vinculador> => {
    const payload: Record<string, string | undefined> = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.apellido !== undefined) payload.apellido = data.apellido;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.email !== undefined) payload.email = data.email;
    if (data.estado !== undefined) payload.estado = data.estado;
    // cedula NO se envía en updates (backend la rechaza)
    const response = await apiClient.put<ApiResponse<any>>(
      `/api/v1/vinculadores/${id}`,
      payload
    );
    return mapVinculador(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/vinculadores/${id}`);
  },

  restore: async (id: string): Promise<Vinculador> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/v1/vinculadores/${id}/restore`,
      {}
    );
    return mapVinculador(response.data);
  },

  permanentDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/vinculadores/${id}/permanent`);
  },
};
