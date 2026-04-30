export type VinculadorStatus = "active" | "pending" | "deleted";

export interface Vinculador {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  areaAsignada: string;
  status: VinculadorStatus;
  fecha_creacion?: string;
  deletedAt?: string;
}

export interface CreateVinculadorData {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  areaAsignada: string;
}

export interface VinculadorStats {
  total: number;
  activos: number;
  pendientes: number;
  inhabilitados: number;
}
