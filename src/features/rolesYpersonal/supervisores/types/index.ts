export interface Supervisor {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  estado: "activo" | "inactivo";
  fecha_creacion?: string;
  deleted_at?: string | null;
}

export interface SupervisorFormData {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
}

// Alias for backwards compat with Register dialog
export type CreateSupervisorData = SupervisorFormData;

export interface SupervisorStats {
  total: number;
  activos: number;
  inactivos: number;
}
