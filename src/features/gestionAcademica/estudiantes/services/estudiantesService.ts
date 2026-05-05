import { apiClient } from "../../../../lib/api";
import type { ApiResponse, PaginatedResponse } from "../../../../lib/api";
import type { Estudiante, CreateEstudianteData, EstudianteQueryParams } from "../types";

/**
 * Maps a raw backend response object to the frontend Estudiante type.
 * Backend returns: { id, perfil: { nombre, apellido, email_contacto, cedula, telefono }, taller: { nombre }, estado, sexo, fecha_creacion, fecha_nacimiento, direccion: { calle, numero_residencia }, pasaporte }
 */
const mapEstudiante = (d: any): Estudiante => ({
  id: d.id ?? d.cedula ?? String(Date.now()),
  nombre: d.perfil?.nombre ?? d.nombre ?? "",
  apellido: d.perfil?.apellido ?? d.apellido ?? "",
  email: d.perfil?.email_contacto ?? d.email ?? d.correo ?? "",
  telefono: d.perfil?.telefono ?? d.telefono ?? "",
  genero: d.sexo === "M" ? "Masculino" : d.sexo === "F" ? "Femenino" : d.genero ?? "Masculino",
  estado: (d.estado ?? "Activo") as Estudiante["estado"],
  carrera: d.taller?.nombre ?? d.carrera ?? "",
  id_taller: d.id_taller ?? d.taller?.id ?? undefined,
  fechaIngreso: d.fecha_creacion
    ? new Date(d.fecha_creacion).toLocaleDateString("es-DO")
    : new Date().toLocaleDateString("es-DO"),
  fechaNacimiento: d.fecha_nacimiento ?? "",
  direccionCompleta: d.direccion
    ? `${d.direccion.calle ?? ""} ${d.direccion.numero_residencia ?? ""}`.trim()
    : d.direccionCompleta ?? "",
  calle: d.direccion?.calle ?? d.calle ?? "",
  provincia: d.direccion?.provincia ?? d.provincia ?? "",
  pais: d.direccion?.pais ?? d.pais ?? "",
  esExtranjero: !!d.pasaporte,
  cedula: d.pasaporte ? undefined : (d.perfil?.cedula ?? d.cedula ?? undefined),
  pasaporte: d.pasaporte ?? undefined,
});

export const estudiantesService = {
  /** GET /api/v1/estudiantes — listado paginado */
  getAll: async (params?: EstudianteQueryParams): Promise<PaginatedResponse<Estudiante>> => {
    // The backend uses lowercase estado values by default ("activo"), but accepts capitalized too.
    // When the user wants "todos", we omit the estado filter entirely.
    const query: Record<string, string | number | boolean> = {};
    if (params?.page) query.page = params.page;
    if (params?.pageSize) query.pageSize = params.pageSize;
    if (params?.search) query.search = params.search;
    if (params?.estado) query.estado = params.estado;

    const response = await apiClient.get<any>("/api/v1/estudiantes", query);

    // Backend returns { success, data: [...], pagination: {...} }
    const data: any[] = Array.isArray(response.data) ? response.data : [];
    return {
      success: response.success ?? true,
      data: data.map(mapEstudiante),
      pagination: response.pagination ?? { page: 1, pageSize: params?.pageSize ?? 15, total: data.length, totalPages: 1 },
    };
  },

  /** GET /api/v1/estudiantes/stats */
  getStats: async (): Promise<ApiResponse<{ total: number; activos: number; inactivos: number; suspendidos: number }>> => {
    return apiClient.get<ApiResponse<{ total: number; activos: number; inactivos: number; suspendidos: number }>>("/api/v1/estudiantes/stats");
  },

  /** GET /api/v1/estudiantes/:id */
  getById: async (id: string | number): Promise<ApiResponse<Estudiante>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/api/v1/estudiantes/${id}`);
    return { ...response, data: mapEstudiante(response.data) };
  },

  /**
   * POST /api/v1/estudiantes — crear estudiante
   * Backend DTO fields: nombre, apellido, telefono, email, genero (alias for sexo),
   *   fecha_nacimiento, calle, numero_residencia, cedula, pasaporte, id_taller
   */
  create: async (data: CreateEstudianteData): Promise<ApiResponse<Estudiante>> => {
    const payload: Record<string, any> = {
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      email: data.email,
      genero: data.genero,    // backend maps Masculino→M, Femenino→F
      fecha_nacimiento: data.fechaNacimiento,
      provincia: data.provincia,
      calle: data.calle,
      numero_residencia: data.numero_residencia,
    };

    if (data.esExtranjero) {
      if (data.pasaporte) {
        payload.pasaporte = data.pasaporte;
        // Backend requires cedula/id — use pasaporte as unique identifier for foreign students
        payload.id = data.pasaporte;
      }
    } else {
      if (data.cedula) payload.cedula = data.cedula;
    }

    if (data.id_taller) payload.id_taller = data.id_taller;

    const response = await apiClient.post<ApiResponse<any>>("/api/v1/estudiantes", payload);
    return { ...response, data: mapEstudiante(response.data) };
  },

  /**
   * PUT /api/v1/estudiantes/:id — actualizar datos del estudiante
   * Uses same field aliases as create.
   */
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
    if (data.direccionCompleta) payload.direccion = data.direccionCompleta;
    if (data.id_taller) payload.id_taller = data.id_taller;
    if (data.pasaporte) payload.pasaporte = data.pasaporte;

    const response = await apiClient.put<ApiResponse<any>>(`/api/v1/estudiantes/${id}`, payload);
    return { ...response, data: mapEstudiante(response.data) };
  },

  /**
   * PATCH /api/v1/estudiantes/:id/estado — cambiar solo el estado
   * Backend body: { estado: "Activo" | "Inactivo" | "Suspendido" }
   */
  updateEstado: async (
    id: string | number,
    estado: string,
  ): Promise<ApiResponse<Estudiante>> => {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/api/v1/estudiantes/${id}/estado`,
      { estado },
    );
    return { ...response, data: mapEstudiante(response.data) };
  },

  /**
   * DELETE /api/v1/estudiantes/:id — soft delete (inactiva el estudiante)
   */
  delete: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/api/v1/estudiantes/${id}`);
  },
};
