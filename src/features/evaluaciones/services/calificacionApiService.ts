import { API_BASE_URL } from "@/lib/api";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface TallerItem {
  id: number;
  nombre: string;
  codigo_titulo: string;
  codigo_taller: string;
  estado: string;
}

export interface CalificacionAdminItem extends MisNotasResponse {
  nota_final: string;
  estudiante_nombre: string;
  estudiante_apellido: string;
  estudiante_cedula: string;
  taller_nombre: string;
  // campos legacy (pueden venir o no)
  estudiante?: {
    nombre: string;
    apellido: string;
    cedula?: string | null;
    taller?: { id: number; nombre: string } | null;
  } | null;
  centro_trabajo?: { nombre: string } | null;
}

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

  getAll: async (): Promise<CalificacionAdminItem[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/calificaciones`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as Record<string, string>;
      throw new Error(err.message || err.detail || `Error ${response.status}`);
    }
    return response.json() as Promise<CalificacionAdminItem[]>;
  },

  getTalleres: async (): Promise<TallerItem[]> => {
    const url = new URL(`${API_BASE_URL}/api/v1/talleres`, window.location.origin);
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("estado", "Activo");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) return [];
    const data = await response.json() as { data?: TallerItem[] };
    return data.data ?? [];
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
