import type { UserRole } from "@/features/auth/types";

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
}

export interface ModulePermissions {
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

export interface ModuleConfig {
  module_title: string;
  permissions: ModulePermissions;
  table_schema: TableColumn[];
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { path: "/estudiantes", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
  { path: "/talleres", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/tutoresAcademicos", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/centroDeTrabajo", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/plaza", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/tutoresEmpresariales", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/supervisores", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/vinculadores", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR"] },
  { path: "/usuarios", allowedRoles: ["ADMINISTRADOR", "VINCULADOR"] },
  { path: "/documentos", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
  { path: "/subir", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE"] },
  { path: "/mis-documentos", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE"] },
  { path: "/evaluaciones", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "TUTOR EMPRESARIAL", "SUPERVISOR", "VINCULADOR"] },
  { path: "/calificaciones", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
  { path: "/mis-calificaciones", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE"] },
  { path: "/gestionDePasantias", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/cierrePasantias", allowedRoles: ["ADMINISTRADOR", "VINCULADOR"] },
  { path: "/excusas", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE", "TUTOR ACADEMICO", "TUTOR EMPRESARIAL", "SUPERVISOR", "VINCULADOR"] },
  { path: "/asistencias", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE", "TUTOR ACADEMICO", "TUTOR EMPRESARIAL", "SUPERVISOR", "VINCULADOR"] },
  { path: "/visitas", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
  { path: "/reportes", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
];

export const NAV_PERMISSIONS: Record<string, string[]> = {
  ESTUDIANTE: [
    "Dashboard", 
    "Mis Documentos", 
    "Subir Documentos", 
    "Mis Calificaciones", 
    "Enviar Excusas", 
    "Registro de Asistencias"
  ],
  "TUTOR ACADEMICO": [
    "Dashboard",
    "Gestion Academica",
    "Estudiantes",
    "Documentacion",
    "Documentos",
    "Evaluaciones",
    "Calificaciones",
    "Proceso de Pasantias",
    "Registro de Asistencias",
    "Registro de Visitas",
    "Enviar Excusas",
    "Reportes"
  ],
  "TUTOR EMPRESARIAL": [
    "Dashboard",
    "Evaluaciones",
    "Proceso de Pasantias",
    "Registro de Asistencias",
    "Enviar Excusas"
  ],
  "SUPERVISOR": [
    "Dashboard",
    "Gestion Academica",
    "Estudiantes",
    "Talleres",
    "Tutores",
    "Gestion Institucional",
    "Centros de Trabajo",
    "Plazas",
    "Tutores Empresariales",
    "Roles y Personal",
    "Supervisores",
    "Vinculadores",
    "Documentacion",
    "Documentos",
    "Evaluaciones",
    "Calificaciones",
    "Proceso de Pasantias",
    "Gestion de Pasantias",
    "Registro de Asistencias",
    "Registro de Visitas",
    "Enviar Excusas",
    "Reportes"
  ],
  "VINCULADOR": [
    "Dashboard",
    "Gestion Academica",
    "Estudiantes",
    "Talleres",
    "Tutores",
    "Gestion Institucional",
    "Centros de Trabajo",
    "Plazas",
    "Tutores Empresariales",
    "Roles y Personal",
    "Supervisores",
    "Usuarios",
    "Documentacion",
    "Documentos",
    "Evaluaciones",
    "Calificaciones",
    "Proceso de Pasantias",
    "Gestion de Pasantias",
    "Cierre de Pasantias",
    "Registro de Asistencias",
    "Registro de Visitas",
    "Enviar Excusas",
    "Reportes"
  ]
};

export function canAccessRoute(role: UserRole, path: string): boolean {
  const permission = ROUTE_PERMISSIONS.find(p => p.path === path);
  if (!permission) return true;
  return permission.allowedRoles.includes(role);
}

export function isNavVisible(role: UserRole, title: string): boolean {
  if (role === "ADMINISTRADOR") return true;
  
  const allowedTitles = NAV_PERMISSIONS[role as string];
  if (allowedTitles) {
    return allowedTitles.includes(title);
  }

  return true;
}

/**
 * Indica si un rol tiene acceso de solo lectura en todos los módulos
 */
export function isReadOnlyRole(role: UserRole): boolean {
  return role === "SUPERVISOR";
}

// Configuración específica del módulo de Excusas (Unificada aquí)
export const EXCUSAS_MODULE_CONFIG: Record<UserRole, ModuleConfig> = {
  ADMINISTRADOR: {
    module_title: 'Panel de Administración Global: Excusas',
    permissions: { can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Registro', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  "TUTOR EMPRESARIAL": {
    module_title: 'Panel de Revisión: Excusas Institucionales',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Registro', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  "TUTOR ACADEMICO": {
    module_title: 'Gestión de Excusas: Tutor Académico',
    permissions: { can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Registro', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  SUPERVISOR: {
    module_title: 'Supervisión de Excusas',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Registro', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  VINCULADOR: {
    module_title: 'Visualización de Excusas',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Registro', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  ESTUDIANTE: {
    module_title: 'Mis Excusas Enviadas',
    permissions: { can_view: true, can_create: true, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'fecha', label: 'Fecha Registro', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
};

// Configuración específica del módulo de Asistencias
export const ASISTENCIAS_MODULE_CONFIG: Record<UserRole, ModuleConfig> = {
  ADMINISTRADOR: {
    module_title: 'Gestión Global de Asistencias',
    permissions: { can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: true },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'horaEntrada', label: 'Entrada', sortable: true },
      { key: 'horaSalida', label: 'Salida', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  "TUTOR EMPRESARIAL": {
    module_title: 'Registro de Asistencias: Tutor Empresarial',
    permissions: { can_view: true, can_create: true, can_edit: true, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'horaEntrada', label: 'Entrada', sortable: true },
      { key: 'horaSalida', label: 'Salida', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  "TUTOR ACADEMICO": {
    module_title: 'Supervisión de Asistencias: Tutor Académico',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Detalles', sortable: false },
    ],
  },
  SUPERVISOR: {
    module_title: 'Monitoreo de Asistencias',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'pasantia', label: 'Pasantía', sortable: true },
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Detalles', sortable: false },
    ],
  },
  VINCULADOR: {
    module_title: 'Visualización de Asistencias',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Detalles', sortable: false },
    ],
  },
  ESTUDIANTE: {
    module_title: 'Mi Historial de Asistencia',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'fecha', label: 'Fecha', sortable: true },
      { key: 'horaEntrada', label: 'Entrada', sortable: true },
      { key: 'horaSalida', label: 'Salida', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Detalles', sortable: false },
    ],
  },
};
