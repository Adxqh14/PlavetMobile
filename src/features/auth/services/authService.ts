import { apiClient } from "../../../lib/api";

export interface LoginCredentials {
  cedula: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  id_rol: string;
  rol: string;
  estado: string;
  tenant: string;
}

/**
 * El backend establece accessToken y refreshToken como cookies HttpOnly.
 * La respuesta JSON del login solo incluye `user` y `message`.
 */
export interface LoginResponse {
  user: AuthUser;
  message: string;
}

export const authService = {
  /**
   * Autentica al usuario. Los tokens JWT se establecen automáticamente
   * como cookies HttpOnly en el navegador; no se devuelven en el JSON.
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>("/api/v1/auth/login", credentials);
  },

  /**
   * Cierra la sesión. Las cookies HttpOnly son eliminadas por el navegador
   * al recibir la respuesta del servidor (requiere credentials: 'include').
   */
  logout: async (): Promise<void> => {
    return apiClient.post<void>("/api/v1/auth/logout", {});
  },
};
