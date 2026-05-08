"use client"

import { useState, useEffect } from "react"
import Main from "@/features/main/pages/page"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import {
  GraduationCap,
  FileText,
  Download,
  CheckCircle2,
  Brain,
  Target,
  Loader2,
  Table as TableIcon,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { calificacionApiService, type MisNotasResponse } from "../services/calificacionApiService"

// ── Helpers ──────────────────────────────────────────────────────────────────

function getNotaBadge(nota: number) {
  if (nota >= 90) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Excelente
      </Badge>
    )
  } else if (nota >= 80) {
    return (
      <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        Muy Bueno
      </Badge>
    )
  } else if (nota >= 70) {
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

function calcNotaFinal(datos: MisNotasResponse["datos"]): number {
  const { capacidad, habilidad, actitud } = datos.subtotales
  // Contar subtotales con datos reales (> 0)
  const values = [capacidad, habilidad, actitud].filter((v) => v > 0)
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + b, 0)
  return Math.round(sum / values.length)
}

// ── Tabla de competencias ─────────────────────────────────────────────────────

interface CompetenciaTableProps {
  title: string
  items: MisNotasResponse["datos"]["competencias"]["CAPACIDAD"]
  colorClass: string
}

function CompetenciaTable({ title, items, colorClass }: CompetenciaTableProps) {
  if (!items || items.length === 0) return null

  const maxSemanas = Math.max(...items.map((i) => i.semanas.length))

  return (
    <div className="space-y-2">
      <h4 className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{title}</h4>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-2 py-1.5 text-left font-bold text-foreground min-w-[140px]">
                Criterio
              </th>
              {Array.from({ length: maxSemanas }, (_, i) => (
                <th key={i} className="border border-border px-1.5 py-1.5 text-center font-bold text-foreground min-w-[28px]">
                  {i + 1}ª
                </th>
              ))}
              <th className="border border-border px-2 py-1.5 text-center font-bold text-foreground min-w-[60px] bg-muted/70">
                Promedio
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const validValues = item.semanas.filter((v) => v > 0)
              const avg = validValues.length > 0
                ? Math.round(validValues.reduce((a, b) => a + b, 0) / validValues.length)
                : 0
              return (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="border border-border px-2 py-1.5 font-medium text-foreground">
                    {item.nombre}
                  </td>
                  {item.semanas.map((v, wi) => (
                    <td key={wi} className="border border-border px-1.5 py-1.5 text-center text-foreground">
                      {v > 0 ? v : <span className="text-muted-foreground/40">—</span>}
                    </td>
                  ))}
                  {/* Padding if this row has fewer weeks than others */}
                  {Array.from({ length: maxSemanas - item.semanas.length }, (_, i) => (
                    <td key={`pad-${i}`} className="border border-border px-1.5 py-1.5 text-center text-muted-foreground/40">—</td>
                  ))}
                  <td className="border border-border px-2 py-1.5 text-center font-bold text-foreground bg-muted/30">
                    {avg > 0 ? avg : <span className="text-muted-foreground/40">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
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
        setError(err instanceof Error ? err.message : "Error al cargar las calificaciones.")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const notaFinal = notas ? calcNotaFinal(notas.datos) : 0
  const { capacidad = 0, habilidad = 0, actitud = 0 } = notas?.datos?.subtotales ?? {}

  return (
    <Main>
      <div className="min-h-screen bg-background/50 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <GraduationCap className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Mis Calificaciones
                </h1>
                <p className="text-muted-foreground">
                  Registro oficial de evaluación y rendimiento en pasantías
                </p>
              </div>
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
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-8 text-center">
                <p className="text-destructive font-medium">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Sin evaluaciones */}
          {!loading && !error && !notas && (
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
          )}

          {/* Contenido principal */}
          {!loading && !error && notas && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">

              {/* Resumen de calificación */}
              <div className="py-4">
                <div className="grid md:grid-cols-12 gap-12 items-start">

                  {/* Nota final */}
                  <div className="md:col-span-4 flex flex-col items-center md:items-start pb-8 md:pb-0 md:border-r border-slate-200 dark:border-slate-800 md:pr-12">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      Calificación Final
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-8xl font-light tracking-tighter text-slate-900 dark:text-white">
                        {notaFinal}
                      </span>
                      <span className="text-2xl font-medium text-slate-400">/ 100</span>
                    </div>
                    <div className="mt-6">{getNotaBadge(notaFinal)}</div>
                  </div>

                  {/* Info */}
                  <div className="md:col-span-8">
                    <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Resultado de Aprendizaje
                        </p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                          {notas.ra}
                        </p>
                        <p className="text-xs text-slate-500 italic mt-1">
                          Documento validado por Tutor Empresarial
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Fecha de Evaluación
                        </p>
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                          {notas.fecha}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          ID de Validación
                        </p>
                        <p className="text-sm font-mono font-bold text-red-700 dark:text-red-500">
                          PLA-{notas.id.slice(-10).toUpperCase()}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Desglose de Competencias
                        </p>
                        <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {Math.round(capacidad * 10) / 10}
                            </span>
                            <span className="text-[9px] uppercase font-medium text-slate-400">Capacidades</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {Math.round(habilidad * 10) / 10}
                            </span>
                            <span className="text-[9px] uppercase font-medium text-slate-400">Habilidades</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {Math.round(actitud * 10) / 10}
                            </span>
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
                      Registro oficial
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabla de competencias detallada */}
              {(notas.datos.competencias.CAPACIDAD.length > 0 ||
                notas.datos.competencias.HABILIDAD.length > 0 ||
                notas.datos.competencias.ACTITUD.length > 0) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <TableIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">Matriz de Evaluación Detallada</h2>
                      <p className="text-sm text-muted-foreground">
                        Puntuaciones por semana según criterios de evaluación
                      </p>
                    </div>
                  </div>

                  <Card className="border shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-6 space-y-6 bg-card">
                      <CompetenciaTable
                        title="Capacidades"
                        items={notas.datos.competencias.CAPACIDAD}
                        colorClass="text-blue-600"
                      />
                      <CompetenciaTable
                        title="Habilidades"
                        items={notas.datos.competencias.HABILIDAD}
                        colorClass="text-emerald-600"
                      />
                      <CompetenciaTable
                        title="Actitudes"
                        items={notas.datos.competencias.ACTITUD}
                        colorClass="text-amber-600"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Observaciones */}
              {notas.observaciones && (
                <Card className="border shadow-sm rounded-2xl">
                  <CardContent className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Observaciones del Tutor
                    </p>
                    <p className="text-sm text-foreground">{notas.observaciones}</p>
                  </CardContent>
                </Card>
              )}

              {/* Footer informativo */}
              <div className="grid gap-6 md:grid-cols-2 mt-8">
                <Card className="border-none shadow-lg bg-linear-to-br from-blue-500/5 to-transparent p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                      <Brain className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">Comprensión de Resultados</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        La matriz detalla tu desempeño en cada semana. Los subtotales reflejan tu progreso
                        en competencias específicas definidas por el currículo institucional.
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
                        Esta calificación ha sido validada por tu tutor empresarial. Puedes descargar
                        el reporte en PDF para tus registros personales.
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
