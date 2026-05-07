"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  Calendar,
  Building2,
  FileText,
  Users,
  Clock,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Loader2,
} from "lucide-react"
import {
  dashboardService,
  type TutorAcademicoDashboardData,
} from "../services/dashboardService"

export function TutorAcademicDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<TutorAcademicoDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getTutorAcademicoDashboard()
      .then(res => {
        if (res.success) setData(res.data)
        else setError("No se pudo cargar el dashboard.")
      })
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false))
  }, [])

  const totalEstudiantes = data?.resumen.total_estudiantes ?? 0
  const excusas = data?.excusas_por_validar ?? []
  const visitas = data?.proximas_visitas ?? []

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Tutor Académico · Taller Activo
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de Gestión Académica</h1>
          <p className="text-muted-foreground text-base">
            Bienvenido, <span className="font-semibold text-foreground">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? "Tutor")}</span>.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      <div className="space-y-6">
        {/* Resumen del Grupo */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando grupo...
                  </span>
                ) : (
                  `Resumen del Grupo — ${totalEstudiantes} estudiante${totalEstudiantes !== 1 ? 's' : ''}`
                )}
              </CardTitle>
              <Button size="sm" className="text-xs gap-1.5" asChild>
                <Link to="/estudiantes">
                  Gestionar taller
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Distribución */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Distribución de Estudiantes</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "En Proceso", value: data?.resumen.distribucion.en_proceso ?? 0, color: "text-emerald-600" },
                    { label: "Finalizados", value: data?.resumen.distribucion.finalizados ?? 0, color: "text-primary" },
                    { label: "En Riesgo", value: data?.resumen.distribucion.en_riesgo ?? 0, color: "text-amber-600" },
                    { label: "Inactivos", value: data?.resumen.distribucion.inactivos ?? 0, color: "text-muted-foreground" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border/50 bg-muted/30 text-center">
                      <p className={`text-2xl font-bold ${item.color}`}>
                        {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /> : item.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Métricas */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Métricas del Grupo</p>
                <div className="grid gap-3">
                  {[
                    { label: "Progreso Promedio", value: data?.resumen.metricas.progreso_prom ?? "—" },
                    { label: "Horas Promedio", value: data?.resumen.metricas.horas_prom ?? "—" },
                    { label: "Documentos Completos", value: loading ? "—" : String(data?.resumen.metricas.docs_completos ?? 0) },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border/50 bg-muted/30">
                      <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                      <p className="text-sm font-bold text-foreground">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección inferior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Acciones Rápidas */}
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid gap-2 flex-1">
              {[
                { title: "Gestión Académica", icon: BookOpen, href: "/estudiantes" },
                { title: "Revisar Excusas", icon: ClipboardCheck, href: "/excusas" },
                { title: "Mis Reportes", icon: FileText, href: "/reportes" },
                { title: "Calendario Visitas", icon: Calendar, href: "/visitas" },
              ].map((action, i) => (
                <Button key={i} variant="ghost" className="w-full justify-start font-medium text-sm h-10 px-3 hover:bg-muted" asChild>
                  <Link to={action.href}>
                    <action.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                    {action.title}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Excusas por Validar */}
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-amber-500" />
                  Excusas por Validar
                </CardTitle>
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 text-[10px] font-bold">
                  {loading ? "—" : excusas.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando...</span>
                </div>
              ) : excusas.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No hay excusas pendientes.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {excusas.map((excusa) => (
                    <div key={excusa.id} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{excusa.estudiante_nombre}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{excusa.tipo}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {excusa.fecha}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="text-[10px] h-7 px-2 shrink-0">
                        Revisar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximas Visitas */}
          <Card className="border bg-card shadow-sm h-full flex flex-col rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-muted/10 pb-3">
              <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Próximas Visitas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Cargando...</span>
                </div>
              ) : visitas.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                  No hay visitas programadas.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {visitas.map((visita, i) => {
                    const fechaDate = new Date(visita.fecha)
                    const dia = fechaDate.getDate()
                    const mes = fechaDate.toLocaleString("es", { month: "short" }).toUpperCase()
                    return (
                      <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-all group">
                        <div className="h-10 w-10 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all">
                          <span className="text-[9px] font-black text-primary uppercase group-hover:text-white">{mes}</span>
                          <span className="text-base font-black text-primary leading-none group-hover:text-white">{dia}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{visita.empresa}</p>
                          <p className="text-[11px] text-muted-foreground font-medium truncate">{visita.estudiante_nombre}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
