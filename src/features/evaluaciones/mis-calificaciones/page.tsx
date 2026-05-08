"use client"

import { useState, useEffect, useMemo } from "react"
import Main from "@/features/main/pages/page"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import {
  GraduationCap,
  FileText,
  Download,
  Loader2,
  Table as TableIcon,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { calificacionApiService, type MisNotasResponse, type CompetenciaItem } from "../services/calificacionApiService"
import { EvaluacionTable } from "../components/EvaluacionTable"
import { type EvaluacionForm } from "../hooks/useEvaluacion"

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNotaBadge(nota: number | string) {
  const n = typeof nota === "string" ? parseFloat(nota) : nota
  if (n >= 90) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Excelente
      </Badge>
    )
  } else if (n >= 80) {
    return (
      <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Muy Bueno
      </Badge>
    )
  } else if (n >= 70) {
    return (
      <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Aprobado
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-500/15 text-red-700 border-red-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
      Reprobado
    </Badge>
  )
}

// Mapeo de la respuesta del API al formato de la tabla de main
const mapResponseToForm = (data: MisNotasResponse): EvaluacionForm => {
  const initialArray = () => Array(14).fill("")
  
  const form: EvaluacionForm = {
    identidadTitulo: "Desarrollo y administración de aplicaciones informáticas",
    codigoTitulo: "IFC006_3",
    nombreApellidos: "",
    horario: "",
    direccion: "",
    telefonos: "",
    fechaInicioPasantia: "",
    fechaTerminoPasantia: "",
    centroTrabajo: "",
    direccionEmpresa: "",
    telefonosEmpresa: "",
    personaContacto: "",
    nombreTutor: "",
    telefonosCorreoTutor: "",
    
    // Mapeo de contenidos
    raContenido: data.ra,
    observaciones: data.observaciones || "",
    notaFinal: "", // Se calculará abajo
    
    // Inicialización de arrays
    conocimientosTeoricos: initialArray(),
    asimilacionInstruccionesVerbales: initialArray(),
    asimilacionInstruccionesEscritas: initialArray(),
    asimilacionInstruccionesSimbolicas: initialArray(),
    subtotalCapacidad: initialArray(),
    
    organizacionPlanificacion: initialArray(),
    metodo: initialArray(),
    ritmoTrabajo: initialArray(),
    trabajoRealizado: initialArray(),
    subtotalHabilidad: initialArray(),
    
    iniciativa: initialArray(),
    trabajoEquipo: initialArray(),
    puntualidadAsistencia: initialArray(),
    responsabilidad: initialArray(),
    subtotalActitud: initialArray(),
    
    total: initialArray(),
    
    promedioCapacidades: "",
    promedioHabilidades: "",
    promedioActitudes: "",
    criterio1: "",
    criterio2: "",
    criterio3: "",
    criterio4: "",
    criterio5: "",
    criterio6: "",
  }

  // Mapeo nombre → campo del formulario (case-insensitive, tolerante a variaciones)
  const NOMBRE_A_CAMPO: Record<string, keyof EvaluacionForm> = {
    "conocimientos teóricos":                             "conocimientosTeoricos",
    "conocimientos teoricos":                             "conocimientosTeoricos",
    "asimilación y seguimiento de instrucciones verbales": "asimilacionInstruccionesVerbales",
    "asimilacion y seguimiento de instrucciones verbales": "asimilacionInstruccionesVerbales",
    "asimilación y seguimiento de instrucciones escritas": "asimilacionInstruccionesEscritas",
    "asimilacion y seguimiento de instrucciones escritas": "asimilacionInstruccionesEscritas",
    "asimilación y seguimiento de instrucciones simbólicas": "asimilacionInstruccionesSimbolicas",
    "asimilacion y seguimiento de instrucciones simbolicas": "asimilacionInstruccionesSimbolicas",
    "organización planificación del trabajo":             "organizacionPlanificacion",
    "organización y planificación del trabajo":           "organizacionPlanificacion",
    "organizacion planificacion del trabajo":             "organizacionPlanificacion",
    "organizacion y planificacion del trabajo":           "organizacionPlanificacion",
    "método":                                             "metodo",
    "metodo":                                             "metodo",
    "ritmo de trabajo":                                   "ritmoTrabajo",
    "trabajo realizado":                                  "trabajoRealizado",
    "iniciativa":                                         "iniciativa",
    "trabajo en equipo":                                  "trabajoEquipo",
    "puntualidad y asistencia":                           "puntualidadAsistencia",
    "responsabilidad":                                    "responsabilidad",
  }

  const mapGroup = (items: CompetenciaItem[], fallbackFields: (keyof EvaluacionForm)[]) => {
    items.forEach((item, i) => {
      const campo = NOMBRE_A_CAMPO[item.nombre.toLowerCase().trim()] ?? fallbackFields[i]
      if (!campo) return

      const weeks = Array(14).fill("")
      item.semanas.forEach((v, wi) => { if (wi < 12) weeks[wi] = v > 0 ? String(v) : "" })

      const valid = item.semanas.filter(v => v > 0)
      const avg = valid.length > 0 ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0
      weeks[12] = avg > 0 ? String(avg) : ""
      weeks[13] = avg > 0 ? String(avg) : ""

      ;(form[campo as keyof EvaluacionForm] as string[]) = weeks
    })
  }

  mapGroup(data.datos.competencias.CAPACIDAD, ["conocimientosTeoricos", "asimilacionInstruccionesVerbales", "asimilacionInstruccionesEscritas", "asimilacionInstruccionesSimbolicas"])
  mapGroup(data.datos.competencias.HABILIDAD, ["organizacionPlanificacion", "metodo", "ritmoTrabajo", "trabajoRealizado"])
  mapGroup(data.datos.competencias.ACTITUD, ["iniciativa", "trabajoEquipo", "puntualidadAsistencia", "responsabilidad"])

  // Calcular subtotales
  const calcSubtotal = (fields: (keyof EvaluacionForm)[], target: keyof EvaluacionForm) => {
    const subtotal = Array(14).fill("")
    for (let wi = 0; wi < 14; wi++) {
      let sum = 0, count = 0
      fields.forEach(f => {
        const val = parseFloat((form[f as keyof EvaluacionForm] as string[])[wi])
        if (!isNaN(val) && val > 0) { sum += val; count++ }
      })
      if (count > 0) subtotal[wi] = String(Math.round(sum / count))
    }
    ;(form[target as keyof EvaluacionForm] as string[]) = subtotal
  }

  calcSubtotal(["conocimientosTeoricos", "asimilacionInstruccionesVerbales", "asimilacionInstruccionesEscritas", "asimilacionInstruccionesSimbolicas"], "subtotalCapacidad")
  calcSubtotal(["organizacionPlanificacion", "metodo", "ritmoTrabajo", "trabajoRealizado"], "subtotalHabilidad")
  calcSubtotal(["iniciativa", "trabajoEquipo", "puntualidadAsistencia", "responsabilidad"], "subtotalActitud")
  calcSubtotal(["subtotalCapacidad", "subtotalHabilidad", "subtotalActitud"], "total")

  const totalArr = form.total as string[]
  form.notaFinal = totalArr[13] || "0"
  form.promedioCapacidades = (form.subtotalCapacidad as string[])[13] || "0"
  form.promedioHabilidades = (form.subtotalHabilidad as string[])[13] || "0"
  form.promedioActitudes = (form.subtotalActitud as string[])[13] || "0"

  return form
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MisCalificacionesPage() {
  const [notas, setNotas] = useState<MisNotasResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await calificacionApiService.getMisNotas()
        setNotas(data)
      } catch (err: unknown) {
        // Si el error es un "no encontrado" o un error de JSON (pasan cuando no hay datos), lo tratamos como notas vacías
        const msg = err instanceof Error ? err.message.toLowerCase() : "";
        const isNotFound = 
          msg.includes("not found") || 
          msg.includes("404") || 
          msg.includes("no existe") || 
          msg.includes("unexpected end of json input") ||
          msg.includes("failed to execute 'json'");

        if (isNotFound) {
          setNotas(null);
        } else {
          setError(err instanceof Error ? err.message : "Error al cargar las calificaciones.");
        }
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  // Transformar datos para la tabla de Main
  const evaluationForm = useMemo(() => (notas ? mapResponseToForm(notas) : null), [notas])
  const notaBadge = useMemo(() => (evaluationForm ? getNotaBadge(evaluationForm.notaFinal) : null), [evaluationForm])

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section (Design from Main) */}
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
          {/* Section heading + actions (Design from Main) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Registro de Rendimiento</h2>
              <p className="text-muted-foreground font-medium text-sm">Monitoreo detallado de competencias y habilidades</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="rounded-xl px-6 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              disabled={!notas}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <Card className="border-destructive/30 bg-destructive/5 rounded-2xl mb-8">
              <CardContent className="p-8 text-center">
                <p className="text-destructive font-medium">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Contenido principal (Basado en el diseño de Main) */}
          {!loading && !error && (!notas || !evaluationForm) ? (
            <Card className="border-dashed border-2 shadow-none bg-muted/20 rounded-2xl">
              <CardContent className="p-16 text-center flex flex-col items-center justify-center">
                <div className="p-6 rounded-3xl bg-background shadow-sm mb-6">
                  <FileText className="h-14 w-14 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Usted no tiene registrada una calificación todavía
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-lg font-medium leading-relaxed">
                  Su evaluación académica aparecerá aquí una vez que sea procesada y publicada por su tutor correspondiente.
                </p>
              </CardContent>
            </Card>
          ) : !loading && !error && evaluationForm && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
              
              {/* Matriz Detallada (El componente que trae Main) */}
              <div className="space-y-4">
                <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b bg-muted/10 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                          <TableIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">Matriz de Evaluación Detallada</h3>
                          <p className="text-xs text-muted-foreground font-medium">Formato oficial con Resultados de Aprendizaje y criterios técnicos</p>
                        </div>
                      </div>
                      <div className="sm:ml-auto flex items-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Nota Final</p>
                          <div className="flex items-center gap-2 justify-end">
                             <span className="text-2xl font-black text-primary">{evaluationForm.notaFinal}</span>
                             {notaBadge}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 md:p-6 overflow-x-auto bg-card">
                    {/* Componente oficial de Main */}
                    <EvaluacionTable 
                      evaluationForm={evaluationForm} 
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
