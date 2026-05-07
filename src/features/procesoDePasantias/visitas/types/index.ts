export interface VisitaEstudiante {
  id_visita_estudiante?: string;
  observacion?: string | null;
  estudiante: {
    id?: string;
    nombre: string;
    apellido: string;
  };
}

export interface Visita {
  id: string;
  id_tutor: string;
  id_centro_trabajo: string;
  motivo: string;
  fecha: string;
  hora?: string | null;
  observacion?: string | null;
  estado: string;
  created_at?: string;
  updated_at?: string | null;
  tutor?: {
    id?: string;
    nombre: string;
    apellido: string;
    email_contacto?: string;
    id_taller?: string;
  };
  centro_trabajo?: {
    id?: string;
    nombre: string;
  };
  estudiantes?: VisitaEstudiante[];
}

export interface EstudianteFormEntry {
  id_estudiante: string;       // UUID
  nombre_display: string;      // For display only
  observacion: string;
}

export interface VisitaFormData {
  id_tutor: string;
  id_centro_trabajo: string;
  motivo: string;
  fecha: string;
  hora: string;
  observacion: string;
  estado: string;
  estudiantes: { id_estudiante: string; observacion?: string }[];
}

export interface VisitaFilters {
  searchTerm: string;
  filterEstado: string;
}

// Search result shapes returned by each endpoint
export interface TutorResult {
  id: string;
  id_taller?: string;
  taller?: { id: string; nombre: string };
  perfil?: { nombre: string; apellido: string };
  nombre?: string;
  apellido?: string;
}

export interface CentroResult {
  id: string;
  nombre: string;
}

export interface EstudianteResult {
  id: string;
  perfil?: { nombre: string; apellido: string };
  nombre?: string;
  apellido?: string;
}
