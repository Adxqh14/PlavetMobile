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
  id: string | number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  genero: Genero;
  estado: EstadoEstudiante;
  carrera: Carrera | string;
  fechaIngreso: string;
  fechaNacimiento: string;
  direccionCompleta: string;
  calle: string;
  provincia: string;
  pais: string;
  esExtranjero: boolean;
  cedula?: string;
  pasaporte?: string;
  id_taller?: string;
}

export interface CreateEstudianteData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  genero: Genero;
  estado: EstadoEstudiante;
  fechaNacimiento: string;
  esExtranjero: boolean;
  cedula?: string;
  pasaporte?: string;
  calle: string;
  provincia: string;
  pais: string;
  direccionCompleta: string;
  id_taller?: string;
}

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