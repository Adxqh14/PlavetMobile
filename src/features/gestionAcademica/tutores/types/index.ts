// Tipos para el módulo de Tutores Académicos
// Alineados con el backend: /api/v1/tutores-academicos

export type TutorStatus = "active" | "pending" | "deleted";

export interface Tutor {
  id: string;             // cédula del tutor (es el 'id' en el backend)
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;         // mismo que id, para display
  id_taller?: string;     // UUID del taller asignado (backend field)
  areaAsignada: string;   // nombre del taller para mostrar en UI
  status: TutorStatus;    // "active" | "pending" | "deleted"
  fechaCreacion?: string;
  deletedAt?: string;      // fecha de baja si fue inactivado
}

// Para crear un tutor - se mapea a CreateTutorAcademicoDto del backend
export interface CreateTutorData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;    // se envía al backend como 'id'
  id_taller: string; // UUID del taller (requerido por el backend)
}

// Para actualizar un tutor - se mapea a UpdateTutorAcademicoDto del backend
export interface UpdateTutorData {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  id_taller?: string; // UUID del taller
  estado?: string;    // "activo" | "inactivo"
}
