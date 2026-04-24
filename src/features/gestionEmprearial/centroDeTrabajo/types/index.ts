export type CentroStatus = "active" | "pending" | "rejected" | "deleted";

export interface CentroTrabajo {
  id: string;
  name: string;
  location: string;
  employees: number;
  status: CentroStatus;
  validated: boolean;
  createdAt: string;
  deletedAt?: string;
  // Additional fields for backend integration
  direccion?: string;
  contacto?: string;
  restriccion_edad?: boolean;
  id_usuario?: number | null;
  validacion?: string | null;
  fecha_creacion?: string;
}

export interface CentroStats {
  total: number;
  activos: number;
  validados: number;
  pendientes: number;
  archivados: number;
}

export interface CreateCentroData {
  name: string;
  location: string;
  employees: number;
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
