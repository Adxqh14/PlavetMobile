// Backend-aligned tipo_excusa values
export type TipoExcusa = "Ausencia" | "tardanza" | "salir temprano";

export const TIPO_EXCUSA_LABELS: Record<TipoExcusa, string> = {
  Ausencia: "Ausencia",
  tardanza: "Tardanza",
  "salir temprano": "Salida Temprana",
};

export interface Excuse {
  id: string;
  id_pasantia: string;
  pasantia: string;      // display label built client-side
  estudiante: string;    // "Nombre Apellido" from backend
  tutor: string;         // "Nombre Apellido" from backend
  justificacion: string;
  tipoExcusa: TipoExcusa;
  fecha: string;         // date part of fecha_creacion
  fechaCreacion: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}

export interface ExcuseFormData {
  id_pasantia: string;        // UUID sent to backend
  pasantia: string;           // display label shown in form
  estudiante: string;         // auto-filled from selected pasantia (read-only)
  tutor: string;              // auto-filled from selected pasantia (read-only)
  centroDeTrabajo: string;    // auto-filled from selected pasantia (read-only)
  justificacion: string;
  tipoExcusa: TipoExcusa;
}

export interface ExcuseFilters {
  searchTerm: string;
  filterEstado: string;
}
