// ==========================================
// Servicio para el módulo de Inicio (home/landing)
// Conecta con: /api/inicio | /api/dashboard
// ==========================================

import { apiClient } from "../../../lib/api";
import type { ApiResponse } from "../../../lib/api";

export interface InicioData {
  bienvenida: string;
  nombreUsuario: string;
  stats: {
    totalPasantias: number;
    pasantiasActivas: number;
  };
  notificaciones: {
    id: number;
    mensaje: string;
    fecha: string;
    leida: boolean;
  }[];
}

export const inicioService = {
  getData: async (): Promise<ApiResponse<InicioData>> => {
    return apiClient.get<ApiResponse<InicioData>>("/api/inicio");
  },

  marcarNotificacionLeida: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.patch<ApiResponse<void>>(`/api/notificaciones/${id}/leer`, {});
  },
};
