export const breadcrumbModules: Record<string, string> = {
  "gestion-academica": "Gestión Académica",
  "gestion-institucional": "Gestión Institucional",
  "roles-personal": "Roles y Personal",
  "documentacion": "Documentación",
  "evaluaciones": "Evaluaciones",
  "proceso-pasantias": "Proceso de Pasantías",
  "reportes": "Reportes",
  "dashboard": "Dashboard",
}

// Configuración jerárquica para sub-items
export const breadcrumbHierarchy: Record<string, { parent: string; label: string }> = {
  "plaza": { parent: "gestion-institucional", label: "Plazas" },
  "tutores": { parent: "gestion-institucional", label: "Tutores" },
  "centroDeTrabajo": { parent: "gestion-institucional", label: "Centros de Trabajo" },
  "documentos": { parent: "documentacion", label: "Documentos" },
  "subir": { parent: "documentacion", label: "Subir Documentos" },
  "calificaciones": { parent: "evaluaciones", label: "Calificaciones" },
  "mis-calificaciones": { parent: "evaluaciones", label: "Mis Calificaciones" },
  "gestionDePasantias": { parent: "proceso-pasantias", label: "Gestión de Pasantías" },
  "cierrePasantias": { parent: "proceso-pasantias", label: "Cierre de Pasantías" },
  "excusas": { parent: "proceso-pasantias", label: "Excusas" },
  "supervisores": { parent: "roles-personal", label: "Supervisores" },
  "vinculadores": { parent: "roles-personal", label: "Vinculadores" },
  "estudiantes": { parent: "gestion-academica", label: "Estudiantes" },
  "talleres": { parent: "gestion-academica", label: "Talleres" },
  "tutores-academicos": { parent: "gestion-academica", label: "Tutores Académicos" },
}
