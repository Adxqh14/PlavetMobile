// ==========================================
// Servicio para el módulo de Dashboard
// Conecta con: /api/v1/dashboard
// ==========================================

import { apiClient } from "../../../lib/api";
import type { ApiResponse } from "../../../lib/api";

export interface DashboardStats {
  totalEstudiantes: number;
  totalTalleres: number;
  totalCentrosTrabajo: number;
  pasantiasActivas: number;
  pasantiasCompletadas: number;
  pasantiasPendientes: number;
}

export interface DashboardActivity {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  usuario?: string;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  usuarios_totales: number;
  programas_activos: number;
  uptime: string;
  sesiones_hoy: number;
}

export interface AdminAuditoriaEntry {
  actividad: string;
  fecha: string;
  id_usuario: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  auditoria: AdminAuditoriaEntry[] | null;
}

// ── Estudiante ────────────────────────────────────────────────────────────────

export interface EstudiantePasantia {
  id?: string | number;
  id_centro?: string | number;
  centro_trabajo_id?: string | number;
  empresa: string;
  tutor: string;
  id_tutor?: string | number;
  estado: string;
  progreso: { actual: number; total: number; porcentaje: number };
}

export interface EstudianteEstadisticas {
  documentos: string;
  excusas: string;
}

export interface EstudianteDashboardData {
  pasantia: EstudiantePasantia;
  estadisticas: EstudianteEstadisticas;
  actividad_reciente: Array<{ actividad: string; fecha: string }>;
  asistencia: unknown[];
}

// ── Supervisor / Tutor Empresarial ────────────────────────────────────────────

export interface SupervisorStats {
  estudiantes: number;
  empresas: number;
  tasa_exito: string;
  alertas_count: number;
}

export interface AlertaEstudiante {
  id: string;
  nombre: string;
  taller: string;
  tipo_alerta: string;
  valor: string;
}

export interface SupervisorDashboardData {
  stats: SupervisorStats;
  alertas: AlertaEstudiante[];
}

// ── Vinculador ────────────────────────────────────────────────────────────────

export interface VinculadorStats {
  convenios: number;
  plazas_libres: number;
  por_asignar: number;
  alertas: number;
}

export interface VinculadorDashboardData {
  stats: VinculadorStats;
}

// ── Tutor Académico ───────────────────────────────────────────────────────────

export interface TutorAcademicoExcusa {
  id: string;
  estudiante_nombre: string;
  tipo: string;
  fecha: string;
}

export interface TutorAcademicoVisita {
  empresa: string;
  fecha: string;
  estudiante_nombre: string;
}

export interface TutorAcademicoDashboardData {
  resumen: {
    total_estudiantes: number;
    distribucion: {
      en_proceso: number;
      finalizados: number;
      en_riesgo: number;
      inactivos: number;
    };
    metricas: {
      progreso_prom: string;
      horas_prom: string;
      docs_completos: number;
    };
  };
  excusas_por_validar: TutorAcademicoExcusa[];
  proximas_visitas: TutorAcademicoVisita[];
}

// ── Tutor Empresarial ─────────────────────────────────────────────────────────

export interface TutorEmpresarialEquipoMember {
  nombre: string;
  rol: string;
  asistencia: string;
}

export interface TutorEmpresarialDashboardData {
  empresa: string;
  evaluaciones_pendientes: number;
  equipo: TutorEmpresarialEquipoMember[];
}

// ── Service ───────────────────────────────────────────────────────────────────

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get<ApiResponse<DashboardStats>>("/api/dashboard/stats");
  },

  getRecentActivity: async (limit?: number): Promise<ApiResponse<DashboardActivity[]>> => {
    return apiClient.get<ApiResponse<DashboardActivity[]>>("/api/dashboard/activity", {
      limit: limit ?? 10,
    });
  },

  getAdminDashboard: async (): Promise<{ success: boolean; data: AdminDashboardData }> => {
    return apiClient.get<{ success: boolean; data: AdminDashboardData }>("/api/v1/dashboard/admin");
  },

  getEstudianteDashboard: async (): Promise<{ success: boolean; data: EstudianteDashboardData }> => {
    return apiClient.get<{ success: boolean; data: EstudianteDashboardData }>("/api/v1/dashboard/estudiante");
  },

  getSupervisorDashboard: async (): Promise<{ success: boolean; data: SupervisorDashboardData }> => {
    return apiClient.get<{ success: boolean; data: SupervisorDashboardData }>("/api/v1/dashboard/supervisor");
  },

  getVinculadorDashboard: async (): Promise<{ success: boolean; data: VinculadorDashboardData }> => {
    return apiClient.get<{ success: boolean; data: VinculadorDashboardData }>("/api/v1/dashboard/vinculador");
  },

  getTutorAcademicoDashboard: async (): Promise<{ success: boolean; data: TutorAcademicoDashboardData }> => {
    return apiClient.get<{ success: boolean; data: TutorAcademicoDashboardData }>("/api/v1/dashboard/tutor-academico");
  },

  getTutorEmpresarialDashboard: async (): Promise<{ success: boolean; data: TutorEmpresarialDashboardData }> => {
    return apiClient.get<{ success: boolean; data: TutorEmpresarialDashboardData }>("/api/v1/dashboard/tutor-empresarial");
  },
};
