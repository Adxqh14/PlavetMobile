export type SupervisorStatus = "active" | "pending" | "deleted";

export interface Supervisor {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  areaAsignada: string;
  status: SupervisorStatus;
  fecha_contratacion?: string;
  deletedAt?: string;
}

export interface CreateSupervisorData {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  areaAsignada: string;
}

export interface SupervisorStats {
  total: number;
  activos: number;
  pendientes: number;
  inhabilitados: number;
}
