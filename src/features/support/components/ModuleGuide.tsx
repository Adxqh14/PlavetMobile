"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import {
  BookOpen,
  Users,
  FileText,
  Briefcase,
  BarChart3,
  Building2,
  GraduationCap,
  Download
} from "lucide-react"

interface ModuleStep {
  title: string
  description: string
  details?: string[]
}

interface ModuleGuide {
  id: string
  title: string
  description: string
  icon: typeof BookOpen
  color: string
  path: string
  explanation: string
  steps: ModuleStep[]
}

const moduleGuides: ModuleGuide[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Panel principal de control",
    icon: BarChart3,
    color: "text-slate-600 dark:text-slate-400",
    path: "/dashboard",
    explanation: "Acceso rapido: Ver estadísticas, Atajos, Reportes",
    steps: [
      {
        title: "1. Vista General",
        description: "Acceso al panel principal con métricas institucionales",
        details: [
          
          "Componentes de visualización de datos",
          "Estadísticas en tiempo real"
        ]
      },
      {
        title: "2. Navegación Rápida",
        description: "Acceso directo a módulos principales",
        details: [
          "Atajos a funciones frecuentes",
          "Enlaces a reportes importantes"
        ]
      }
    ]
  },
  {
    id: "gestion-academica",
    title: "Gestión Académica",
    description: "Administra todo lo relacionado con el ámbito académico",
    icon: GraduationCap,
    color: "text-blue-600 dark:text-blue-400",
    path: "/gestion-academica",
    explanation: "Acceso rapido: Buscar estudiantes, Registrar nuevo, Editar datos, Exportar lista, Filtro por estado",
    steps: [
      {
        title: "1. Submódulo: Estudiantes",
        description: "Gestión completa de registros y seguimiento académico",
        details: [
          "Registro de nuevos estudiantes con datos personales y académicos",
          "Edición de información existente y actualización de estados",
          "Seguimiento del progreso académico y rendimiento",
          "Exportación de datos y generación de reportes",
          "Control de documentos y archivos adjuntos",
          "Búsqueda avanzada y filtrado de estudiantes"
        ]
      },
      {
        title: "2. Submódulo: Talleres",
        description: "Organización de actividades académicas complementarias",
        details: [
          "Creación y programación de talleres y actividades",
          "Inscripción de estudiantes y control de cupos",
          "Gestión de horarios y fechas de realización",
          "Control de asistencia y participación",
          "Evaluación de resultados y rendimiento",
          "Generación de certificados de participación",
          "Asignación de instructores y recursos"
        ]
      },
      {
        title: "3. Submódulo: Tutores",
        description: "Asignación y seguimiento de tutores académicos",
        details: [
          "Asignación de tutores a estudiantes y grupos",
          "Seguimiento del progreso tutorial y académico",
          "Evaluación del desempeño de tutores",
          "Gestión de disponibilidad y horarios",
          "Comunicación entre tutores y estudiantes",
          "Reportes de tutoría y seguimiento",
          "Coordinación con actividades académicas"
        ]
      }
    ]
  },
  {
    id: "gestion-institucional",
    title: "Gestión Institucional",
    description: "Controla aspectos administrativos y organizacionales",
    icon: Building2,
    color: "text-purple-600 dark:text-purple-400",
    path: "/gestion-institucional",
    explanation: "Acceso rapido: Registrar empresa, Gestionar convenios, Ver contactos, Controlar cupos, Filtro por estado",
    steps: [
      {
        title: "1. Submódulo: Centros de Trabajo",
        description: "Gestión de empresas colaboradoras",
        details: [
          "Registro de nuevas empresas y centros de práctica",
          "Gestión de convenios y acuerdos de colaboración",
          "Mantenimiento de información de contacto",
          "Control de capacidad y cupos disponibles",
          "Asignación de supervisores de empresa",
          "Seguimiento de relaciones institucionales",
          "Evaluación del desempeño de centros"
        ]
      },
      {
        title: "2. Submódulo: Plazas",
        description: "Control de capacidad y disponibilidad",
        details: [
          "Definición de capacidad de plazas por centro",
          "Control de disponibilidad en tiempo real",
          "Asignación de plazas a estudiantes",
          "Gestión de períodos y fechas",
          "Seguimiento del estado de las plazas",
          "Reportes de ocupación y utilización",
          "Optimización de recursos disponibles"
        ]
      },
      {
        title: "3. Submódulo: Tutores Institucionales",
        description: "Administración de tutores institucionales",
        details: [
          "Registro y perfil de tutores institucionales",
          "Asignación de responsabilidades y funciones",
          "Gestión de disponibilidad y horarios",
          "Coordinación con programas académicos",
          "Evaluación del desempeño institucional",
          "Reportes de actividades y resultados",
          "Desarrollo profesional continuo"
        ]
      }
    ]
  },
  {
    id: "roles-y-personal",
    title: "Roles y Personal",
    description: "Administra roles de usuario y personal",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
    path: "/roles-y-personal",
    explanation: "Acceso rapido: Asignar supervisor, Ver pasantias, Evaluar desempeno, Generar reportes, Ver disponibilidad",
    steps: [
      {
        title: "1. Submódulo: Supervisores",
        description: "Seguimiento de pasantías",
        details: [
          "Asignación de supervisores a estudiantes y empresas",
          "Seguimiento del progreso de las pasantías",
          "Evaluación del desempeño de estudiantes",
          "Comunicación con empresas y estudiantes",
          "Reportes periódicos de seguimiento",
          "Control de disponibilidad y horarios",
          "Gestión de documentación de supervisión"
        ]
      },
      {
        title: "2. Submódulo: Vinculadores",
        description: "Conexión empresas-estudiantes",
        details: [
          "Identificación y contacto con empresas potenciales",
          "Promoción de oportunidades de pasantías",
          "Coordinación del proceso de vinculación",
          "Seguimiento del proceso de aplicación",
          "Gestión de relaciones institucionales",
          "Reportes de actividades de vinculación",
          "Organización de eventos de networking"
        ]
      }
    ]
  },
  {
    id: "documentacion",
    title: "Documentación",
    description: "Centraliza gestión de documentos y archivos",
    icon: FileText,
    color: "text-green-600 dark:text-green-400",
    path: "/documentacion",
    explanation: "Acceso rapido: Subir archivo, Organizar documentos, Compartir archivos, Controlar acceso, Filtrar por tipo",
    steps: [
      {
        title: "1. Subida de Documentos",
        description: "Carga y almacenamiento de archivos",
        details: [
          "Subida de múltiples formatos de archivo",
          "Validación automática de formatos permitidos",
          "Control de tamaño y compresión",
          "Organización automática por categorías",
          "Detección de duplicados",
          "Generación de versiones"
        ]
      },
      {
        title: "2. Organización",
        description: "Categorización y búsqueda",
        details: [
          "Clasificación por categorías y etiquetas",
          "Sistema de búsqueda avanzada",
          "Metadatos automáticos",
          "Control de versiones y historial",
          "Indexación de contenido",
          "Filtros personalizados"
        ]
      },
      {
        title: "3. Control de Acceso",
        description: "Permisos y seguridad",
        details: [
          "Gestión de roles y permisos de acceso",
          "Control de quién puede ver cada documento",
          "Historial de accesos y descargas",
          "Compartir archivos con enlaces seguros",
          "Protección con cifrado de seguridad",
          "Auditoría de accesos"
        ]
      }
    ]
  },
  {
    id: "evaluaciones",
    title: "Evaluaciones",
    description: "Sistema de evaluaciones de estudiantes",
    icon: FileText,
    color: "text-red-600 dark:text-red-400",
    path: "/evaluaciones",
    explanation: "Acceso rapido: Crear evaluacion, Asignar estudiantes, Revisar resultados, Generar informes, Ver estadisticas",
    steps: [
      {
        title: "1. Creación de Evaluaciones",
        description: "Diseño y configuración de formularios",
        details: [
          "Diseño de formularios de evaluación personalizados",
          "Configuración de criterios de evaluación",
          "Definición de tipos de evaluación",
          "Establecimiento de métricas y ponderaciones",
          "Creación de plantillas reutilizables"
        ]
      },
      {
        title: "2. Aplicación",
        description: "Ejecución de evaluaciones",
        details: [
          "Asignación de evaluaciones a estudiantes",
          "Seguimiento del proceso en tiempo real",
          "Control de estados y progreso",
          "Captura de evidencias y documentos"
        ]
      },
      {
        title: "3. Reportes",
        description: "Generación de informes",
        details: [
          "Generación de informes individuales y grupales",
          "Exportación a PDF y otros formatos",
          "Estadísticas de evaluación general",
          "Análisis de tendencias de desempeño",
          "Historial completo de evaluaciones",
          "Comparativos entre evaluaciones"
        ]
      }
    ]
  },
  {
    id: "proceso-de-pasantias",
    title: "Proceso de Pasantías",
    description: "Gestiona el ciclo completo de pasantías",
    icon: Briefcase,
    color: "text-indigo-600 dark:text-indigo-400",
    path: "/proceso-de-pasantias",
    explanation: "Acceso rapido: Crear pasantia, Asignar estudiante, Seguir progreso, Evaluar final, Ver pasantias activas",
    steps: [
      {
        title: "1. Asignación",
        description: "Asignación de estudiantes a empresas",
        details: [
          "Creación de solicitudes de pasantía",
          "Validación de requisitos y elegibilidad",
          "Asignación de estudiantes a empresas",
          "Generación de convenios y acuerdos",
          "Definición de fechas y períodos",
          "Coordinación con empresas y estudiantes"
        ]
      },
      {
        title: "2. Seguimiento",
        description: "Monitoreo del progreso",
        details: [
          "Registro de actividades y progreso diario",
          "Control de asistencia y puntualidad",
          "Reportes periódicos de seguimiento",
          "Comunicación con supervisores",
          "Gestión de incidencias y novedades",
          "Actualización de estados del proceso"
        ]
      },
      {
        title: "3. Evaluación Final",
        description: "Cierre del ciclo de pasantía",
        details: [
          "Evaluación final de desempeño",
          "Generación de informes finales",
          "Emisión de certificados de completion",
          "Reportes de retroalimentación",
          "Validación de cumplimiento de objetivos",
          "Cierre administrativo del proceso"
        ]
      }
    ]
  },
  {
    id: "reportes",
    title: "Reportes",
    description: "Genera informes y análisis detallados",
    icon: BarChart3,
    color: "text-teal-600 dark:text-teal-400",
    path: "/reportes",
    explanation: "Acceso rapido: Crear reporte, Configurar filtros, Generar PDF, Ver estadisticas, Ver ultimos generados",
    steps: [
      {
        title: "1. Configuración",
        description: "Personalización de reportes",
        details: [
          "Selección de tipos de reportes disponibles",
          "Configuración de filtros y parámetros",
          "Definición de períodos y rangos",
          "Personalización de métricas y KPIs",
          "Programación de reportes automáticos"
        ]
      },
      {
        title: "2. Generación",
        description: "Creación de informes",
        details: [
          "Procesamiento de datos en tiempo real",
          "Aplicación de filtros personalizados",
          "Cálculos automáticos y agregaciones",
          "Visualización interactiva de datos",
          "Exportación a múltiples formatos (PDF, Excel, CSV)"
        ]
      },
      {
        title: "3. Análisis",
        description: "Estadísticas y métricas",
        details: [
          "Visualización de gráficos y tablas interactivos",
          "Indicadores clave de rendimiento (KPI)",
          "Análisis de tendencias temporales",
          "Comparativos históricos",
          "Dashboards en tiempo real",
          "Alertas automáticas de métricas"
        ]
      }
    ]
  }
]

