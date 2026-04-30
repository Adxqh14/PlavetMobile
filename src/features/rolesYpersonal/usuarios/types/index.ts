export type EstadoUsuario = "Activo" | "Inactivo";

export const ROLES: Record<number, string> = {
  1: "Administrador",
  2: "Supervisor",
  3: "Vinculador",
  4: "Estudiante",
  5: "Tutor",
  6: "Docente",
};

export const ROL_IDS = [1, 2, 3, 4, 5, 6] as const;
export type RolId = (typeof ROL_IDS)[number];

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  id_rol: RolId;
  rol: string;
  estado: EstadoUsuario;
  perfil_extendido?: PerfilExtendido | null;
}

export interface PerfilExtendido {
  cedula?: string;
  telefono?: string;
  direccion?: string;
  carrera?: string;
  especialidad?: string;
  [key: string]: string | number | undefined;
}

export interface UsuarioStats {
  total: number;
  activos: number;
  inactivos: number;
  rolesUnicos: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UsuarioQueryParams {
  search?: string;
  estado?: string;
  page?: number;
  limit?: number;
}
