import { API_BASE_URL } from "@/lib/api";

export interface MisNotasResponse {
  id: string;
  id_pasantia: string;
  ra: string;
  asistencia: number;
  desempeno: number;
  disponibilidad: number;
  responsabilidad: number;
  limpieza: number;
  trabajo_equipo: number;
  resolucion_problemas: number;
  observaciones: string | null;
  fecha: string;
  updated_at: string;
  deleted_at: string | null;
  datos: {
    subtotales: {
      actitud: number;
      capacidad: number;
      habilidad: number;
    };
    competencias: {
      ACTITUD: CompetenciaItem[];
      CAPACIDAD: CompetenciaItem[];
      HABILIDAD: CompetenciaItem[];
    };
  };
}

export interface CompetenciaItem {
  nombre: string;
  semanas: number[];
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = localStorage.getItem("plavet_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const calificacionApiService = {
  importar: async (cedula: string, file: File, observaciones?: string): Promise<MisNotasResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (observaciones) formData.append("observaciones", observaciones);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/calificaciones/importar/estudiante/${cedula}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
        credentials: "include",
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as Record<string, string>;
      throw new Error(err.message || err.detail || `Error ${response.status}`);
    }
    return response.json() as Promise<MisNotasResponse>;
  },

  getMisNotas: async (): Promise<MisNotasResponse | null> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/calificaciones/mis-notas`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (response.status === 404) return null;

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as Record<string, string>;
      throw new Error(err.message || err.detail || `Error ${response.status}`);
    }
    return response.json() as Promise<MisNotasResponse>;
  },
};