interface ModuleGuideProps {
  moduleId?: string
}

export default function ModuleGuide({ moduleId }: ModuleGuideProps) {
  const filteredGuides = moduleId 
    ? moduleGuides.filter(guide => guide.id === moduleId)
    : moduleGuides

  const handleDownloadPDF = async (guideId: string) => {
    // Generate PDF content based on the guide
    const guide = moduleGuides.find(g => g.id === guideId)
    if (!guide) return

    // Generate timestamp outside of render
    const timestamp = new Date().getTime()

    // Create HTML content for PDF
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Guía de Módulo: ${guide.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    p { margin: 10px 0; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>Guía de Módulo: ${guide.title}</h1>
  
  <h2>Descripción</h2>
  <p>${guide.description}</p>
  
  <h2>Explicación</h2>
  <p>${guide.explanation}</p>
  
  <h2>Ruta de Acceso</h2>
  <p>${guide.path}</p>
  
  <div class="footer">
    <p>Generado el: ${new Date().toLocaleDateString('es-ES')}</p>
    <p>Sistema Plavet</p>
  </div>
  
  <script class="no-print">
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `.trim()

    // Create a blob and download as HTML file that can be saved as PDF
    const blob = new Blob([pdfContent], { type: 'text/html;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `guia-${guideId}-${timestamp}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Guías de Módulos</h2>
        <p className="text-muted-foreground">
          Instrucciones detalladas para utilizar cada funcionalidad del sistema
        </p>
      </div>

      <div className="grid gap-6">
        {filteredGuides.map((guide) => {
          const IconComponent = guide.icon
          return (
            <Card key={guide.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${guide.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Explicación Breve */}
                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {guide.explanation}
                  </p>
                </div>

                {/* Pasos del Módulo */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Pasos de Uso
                  </h4>
                  <div className="space-y-3">
                    {guide.steps.map((step, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h5 className="font-medium text-sm">{step.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                        {step.details && step.details.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recursos Adicionales */}
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleDownloadPDF(guide.id)}
                  >
                    <Download className="h-4 w-4" />
                    Descargar Guía PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
