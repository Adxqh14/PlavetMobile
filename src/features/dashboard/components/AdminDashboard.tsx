"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  Users,
  Settings,
  ShieldCheck,
  Activity,
  FileText,
  Database,
  Lock,
  ChevronRight,
  RefreshCcw,
  Server,
  Loader2
} from "lucide-react"
import { dashboardService, type AdminDashboardData } from "../services/dashboardService"

export function AdminDashboard() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await dashboardService.getAdminDashboard()
      if (res.success) {
        setDashboardData(res.data)
      } else {
        setError("No se pudo cargar el dashboard.")
      }
    } catch {
      setError("Error al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const stats = dashboardData?.stats
  const auditoria = dashboardData?.auditoria ?? []

  const kpis = [
    {
      title: "Usuarios Totales",
      value: stats ? stats.usuarios_totales : "—",
      desc: "Institución completa",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Programas Activos",
      value: stats ? stats.programas_activos : "—",
      desc: "Pasantías en curso",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Uptime Sistema",
      value: stats ? stats.uptime : "—",
      desc: "Rendimiento servidores",
      icon: Server,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Sesiones",
      value: stats ? stats.sesiones_hoy : "—",
      desc: "Usuarios online hoy",
      icon: ShieldCheck,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
  ]

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Panel de Administración Global · Superusuario
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

      {/* --- Error --- */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="border border-border bg-card shadow-sm hover:shadow-md transition-all h-full flex flex-col border-l-4 border-l-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {kpi.title}
              </CardTitle>
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

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Izquierda: Auditoría */}
        <div className="lg:col-span-8">
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Auditoría del Sistema
                  </CardTitle>
                  <CardDescription className="text-xs">Registro de eventos críticos y actividad técnica reciente.</CardDescription>
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
