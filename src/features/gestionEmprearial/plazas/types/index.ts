export type Genero = "Indistinto" | "Masculino" | "Femenino";
export type EstadoPlaza = "Activa" | "Ocupada" | "Inhabilitada";

export const TALLERES = [
  "Mecanizado",
  "Electronica",
  "Automotriz",
  "Informatica",
  "Confeccion y Patronaje",
  "Ebanisteria",
  "Contabilidad",
  "Electricidad",
] as const;

export type Taller = (typeof TALLERES)[number];

export interface Plaza {
  id: number;
  nombre: string;
  centro: string;
  titulo: string;
  genero: Genero;
  estado: EstadoPlaza;
  descripcion: string;
  fechaCreacion: string;
  taller: Taller;
}

export type CreatePlazaData = Omit<Plaza, "id" | "fechaCreacion">;

export interface PlazaStats {
  total: number;
  activas: number;
  ocupadas: number;
  inhabilitada: number;
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

export interface PlazaQueryParams {
  search?: string;
  estado?: string;
  taller?: string;
  page?: number;
  pageSize?: number;
}
