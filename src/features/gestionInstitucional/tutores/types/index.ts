export interface Tutor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  idCentroTrabajo?: number;
  nombreCentroTrabajo?: string;
  estado: string;
  fechaCreacion: string;
}

export interface CreateTutorData {
  nombre: string;
  apellido: string;
  correo?: string;
  telefono: string;
  idCentroTrabajo?: number;
}

export interface UpdateTutorData {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  idCentroTrabajo?: number;
  estado?: string;
}
