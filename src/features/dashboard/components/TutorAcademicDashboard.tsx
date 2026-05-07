"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  Calendar,
  Building2,
  FileText,
  Users,
  Clock,
  BookOpen,
  ClipboardCheck,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { dashboardService, type TutorAcademicoDashboardData } from "../services/dashboardService"

const TALLER = {
  nombre: "Taller Activo",
  ubicacion: "Laboratorio Asignado",
  periodo: "2025–2026",
}

interface Excusa {
  id: number
  estudiante: string
  fecha: string
  motivo: string
}

const EXCUSAS_PENDIENTES: Excusa[] = [
  { id: 1, estudiante: "Jean Carlos Bautista", fecha: "28 Abr", motivo: "Cita médica" },
  { id: 2, estudiante: "Ana Karina López", fecha: "29 Abr", motivo: "Problema familiar" },
  { id: 3, estudiante: "Pedro Antonio Reyes", fecha: "02 May", motivo: "Trámite institucional" },
]

interface Visita {
  id: number
  empresa: string
  estudiante: string
  fecha: string
  hora: string
  tipo: "Presencial" | "Virtual"
}

const PROXIMAS_VISITAS: Visita[] = [
  { id: 1, empresa: "TechCorp Software", estudiante: "Jean Bautista", fecha: "08 May", hora: "10:00 AM", tipo: "Presencial" },
  { id: 2, empresa: "CodeFlow Agency", estudiante: "Ana López", fecha: "09 May", hora: "2:00 PM", tipo: "Presencial" },
  { id: 3, empresa: "Innovatech Solutions", estudiante: "María González", fecha: "12 May", hora: "11:00 AM", tipo: "Virtual" },
]

export function TutorAcademicDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<TutorAcademicoDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getTutorAcademicoDashboard()
      .then(res => setData(res))
      .catch(() => setError("Error al conectar con el servidor."))
      .finally(() => setLoading(false))
  }, [])

  const totalEstudiantes = data ? parseInt(data.mis_estudiantes) : 0
  const visitasPendientes = data ? parseInt(data.visitas_pendientes) : 0

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Tutor Académico · Taller Activo
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Panel de Gestión Académica</h1>
          <p className="text-muted-foreground text-base">
            Bienvenido, <span className="font-semibold text-foreground">{user?.perfil ? `${user.perfil.nombre} ${user.perfil.apellido}` : (user?.username ?? "Tutor")}</span>. Supervisando el taller de{" "}
            <span className="font-semibold text-foreground">{TALLER.nombre}</span>.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Periodo Académico</p>
          <div className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-md">
            <Calendar className="h-4 w-4 text-primary" />
            {TALLER.periodo}
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3" /> {TALLER.ubicacion}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-700 font-medium">{error}</div>
      )}

      <div className="space-y-6">
        {/* Resumen del Grupo */}
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Cargando grupo...
                  </span>
                ) : (
                  `Resumen del Grupo — ${totalEstudiantes} estudiante${totalEstudiantes !== 1 ? 's' : ''}`
                )}
              </CardTitle>
              <Button size="sm" className="text-xs gap-1.5" asChild>
                <Link to="/estudiantes">
                  Gestionar taller
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resumen General</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg border border-border/50 bg-muted/30 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /> : totalEstudiantes}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">Mis Estudiantes</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border/50 bg-muted/30 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /> : visitasPendientes}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">Visitas Pendientes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Acciones del Taller</p>
                <div className="grid gap-2">
                  {[
                    { title: "Gestión Académica", icon: BookOpen, href: "/estudiantes" },
                    { title: "Revisar Excusas", icon: ClipboardCheck, href: "/excusas" },
                  ].map((action, i) => (
                    <Button key={i} variant="ghost" className="w-full justify-start font-medium text-sm h-10 px-3 hover:bg-muted" asChild>
                      <Link to={action.href}>
                        <action.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                        {action.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sección inferior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Acciones Rápidas */}
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid gap-2 flex-1">
              {[
                { title: "Gestión Académica", icon: BookOpen, href: "/estudiantes" },
                { title: "Revisar Excusas", icon: ClipboardCheck, href: "/excusas" },
                { title: "Mis Reportes", icon: FileText, href: "/reportes" },
                { title: "Calendario Visitas", icon: Calendar, href: "/visitas" },
              ].map((action, i) => (
                <Button key={i} variant="ghost" className="w-full justify-start font-medium text-sm h-10 px-3 hover:bg-muted" asChild>
                  <Link to={action.href}>
                    <action.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                    {action.title}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Excusas por Validar */}
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-amber-500" />
                  Excusas por Validar
                </CardTitle>
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 text-[10px] font-bold">
                  {EXCUSAS_PENDIENTES.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-border/50">
                {EXCUSAS_PENDIENTES.map(excusa => (
                  <div key={excusa.id} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{excusa.estudiante}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{excusa.motivo}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {excusa.fecha}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-[10px] h-7 px-2 shrink-0">
                      Revisar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Visitas */}
          <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Próximas Visitas
                {visitasPendientes > 0 && (
                  <Badge className="ml-auto bg-primary/10 text-primary border-0 text-[10px] font-bold">
                    {visitasPendientes}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-border/50">
                {PROXIMAS_VISITAS.map(visita => (
                  <div key={visita.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="h-9 w-9 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-primary uppercase">{visita.fecha.split(" ")[1]}</span>
                      <span className="text-sm font-bold text-primary leading-none">{visita.fecha.split(" ")[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{visita.empresa}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{visita.estudiante}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${visita.tipo === "Virtual" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                      {visita.tipo[0]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
