// ==========================================
// Servicio para el módulo de Account (Cuenta de Usuario)
// Conecta con: /api/account | /api/users
// ==========================================

import { apiClient } from "../../../lib/api";
import type { ApiResponse } from "../../../lib/api";

export interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  avatar?: string;
}

export interface UpdateProfileData {
  nombre?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const accountService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return apiClient.get<ApiResponse<UserProfile>>("/api/account/profile");
  },

  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<UserProfile>> => {
    return apiClient.patch<ApiResponse<UserProfile>>("/api/account/profile", data);
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.patch<ApiResponse<void>>("/api/account/password", {
      currentPassword,
      newPassword,
    });
  },
};
