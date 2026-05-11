/**
 * API Client — plavet frontend
 *
 * Desarrollo: API_BASE_URL = "" → Vite proxy reenvía /api/* al backend (sin CORS).
 * Producción: Vercel rewrite reenvía /api/* al backend (vercel.json) → también sin CORS.
 *
 * Autenticación: El backend establece el JWT en una cookie HttpOnly (accessToken).
 * El cliente envía `credentials: "include"` para que el navegador adjunte esa cookie.
 * Como respaldo, si hay un token en localStorage["plavet_token"], se envía como
 * Authorization: Bearer (útil si la cookie no se transfiere en ciertos entornos).
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Construye los headers de autenticación.
   * Siempre incluye Accept/Content-Type.
   * Si hay un token en localStorage (plavet_token), lo agrega como Bearer.
   * Las cookies HttpOnly se envían automáticamente gracias a `credentials: "include"`.
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    // Respaldo: bearer token guardado en localStorage
    const token = localStorage.getItem("plavet_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.detail ||
          errorData.message ||
          errorData.title ||
          errorMessage;
      } catch {
        // no-op, keep default message
      }

      // Traducciones y formatos amigables
      const msgLower = errorMessage.toLowerCase();
      if (msgLower.includes("invalid") || msgLower.includes("credenciales")) {
        errorMessage = "Credenciales o datos inválidos. Por favor, verifica la información.";
      } else if (response.status === 401) {
        errorMessage = "Sesión expirada o no autorizada.";
      } else if (response.status === 403) {
        errorMessage = "No tienes permiso para realizar esta acción.";
      } else if (response.status === 404) {
        errorMessage = "El recurso solicitado no fue encontrado.";
      } else if (response.status >= 500) {
        errorMessage = "Error interno del servidor. Por favor, inténtalo más tarde.";
      }

      throw new Error(errorMessage);
    }

    // 204 No Content → cuerpo vacío
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      return (text || {}) as T;
    }

    return response.json().catch(() => ({}) as T);
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
        credentials: "include",
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
        credentials: "include",
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body),
        credentials: "include",
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
        credentials: "include",
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleNetworkError(error);
    }
  }

  private handleNetworkError(error: unknown): never {
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("fetch")) {
        throw new Error("Error de conexión: No se pudo contactar con el servidor. Verifica tu internet.");
      }
    }
    throw error;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);