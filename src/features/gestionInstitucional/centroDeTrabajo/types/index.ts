export type CentroStatus = "activo" | "inactivo" | "pendiente" | "rechazado";

export interface CentroTrabajo {
  id: string;
  name: string;
  location: string;
  employees: number;
  status: CentroStatus;
  validated: boolean;
  createdAt: string;
  deletedAt?: string;
  
  // New fields for synchronization
  tipo?: string;
  responsable?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;

  // Technical fields for backend integration
  id_contacto?: number | null;
  id_direccion?: number | null;
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
  status?: CentroStatus;
  tipo?: string;
  responsable?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
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
