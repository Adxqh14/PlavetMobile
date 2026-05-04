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

export type Taller = string; // Ahora es flexible para IDs o Nombres

export interface Plaza {
  id: number;
  nombre: string;
  centro: string;           // nombre del centro (display)
  empresaId?: number;       // ID del centro de trabajo (API)
  idTaller?: string;        // ID del taller (API) - Debe ser numérico
  titulo: string;
  genero: Genero;
  estado: EstadoPlaza;
  descripcion: string;
  fechaCreacion: string;
  taller: Taller;           // nombre del taller (display)
  cupoTotal: number;        // cupo total de la plaza
  cupoOcupado: number;      // cantidad de estudiantes asignados
  cantidadPersonas?: number; // alias de cupoTotal usado en el formulario
  edadMinima?: number;      // edad mínima requerida
}

export type CreatePlazaData = Omit<Plaza, "id" | "fechaCreacion" | "cupoOcupado">;

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
