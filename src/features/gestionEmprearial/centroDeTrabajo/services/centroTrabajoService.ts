import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { CentroTrabajo, CreateCentroData, CentroStatus } from "../types";

const mapCentro = (b: any): CentroTrabajo => {
  // Mapeo flexible del estado para el frontend (activo, inactivo, pendiente, rechazado)
  let status: CentroStatus = "activo";
  const backendEstado = (b.estado || "").toLowerCase();

  if (backendEstado === "inactivo") status = "inactivo";
  else if (backendEstado === "pendiente") status = "pendiente";
  else if (backendEstado === "rechazado") status = "rechazado";

  // Extraer datos de los joins (si existen)
  const direccion = b.direccion || {};
  const contacto = b.contacto || {};

  return {
    id: String(b.id),
    name: b.nombre || "",
    location: direccion.calle
      ? `${direccion.calle} ${direccion.numero_residencia || ""}`.trim()
      : b.location || "Sin dirección",
    employees: 0,
    status: status,
    validated: b.validacion === "Validada" || b.validacion === "Válido" || b.validacion === "Aprobado",

    // Campos extraídos de las relaciones
    email: contacto.email || "",
    telefono: contacto.telefono || "",
    responsable: b.responsable || "", // Mapeado desde el join en el repo
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
      // El backend solo acepta Activo/Inactivo para el campo 'estado'
    }

    const response = await apiClient.get<any>("/api/centros-trabajo", query);
    const data = response.data || response || [];

    return {
      success: true,
      data: Array.isArray(data) ? data.map(mapCentro) : [],
      pagination: response.pagination || {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        total: Array.isArray(data) ? data.length : 0,
        totalPages: 1
      }
    };
  },

  getById: async (id: string | number): Promise<ApiResponse<CentroTrabajo>> => {
    const response = await apiClient.get<any>(`/api/centros-trabajo/${id}`);
    const data = response.data || response;
    return {
      success: true,
      data: mapCentro(data)
    };
  },

  create: async (data: CreateCentroData): Promise<ApiResponse<CentroTrabajo>> => {
    // IMPORTANTE: El backend solo acepta 'Activo' o 'Inactivo' en el campo 'estado'
    // El estado 'Pendiente' se maneja en el campo 'validacion'
    const payload = {
      nombre: data.name,
      location: data.location, // Se usa para crear la dirección en el repo mejorado
      calle: data.location,
      email: data.email,
      telefono: data.telefono,
      responsable: data.responsable,
      tipo: data.tipo,
      descripcion: data.descripcion,
      estado: "Activo", // Siempre Activo al crear segun DTO
      validacion: data.status === "pendiente" ? "Pendiente" : "Válido",
      restriccion_edad: false,
    };

    const response = await apiClient.post<any>("/api/centros-trabajo", payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapCentro(resultData)
    };
  },

  update: async (id: string | number, data: Partial<CentroTrabajo>): Promise<ApiResponse<CentroTrabajo>> => {
    const payload: Record<string, any> = {};
    if (data.name) payload.nombre = data.name;
    if (data.status) {
      const status = data.status.toLowerCase();
      if (status === "activo") payload.estado = "Activo";
      else if (status === "inactivo") payload.estado = "Inactivo";
      // Si es pendiente, el backend no lo acepta en 'estado', ignoramos o manejamos en validacion
    }
    if (data.restriccion_edad !== undefined) payload.restriccion_edad = data.restriccion_edad;
    if (data.validated !== undefined) payload.validacion = data.validated ? "Validada" : "Pendiente";

    const response = await apiClient.patch<any>(`/api/centros-trabajo/${id}`, payload);
    const resultData = response.data || response;
    return {
      success: true,
      data: mapCentro(resultData)
    };
  },

  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    await apiClient.delete<any>(`/api/centros-trabajo/${id}`);
    return {
      success: true,
      data: undefined
    };
  },
};
