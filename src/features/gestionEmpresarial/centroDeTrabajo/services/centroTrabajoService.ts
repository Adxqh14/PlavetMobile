import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { CentroTrabajo, CreateCentroData, CentroStatus } from "../types";

const ENDPOINT = "/api/v1/centros-trabajo";

interface BackendCentro {
  id: number | string;
  nombre?: string;
  estado?: string;
  validacion?: string;
  fecha_creacion?: string;
  restriccion_edad?: boolean;
  id_contacto?: number;
  id_direccion?: number;
  id_usuario?: number;
  responsable?: string;
  descripcion?: string;
  tipo?: string;
  telefono?: string;
  email_contacto?: string;
  direccion?: Record<string, string | number | boolean | undefined>;
  contacto?: Record<string, string | number | boolean | undefined>;
}

const mapCentro = (b: BackendCentro): CentroTrabajo => {
  let status: CentroStatus = "activo";
  const backendEstado = (b.estado || "").toLowerCase();

  if (backendEstado === "inactivo") status = "inactivo";
  else if (backendEstado === "pendiente") status = "pendiente";
  else if (backendEstado === "rechazado") status = "rechazado";

  const direccion = b.direccion || {};
  const contacto = b.contacto || {};

  return {
    id: String(b.id),
    name: b.nombre || "",
    location:
      (direccion && typeof direccion === 'object'
        ? [direccion.calle, direccion.referencia, direccion.provincia, direccion.pais]
            .filter(Boolean)
            .join(", ")
        : null) ||
      "Sin dirección",
    employees: 0,
    status: status,
    validated:
      b.validacion === "aprobada" ||
      b.validacion === "Validada" ||
      b.validacion === "Válido" ||
      b.validacion === "Aprobado",

    email: b.email_contacto || String(contacto.email || ""),
    telefono: b.telefono || String(contacto.telefono || ""),
    responsable: b.responsable || "",
    descripcion: b.descripcion || "",
    tipo: b.tipo || "oficina",

    id_contacto: b.id_contacto,
    id_direccion: b.id_direccion,
    restriccion_edad: b.restriccion_edad,
    id_usuario: b.id_usuario,
    validacion: b.validacion,
    fecha_creacion: b.fecha_creacion,
    createdAt: b.fecha_creacion || new Date().toISOString(),
  };
};

export const centroTrabajoService = {
  getAll: async (params?: {
    search?: string;
    estado?: string;
    page?: number;
    pageSize?: number;
    id_taller?: string;
  }): Promise<PaginatedResponse<CentroTrabajo>> => {
    const query: Record<string, string | number | boolean | undefined> = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
    };
    if (params?.search) query.search = params.search;
    if (params?.id_taller) query.id_taller = params.id_taller;

    if (params?.estado && params.estado !== "todos") {
      const estado = params.estado.toLowerCase();
      if (estado === "activo") query.estado = "Activo";
      else if (estado === "inactivo") query.estado = "Inactivo";
      else if (estado === "pendiente") query.estado = "pendiente";
    } else {
      query.estado = "";
    }

    const response = await apiClient.get<BackendCentro[] | PaginatedResponse<BackendCentro>>(ENDPOINT, query);
    
    // El backend puede devolver el array directo o envuelto en data
    const data = response && 'data' in response ? response.data : response;
    const items = Array.isArray(data) ? data : [];

    return {
      success: true,
      data: items.map(mapCentro),
      pagination: (response && 'pagination' in response ? response.pagination : null) || {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: items.length,
        totalPages: 1,
      },
    };
  },

  getById: async (id: string | number): Promise<ApiResponse<CentroTrabajo>> => {
    const response = await apiClient.get<BackendCentro | { data: BackendCentro }>(`${ENDPOINT}/${id}`);
    const data = response && 'data' in response ? response.data : response;
    return {
      success: true,
      data: mapCentro(data as BackendCentro),
    };
  },

  create: async (data: CreateCentroData): Promise<ApiResponse<CentroTrabajo>> => {
    const payload: Record<string, string | number | boolean | undefined | object> = {
      nombre: data.name,
      estado: "activo",
    };

    if (data.telefono) payload.telefono = data.telefono;
    if (data.email) payload.email_contacto = data.email;
    if (data.restriccion_edad !== undefined) payload.restriccion_edad = data.restriccion_edad;
    if (data.direccion && Object.values(data.direccion).some(Boolean)) {
      payload.direccion = data.direccion;
    } else if (data.id_direccion) {
      payload.id_direccion = data.id_direccion;
    }

    const response = await apiClient.post<BackendCentro | { data: BackendCentro }>(ENDPOINT, payload);
    const resultData = response && 'data' in response ? response.data : response;
    return {
      success: true,
      data: mapCentro(resultData as BackendCentro),
    };
  },

  update: async (
    id: string | number,
    data: Partial<CentroTrabajo>
  ): Promise<ApiResponse<CentroTrabajo>> => {
    const payload: Record<string, string | number | boolean | undefined> = {};

    if (data.name) payload.nombre = data.name;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.email !== undefined) payload.email_contacto = data.email;
    if (data.restriccion_edad !== undefined) payload.restriccion_edad = data.restriccion_edad;

    if (data.status) {
      const status = data.status.toLowerCase();
      if (status === "activo") payload.estado = "activo";
      else if (status === "inactivo") payload.estado = "inactivo";
    }

    if (data.validated !== undefined) {
      payload.validacion = data.validated ? "aprobada" : "pendiente";
    } else if (data.validacion !== undefined && data.validacion !== null) {
      payload.validacion = data.validacion;
    }

    const response = await apiClient.patch<BackendCentro | { data: BackendCentro }>(`${ENDPOINT}/${id}`, payload);
    const resultData = response && 'data' in response ? response.data : response;
    return {
      success: true,
      data: mapCentro(resultData as BackendCentro),
    };
  },

  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
    return {
      success: true,
      data: undefined,
    };
  },
};
