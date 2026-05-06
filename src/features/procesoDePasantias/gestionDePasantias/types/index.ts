export type EstadoPasantia = "activa" | "completada" | "suspendida" | "pendiente" | "cancelada";

// ── Backend entity types ──────────────────────────────────────────────────────

export interface CentroTrabajo {
  id: string;
  nombre: string;
  estado: string;
  telefono?: string | null;
  email_contacto?: string | null;
}

export interface Plaza {
  id: string;
  nombre_plaza: string | null;
  id_centro_trabajo: string;
  estado: string;
  cantidad?: number;
}

export interface TutorEmpresarial {
  id: string;
  id_centro_trabajo: string;
  departamento?: string | null;
  estado: string;
  perfil?: {
    nombre: string;
    apellido: string;
    cedula?: string | null;
    telefono?: string | null;
    email_contacto?: string | null;
  };
  centro_trabajo?: {
    id: string;
    nombre: string;
  };
}

export interface EstudianteBackend {
  id: string;
  perfil?: {
    id: string;
    nombre: string;
    apellido: string;
    cedula?: string | null;
    telefono?: string | null;
    email_contacto?: string | null;
  };
}

// ── Main Pasantia type (matches backend response) ─────────────────────────────

export interface Pasantia {
  id: string;
  id_estudiante: string;
  id_centro_trabajo: string;
  id_tutor_empresarial: string;
  id_plaza?: string | null;
  estado: EstadoPasantia;
  horas_acumuladas: number;
  fecha_inicio: string;
  fecha_fin?: string | null;
  fecha_creacion?: string;
  // Nested relations
  estudiante?: {
    nombre: string;
    apellido: string;
    cedula?: string | null;
  } | null;
  centro_trabajo?: {
    id: string;
    nombre: string;
  } | null;
  tutor_empresarial?: {
    nombre: string;
    apellido: string;
  } | null;
  plaza?: {
    id: string;
    nombre_plaza: string | null;
  } | null;
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreatePasantiaPayload {
  estudiante_nombre: string;
  centro_trabajo_nombre: string;
  tutor_empresarial_nombre: string;
  plaza_nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  horas_acumuladas?: number;
  estado: string;
}

// Backend update only accepts these fields
export interface UpdatePasantiaPayload {
  estado?: string;
  horas_acumuladas?: number;
  fecha_inicio?: string;
  fecha_fin?: string | null;
  id_plaza?: string | null;
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface PasantiaStats {
  total: number;
  activas: number;
  completadas: number;
  pendientes: number;
  suspendidas: number;
}
