import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { CentroTrabajo, CreateCentroData, CentroStatus } from "../types";

const ENDPOINT = "/api/v1/centros-trabajo";

const mapCentro = (b: any): CentroTrabajo => {
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
      (direccion && typeof direccion === 'object' && (direccion.referencia || direccion.direccion || direccion.calle)) ||
      (typeof direccion === 'string' ? direccion : null) ||
      b.referencia ||
      b.direccion_referencia ||
      b.id_direccion ||
      b.location || 
      "Sin dirección",
    employees: 0,
    status: status,
    validated:
      b.validacion === "aprobada" ||
      b.validacion === "Validada" ||
      b.validacion === "Válido" ||
      b.validacion === "Aprobado",

    email: contacto.email || b.email_contacto || "",
    telefono: b.telefono || contacto.telefono || "",
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
  }): Promise<PaginatedResponse<CentroTrabajo>> => {
    const query: Record<string, any> = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
    };
    if (params?.search) query.search = params.search;

    if (params?.estado && params.estado !== "todos") {
      const estado = params.estado.toLowerCase();
      if (estado === "activo") query.estado = "Activo";
      else if (estado === "inactivo") query.estado = "Inactivo";
    }

    const response = await apiClient.get<any>(ENDPOINT, query);
    const data = response.data || response || [];

    return {
      success: true,
      data: Array.isArray(data) ? data.map(mapCentro) : [],
      pagination: response.pagination || {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: Array.isArray(data) ? data.length : 0,
        totalPages: 1,
      },
    };
  },

  getById: async (id: string | number): Promise<ApiResponse<CentroTrabajo>> => {
    const response = await apiClient.get<any>(`${ENDPOINT}/${id}`);
    const data = response.data || response;
    return {
      success: true,
      data: mapCentro(data),
    };
  },

  create: async (data: CreateCentroData): Promise<ApiResponse<CentroTrabajo>> => {
    // El backend solo acepta los campos definidos en CreateCentroTrabajoDto
    // Campos válidos: nombre, telefono, email_contacto, id_direccion, restriccion_edad, estado
    const payload: Record<string, any> = {
      nombre: data.name,
      estado: "activo",
    };

    if (data.telefono) payload.telefono = data.telefono;
    if (data.email) payload.email_contacto = data.email;
    if (data.restriccion_edad !== undefined) payload.restriccion_edad = data.restriccion_edad;
    if (data.id_direccion) payload.id_direccion = data.id_direccion;

    const response = await apiClient.post<any>(ENDPOINT, payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapCentro(resultData),
    };
  },

  update: async (
    id: string | number,
    data: Partial<CentroTrabajo>
  ): Promise<ApiResponse<CentroTrabajo>> => {
    // Campos válidos para UpdateCentroTrabajoDto: nombre, telefono, email_contacto,
    // id_direccion, restriccion_edad, estado, validacion
    const payload: Record<string, any> = {};

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
    } else if (data.validacion !== undefined) {
      payload.validacion = data.validacion;
    }

    const response = await apiClient.patch<any>(`${ENDPOINT}/${id}`, payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapCentro(resultData),
    };
  },

  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    await apiClient.delete<any>(`${ENDPOINT}/${id}`);
    return {
      success: true,
      data: undefined,
    };
  },
};
