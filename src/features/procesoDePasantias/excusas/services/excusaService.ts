import { apiClient } from "../../../../lib/api";
import type { PaginatedResponse, ApiResponse } from "../../../../lib/api";
import type { Excuse, TipoExcusa } from "../types";

const BASE = "/api/v1/excusas";
const PASANTIAS_BASE = "/api/v1/pasantias";

// ── Backend shapes ────────────────────────────────────────────────────────────

interface ExcusaBackend {
  id: string;
  id_pasantia: string;
  id_tutor: string;
  id_estudiante: string;
  justificacion: string | null;
  tipo_excusa: TipoExcusa | null;
  fecha_creacion: string;
  updated_at: string | null;
  deleted_at: string | null;
  estudiante?: { nombre: string; apellido: string };
  tutor?: { nombre: string; apellido: string };
}

interface PasantiaBackend {
  id: string;
  id_estudiante: string;
  id_tutor_empresarial: string;
  estado: string;
  horas_acumuladas: number;
  fecha_inicio: string;
  fecha_fin?: string;
  fecha_creacion: string;
  estudiante?: { nombre: string; apellido: string; cedula?: string };
  tutor_empresarial?: { nombre: string; apellido: string };
  centro_trabajo?: { id: string; nombre: string };
}

// ── Public option shape used by ExcusaForm ────────────────────────────────────

export interface PasantiaOption {
  id: string;
  label: string;           // shown in dropdown
  estudiante: string;      // auto-filled when selected
  tutor: string;           // auto-filled when selected
  centroDeTrabajo: string; // auto-filled when selected
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapToExcuse(e: ExcusaBackend): Excuse {
  const shortId = e.id_pasantia
    ? `Pasantía ${e.id_pasantia.slice(0, 8)}...`
    : "—";
  return {
    id: e.id,
    id_pasantia: e.id_pasantia,
    pasantia: shortId,
    estudiante: e.estudiante
      ? `${e.estudiante.nombre} ${e.estudiante.apellido}`
      : "—",
    tutor: e.tutor
      ? `${e.tutor.nombre} ${e.tutor.apellido}`
      : "—",
    justificacion: e.justificacion ?? "",
    tipoExcusa: e.tipo_excusa ?? "Ausencia",
    fecha: e.fecha_creacion ? e.fecha_creacion.split("T")[0] : "",
    fechaCreacion: e.fecha_creacion ?? "",
    estado: "Pendiente",
  };
}

function mapToPasantiaOption(p: PasantiaBackend): PasantiaOption {
  const estudiante = p.estudiante
    ? `${p.estudiante.nombre} ${p.estudiante.apellido}`
    : "Sin estudiante";
  const tutor = p.tutor_empresarial
    ? `${p.tutor_empresarial.nombre} ${p.tutor_empresarial.apellido}`
    : "Sin tutor";
  const centroDeTrabajo = p.centro_trabajo?.nombre ?? "Sin centro de trabajo";
  return {
    id: p.id,
    label: `${estudiante} — ${centroDeTrabajo}`,
    estudiante,
    tutor,
    centroDeTrabajo,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const excusaService = {
  getAll: async (params?: {
    id_estudiante?: string;
    id_pasantia?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ data: Excuse[]; pagination: PaginatedResponse<Excuse>["pagination"] }> => {
    const query: Record<string, string | number> = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    };
    if (params?.id_estudiante) query.id_estudiante = params.id_estudiante;
    if (params?.id_pasantia) query.id_pasantia = params.id_pasantia;

    const res = await apiClient.get<PaginatedResponse<ExcusaBackend>>(BASE, query);
    return {
      data: res.data.map(mapToExcuse),
      pagination: res.pagination,
    };
  },

  getById: async (id: string): Promise<Excuse> => {
    const res = await apiClient.get<ApiResponse<ExcusaBackend>>(`${BASE}/${id}`);
    return mapToExcuse(res.data);
  },

  create: async (payload: {
    id_pasantia: string;
    justificacion: string;
    tipo_excusa: TipoExcusa;
  }): Promise<Excuse> => {
    const res = await apiClient.post<ApiResponse<ExcusaBackend>>(BASE, payload);
    return mapToExcuse(res.data);
  },

  /** Search pasantias by student name (or any search term) */
  searchPasantias: async (search?: string): Promise<PasantiaOption[]> => {
    const query: Record<string, string | number> = { page: 1, pageSize: 20 };
    if (search) query.search = search;
    const res = await apiClient.get<PaginatedResponse<PasantiaBackend>>(
      PASANTIAS_BASE,
      query,
    );
    return res.data.map(mapToPasantiaOption);
  },
};
