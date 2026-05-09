import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";
import { apiClient, API_BASE_URL } from "../../../../lib/api";
import type { PaginatedResponse } from "../../../../lib/api";

const ENDPOINT = "/api/v1/tutores-empresariales";

interface BackendTutor {
  id?: string;
  perfil?: {
    nombre?: string;
    apellido?: string;
    email_contacto?: string;
    telefono?: string;
    cedula?: string;
  };
  nombre?: string;
  apellido?: string;
  email?: string;
  email_contacto?: string;
  telefono?: string;
  cedula?: string;
  departamento?: string;
  centro_trabajo?: {
    nombre?: string;
  };
  nombre_centro_trabajo?: string;
  id_centro_trabajo?: string | null;
  estado?: string;
  fecha_creacion?: string;
}

// Adaptador: backend entity → frontend Tutor
const mapTutor = (b: BackendTutor): Tutor => ({
  id: b.id ?? "",
  nombre: b.perfil?.nombre || b.nombre || "",
  apellido: b.perfil?.apellido || b.apellido || "",
  email: b.perfil?.email_contacto || b.email_contacto || b.email || "",
  telefono: b.perfil?.telefono || b.perfil?.telefono || b.telefono || "",
  cedula: b.perfil?.cedula || b.cedula || "",
  departamento: b.departamento || "",
  nombreCentroTrabajo: b.centro_trabajo?.nombre || b.nombre_centro_trabajo || "",
  idCentroTrabajo: b.id_centro_trabajo ?? null,
  estado: b.estado === "activo" ? "Activo" : b.estado === "inactivo" ? "Inactivo" : (b.estado || "Inactivo"),
  fechaCreacion: b.fecha_creacion
    ? new Date(b.fecha_creacion).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
});

export const tutorService = {
  getTutoresPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    filters?: { search?: string; estado?: string; id_taller?: string }
  ): Promise<PaginatedResponse<Tutor>> => {
    const queryParams: Record<string, string | number | boolean> = {
      page,
      pageSize,
    };
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.id_taller) queryParams.id_taller = filters.id_taller;
    if (filters?.estado) {
      queryParams.estado = filters.estado === "todos" ? "" : filters.estado.toLowerCase();
    }

    const response = await apiClient.get<PaginatedResponse<BackendTutor>>(ENDPOINT, queryParams);
    
    // Si la respuesta es directa o está en data
    const data = response && 'data' in response ? response.data : response;
    const items = Array.isArray(data) ? data : [];

    return {
      success: true,
      data: items.map((b: BackendTutor) => mapTutor(b)),
      pagination: (response && 'pagination' in response ? (response as PaginatedResponse<BackendTutor>).pagination : null) || {
        page,
        pageSize,
        total: items.length,
        totalPages: 1
      }
    };
  },

  getTutorById: async (id: string): Promise<Tutor> => {
    const response = await apiClient.get<BackendTutor | { data: BackendTutor }>(
      `${ENDPOINT}/${id}`
    );
    const data = response && 'data' in response ? response.data : response;
    return mapTutor(data as BackendTutor);
  },

  createTutor: async (data: CreateTutorData): Promise<Tutor> => {
    const response = await apiClient.post<BackendTutor | { data: BackendTutor }>(ENDPOINT, {
      cedula: data.cedula,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      centro_trabajo_nombre: data.centro_trabajo_nombre,
      departamento: data.departamento,
    });
    const resultData = response && 'data' in response ? response.data : response;
    return mapTutor(resultData as BackendTutor);
  },

  updateTutor: async (
    id: string,
    data: UpdateTutorData
  ): Promise<Tutor> => {
    const payload: Record<string, string | number | boolean | undefined> = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.apellido !== undefined) payload.apellido = data.apellido;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.email !== undefined) payload.email = data.email;
    if (data.departamento !== undefined) payload.departamento = data.departamento;
    if (data.estado !== undefined) payload.estado = data.estado.toLowerCase();

    const response = await apiClient.put<BackendTutor | { data: BackendTutor }>(
      `${ENDPOINT}/${id}`,
      payload
    );
    const resultData = response && 'data' in response ? response.data : response;
    return mapTutor(resultData as BackendTutor);
  },

  deleteTutor: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  restoreTutor: async (id: string): Promise<Tutor> => {
    return tutorService.updateTutor(id, { estado: "activo" });
  },

  permanentlyDeleteTutor: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}/permanent`);
  },

  exportTutoresToCSV: async (filters?: {
    estado?: string;
  }): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.estado && filters.estado !== "todos")
      params.append("estado", filters.estado);

    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINT}/export?${params}`,
      {
        method: "GET",
        headers: {
          Accept: "text/csv",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return response.blob();
  },
};
