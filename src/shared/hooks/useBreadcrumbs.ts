import { useLocation } from "react-router-dom"
import { breadcrumbModules, breadcrumbHierarchy } from "@/shared/hooks/config/breadcrumbConfig"

// Ruta principal de cada módulo padre
const parentRoutes: Record<string, string> = {
  "gestion-academica": "/estudiantes",
  "gestion-institucional": "/centroDeTrabajo",
  "roles-personal": "/supervisores",
  "documentacion": "/documentos",
  "evaluaciones": "/evaluaciones",
  "proceso-pasantias": "/gestionDePasantias",
  "reportes": "/reportes",
  "dashboard": "/dashboard",
}

export function useBreadcrumbs() {
  const location = useLocation()

  const segments = location.pathname.split("/").filter(Boolean)
  const breadcrumbs = []

  // 1. Obtener la primera ruta (módulo o sub-item)
  const firstSegment = segments[0]

  // 2. Verificar si es un sub-item que tiene padre
  if (breadcrumbHierarchy[firstSegment]) {
    const hierarchy = breadcrumbHierarchy[firstSegment]
    
    // Agregar el módulo padre con enlace real
    if (breadcrumbModules[hierarchy.parent]) {
      breadcrumbs.push({
        label: breadcrumbModules[hierarchy.parent],
        href: parentRoutes[hierarchy.parent] || "/dashboard",
        isLast: false,
      })
    }
    
    // Agregar el sub-item
    breadcrumbs.push({
      label: hierarchy.label,
      href: "/" + firstSegment,
      isLast: segments.length === 1,
    })
  } 
  // 3. Si es un módulo principal
  else if (breadcrumbModules[firstSegment]) {
    breadcrumbs.push({
      label: breadcrumbModules[firstSegment],
      href: "/" + firstSegment,
      isLast: segments.length === 1,
    })
  }

  // 4. Agregar subrutas adicionales si existen
  segments.slice(1).forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 2).join("/")

    breadcrumbs.push({
      label: segment
        .replaceAll("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      href,
      isLast: index === segments.slice(1).length - 1,
    })
  })

  return breadcrumbs
}
