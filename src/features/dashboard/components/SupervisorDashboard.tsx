"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  FileText,
  Briefcase,
  ChevronRight,
  Loader2,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table"
import { dashboardService, type SupervisorDashboardData } from "../services/dashboardService"

export function SupervisorDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<SupervisorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getSupervisorDashboard()
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
    { title: "Estudiantes", value: stats ? stats.estudiantes : "—", desc: "En programas activos", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Empresas", value: stats ? stats.empresas : "—", desc: "Centros de trabajo", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "Tasa Éxito", value: stats ? stats.tasa_exito : "—", desc: "Promedio global", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "Alertas", value: stats ? stats.alertas_count : "—", desc: "Casos críticos", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-8 space-y-10 pb-12 animate-in fade-in duration-700">

      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
        <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
          <ShieldCheck className="w-80 h-80 text-primary -rotate-12" />
        </div>
        
        <div className="w-full relative px-8 md:px-16 z-10">
          <div className="max-w-3xl flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/20">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Supervisión General · Modo Observación
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Dashboard de <span className="text-primary">Supervisión</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Hola, <span className="text-foreground font-bold">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? 'Supervisor')}</span>. Tienes una vista panorámica del rendimiento académico y laboral de la institución.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      {/* Grid de KPIs Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((s, i) => (
          <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.title}</p>
                <p className="text-2xl font-black text-foreground">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : s.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tight">{s.desc}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg} group-hover:scale-110 transition-transform`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Alertas */}
        <div className="lg:col-span-8">
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-red-500" />
                    Alertas de Seguimiento Académico
                  </CardTitle>
                  <CardDescription className="text-xs">Estudiantes detectados con anomalías de rendimiento o asistencia.</CardDescription>
                </div>
                <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-100 font-bold">
                  {loading ? "—" : `${alertas.length} Alertas`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
                  <span className="text-sm font-medium">Sincronizando alertas...</span>
                </div>
              ) : alertas.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm font-medium bg-muted/5 italic">
                  No se detectaron anomalías en el periodo actual.
                </div>
              ) : (
                <div className="rounded-b-2xl overflow-hidden w-full">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow className="hover:bg-transparent border-b">
                        <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 px-4">Estudiante</TableHead>
                        <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 hidden sm:table-cell">Taller</TableHead>
                        <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 text-center">Alerta</TableHead>
                        <TableHead className="h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 text-right px-4">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertas.map((alerta) => (
                        <TableRow key={alerta.id} className="group hover:bg-muted/30 transition-colors border-b last:border-0">
                          <TableCell className="px-4 py-4 max-w-[200px]">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 shrink-0 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-500/20 shadow-sm group-hover:scale-105 transition-transform">
                                {alerta.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </div>
                              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {alerta.nombre}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">
                              {alerta.taller}
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="rounded-lg px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border-none shadow-none bg-rose-100 text-rose-700 whitespace-nowrap">
                              {alerta.tipo_alerta}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-4">
                            <span className="text-sm font-black text-foreground whitespace-nowrap">{alerta.valor}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de Control */}
        <div className="lg:col-span-4">
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-widest">Panel de Control</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid gap-2 flex-1">
              {[
                { title: "Reportes Consolidados", icon: FileText, href: "/reportes", color: "text-primary" },
                { title: "Centros de Trabajo", icon: Building2, href: "/centroDeTrabajo", color: "text-emerald-600" },
                { title: "Gestión de Pasantías", icon: Briefcase, href: "/gestionDePasantias", color: "text-indigo-600" }
              ].map((action, i) => (
                <Button key={i} variant="ghost" className="w-full justify-start font-medium text-sm h-14 px-3 hover:bg-muted group rounded-xl border border-transparent hover:border-border/50 transition-all" asChild>
                  <Link to={action.href}>
                    <div className="p-2 rounded-lg mr-3 bg-background border border-border group-hover:border-primary/30 shadow-xs transition-colors">
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="flex-1 text-left text-sm font-semibold">{action.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sistema de Supervisión · Conexión Segura</span>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">v2.4.0</p>
          <span className="text-[10px] font-black uppercase text-primary">Plavet Académico</span>
        </div>
      </div>

    </div>
  )
}
