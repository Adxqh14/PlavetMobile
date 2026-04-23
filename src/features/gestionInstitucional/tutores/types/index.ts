export interface Tutor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  idCentroTrabajo: number | null;
  nombreCentroTrabajo?: string;
  estado: "Activo" | "Inactivo";
  fechaCreacion: string;
}

export interface CreateTutorData {
  nombre: string;
  apellido: string;
  telefono: string;
  correo?: string;
  idCentroTrabajo?: number;
}

export interface UpdateTutorData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  correo?: string;
  idCentroTrabajo?: number;
}
