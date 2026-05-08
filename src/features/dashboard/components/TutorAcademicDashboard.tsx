"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  Calendar,
  FileText,
  Users,
  Clock,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  AlertTriangle,
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

  const excusas = data?.excusas_por_validar ?? []
  const visitas = data?.proximas_visitas ?? []

  const kpis = [
    { title: "Total Estudiantes", value: data ? String(data.resumen.total_estudiantes) : "—", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "En Proceso", value: data ? String(data.resumen.distribucion.en_proceso) : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "En Riesgo", value: data ? String(data.resumen.distribucion.en_riesgo) : "—", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
    { title: "Finalizados", value: data ? String(data.resumen.distribucion.finalizados) : "—", icon: UserCheck, color: "text-primary", bg: "bg-primary/10" },
  ]

  const actions = [
    { title: "Gestión Académica", icon: Users, href: "/estudiantes", desc: "Listado", color: "text-primary" },
    { title: "Revisar Excusas", icon: ClipboardCheck, href: "/excusas", desc: "Inasistencias", color: "text-amber-600" },
    { title: "Mis Reportes", icon: FileText, href: "/reportes", desc: "Analítica", color: "text-indigo-600" },
    { title: "Calendario Visitas", icon: Calendar, href: "/visitas", desc: "Visitas", color: "text-emerald-600" },
  ]

  const displayName = user?.perfil
    ? `${user.perfil.nombre} ${user.perfil.apellido}`
    : (user?.username ?? 'Tutor')

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-10 pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section - Estilo Admin */}
      <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl w-full">
        <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
          <ShieldCheck className="w-80 h-80 text-primary -rotate-12" />
        </div>
        
        <div className="w-full relative px-10 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Consola de <span className="text-primary">Gestión Académica</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Hola, <span className="text-foreground font-bold">{displayName}</span>. Supervisa el progreso de tu taller y coordina las visitas a empresas.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.title}</p>
                <p className="text-2xl font-black text-foreground">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : kpi.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.bg} group-hover:scale-110 transition-transform`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rendimiento del Taller (Ahora ocupa todo el ancho) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-primary">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-black text-foreground tracking-tight">Rendimiento del Taller</h2>
        </div>
        <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
              {[
                { label: "Progreso Promedio del Grupo", value: data?.resumen.metricas.progreso_prom ?? "—", icon: Clock, desc: "Avance porcentual en el plan" },
                { label: "Horas Promedio Registradas", value: data?.resumen.metricas.horas_prom ?? "—", icon: BookOpen, desc: "Total de horas acumuladas" },
                { label: "Expedientes Completos", value: loading ? "—" : `${data?.resumen.metricas.docs_completos ?? 0} estudiantes`, icon: FileText, desc: "Documentación validada" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col justify-between p-8 hover:bg-muted/30 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground font-bold">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-black text-primary leading-none">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alertas y Próximas Visitas (Uno al lado del otro) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Alertas */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-primary">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-xl font-black text-foreground tracking-tight">Alertas Pendientes</h2>
            </div>
            <Badge className="bg-amber-500/10 text-amber-600 border-0 font-black rounded-lg px-3 py-1">
              {loading ? "—" : excusas.length} Pendientes
            </Badge>
          </div>
          <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
            <CardContent className="p-0 flex-1">
              {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
              ) : excusas.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-2 text-muted-foreground">
                  <ClipboardCheck className="h-10 w-10 opacity-10" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">Sin pendientes</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {excusas.slice(0, 5).map((excusa) => (
                    <div key={excusa.id} className="p-5 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 group">
                      <div className="min-w-0">
                        <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">{excusa.estudiante_nombre}</p>
                        <p className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {excusa.fecha}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">Revisar</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Próximas Visitas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-primary">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Calendario de Visitas</h2>
          </div>
          <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
            <CardContent className="p-0 flex-1">
              {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin opacity-20" /></div>
              ) : visitas.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-2 text-muted-foreground">
                  <Calendar className="h-10 w-10 opacity-10" />
                  <p className="text-sm font-bold uppercase tracking-widest opacity-40">Sin visitas programadas</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {visitas.slice(0, 5).map((visita, i) => {
                    const fechaDate = new Date(visita.fecha)
                    const dia = fechaDate.getDate()
                    const mes = fechaDate.toLocaleString("es", { month: "short" }).toUpperCase()
                    return (
                      <div key={i} className="p-5 hover:bg-muted/30 transition-all flex items-center gap-5 group">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0 transition-all group-hover:bg-primary group-hover:border-primary">
                          <span className="text-[10px] font-black text-primary uppercase group-hover:text-white tracking-widest leading-none mb-0.5">{mes}</span>
                          <span className="text-2xl font-black text-primary leading-none group-hover:text-white">{dia}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{visita.empresa}</p>
                          <p className="text-[12px] text-muted-foreground font-bold truncate">{visita.estudiante_nombre}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

      </div>

      {/* Acciones Rápidas Horizontal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, i) => (
          <Link key={i} to={action.href} className="group flex items-center gap-4 p-5 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-all">
              <action.icon className={`h-5 w-5 ${action.color} group-hover:text-white transition-colors`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{action.title}</p>
              <p className="text-[11px] text-muted-foreground font-bold">{action.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </Link>
        ))}
      </div>

      {/* Status Bar */}
      <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sincronización Académica Activa</span>
        </div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Plavet v2.4.1 · Módulo Tutor Académico</p>
      </div>

    </div>
  )
}
