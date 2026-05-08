"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { Link } from "react-router-dom"
import {
  Users,
  Building2,
  UserPlus,
  AlertCircle,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  Loader2,
  Briefcase
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
    { title: "Convenios", value: stats ? String(stats.convenios) : "—", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { title: "Plazas Libres", value: stats ? String(stats.plazas_libres) : "—", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "Por Asignar", value: stats ? String(stats.por_asignar) : "—", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "Alertas", value: stats ? String(stats.alertas) : "—", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
  ]

  const displayName = user?.perfil
    ? `${user.perfil.nombre} ${user.perfil.apellido}`
    : (user?.username ?? 'Vinculador')

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-10 pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section - Estilo Admin */}
      <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
        {/* Icono Decorativo */}
        <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
          <ShieldCheck className="w-80 h-80 text-primary -rotate-12" />
        </div>
        
        <div className="w-full relative px-6 md:px-12 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Consola de <span className="text-primary">Vinculación</span> Institucional
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Hola, <span className="text-foreground font-bold">{displayName}</span>. Gestiona la red de empresas aliadas y asegura que cada estudiante tenga una plaza ideal.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
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

      {/* Acciones del Vinculador Organizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Columna 1: Gestión de Red */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-primary">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Gestión Institucional</h2>
          </div>
          <div className="grid gap-3">
            {[
              { title: "Directorio de Empresas", icon: Building2, href: "/centroDeTrabajo", desc: "Listado completo de aliados estratégicos" },
              { title: "Gestión de Pasantías", icon: Briefcase, href: "/gestionDePasantias", desc: "Asignaciones y seguimiento de estudiantes" }
            ].map((item, i) => (
              <Link key={i} to={item.href} className="group flex items-center gap-4 p-5 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-all">
                  <item.icon className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground font-bold">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Columna 2: Operación de Plazas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-primary">
            <Briefcase className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Control Operativo</h2>
          </div>
          <div className="grid gap-3">
            {[
              { title: "Asignación de Plazas", icon: UserPlus, href: "/plaza", desc: "Gestión de cupos por talleres y especialidades" },
              { title: "Cierre de Pasantías", icon: FileCheck, href: "/cierrePasantias", desc: "Finalización y validación de horas totales" },
            ].map((item, i) => (
              <Link key={i} to={item.href} className="group flex items-center gap-4 p-5 rounded-2xl bg-card border hover:border-primary/30 hover:shadow-md transition-all">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary group-hover:border-primary transition-all">
                  <item.icon className="h-5 w-5 text-primary group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground font-bold">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* Status Bar */}
      <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Panel de Vinculación · Conexión Activa</span>
        </div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Módulo de Intermediación Laboral</p>
      </div>

    </div>
  )
}
