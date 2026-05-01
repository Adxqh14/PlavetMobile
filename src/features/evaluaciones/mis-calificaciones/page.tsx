"use client"

import { useMemo } from "react"
import Main from "@/features/main/pages/page"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { 
  GraduationCap, 
  Table as TableIcon, 
  FileText,
  Download,
  CheckCircle2,
  Brain,
  Target
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useCalificaciones } from "../calificacion/hooks/useCalificaciones"
import { EvaluacionTable } from "../components/EvaluacionTable"
import { type EvaluacionForm } from "../hooks/useEvaluacion"


const getNotaBadge = (notaFinal: string) => {
  const nota = parseFloat(notaFinal || '0');
  if (nota >= 90) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Excelente
      </Badge>
    );
  } else if (nota >= 80) {
    return (
      <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Muy Bueno
      </Badge>
    );
  } else if (nota >= 70) {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Aprobado
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-500/15 text-red-700 border-red-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Reprobado
      </Badge>
    );
  }
};

export default function MisCalificacionesPage() {
  const { paginatedEvaluaciones } = useCalificaciones()
  
  // En la vista del estudiante, mostramos su evaluación actual
  const evaluacion = useMemo(() => 
    paginatedEvaluaciones.length > 0 ? paginatedEvaluaciones[0] : null
  , [paginatedEvaluaciones])



  const notaBadge = useMemo(() => 
    evaluacion ? getNotaBadge(evaluacion.notaFinal) : null
  , [evaluacion]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Main>
      <div className="min-h-screen bg-background/50 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
          
          {/* Header al estilo Subir Documentos */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <GraduationCap className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Mis Calificaciones</h1>
                  <p className="text-muted-foreground">Registro oficial de evaluación y rendimiento en pasantías</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={handlePrint}
                  className="rounded-xl px-6 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                  disabled={!evaluacion}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </div>

          {!evaluacion ? (
            <Card className="border-dashed border-2 shadow-none bg-muted/20">
              <CardContent className="p-16 text-center flex flex-col items-center justify-center">
                <div className="p-6 rounded-3xl bg-background shadow-sm mb-6">
                  <FileText className="h-14 w-14 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Sin evaluaciones publicadas
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  Tus calificaciones aparecerán aquí una vez que el proceso de evaluación sea completado por tu tutor.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              
              {/* Resumen Integrado en la Página (Sin Fondos/Bordes) */}
              <div className="py-4">
                <div className="grid md:grid-cols-12 gap-12 items-start">
                  
                  {/* Puntaje Final - Integración Total */}
                  <div className="md:col-span-4 flex flex-col items-center md:items-start pb-8 md:pb-0 md:border-r border-slate-200 dark:border-slate-800 md:pr-12">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Calificación Final</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-8xl font-light tracking-tighter text-slate-900 dark:text-white">
                        {evaluacion.notaFinal}
                      </span>
                      <span className="text-2xl font-medium text-slate-400">/ 100</span>
                    </div>
                    <div className="mt-6">
                      {notaBadge}
                    </div>
                  </div>

                  {/* Información de Certificación */}
                  <div className="md:col-span-8">
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Centro de Trabajo</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{evaluacion.empresa}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 italic">
                          Documento validado por Tutor Empresarial
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fecha de Evaluación</p>
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{evaluacion.fechaEvaluacion}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID de Validación</p>
                        <p className="text-sm font-mono font-bold text-red-700 dark:text-red-500">
                          PLA-{evaluacion.id.slice(-10).toUpperCase()}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Desglose de Competencias</p>
                        <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{evaluacion.promedioCapacidades}%</span>
                            <span className="text-[9px] uppercase font-medium text-slate-400">Capacidades</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{evaluacion.promedioHabilidades}%</span>
                            <span className="text-[9px] uppercase font-medium text-slate-400">Habilidades</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{evaluacion.promedioActitudes}%</span>
                            <span className="text-[9px] uppercase font-medium text-slate-400">Actitudes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between opacity-40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
                      Registro oficial firmado digitalmente
                    </span>
                  </div>
                </div>
              </div>

              {/* Matriz Detallada Full Page */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <TableIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Matriz de Evaluación Detallada</h2>
                    <p className="text-sm text-muted-foreground">Formato oficial con Resultados de Aprendizaje y criterios técnicos</p>
                  </div>
                </div>
                
                <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
                  <CardContent className="p-0 md:p-6 overflow-x-auto bg-card">
                    <EvaluacionTable 
                      evaluationForm={evaluacion.evaluacionCompleta as unknown as EvaluacionForm} 
                      readOnly={true} 
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Footer Informativo */}
              <div className="grid gap-6 md:grid-cols-2 mt-8">
                <Card className="border-none shadow-lg bg-linear-to-br from-blue-500/5 to-transparent p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Comprensión de Resultados</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Esta matriz detalla tu desempeño en cada semana. Los subtotales reflejan tu progreso en competencias específicas 
                        definidas por el currículo institucional.
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="border-none shadow-lg bg-linear-to-br from-amber-500/5 to-transparent p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
                      <Target className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Validación Académica</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Esta calificación ha sido validada por tu tutor empresarial y el centro educativo. Puedes descargar el reporte en PDF 
                        para tus registros personales.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

            </div>
          )}
        </div>
      </div>
    </Main>
  )
}
