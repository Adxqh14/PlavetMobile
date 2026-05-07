import { apiClient } from "@/lib/api";

export interface LoginCredentials {
  cedula: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  nombre?: string;
  apellido?: string;
  email: string;
  id_rol: string;
  rol: string;
  estado: string;
  tenant: string;
  taller?: {
    id: number;
    nombre: string;
  };
}

/**
 * El backend establece accessToken y refreshToken como cookies HttpOnly
 * Y también devuelve el accessToken en el body como Bearer token de respaldo.
 */
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
  message: string;
}

export const authService = {
  /**
   * Autentica al usuario.
   * - Los tokens JWT se establecen como cookies HttpOnly.
   * - También se devuelve `accessToken` en el body para guardarlo en localStorage
   *   como respaldo Bearer cuando las cookies no llegan (ej: Vite dev proxy).
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", credentials);
    // Guardar token en localStorage como respaldo para Authorization: Bearer
    if (response.accessToken) {
      localStorage.setItem("plavet_token", response.accessToken);
    }
    return response;
  },

  /**
   * Cierra la sesión. Limpia el token del localStorage y la cookie del servidor.
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem("plavet_token");
    return apiClient.post<void>("/api/v1/auth/logout", {});
  },
};
