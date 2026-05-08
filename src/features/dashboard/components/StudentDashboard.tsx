"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../../../shared/components/ui/card"
import { useAuth } from "../../auth/hooks/useAuth"

import { Link } from "react-router-dom"
import {
  Briefcase,
  FileText,
  AlertCircle,
  GraduationCap,
  MapPin,
  Building2,
  Loader2,
  ArrowRight,
  Users,
  Clock,
} from "lucide-react"
import { dashboardService, type EstudianteDashboardData } from "../services/dashboardService"

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
    <div className="max-w-[1600px] mx-auto px-6 md:px-8 space-y-10 pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
        <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
          <GraduationCap className="w-80 h-80 text-primary -rotate-12" />
        </div>
        
        <div className="w-full relative px-8 md:px-16 z-10">
          <div className="max-w-3xl flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {pasantia ? `Pasantía ${pasantia.estado}` : "Pasantía Activa"}
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Dashboard <span className="text-primary">Estudiantil</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Hola, <span className="text-foreground font-bold">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? 'Estudiante')}</span>. Monitorea tu progreso académico, gestiona tus documentos y supervisa tu asistencia.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 md:px-12">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
        </div>
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
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg} group-hover:scale-110 transition-transform`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
        {/* Progreso rápido como KPI */}
        <Card className="md:col-span-2 border-none bg-primary/5 shadow-none rounded-2xl p-5 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Progreso de Pasantía</p>
            <span className="text-sm font-black text-primary">{porcentaje}%</span>
          </div>
          <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${porcentaje}%` }} />
          </div>
        </Card>
      </div>

      {/* Grid Principal */}
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Columna Izquierda: Mi Pasantía */}
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-primary">
              <Briefcase className="h-5 w-5" />
              <h2 className="text-xl font-black text-foreground tracking-tight">Mi Pasantía Actual</h2>
            </div>
            
            <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-12 flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" /> Cargando datos...
                  </div>
                ) : (
                  <div className="divide-y">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <Building2 className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-black text-xl text-foreground">{pasantia?.empresa ?? "Sin empresa asignada"}</h4>
                          <p className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                            <MapPin className="h-3 w-3 text-primary" />
                            {pasantia?.estado ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 divide-x divide-y sm:divide-y-0">
                      <div className="p-6 bg-muted/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Tutor Asignado</p>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <p className="font-bold text-foreground">{pasantia?.tutor ?? "—"}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-muted/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total de Horas</p>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-emerald-600" />
                          </div>
                          <p className="font-bold text-foreground">{pasantia ? `${pasantia.progreso.total} Horas` : "—"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Columna Derecha: Acciones */}
        <div className="space-y-8">
          
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1 text-primary">
              <Briefcase className="h-5 w-5" />
              <h2 className="text-xl font-black text-foreground tracking-tight">Acciones y Estado</h2>
            </div>

            <div className="grid gap-3">
              {[
                { title: "Subir Documentos", icon: FileText, href: "/subir", desc: "Gestionar expedientes" },
                { title: "Registrar Excusa", icon: AlertCircle, href: "/excusas", desc: "Justificar ausencias" },
                { title: "Mis Calificaciones", icon: GraduationCap, href: "/mis-calificaciones", desc: "Ver rendimiento" }
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
      </div>

      {/* Status Bar */}
      <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Portal Estudiantil · Conexión Segura</span>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">v2.4.0</p>
          <span className="text-[10px] font-black uppercase text-primary">Plavet Académico</span>
        </div>
      </div>

    </div>
  )
}
