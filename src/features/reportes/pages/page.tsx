"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { FileText, Star, Building2, FolderOpen, Eye, Users, ArrowRight } from "lucide-react"
import { useState, lazy, Suspense } from "react"
import Main from "../../main/pages/page"

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
  const [filters] = useState({
    taller: "",
    periodo: "2024",
    formato: "pdf",
  })

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
    },
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
          <div className="flex items-center justify-between mb-10 border-l-4 border-primary pl-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Catálogo de Informes</h2>
              <p className="text-muted-foreground font-medium text-sm">Gestiona la información crítica de la institución</p>
            </div>
          </div>

          {/* Cards del Catálogo - Color Rojo/Primary uniforme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <Card
                  key={report.id}
                  className="group relative overflow-hidden border-2 border-primary/10 hover:border-primary/40 bg-card hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl"
                  onClick={() => handleShowPreview(report.id)}
                >
                  <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors duration-500">
                    <Icon className="h-32 w-32 -mr-8 -mt-8 rotate-12" />
                  </div>
                  
                  <CardHeader className="relative z-10 p-8 pb-0">
                    <div className="inline-flex items-center justify-center rounded-2xl p-4 bg-primary/10 text-primary shadow-sm mb-6 transition-transform group-hover:scale-110 duration-300">
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight mb-3 group-hover:text-primary transition-colors">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-muted-foreground font-medium leading-snug">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 p-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                      Abrir Reporte <ArrowRight className="h-4 w-4" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-xl font-bold border-2 shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Vista Previa
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Footer Rediseñado - Más ligero y moderno */}
          <footer className="mt-20 pt-16 border-t border-primary/10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">P</div>
                  <span className="text-2xl font-black tracking-tighter">PLAVET <span className="text-primary text-sm font-bold tracking-widest uppercase ml-1">Reports</span></span>
                </div>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Nuestra plataforma de análisis proporciona una visión 360° del ecosistema académico, facilitando la toma de decisiones basada en datos reales y actualizados.
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sistema Operativo • Sincronizado</span>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { n: "01", t: "Selección", d: "Elige el tipo de informe estratégico." },
                    { n: "02", t: "Filtrado", d: "Segmenta por taller y periodo." },
                    { n: "03", t: "Validación", d: "Verifica datos en la preview." },
                    { n: "04", t: "Exportación", d: "Genera tu documento PDF oficial." }
                  ].map((step, idx) => (
                    <div key={idx} className="group p-6 rounded-2xl bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300">
                      <span className="text-primary/40 font-black text-xl italic group-hover:text-primary transition-colors">{step.n}</span>
                      <h4 className="font-bold text-sm mt-2 mb-1">{step.t}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{step.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="py-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
              <p>© 2024 Plavet Academic Management System</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-primary transition-colors">Términos</a>
                <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
                <a href="#" className="hover:text-primary transition-colors">Soporte Técnico</a>
              </div>
            </div>
          </footer>
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
