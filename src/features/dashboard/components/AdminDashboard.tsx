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
    <div className="max-w-[1600px] mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
      
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard del Administrador
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Hola, <span className="font-semibold text-foreground">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? 'Admin')}</span>. Tienes acceso total a la configuración del sistema, auditoría y gestión de recursos institucionales.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <Button
            className="rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all font-bold h-10"
            onClick={fetchDashboard}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Actualizar
          </Button>
        </div>
      </div>

      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 md:px-12">
        {stats.map((s, i) => (
          <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.title}</p>
                <p className="text-2xl font-black text-foreground">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : s.value}
                </p>
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

      {/* Secciones de Acceso Directo Organizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-12">
        
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
                <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-wider h-8">
                  Ver Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Cargando auditoría...</span>
                </div>
              ) : auditoria.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                  No hay registros de auditoría.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {auditoria.map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between px-6 py-5 hover:bg-muted/20 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs border bg-indigo-500/10 text-indigo-600 border-indigo-500/20 transition-transform group-hover:scale-105">
                          <Activity className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{entry.actividad}</p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                            {new Date(entry.fecha).toLocaleString("es-VE")} · Usuario #{entry.id_usuario}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-[10px] font-bold border-none bg-indigo-100 text-indigo-700">
                          Registrado
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

        {/* Columna Derecha: Panel de Control */}
        <div className="lg:col-span-4">
          <Card className="border border-border bg-card shadow-sm flex flex-col h-full">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground uppercase tracking-widest">Configuración Global</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid gap-2 flex-1">
              {[
                { title: "Gestión de Usuarios", icon: Users, href: "/admin/usuarios", color: "text-primary", desc: "Roles y permisos" },
                { title: "Bases de Datos", icon: Database, href: "/admin/db", color: "text-indigo-600", desc: "Mantenimiento y backups" },
                { title: "Seguridad y Cifrado", icon: Lock, href: "/admin/seguridad", color: "text-emerald-600", desc: "Políticas de acceso" },
                { title: "Reportes Técnicos", icon: FileText, href: "/admin/reportes", color: "text-rose-600", desc: "Logs de errores" }
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start font-medium h-16 px-3 hover:bg-muted group rounded-xl border border-transparent hover:border-border/50 transition-all shadow-xs hover:shadow-sm"
                  asChild
                >
                  <Link to={action.href}>
                    <div className="p-2 rounded-lg mr-3 bg-background border border-border group-hover:border-primary/30 shadow-xs transition-colors">
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-foreground">{action.title}</p>
                      <p className="text-[10px] text-muted-foreground leading-none mt-1">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              ))}
            </CardContent>
            <div className="p-6 mt-auto">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Estado del Servidor</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stats ? `Uptime: ${stats.uptime}` : "Cargando..."}
                </p>
                <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary mt-2">
                  Panel Técnico <Settings className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

    </div>
  )
}
