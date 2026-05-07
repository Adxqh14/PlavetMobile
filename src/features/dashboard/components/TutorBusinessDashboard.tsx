"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  ClipboardCheck,
  Building2,
  AlertCircle,
  Users,
  ChevronRight,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { dashboardService, type SupervisorDashboardData } from "../services/dashboardService"

export function TutorBusinessDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<SupervisorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getTutorEmpresarialDashboard()
      .then(res => {
        if (res.success) setData(res.data)
        else setError("No se pudo cargar el dashboard.")
      })
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats
  const alertas = data?.alertas ?? []

  const kpis = [
    { title: "Estudiantes", value: stats ? stats.estudiantes : "—", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Empresas", value: stats ? stats.empresas : "—", icon: Building2, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "Tasa Éxito", value: stats ? stats.tasa_exito : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "Alertas", value: stats ? stats.alertas_count : "—", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Tutor Empresarial · Supervisión Activa
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            ¡Bienvenido, {user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? "Tutor")}!
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Panel de seguimiento de pasantes. Tienes{" "}
            <span className="font-semibold text-foreground">
              {loading ? "..." : stats?.alertas_count ?? 0}
            </span>{" "}
            alerta{(stats?.alertas_count ?? 0) !== 1 ? "s" : ""} activa{(stats?.alertas_count ?? 0) !== 1 ? "s" : ""} esta semana.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Centro de Trabajo</p>
          <div className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-md border border-border/50">
            <Building2 className="h-4 w-4 text-primary" />
            {stats ? `${stats.empresas} empresa${stats.empresas !== 1 ? 's' : ''}` : "—"}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col border-l-4 border-l-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : kpi.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Alertas de Rendimiento */}
        <div className="lg:col-span-8">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Alertas de Pasantes
                  </CardTitle>
                  <CardDescription className="text-xs">Pasantes con bajo rendimiento u otras anomalías detectadas.</CardDescription>
                </div>
                <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-100 font-bold">
                  {loading ? "—" : `${alertas.length} alertas`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Cargando pasantes...</span>
                </div>
              ) : alertas.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                  No hay alertas activas.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {alertas.map((alerta) => (
                    <div key={alerta.id} className="flex items-center justify-between px-6 py-5 hover:bg-muted/20 transition-all group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xs border shadow-sm transition-transform group-hover:scale-105 bg-rose-500/10 text-rose-600 border-rose-500/20">
                          {alerta.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{alerta.nombre}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{alerta.taller}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider leading-none mb-1">{alerta.tipo_alerta}</p>
                          <p className="text-xs font-semibold text-foreground/80">{alerta.valor}</p>
                        </div>
                        <Badge className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border-none bg-rose-500/10 text-rose-600">
                          Alerta
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="lg:col-span-4">
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-3 bg-muted/30">
              <CardTitle className="text-[11px] font-bold text-foreground uppercase tracking-widest">Panel de Control</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {[
                { title: "Evaluaciones Técnicas", icon: ClipboardCheck, href: "/evaluaciones", color: "text-primary" },
                { title: "Gestión de Excusas", icon: AlertCircle, href: "/excusas", color: "text-amber-600" },
              ].map((action, i) => (
                <Button key={i} variant="ghost" className="w-full justify-start font-medium text-sm h-12 px-3 hover:bg-muted group rounded-xl border border-transparent hover:border-border/50 transition-all" asChild>
                  <Link to={action.href}>
                    <div className="p-1.5 rounded-lg mr-3 bg-background border border-border group-hover:border-primary/30 shadow-xs transition-colors">
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <span className="flex-1 text-left text-sm font-semibold">{action.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
