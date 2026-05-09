export type TutorStatus = "activo" | "inactivo" | "Activo" | "Inactivo";

export interface Tutor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;
  departamento: string;
  nombreCentroTrabajo: string;
  idCentroTrabajo: string | null;
  estado: string;
  fechaCreacion: string;
}

export interface TutorStats {
  total: number;
  activos: number;
  inactivos: number;
}

export interface CreateTutorData {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  centro_trabajo_nombre: string;
  departamento: string;
}

export interface UpdateTutorData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  cedula?: string;
  centro_trabajo_nombre?: string;
  departamento?: string;
  estado?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
