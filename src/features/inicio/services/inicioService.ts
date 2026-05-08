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
}

export const inicioService = {
  getData: async (): Promise<ApiResponse<InicioData>> => {
    return apiClient.get<ApiResponse<InicioData>>("/api/inicio");
  },
};
