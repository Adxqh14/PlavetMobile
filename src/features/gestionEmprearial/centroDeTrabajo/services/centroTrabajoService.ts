/**
 * Servicios de API para Centros de Trabajo
 * 
 * Este archivo contiene las funciones para interactuar con la API del backend
 * cuando esté disponible. Por ahora, las funciones están preparadas pero
 * retornan datos simulados o errores de implementación.
 */

import type { CentroTrabajo, CreateCentroData, CentroStats, ApiResponse, PaginatedResponse } from "../types";

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
 * Obtener todos los centros de trabajo
 */
export const getCentros = async (): Promise<CentroTrabajo[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroTrabajo[]> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    // Retornar datos simulados mientras la API no está disponible
    return [];
  }
};

/**
 * Obtener centros de trabajo paginados
 */
export const getCentrosPaginated = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    status?: string;
  }
): Promise<PaginatedResponse<CentroTrabajo>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
    });

    const response = await fetch(`${API_BASE_URL}/centros/paginated?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: PaginatedResponse<CentroTrabajo> = await response.json();
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
 * Obtener un centro de trabajo por ID
 */
export const getCentroById = async (id: string): Promise<CentroTrabajo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroTrabajo> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Centro no encontrado");
  }
};

/**
 * Crear un nuevo centro de trabajo
 */
export const createCentro = async (centroData: CreateCentroData): Promise<CentroTrabajo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(centroData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroTrabajo> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo crear el centro");
  }
};

/**
 * Actualizar un centro de trabajo
 */
export const updateCentro = async (id: string, centroData: Partial<CentroTrabajo>): Promise<CentroTrabajo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(centroData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroTrabajo> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo actualizar el centro");
  }
};

/**
 * Eliminar (soft delete) un centro de trabajo
 */
export const deleteCentro = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo eliminar el centro");
  }
};

/**
 * Restaurar un centro de trabajo eliminado
 */
export const restoreCentro = async (id: string): Promise<CentroTrabajo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/${id}/restore`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroTrabajo> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo restaurar el centro");
  }
};

/**
 * Eliminar permanentemente un centro de trabajo
 */
export const permanentlyDeleteCentro = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/${id}/permanent`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo eliminar permanentemente el centro");
  }
};

/**
 * Obtener estadísticas de centros de trabajo
 */
export const getCentrosStats = async (): Promise<CentroStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/stats`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroStats> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    // Retornar estadísticas por defecto
    return {
      total: 0,
      activos: 0,
      validados: 0,
      pendientes: 0,
      archivados: 0,
    };
  }
};

/**
 * Exportar centros de trabajo a CSV
 */
export const exportCentrosToCSV = async (filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);

    const response = await fetch(`${API_BASE_URL}/centros/export/csv?${params}`, {
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

/**
 * Validar un centro de trabajo
 */
export const validateCentro = async (id: string): Promise<CentroTrabajo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/centros/${id}/validate`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<CentroTrabajo> = await response.json();
    return data.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("No se pudo validar el centro");
  }
};
