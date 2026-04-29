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
  { path: "/talleres", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
  { path: "/tutoresAcademicos", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/centroDeTrabajo", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/plaza", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/tutoresEmpresariales", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/supervisores", allowedRoles: ["ADMINISTRADOR", "VINCULADOR"] },
  { path: "/vinculadores", allowedRoles: ["ADMINISTRADOR"] },
  { path: "/usuarios", allowedRoles: ["ADMINISTRADOR"] },
  { path: "/documentos", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/subir", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE"] },
  { path: "/mis-documentos", allowedRoles: ["ESTUDIANTE"] },
  { path: "/evaluaciones", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "TUTOR EMPRESARIAL", "SUPERVISOR", "VINCULADOR"] },
  { path: "/calificaciones", allowedRoles: ["ADMINISTRADOR", "TUTOR ACADEMICO", "SUPERVISOR", "VINCULADOR"] },
  { path: "/mis-calificaciones", allowedRoles: ["ESTUDIANTE"] },
  { path: "/gestionDePasantias", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
  { path: "/cierrePasantias", allowedRoles: ["ADMINISTRADOR", "VINCULADOR"] },
  { path: "/excusas", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE", "TUTOR ACADEMICO", "TUTOR EMPRESARIAL", "SUPERVISOR", "VINCULADOR"] },
  { path: "/asistencias", allowedRoles: ["ADMINISTRADOR", "ESTUDIANTE", "TUTOR ACADEMICO", "TUTOR EMPRESARIAL", "SUPERVISOR", "VINCULADOR"] },
  { path: "/reportes", allowedRoles: ["ADMINISTRADOR", "SUPERVISOR", "VINCULADOR"] },
];

export const NAV_PERMISSIONS = {
  ESTUDIANTE: ["Dashboard", "Mis Documentos", "Subir Documentos", "Mis Calificaciones", "Enviar Excusas", "Gestión de Asistencias"],
};

export function canAccessRoute(role: UserRole, path: string): boolean {
  const permission = ROUTE_PERMISSIONS.find(p => p.path === path);
  if (!permission) return true;
  return permission.allowedRoles.includes(role);
}

export function isNavVisible(role: UserRole, title: string): boolean {
  if (role === "ADMINISTRADOR") return true;
  
  if (role === "ESTUDIANTE") {
    return NAV_PERMISSIONS.ESTUDIANTE.includes(title);
  }

  if (title === "Cierre de Pasantias") {
    return ["ADMINISTRADOR", "VINCULADOR"].includes(role);
  }

  return true;
}

// Configuración específica del módulo de Excusas (Unificada aquí)
export const EXCUSAS_MODULE_CONFIG: Record<UserRole, ModuleConfig> = {
  ADMINISTRADOR: {
    module_title: 'Panel de Administración Global: Excusas',
    permissions: { can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: true },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Evento', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  "TUTOR EMPRESARIAL": {
    module_title: 'Panel de Revisión: Excusas Institucionales',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Evento', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  "TUTOR ACADEMICO": {
    module_title: 'Gestión de Excusas: Tutor Académico',
    permissions: { can_view: true, can_create: true, can_edit: true, can_delete: true, can_approve: true },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Evento', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  SUPERVISOR: {
    module_title: 'Supervisión de Excusas',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Evento', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  VINCULADOR: {
    module_title: 'Visualización de Excusas',
    permissions: { can_view: true, can_create: false, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'estudiante', label: 'Estudiante', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'fecha', label: 'Fecha Evento', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
  ESTUDIANTE: {
    module_title: 'Mis Excusas Enviadas',
    permissions: { can_view: true, can_create: true, can_edit: false, can_delete: false, can_approve: false },
    table_schema: [
      { key: 'fecha', label: 'Fecha Evento', sortable: true },
      { key: 'tipoExcusa', label: 'Tipo', sortable: true },
      { key: 'estado', label: 'Estado', sortable: true },
      { key: 'acciones', label: 'Acciones', sortable: false },
    ],
  },
};
