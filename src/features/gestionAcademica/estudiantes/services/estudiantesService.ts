import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Estudiante, CreateEstudianteData, EstudianteQueryParams } from "../types";

const mapEstudiante = (d: any): Estudiante => ({
  id: d.id ?? d.cedula ?? String(Date.now()),
  nombre: d.perfil?.nombre ?? d.nombre ?? "",
  apellido: d.perfil?.apellido ?? d.apellido ?? "",
  email: d.perfil?.email_contacto ?? d.email ?? "",
  telefono: d.perfil?.telefono ?? d.telefono ?? "",
  genero: d.sexo === "M" ? "Masculino" : d.sexo === "F" ? "Femenino" : "Masculino",
  estado: d.estado ?? "Activo",
  carrera: d.taller?.nombre ?? "",
  id_taller: d.id_taller ?? d.taller?.id ?? undefined,
  fechaIngreso: d.fecha_creacion
    ? new Date(d.fecha_creacion).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  fechaNacimiento: d.fecha_nacimiento ?? "",
  direccionCompleta: d.direccion
    ? `${d.direccion.calle ?? ""} ${d.direccion.numero_residencia ?? ""}`.trim()
    : "",
  calle: d.direccion?.calle ?? "",
  provincia: "",
  pais: "",
  esExtranjero: !!d.pasaporte && !d.perfil?.cedula,
  cedula: d.perfil?.cedula ?? d.cedula ?? undefined,
  pasaporte: d.pasaporte ?? undefined,
});

export const estudiantesService = {
  getAll: async (params?: EstudianteQueryParams): Promise<PaginatedResponse<Estudiante>> => {
    const query = params ? (params as Record<string, string | number | boolean>) : undefined;
    const response = await apiClient.get<PaginatedResponse<any>>("/api/v1/estudiantes", query);
    return {
      ...response,
      data: (response.data ?? []).map(mapEstudiante),
    };
  },

  getById: async (id: string | number): Promise<ApiResponse<Estudiante>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/api/v1/estudiantes/${id}`);
    return { ...response, data: mapEstudiante(response.data) };
  },

  create: async (data: CreateEstudianteData): Promise<ApiResponse<Estudiante>> => {
    const payload: Record<string, any> = {
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      correo: data.email,
      genero: data.genero,
      fecha_nacimiento: data.fechaNacimiento,
      calle: data.calle,
    };

    if (data.esExtranjero) {
      if (data.pasaporte) payload.pasaporte = data.pasaporte;
    } else {
      if (data.cedula) payload.cedula = data.cedula;
    }

    if (data.id_taller) payload.id_taller = data.id_taller;

    const response = await apiClient.post<ApiResponse<any>>("/api/v1/estudiantes", payload);
    return { ...response, data: mapEstudiante(response.data) };
  },

  update: async (
    id: string | number,
    data: Partial<CreateEstudianteData> & Partial<Estudiante>,
  ): Promise<ApiResponse<Estudiante>> => {
    const payload: Record<string, any> = {};
    if (data.nombre) payload.nombre = data.nombre;
    if (data.apellido) payload.apellido = data.apellido;
    if (data.telefono) payload.telefono = data.telefono;
    if (data.email) payload.correo = data.email;
    if (data.genero) payload.genero = data.genero;
    if (data.fechaNacimiento) payload.fecha_nacimiento = data.fechaNacimiento;
    if (data.calle) payload.calle = data.calle;
    if (data.id_taller) payload.id_taller = data.id_taller;
    if (data.cedula) payload.cedula = data.cedula;
    if (data.pasaporte) payload.pasaporte = data.pasaporte;

    const response = await apiClient.put<ApiResponse<any>>(`/api/v1/estudiantes/${id}`, payload);
    return { ...response, data: mapEstudiante(response.data) };
  },

  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/api/v1/estudiantes/${id}`);
  },
};
