"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { FileText, Star, Building2, FolderOpen, Eye, Users, ArrowRight } from "lucide-react"
import { useState, lazy, Suspense } from "react"
import Main from "../../main/pages/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/components/ui/select"
import { Filter, Calendar } from "lucide-react"

// Carga perezosa del componente pesado para mejorar el rendimiento inicial
const ReportPreview = lazy(() => import("../components/ReportPreview").then(m => ({ default: m.ReportPreview })))


interface ReportCard {
  id: string
  title: string
  description: string
  icon: typeof FileText
}

export default function ReportesPage() {
  const [showPreview, setShowPreview] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    taller: "desarrollo-web",
    periodo: "2024",
    formato: "pdf",
  })

  const talleres = [
    { id: "desarrollo-web", nombre: "Desarrollo Web" },
    { id: "ebanisteria", nombre: "Ebanistería" },
    { id: "electronica", nombre: "Electrónica" },
    { id: "mecanizado", nombre: "Mecanizado" },
    { id: "automotriz", nombre: "Automotriz" },
    { id: "contabilidad", nombre: "Contabilidad" },
    { id: "todos", nombre: "Vista Global" },
  ]

  const reports: ReportCard[] = [
    {
      id: "estudiantes-pasantias",
      title: "Reporte de Estudiantes y Pasantías",
      description: "Análisis detallado de la participación estudiantil y progreso en pasantías por taller.",
      icon: Users,
    },
    {
      id: "calificaciones",
      title: "Reporte de Calificaciones",
      description: "Estadísticas de rendimiento académico y evaluaciones finales por área técnica.",
      icon: Star,
    },
    {
      id: "asignaciones",
      title: "Reporte de Asignaciones",
      description: "Control y seguimiento de la vinculación de estudiantes con centros de trabajo.",
      icon: Building2,
    },
    {
      id: "documentacion",
      title: "Documentación Estudiantil",
      description: "Estado de entrega y validación de expedientes de estudiantes activos.",
      icon: FolderOpen,
    }
  ]



  const handleShowPreview = (reportId: string) => {
    setShowPreview(reportId)
  }

  const handleClosePreview = () => {
    setShowPreview(null)
  }

  return (
    <Main>
      <div className="min-h-screen bg-background">
        {/* Hero Section Simplificado - Color Uniforme (Primary) */}
        <div className="relative overflow-hidden py-16 border-b bg-primary/5">
          <div className="container mx-auto px-4 max-w-7xl relative">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black mb-6 tracking-tight text-foreground leading-[1.1]">
                Análisis <span className="text-primary">Estratégico</span> y Datos
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
                Visualiza el rendimiento académico y la gestión de pasantías con reportes inteligentes de alta precisión.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Catálogo de Informes</h2>
              <p className="text-muted-foreground font-medium text-sm">Gestiona la información crítica de la institución</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 px-3 border-r border-border/50">
                <Filter className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filtros Activos</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <Select 
                    value={filters.taller} 
                    onValueChange={(val) => setFilters(prev => ({ ...prev, taller: val }))}
                  >
                    <SelectTrigger className="w-[200px] h-10 rounded-xl bg-background border-2 font-bold text-xs">
                      <SelectValue placeholder="Seleccionar Taller" />
                    </SelectTrigger>
                    <SelectContent>
                      {talleres.map(t => (
                        <SelectItem key={t.id} value={t.id} className="text-xs font-medium">
                          {t.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Select 
                    value={filters.periodo} 
                    onValueChange={(val) => setFilters(prev => ({ ...prev, periodo: val }))}
                  >
                    <SelectTrigger className="w-[140px] h-10 rounded-xl bg-background border-2 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <SelectValue placeholder="Periodo" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024" className="text-xs font-medium">Ciclo 2024</SelectItem>
                      <SelectItem value="2023" className="text-xs font-medium">Ciclo 2023</SelectItem>
                      <SelectItem value="todos" className="text-xs font-medium">Histórico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Cards del Catálogo - Más compactos y eficientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <Card
                  key={report.id}
                  className="group relative overflow-hidden border border-primary/10 hover:border-primary/40 bg-card hover:shadow-xl transition-all duration-500 cursor-pointer rounded-2xl"
                  onClick={() => handleShowPreview(report.id)}
                >
                  <div className="absolute top-0 right-0 p-4 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
                    <Icon className="h-20 w-20 -mr-4 -mt-4 rotate-12" />
                  </div>
                  
                  <CardHeader className="relative z-10 p-6 pb-0">
                    <div className="inline-flex items-center justify-center rounded-xl p-3 bg-primary/10 text-primary shadow-xs mb-4 transition-transform group-hover:scale-110 duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-x-[-5px] group-hover:translate-x-0 transition-all duration-500">
                      Abrir <ArrowRight className="h-3 w-3" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-lg font-bold border h-8 text-xs shadow-xs group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      Vista Previa
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      </div>

      {/* Report Preview Modal con Carga Diferida */}
      {showPreview && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="text-sm font-bold animate-pulse">Cargando Analítica...</p>
            </div>
          </div>
        }>
          <ReportPreview
            reportType={showPreview}
            filters={filters}
            onClose={handleClosePreview}
          />
        </Suspense>
      )}
    </Main>
  )
}
