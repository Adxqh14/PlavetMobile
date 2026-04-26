export class GetRoleConfigUseCase {
  execute() {
    return {
      roles_config: {
        ADMINISTRADOR: {
          module_title: 'Panel de Administración Global: Excusas',
          api_endpoint: '/api/excusas',
          permissions: {
            can_view: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_approve: true,
          },
          table_schema: [
            { key: 'id', label: 'ID', sortable: true },
            { key: 'pasantia', label: 'Pasantía', sortable: true },
            { key: 'estudiante', label: 'Estudiante', sortable: true },
            { key: 'tutor', label: 'Tutor', sortable: true },
            { key: 'justificacion', label: 'Justificación', sortable: false },
            { key: 'certificado', label: 'Certificado', sortable: false },
            { key: 'fecha', label: 'Fecha Envío', sortable: true },
            { key: 'estado', label: 'Estado', sortable: true },
            { key: 'acciones', label: 'Acciones', sortable: false },
          ],
        },
        "TUTOR EMPRESARIAL": {
          module_title: 'Panel de Revisión: Excusas Institucionales',
          api_endpoint: '/api/excusas',
          permissions: {
            can_view: true,
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_approve: false,
          },
          table_schema: [
            { key: 'estudiante', label: 'Estudiante', sortable: true },
            { key: 'fecha', label: 'Fecha Envío', sortable: true },
            { key: 'justificacion', label: 'Motivo', sortable: false },
            { key: 'estado', label: 'Estado Actual', sortable: true },
            { key: 'acciones', label: 'Acciones de Gestión', sortable: false },
          ],
        },
        "TUTOR ACADEMICO": {
          module_title: 'Gestión de Excusas: Tutor Académico',
          api_endpoint: '/api/excusas',
          permissions: {
            can_view: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
            can_approve: true,
          },
          table_schema: [
            { key: 'estudiante', label: 'Estudiante', sortable: true },
            { key: 'tutor', label: 'Tutor', sortable: true },
            { key: 'fecha', label: 'Fecha Envío', sortable: true },
            { key: 'justificacion', label: 'Motivo', sortable: false },
            { key: 'estado', label: 'Estado', sortable: true },
            { key: 'acciones', label: 'Acciones', sortable: false },
          ],
        },
        SUPERVISOR: {
          module_title: 'Supervisión de Excusas',
          api_endpoint: '/api/excusas',
          permissions: {
            can_view: true,
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_approve: false,
          },
          table_schema: [
            { key: 'estudiante', label: 'Estudiante', sortable: true },
            { key: 'fecha', label: 'Fecha Envío', sortable: true },
            { key: 'justificacion', label: 'Motivo', sortable: false },
            { key: 'estado', label: 'Estado', sortable: true },
            { key: 'acciones', label: 'Acciones', sortable: false },
          ],
        },
        VINCULADOR: {
          module_title: 'Visualización de Excusas',
          api_endpoint: '/api/excusas',
          permissions: {
            can_view: true,
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_approve: false,
          },
          table_schema: [
            { key: 'estudiante', label: 'Estudiante', sortable: true },
            { key: 'fecha', label: 'Fecha Envío', sortable: true },
            { key: 'justificacion', label: 'Motivo', sortable: false },
            { key: 'estado', label: 'Estado', sortable: true },
            { key: 'acciones', label: 'Acciones', sortable: false },
          ],
        },
        ESTUDIANTE: {
          module_title: 'Mis Excusas Enviadas',
          api_endpoint: '/api/excusas',
          permissions: {
            can_view: true,
            can_create: true,
            can_edit: false,
            can_delete: false,
            can_approve: false,
          },
          table_schema: [
            { key: 'fecha', label: 'Fecha', sortable: true },
            { key: 'justificacion', label: 'Razón', sortable: false },
            { key: 'estado', label: 'Estado de Solicitud', sortable: true },
            { key: 'acciones', label: 'Detalles', sortable: false },
          ],
        },
      },
    };
  }
}