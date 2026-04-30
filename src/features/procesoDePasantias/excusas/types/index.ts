export type TipoExcusa = "Tardanza" | "Inasistencia" | "Salida Temprana" | "Otro";

export interface Excuse {
  id: string
  pasantia: string
  estudiante: string
  tutor: string
  justificacion: string
  tipoExcusa: TipoExcusa
  hora?: string // Para tardanzas o salidas
  duracion?: string // Tiempo que estará fuera
  fecha: string // Fecha de la falta
  fechaCreacion: string // Fecha en que se registra
  estado: "Pendiente" | "Aprobada" | "Rechazada"
}

export interface ExcuseFormData {
  pasantia: string
  estudiante: string
  tutor: string
  justificacion: string
  tipoExcusa: TipoExcusa
  hora?: string
  duracion?: string
  fecha: string
}

export interface ExcuseFilters {
  searchTerm: string
  filterEstado: string
}
