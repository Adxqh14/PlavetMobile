export type TutorStatus = "active" | "pending" | "deleted";

export interface Tutor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadTecnica: string;
  areaAsignada: string;
  status: TutorStatus;
  fechaContratacion: string;
  deletedAt?: string;
}

export interface TutorStats {
  total: number;
  activos: number;
  pendientes: number;
  inhabilitados: number;
}

export interface CreateTutorData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadTecnica: string;
  areaAsignada: string;
  fechaContratacion: string;
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
