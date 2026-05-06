// ==========================================
// Servicio para el módulo de Soporte / Support
// Conecta con: /api/support
// ==========================================

import { apiClient } from "../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../lib/api";

export interface SupportTicket {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: "baja" | "media" | "alta" | "critica";
  estado: "abierto" | "en_progreso" | "cerrado";
  usuarioId?: number;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

export interface CreateSupportTicketData {
  titulo: string;
  descripcion: string;
  prioridad: SupportTicket["prioridad"];
}

export const supportService = {
  getAll: async (page?: number): Promise<PaginatedResponse<SupportTicket>> => {
    return apiClient.get<PaginatedResponse<SupportTicket>>("/api/support", {
      page: page ?? 1,
    });
  },

  getById: async (id: number): Promise<ApiResponse<SupportTicket>> => {
    return apiClient.get<ApiResponse<SupportTicket>>(`/api/support/${id}`);
  },

  create: async (data: CreateSupportTicketData): Promise<ApiResponse<SupportTicket>> => {
    return apiClient.post<ApiResponse<SupportTicket>>("/api/support", data);
  },

  close: async (id: number): Promise<ApiResponse<SupportTicket>> => {
    return apiClient.patch<ApiResponse<SupportTicket>>(`/api/support/${id}/close`, {});
  },
};
