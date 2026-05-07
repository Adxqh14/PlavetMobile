"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { useAuth } from "../../auth/hooks/useAuth"
import { Button } from "../../../shared/components/ui/button"
import { Link } from "react-router-dom"
import {
  Briefcase,
  FileText,
  AlertCircle,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
  Building2,
  Loader2,
  Activity,
} from "lucide-react"
import { dashboardService, type EstudianteDashboardData } from "../services/dashboardService"

const attendanceDays = {
  1: 1, 2: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
  12: 1, 13: 1, 14: 1, 15: 1, 16: 1,
  19: 1, 20: 1, 21: 2, 22: 1, 23: 1,
  26: 1, 27: 1, 28: 1, 29: 3, 30: 1,
}

function AttendanceCalendar() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySpaces = Array.from({ length: adjustedFirstDay }, (_, i) => i);
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-border/50 pb-3 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Asistencia de {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex gap-2.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Laboral</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Feriado</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />No Operable</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase pb-1">{d}</div>
          ))}
          {emptySpaces.map(i => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const status = attendanceDays[day as keyof typeof attendanceDays];
            let bgColor = "hover:bg-muted/50 bg-muted/10 border-transparent text-muted-foreground";
            if (status === 1) bgColor = "bg-red-500/10 text-red-600 border-red-500/20 font-bold";
            if (status === 2) bgColor = "bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold";
            if (status === 3) bgColor = "bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold";
            return (
              <div key={day} className={`flex items-center justify-center h-7 w-full text-[11px] rounded border transition-colors cursor-default ${bgColor}`}>
                {day}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<EstudianteDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getEstudianteDashboard()
      .then(res => {
        if (res.success) setData(res.data)
        else setError("No se pudo cargar el dashboard.")
      })
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false))
  }, [])

  const pasantia = data?.pasantia
  const estadisticas = data?.estadisticas
  const actividadReciente = data?.actividad_reciente ?? []

  const porcentaje = pasantia ? Math.round(pasantia.progreso.porcentaje) : 0

  const kpis = [
    {
      title: "Documentos",
      value: estadisticas ? estadisticas.documentos : "—",
      desc: "Documentos subidos",
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-500/5",
    },
    {
      title: "Mis Excusas",
      value: estadisticas ? estadisticas.excusas : "—",
      desc: "Excusas registradas",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-500/5",
    },
  ]

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {pasantia ? `Pasantía ${pasantia.estado}` : "Pasantía Activa"}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Estudiantil</h1>
          <p className="text-muted-foreground text-base">
            Bienvenido, <span className="font-semibold text-foreground">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? 'Estudiante')}</span>. Resumen de tu progreso académico y laboral.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Periodo Académico</p>
          <div className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-md">
            <Calendar className="h-4 w-4 text-primary" />
            2025-2026
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Columna Izquierda */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="border border-border bg-card shadow-sm shrink-0">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Mi Pasantía Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando datos...
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border border-border">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xl text-foreground">{pasantia?.empresa ?? "Sin empresa asignada"}</h4>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {pasantia?.estado ?? "—"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg shadow-sm" disabled>
                      Ver Perfil Empresa
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Tutor Asignado</p>
                      <p className="font-semibold text-foreground text-sm">{pasantia?.tutor ?? "—"}</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Estado</p>
                      <p className="font-semibold text-foreground text-sm capitalize">{pasantia?.estado ?? "—"}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Progreso de Horas</p>
                      <p className="text-sm font-bold">
                        {pasantia ? `${pasantia.progreso.actual} / ${pasantia.progreso.total}h` : "—"}
                        <span className="text-primary ml-1">({porcentaje}%)</span>
                      </p>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${porcentaje}%` }} />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex-1">
            <AttendanceCalendar />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="flex flex-col gap-6">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid gap-2">
              {[
                { title: "Subir Documento", icon: FileText, href: "/subir" },
                { title: "Registrar Excusa", icon: AlertCircle, href: "/excusas" },
                { title: "Ver Evaluación", icon: GraduationCap, href: "/mis-calificaciones" }
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

          {/* Actividad Reciente */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {loading ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">Cargando...</div>
                ) : actividadReciente.length > 0 ? (
                  actividadReciente.slice(0, 4).map((act, idx) => (
                    <div key={idx} className="flex gap-3 p-4">
                      <Activity className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground leading-none">{act.actividad}</p>
                        <p className="text-[10px] text-muted-foreground/70">{new Date(act.fecha).toLocaleDateString("es-VE")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">Sin actividad reciente.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* KPIs */}
          <div className="flex-1 grid gap-4 grid-cols-2">
            {kpis.map((kpi, i) => (
              <Card key={i} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{kpi.title}</CardTitle>
                  <div className={`p-1.5 rounded-md ${kpi.bg}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : kpi.value}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 font-medium">{kpi.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
