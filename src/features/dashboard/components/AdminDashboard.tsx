"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { Link } from "react-router-dom"
import {
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  ClipboardCheck,
  Building,
  History,
  Loader2,
} from "lucide-react"
import { dashboardService, type AdminDashboardData } from "../services/dashboardService"

export function AdminDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.getAdminDashboard()
      .then(res => { if (res.success) setDashboardData(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const apiStats = dashboardData?.stats

  const displayName = user?.perfil
    ? `${user.perfil.nombre} ${user.perfil.apellido}`
    : (user?.nombre && user?.apellido)
      ? `${user.nombre} ${user.apellido}`
      : (user?.username ?? 'Administrador')

  const stats = [
    { title: "Usuarios", value: apiStats ? String(apiStats.usuarios_totales) : "—", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Programas", value: apiStats ? String(apiStats.programas_activos) : "—", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  ]

  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-10 pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section - Estilo Estudiantes */}
      <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
        {/* Icono Decorativo */}
        <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
          <ShieldCheck className="w-80 h-80 text-primary -rotate-12" />
        </div>
        
        <div className="w-full relative px-6 md:px-12 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Consola <span className="text-primary">Administrativa</span> Central
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Hola, <span className="text-foreground font-bold">{displayName}</span>. Gestiona la estructura institucional, académica y el flujo operativo de Plavet.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.title}</p>
                <p className="text-2xl font-black text-foreground">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : s.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg} group-hover:scale-110 transition-transform`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secciones de Acceso Directo Organizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Pilar 1: Estructura Institucional */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-primary">
            <Building2 className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Estructura Institucional</h2>
          </div>
          <div className="grid gap-3">
            {[
              { title: "Centros de Trabajo", icon: Building2, href: "/centroDeTrabajo", desc: "Empresas y sucursales aliadas" },
              { title: "Gestión de Plazas", icon: Building, href: "/plaza", desc: "Vacantes y requerimientos" },
              { title: "Tutores Académicos", icon: GraduationCap, href: "/tutoresAcademicos", desc: "Supervisores del taller" },
              { title: "Tutores Empresariales", icon: Users, href: "/tutoresEmpresarial", desc: "Supervisores en empresa" },
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

        {/* Pilar 2: Control del Proceso */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1 text-primary">
            <Briefcase className="h-5 w-5" />
            <h2 className="text-xl font-black text-foreground tracking-tight">Control Operativo</h2>
          </div>
          <div className="grid gap-3">
            {[
              { title: "Gestión de Pasantías", icon: Briefcase, href: "/gestionDePasantias", desc: "Asignaciones y seguimiento" },
              { title: "Estudiantes", icon: GraduationCap, href: "/estudiantes", desc: "Expedientes académicos" },
              { title: "Asistencias y Visitas", icon: ClipboardCheck, href: "/asistencias", desc: "Supervisión diaria" },
              { title: "Validación de Excusas", icon: History, href: "/excusas", desc: "Control de ausencias" },
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
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sistema Operativo · Conexión Segura</span>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">v2.4.0</p>
          <Link to="/usuarios" className="text-[10px] font-black uppercase text-primary hover:underline underline-offset-4">Gestión de Usuarios</Link>
        </div>
      </div>

    </div>
  )
}
