"use client"

import { useMemo } from "react"
import Main from "@/features/main/pages/page"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { 
  GraduationCap, 
  Table as TableIcon, 
  FileText,
} from "lucide-react"
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

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <GraduationCap className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Mis <span className="text-primary">Calificaciones</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Registro oficial de evaluación y rendimiento académico durante el programa de pasantías.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Registro de Rendimiento</h2>
              <p className="text-muted-foreground font-medium text-sm">Monitoreo detallado de competencias y habilidades</p>
            </div>
          </div>

          {!evaluacion ? (
            <Card className="border-dashed border-2 shadow-none bg-muted/20 rounded-2xl">
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
              
              {/* Matriz Detallada */}
              <div className="space-y-4">
                <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-muted/10 p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <TableIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Matriz de Evaluación Detallada</h3>
                        <p className="text-xs text-muted-foreground font-medium">Formato oficial con Resultados de Aprendizaje y criterios técnicos</p>
                      </div>
                      <div className="ml-auto flex items-center gap-3">
                        <div className="text-right mr-4 hidden sm:block">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Nota Final</p>
                          <div className="flex items-center gap-2 justify-end">
                             <span className="text-2xl font-black text-primary">{evaluacion.notaFinal}</span>
                             {notaBadge}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 md:p-6 overflow-x-auto bg-card">
                    <EvaluacionTable 
                      evaluationForm={evaluacion.evaluacionCompleta as unknown as EvaluacionForm} 
                      readOnly={true} 
                    />
                  </CardContent>
                </Card>
              </div>

            </div>
          )}
        </div>
      </div>
    </Main>
  )
}
