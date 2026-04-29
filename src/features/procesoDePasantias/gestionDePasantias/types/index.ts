export type EstadoPasantia = "activa" | "completada" | "suspendida" | "pendiente";

// Removed TALLERES as requested

export const CENTROS = [
  "TechCorp Solutions",
  "Consultores RD", 
  "AutoService Center",
  "DataSoft Inc",
  "ElectroTec"
] as const;

export type Centro = (typeof CENTROS)[number];

export const TUTORES = [
  "Ing. Maria Garcia",
  "Lic. Carlos Mendez",
  "Tec. Roberto Diaz", 
  "Ing. Pedro Almonte"
] as const;

export type Tutor = (typeof TUTORES)[number];

export interface Estudiante {
  nombre: string;
  matricula: string;
}

export const ESTUDIANTES: Estudiante[] = [
  { nombre: "Juan Perez", matricula: "12345678" },
  { nombre: "Ana Martinez", matricula: "12345679" },
  { nombre: "Carlos Rodriguez", matricula: "12345680" },
  { nombre: "Maria Sanchez", matricula: "12345681" },
  { nombre: "Luis Fernandez", matricula: "12345682" }
];

export interface Pasantia {
  id: string;
  estudiante: string;
  matricula: string;
  // taller: Taller; // Removed
  plazaAsignada: string; // Added
  centroTrabajo: string; // Changed to string for flexibility
  tutor: string; // Changed to string for flexibility
  fechaInicio: string;
  fechaFin?: string; // Optional
  horasCompletadas: number;
  // horasRequeridas: number; // Removed
  estado: EstadoPasantia;
  observaciones: string;
}

export type CreatePasantiaData = Omit<Pasantia, "id" | "horasCompletadas">;

export interface PasantiaStats {
  total: number;
  activas: number;
  completadas: number;
  pendientes: number;
  suspendidas: number;
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

export interface PasantiaQueryParams {
  search?: string;
  estado?: string;
  // taller?: string; // Removed
  page?: number;
  pageSize?: number;
}
