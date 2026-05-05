// ==========================================
// Servicio para el módulo de Dashboard
// Conecta con: /api/dashboard
// ==========================================

import { apiClient } from "../../../lib/api";
import type { ApiResponse } from "../../../lib/api";

export interface DashboardStats {
  totalEstudiantes: number;
  totalTalleres: number;
  totalCentrosTrabajo: number;
  pasantiasActivas: number;
  pasantiasCompletadas: number;
  pasantiasPendientes: number;
}

export interface DashboardActivity {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  usuario?: string;
}

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<ApiResponse<DashboardStats>>("/api/dashboard/stats");
  },

  getRecentActivity: async (limit?: number): Promise<ApiResponse<DashboardActivity[]>> => {
    return apiClient.get<ApiResponse<DashboardActivity[]>>("/api/dashboard/activity", {
      limit: limit ?? 10,
    });
  },
};
