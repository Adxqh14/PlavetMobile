export interface Asistencia {
  id: string;
  pasantia: string;
  estudiante: string;
  tutor: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  estado: "Presente" | "Ausente" | "Tardanza" | "Justificado";
  observaciones?: string;
  registradoPor: string;
}

export interface AsistenciaFormData {
  pasantia: string;
  estudiante: string;
  tutor: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  estado: "Presente" | "Ausente" | "Tardanza" | "Justificado";
  observaciones: string;
}

export interface AsistenciaFilters {
  searchTerm: string;
  filterEstado: "all" | "Presente" | "Ausente" | "Tardanza" | "Justificado";
}
