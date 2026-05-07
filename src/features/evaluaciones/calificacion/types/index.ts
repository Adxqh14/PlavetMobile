// Definir tipo para la evaluación completa
export interface EvaluacionCompleta {
  [key: string]: string | string[] | number | boolean | undefined;
}

export interface EvaluacionGuardada {
  id: string;
  estudiante: string;
  empresa: string;
  promedioCapacidades: string;
  promedioHabilidades: string;
  promedioActitudes: string;
  notaFinal: string;
  fechaEvaluacion: string;
  evaluacionCompleta: EvaluacionCompleta;
}

export interface CalificacionStats {
  total: number;
  aprobados: number;
  reprobados: number;
  promedioGeneral: string;
}

export type FilterNota = 'todos' | 'aprobado' | 'reprobado';

// Props para los componentes de calificación
export interface ViewCalificacionDialogProps {
  evaluacion: EvaluacionGuardada | null;
  open: boolean;
  onClose: () => void;
  onSave?: (evaluacion: EvaluacionGuardada) => void;
}

export interface EditCalificacionDialogProps {
  evaluacion: EvaluacionGuardada | null;
  open: boolean;
  onClose: () => void;
  onSave: (evaluacion: EvaluacionGuardada) => void;
}

export interface CalificacionTableRowsProps {
  evaluacion: EvaluacionGuardada;
}
