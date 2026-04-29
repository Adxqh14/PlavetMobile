export type Genero = "Masculino" | "Femenino";
export type EstadoEstudiante = "Activo" | "Inactivo" | "Suspendido";

export const CARRERAS = [
  "Informática",
  "Electrónica",
  "Mecanizado",
  "Automotriz",
  "Confección y Patronaje",
  "Ebanistería",
  "Contabilidad",
  "Electricidad",
] as const;

export type Carrera = (typeof CARRERAS)[number];

export interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  genero: Genero;
  estado: EstadoEstudiante;
  carrera: Carrera;
  fechaIngreso: string;
  fechaNacimiento: string;
  nacionalidad: string;
  referencia: string;
  calle: string;
  provincia: string;
  pais: string;
  cedula: string;
}

export type CreateEstudianteData = Omit<Estudiante, "id" | "fechaIngreso">;

export interface EstudianteStats {
  total: number;
  activos: number;
  inactivos: number;
  suspendidos: number;
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

export interface EstudianteQueryParams {
  search?: string;
  estado?: string;
  carrera?: string;
  page?: number;
  pageSize?: number;
}
