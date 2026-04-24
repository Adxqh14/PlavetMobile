/**
 * Servicios de API para Tutores
 * 
 * Este archivo contiene las funciones para interactuar con la API del backend
 * cuando esté disponible. Por ahora, las funciones están preparadas pero
 * retornan datos simulados o errores de implementación.
 */

import type { Tutor, CreateTutorData, TutorStats, ApiResponse, PaginatedResponse } from "../types";

const API_BASE_URL = "http://localhost:3001/api"; // Cambiar cuando la API esté disponible

/**
 * Configuración de headers para las peticiones HTTP
 */
const getHeaders = () => ({
  "Content-Type": "application/json",
  // Aquí se puede añadir el token de autenticación cuando esté disponible
  // Authorization: `Bearer ${token}`,
});

/**
 * Manejo de errores de API
 */
const handleApiError = (error: unknown) => {
  console.error("Error en la API:", error);
  const errorMessage = error instanceof Error ? error.message : "Error desconocido";
  throw new Error(errorMessage || "Error en la comunicación con el servidor");
};

/**
 * Obtener todos los tutores
 */
export const getTutores = async (): Promise<Tutor[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Tutor[]> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    // Retornar datos simulados mientras la API no está disponible
    return [];
  }
};

/**
 * Obtener tutores paginados
 */
export const getTutoresPaginated = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    status?: string;
  }
): Promise<PaginatedResponse<Tutor>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
    });

    const response = await fetch(`${API_BASE_URL}/tutores/paginated?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: PaginatedResponse<Tutor> = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
    // Retornar datos simulados
    return {
      data: [],
      success: false,
      message: "API no disponible",
      pagination: {
        page,
        pageSize,
        total: 0,
        totalPages: 0,
      },
    };
  }
};

/**
 * Obtener un tutor por ID
 */
export const getTutorById = async (id: string): Promise<Tutor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Tutor> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Tutor no encontrado");
  }
};

/**
 * Crear un nuevo tutor
 */
export const createTutor = async (tutorData: CreateTutorData): Promise<Tutor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(tutorData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Tutor> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo crear el tutor");
  }
};

/**
 * Actualizar un tutor
 */
export const updateTutor = async (id: string, tutorData: Partial<Tutor>): Promise<Tutor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(tutorData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Tutor> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo actualizar el tutor");
  }
};

/**
 * Eliminar (soft delete) un tutor
 */
export const deleteTutor = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo eliminar el tutor");
  }
};

/**
 * Restaurar un tutor eliminado
 */
export const restoreTutor = async (id: string): Promise<Tutor> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores/${id}/restore`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Tutor> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo restaurar el tutor");
  }
};

/**
 * Eliminar permanentemente un tutor
 */
export const permanentlyDeleteTutor = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores/${id}/permanent`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo eliminar permanentemente el tutor");
  }
};

/**
 * Obtener estadísticas de tutores
 */
export const getTutoresStats = async (): Promise<TutorStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tutores/stats`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<TutorStats> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    // Retornar estadísticas por defecto
    return {
      total: 0,
      activos: 0,
      pendientes: 0,
      inhabilitados: 0,
    };
  }
};

/**
 * Exportar tutores a CSV
 */
export const exportTutoresToCSV = async (filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);

    const response = await fetch(`${API_BASE_URL}/tutores/export/csv?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.blob();
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo exportar los datos");
  }
};
