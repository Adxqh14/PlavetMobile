"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Link } from "react-router-dom"
import {
  Users,
  Building2,
  UserPlus,
  AlertCircle,
  ArrowRight,
  FileCheck,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { dashboardService, type VinculadorDashboardData } from "../services/dashboardService"

export function VinculadorDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<VinculadorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getVinculadorDashboard()
      .then(res => {
        if (res.success) setData(res.data)
        else setError("No se pudo cargar el dashboard.")
      })
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats

  const kpis = [
    { title: "Convenios", value: stats ? stats.convenios : "—", desc: "Empresas activas", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { title: "Plazas Libres", value: stats ? stats.plazas_libres : "—", desc: "Cupos disponibles", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "Por Asignar", value: stats ? stats.por_asignar : "—", desc: "Estudiantes en espera", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "Alertas", value: stats ? stats.alertas : "—", desc: "Sin pendientes", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Gestión de Vinculación · Plazas y Convenios
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard de Vinculación</h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Hola, <span className="font-semibold text-foreground">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? 'Vinculador')}</span>. Gestiona la red de empresas aliadas y asegura que cada estudiante tenga una plaza ideal.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border border-border bg-card shadow-sm hover:shadow-md transition-all h-full flex flex-col border-l-4 border-l-primary/30">
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
              <p className="text-[10px] text-muted-foreground mt-1 font-medium leading-tight">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Panel de Control */}
      <div className="max-w-3xl mx-auto w-full">
        <Card className="border border-border bg-card shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
                  Panel de Control de Vinculación
                </CardTitle>
                <CardDescription className="text-xs">Accesos rápidos a la gestión institucional de convenios y plazas.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid gap-3">
            {[
              { title: "Directorio de Empresas", icon: Building2, href: "/centros", color: "text-primary", desc: "Listado completo de aliados estratégicos" },
              { title: "Asignación de Plazas", icon: UserPlus, href: "/plazas", color: "text-indigo-600", desc: "Gestión de cupos por talleres" },
              { title: "Gestión de Convenios", icon: FileCheck, href: "/convenios", color: "text-emerald-600", desc: "Contratos y renovaciones legales" }
            ].map((action, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start font-medium h-20 px-4 hover:bg-muted group rounded-2xl border border-transparent hover:border-border/50 transition-all shadow-xs hover:shadow-sm" asChild>
                <Link to={action.href}>
                  <div className="p-3 rounded-xl mr-4 bg-background border border-border group-hover:border-primary/30 shadow-xs transition-colors">
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-base font-bold text-foreground">{action.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              </Button>
            ))}
          </CardContent>
          <div className="p-6 border-t border-border/50 bg-muted/5">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Estado actual</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {stats
                      ? `${stats.plazas_libres} plazas libres · ${stats.por_asignar} estudiantes por asignar`
                      : "Cargando..."}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl font-bold bg-background" asChild>
                <Link to="/plazas">Gestionar</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
