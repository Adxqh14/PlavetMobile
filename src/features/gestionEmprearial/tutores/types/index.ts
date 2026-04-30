export type TutorStatus = "Activo" | "Inactivo";

export interface Tutor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  idCentroTrabajo: number | null;
  nombreCentroTrabajo?: string;
  estado: TutorStatus;
  fechaCreacion: string;
  cedula?: string;
  departamento?: string;
}

export interface TutorStats {
  total: number;
  activos: number;
  inactivos: number;
}

export interface CreateTutorData {
  nombre: string;
  apellido: string;
  telefono: string;
  correo?: string;
  idCentroTrabajo?: number;
}

export interface UpdateTutorData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  correo?: string;
  idCentroTrabajo?: number;
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
