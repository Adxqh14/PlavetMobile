export type EstadoUsuario = "activo" | "inactivo";

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

export interface PerfilUsuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
}

export interface Usuario {
  id: string;
  username: string;
  email: string;
  id_rol: string;
  rol: string;
  estado: string;
  fecha_creacion?: string;
  perfil: PerfilUsuario | null;
}

export function getNombreCompleto(u: Usuario): string {
  if (u.perfil) return `${u.perfil.nombre} ${u.perfil.apellido}`;
  return u.username;
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
