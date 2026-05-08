"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table"
import {
  ClipboardCheck,
  Building2,
  AlertCircle,
  Users,
  Loader2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import {
  dashboardService,
  type TutorEmpresarialDashboardData,
} from "../services/dashboardService"

export function TutorBusinessDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<TutorEmpresarialDashboardData | null>(null)
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

  const equipo = data?.equipo ?? []
  const evaluacionesPendientes = data?.evaluaciones_pendientes ?? 0

  const kpis = [
    { title: "Pasantes Asignados", value: loading ? null : equipo.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Evaluaciones Pendientes", value: loading ? null : evaluacionesPendientes, icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-500/10" },
    { title: "Mis Reportes", value: "Ver ahora", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-500/10", href: "/reportes" },
  ]

  const actions = [
    { title: "Evaluaciones Técnicas", icon: ClipboardCheck, href: "/evaluaciones", desc: "Evaluar desempeño", color: "text-primary" },
    { title: "Gestión de Excusas", icon: AlertCircle, href: "/excusas", desc: "Validar incidencias", color: "text-amber-600" },
    { title: "Centro de Trabajo", icon: Building2, value: data?.empresa ?? "...", color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ]

  const displayName = user?.perfil
    ? `${user.perfil.nombre} ${user.perfil.apellido}`
    : (user?.username ?? 'Tutor')

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section - Estilo Admin */}
      <div className="relative overflow-hidden py-10 border-b bg-primary/5 rounded-2xl w-full">
        <div className="absolute -top-12 -right-8 opacity-[0.03] pointer-events-none hidden md:block">
          <ShieldCheck className="w-80 h-80 text-primary -rotate-12" />
        </div>
        
        <div className="w-full relative px-10 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Gestión <span className="text-primary">Empresarial</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Hola, <span className="text-foreground font-bold">{displayName}</span>. Supervisa a tu equipo de pasantes y completa las evaluaciones de desempeño técnico.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      {/* Equipo de Pasantes (Ahora es el contenido central inmediato) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-primary">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-black text-foreground tracking-tight">Equipo de Pasantes</h2>
        </div>
        <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm font-bold uppercase tracking-widest">Cargando pasantes...</span>
              </div>
            ) : equipo.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                <Users className="h-10 w-10 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">No hay pasantes activos</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b border-border/50">
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-8">Pasante</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-8">Rol Técnico</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 px-8 text-right">Asistencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipo.map((miembro, i) => (
                    <TableRow key={i} className="hover:bg-muted/30 transition-colors border-b border-border/50 group">
                      <TableCell className="py-5 px-8">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm bg-primary/5 text-primary border border-primary/10 transition-transform group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
                            {miembro.nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{miembro.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-8">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">{miembro.rol}</span>
                      </TableCell>
                      <TableCell className="py-5 px-8 text-right">
                        <Badge variant="outline" className="text-[10px] font-black border-emerald-500/20 bg-emerald-500/5 text-emerald-600 uppercase tracking-tighter px-3 py-1">
                          {miembro.asistencia}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Grid Inferior de Tarjetas KPI y Acciones (Organizado para evitar espacios en blanco) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Estadísticas Rápidas */}
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all h-full">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div className="min-w-0 pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">{kpi.title}</p>
                {kpi.href ? (
                  <Link to={kpi.href} className="text-lg font-black text-primary hover:underline flex items-center gap-1">
                    {kpi.value} <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="text-2xl font-black text-foreground truncate leading-none">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : kpi.value}
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg} group-hover:scale-110 transition-transform shrink-0`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Acciones de Control y Sede */}
        {actions.map((action, i) => (
          action.href ? (
            <Link key={i} to={action.href} className="group flex items-center gap-4 p-6 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all h-full">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <action.icon className={`h-5 w-5 ${action.color} group-hover:text-white`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{action.title}</p>
                <p className="text-[10px] text-muted-foreground font-bold">{action.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Link>
          ) : (
            <Card key={i} className="border border-border bg-card shadow-sm rounded-2xl h-full flex flex-col justify-center px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{action.title}</p>
                  <p className="text-sm font-black text-foreground truncate">{loading ? "..." : action.value}</p>
                </div>
              </div>
            </Card>
          )
        ))}
      </div>

      {/* Footer / Status Bar */}
      <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Supervisión Empresarial Activa</span>
        </div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Plavet v2.4.1 · Módulo Empresa</p>
      </div>

    </div>
  )
}
