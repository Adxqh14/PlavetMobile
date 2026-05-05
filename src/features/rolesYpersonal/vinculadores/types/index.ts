export interface Vinculador {
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

export interface VinculadorFormData {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
}

// Alias for backwards compat with Register dialog
export type CreateVinculadorData = VinculadorFormData;

export interface VinculadorStats {
  total: number;
  activos: number;
  inactivos: number;
}
