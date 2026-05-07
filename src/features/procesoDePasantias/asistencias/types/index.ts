export interface EstudiantePerfil {
  id?: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  email_contacto?: string;
  telefono?: string;
  id_taller?: string;
}

export interface CentroTrabajo {
  id?: string;
  nombre: string;
}

export interface Asistencia {
  id: string;
  id_pasantia: string;
  id_estudiante: string;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  horas: string | number | null;
  asistencia: boolean;
  estudiante?: EstudiantePerfil;
  centro_trabajo?: CentroTrabajo;
}

export interface AsistenciaFormData {
  id_pasantia: string;
  id_estudiante: string;
  fecha: string;
  hora_entrada: string;
  hora_salida: string;
  horas?: number;
  asistencia: boolean;
}

export interface AsistenciaFilters {
  searchTerm: string;
  filterAsistencia: "all" | "presente" | "ausente";
}

export interface PasantiaSearchResult {
  id: string;
  id_estudiante: string;
  estado: string;
  // El backend mapea directamente el perfil del estudiante en este campo
  estudiante?: {
    nombre: string;
    apellido: string;
    cedula?: string;
  };
  centro_trabajo?: {
    id: string;
    nombre: string;
  };
}
