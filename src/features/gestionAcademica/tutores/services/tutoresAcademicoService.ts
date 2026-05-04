// ==========================================
// Servicio para el módulo de Tutores Académicos
// Conecta con: /api/v1/tutores-academicos
// Backend: @Controller('v1/tutores-academicos') + setGlobalPrefix('api')
// ==========================================

import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";

const ENDPOINT = "/api/v1/tutores-academicos";

// Mapea la respuesta del backend al tipo Tutor del frontend
const mapTutorAcademico = (b: any): Tutor => {
  const estadoRaw = (b.estado || "").toLowerCase();
  let status: "active" | "pending" | "deleted" = "pending";
  if (estadoRaw === "activo" || estadoRaw === "active") status = "active";
  else if (estadoRaw === "inactivo" || estadoRaw === "inactive") status = "deleted";

  // El campo 'id' en el backend es la cédula del tutor
  const cedula = String(b.id || "");

  return {
    id: cedula,
    nombre: b.perfil?.nombre || b.nombre || "",
    apellido: b.perfil?.apellido || b.apellido || "",
    email: b.perfil?.email_contacto || b.email || "",
    telefono: b.perfil?.telefono || b.telefono || "",
    cedula: b.perfil?.cedula || cedula,
    id_taller: b.id_taller || undefined,
    // Para display: nombre del taller si viene en join, o el UUID
    areaAsignada:
      b.taller?.nombre ||
      b.taller_nombre ||
      b.id_taller ||
      "",
    status,
    fechaCreacion: b.fecha_creacion
      ? new Date(b.fecha_creacion).toISOString().split("T")[0]
      : undefined,
  };
};

export const tutoresAcademicoService = {
  getAll: async (params?: {
    search?: string;
    estado?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Tutor>> => {
    const query: Record<string, string | number | boolean> = {
      page: params?.page || 1,
      pageSize: params?.pageSize || 15,
    };

    if (params?.search) query.search = params.search;

    // El backend tiene default 'activo' en el DTO. Para obtener todos, enviamos estado=""
    // (string vacío es falsy en el repositorio, que hace `if (params.estado)` antes de filtrar).
    if (params?.estado && params.estado !== "todos") {
      const estadoMap: Record<string, string> = {
        active: "Activo",
        activo: "Activo",
        deleted: "Inactivo",
        inactivo: "Inactivo",
      };
      query.estado = estadoMap[params.estado.toLowerCase()] || params.estado;
    } else {
      query.estado = "";
    }

    const response = await apiClient.get<any>(ENDPOINT, query);

    // El backend devuelve { success: true, data: [...], pagination: {...} }
    const rawData = response.data || response;
    const items = Array.isArray(rawData) ? rawData : rawData.data || [];

    return {
      success: true,
      data: items.map(mapTutorAcademico),
      pagination: response.pagination || {
        page: params?.page || 1,
        pageSize: params?.pageSize || 15,
        total: items.length,
        totalPages: 1,
      },
    };
  },

  getById: async (id: string): Promise<ApiResponse<Tutor>> => {
    const response = await apiClient.get<any>(`${ENDPOINT}/${id}`);
    const data = response.data || response;
    return { success: true, data: mapTutorAcademico(data) };
  },

  // CreateTutorAcademicoDto requiere: id (cedula), nombre, apellido, email, telefono, taller_nombre
  create: async (data: CreateTutorData): Promise<ApiResponse<Tutor>> => {
    if (!data.taller_nombre?.trim()) {
      throw new Error("Debes seleccionar un taller antes de registrar el tutor");
    }
    const payload: Record<string, any> = {
      id: data.cedula,           // cedula → id (clave del backend)
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      taller_nombre: data.taller_nombre.trim(),
    };
    if (data.id_taller) payload.id_taller = data.id_taller;

    const response = await apiClient.post<any>(ENDPOINT, payload);
    const resultData = response.data || response;
    return { success: true, data: mapTutorAcademico(resultData) };
  },

  // UpdateTutorAcademicoDto acepta: nombre?, apellido?, email?, telefono?, id_taller?, calle?, numero_residencia?, estado?
  update: async (id: string, data: UpdateTutorData): Promise<ApiResponse<Tutor>> => {
    const payload: Record<string, any> = {};

    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.apellido !== undefined) payload.apellido = data.apellido;
    if (data.email !== undefined) payload.email = data.email;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    if (data.id_taller !== undefined) payload.id_taller = data.id_taller;
    if (data.estado !== undefined) payload.estado = data.estado;

    const response = await apiClient.put<any>(`${ENDPOINT}/${id}`, payload);
    const resultData = response.data || response;
    return { success: true, data: mapTutorAcademico(resultData) };
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    await apiClient.delete<any>(`${ENDPOINT}/${id}`);
    return { success: true, data: undefined };
  },
};
