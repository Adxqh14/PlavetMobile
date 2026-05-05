import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Supervisor, SupervisorFormData } from "../types";

// Mapea la respuesta del backend al tipo frontend
// El backend anida datos personales dentro de "perfil"
const mapSupervisor = (backendData: any): Supervisor => {
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

export const supervisoresService = {
  getAll: async (params?: {
    search?: string;
    estado?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Supervisor>> => {
    const queryParams: Record<string, string | number | boolean> = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 15,
    };
    if (params?.search) queryParams.search = params.search;
    if (params?.estado) {
      queryParams.estado = params.estado === "todos" ? "" : params.estado;
    }

    const response = await apiClient.get<PaginatedResponse<any>>(
      "/api/v1/supervisores",
      queryParams
    );

    return {
      ...response,
      data: response.data.map(mapSupervisor),
    };
  },

  getById: async (id: string): Promise<Supervisor> => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/api/v1/supervisores/${id}`
    );
    return mapSupervisor(response.data);
  },

  create: async (data: SupervisorFormData): Promise<Supervisor> => {
    const payload = {
      nombre: data.nombre,
      apellido: data.apellido,
      cedula: data.cedula,
      telefono: data.telefono,
      email: data.email,
    };
    const response = await apiClient.post<ApiResponse<any>>(
      "/api/v1/supervisores",
      payload
    );
    return mapSupervisor(response.data);
  },

  update: async (
    id: string,
    data: Partial<SupervisorFormData> & { estado?: string }
  ): Promise<Supervisor> => {
    const payload: Record<string, string | undefined> = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.apellido !== undefined) payload.apellido = data.apellido;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.email !== undefined) payload.email = data.email;
    // cedula y estado NO se envían en updates de supervisores (backend los rechaza)
    const response = await apiClient.put<ApiResponse<any>>(
      `/api/v1/supervisores/${id}`,
      payload
    );
    return mapSupervisor(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/supervisores/${id}`);
  },

  restore: async (id: string): Promise<Supervisor> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/api/v1/supervisores/${id}/restore`,
      {}
    );
    return mapSupervisor(response.data);
  },

  permanentDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/supervisores/${id}/permanent`);
  },
};
