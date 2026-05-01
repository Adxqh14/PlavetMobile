// ==========================================
// Tipos para el módulo de Talleres
// ==========================================

export interface Taller {
  id: number;
  nombre: string;
  codigo_taller: string;
  id_familia: string;
  codigo_titulo: string;
  horas_pasantia: number;
  estado: string;
  familia_nombre?: string;
}

export type CreateTallerData = Omit<Taller, "id">;

export interface TallerStats {
  total: number;
  activos: number;
  inactivos: number;
  enMantenimiento: number;
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

export interface TallerQueryParams {
  search?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
}
