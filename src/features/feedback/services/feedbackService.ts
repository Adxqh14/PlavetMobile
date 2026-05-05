// ==========================================
// Servicio para el módulo de Feedback
// Conecta con: /api/feedback
// ==========================================

import { apiClient } from "../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../lib/api";

export interface Feedback {
  id: number;
  tipo: string;
  mensaje: string;
  usuarioId?: number;
  estado: "pendiente" | "revisado" | "resuelto";
  fecha: string;
}

export interface CreateFeedbackData {
  tipo: string;
  mensaje: string;
}

export const feedbackService = {
  getAll: async (page?: number, pageSize?: number): Promise<PaginatedResponse<Feedback>> => {
    return apiClient.get<PaginatedResponse<Feedback>>("/api/feedback", {
      page: page ?? 1,
      pageSize: pageSize ?? 10,
    });
  },

  create: async (data: CreateFeedbackData): Promise<ApiResponse<Feedback>> => {
    return apiClient.post<ApiResponse<Feedback>>("/api/feedback", data);
  },

  updateStatus: async (id: number, estado: Feedback["estado"]): Promise<ApiResponse<Feedback>> => {
    return apiClient.patch<ApiResponse<Feedback>>(`/api/feedback/${id}/estado`, { estado });
  },
};
