"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { useAuth } from "../../auth/hooks/useAuth"
import { Button } from "../../../shared/components/ui/button"
import { Link } from "react-router-dom"
import {
  Briefcase,
  FileText,
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  GraduationCap,
  MapPin,
  User,
  CheckCircle2,
  TrendingUp,
  Building2,
  type LucideIcon,
} from "lucide-react"

// Importar servicios
import { CalificacionService } from "../../evaluaciones/calificacion/services/calificacionService"
import { DocumentacionService } from "../../documentacion/services/documentacionService"
import { ExcusaService } from "../../procesoDePasantias/excusas/services/excusaService"
import { ViewCenterDialog } from "../../gestionEmprearial/centroDeTrabajo/components/view-center-dialog"
import type { CentroTrabajo } from "../../gestionEmprearial/centroDeTrabajo/types"

const attendanceDays = {
  // 1: Asistencia, 2: Feriado, 3: No Laboral
  1: 1, 2: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
  12: 1, 13: 1, 14: 1, 15: 1, 16: 1,
  19: 1, 20: 1, 21: 2, 22: 1, 23: 1, // 21 es feriado
  26: 1, 27: 1, 28: 1, 29: 3, 30: 1, // 29 no laboral empresa
}

function AttendanceCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  
  return (
    <Card className="border-muted/60 shadow-lg overflow-hidden h-full">
      <CardHeader className="pb-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Asistencia</CardTitle>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>Abril 2026</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map(d => (
            <span key={d} className="text-[10px] font-bold text-muted-foreground uppercase">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div className="aspect-square" />
          {days.map(day => {
            const status = attendanceDays[day as keyof typeof attendanceDays]
            let bgColor = "hover:bg-muted"
            const textColor = "text-foreground"
            
            if (status === 1) bgColor = "bg-primary/20 text-primary font-bold"
            if (status === 2) bgColor = "bg-amber-500/20 text-amber-600 font-bold"
            if (status === 3) bgColor = "bg-red-500/20 text-red-600 font-bold"
            
            return (
              <div 
                key={day} 
                className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-colors cursor-default ${bgColor} ${textColor}`}
                title={status === 2 ? "Feriado" : status === 3 ? "Empresa no labora" : ""}
              >
                {day}
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-primary/40" />
            Días de Asistencia
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-amber-500/40" />
            Día Feriado
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-red-500/40" />
            No Laboral (Empresa)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Mock de la empresa para el estudiante actual
const MOCK_CENTRO: CentroTrabajo = {
  id: "CT-1024",
  name: "Tech Solutions S.A.",
  location: "Santo Domingo, DN",
  direccion: "Av. Winston Churchill #123, Santo Domingo",
  telefono: "+1 (809) 555-0123",
  email: "pasantias@techsolutions.com",
  contacto: "Ing. Roberto Martínez",
  employees: 150,
  status: "active",
  validated: true,
  createdAt: "2024-01-10",
}

export function StudentDashboard() {
  const { user } = useAuth()
  const [isCenterDialogOpen, setIsCenterDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    avgCalificacion: '0',
    evalCount: 0,
    docsPercentage: 0,
    docsTotal: 0,
    docsUploaded: 0,
    excusasTotal: 0,
    excusasPendientes: 0,
    excusasAprobadas: 0,
    isLoading: true
  })

  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Calificaciones
        const evaluaciones = CalificacionService.getEvaluaciones()
        const califStats = CalificacionService.calculateStats(evaluaciones)
        
        // 2. Documentos (ID harcodeado para el demo de estudiante)
        const docs = await DocumentacionService.getDocuments({ 
          searchTerm: "1234573", 
          statusFilter: "all",
          typeFilter: "",
          dateFilter: "" 
        })
        const validatedDocs = docs.filter(d => d.estado === "Validado").length
        const docsPercentage = docs.length > 0 ? Math.round((validatedDocs / docs.length) * 100) : 0

        // 3. Excusas
        const excusas = await ExcusaService.getAllExcuses()
        // Filtramos por el nombre del usuario actual si existe, si no por "Juan Pérez" para el demo
        const myExcusas = excusas.filter(e => e.estudiante === (user?.name || "Juan Pérez"))

        setStats({
          avgCalificacion: califStats.promedioGeneral,
          evalCount: califStats.total,
          docsPercentage,
          docsTotal: docs.length,
          docsUploaded: validatedDocs,
          excusasTotal: myExcusas.length,
          excusasPendientes: myExcusas.filter(e => e.estado === "Pendiente").length,
          excusasAprobadas: myExcusas.filter(e => e.estado === "Aprobada").length,
          isLoading: false
        })

        // Generar actividades recientes basadas en los datos
        const newActivities = [
          {
            id: 1,
            title: "Documento validado",
            description: "Tu 'Anexo IV' ha sido validado correctamente.",
            time: "Hace 2 horas",
            icon: CheckCircle2,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
          },
          {
            id: 2,
            title: "Evaluación publicada",
            description: `Se ha registrado una nueva calificación: ${califStats.promedioGeneral}/100.`,
            time: "Hace 5 horas",
            icon: GraduationCap,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
          },
          ...myExcusas.map((ex, idx) => ({
            id: 10 + idx,
            title: `Excusa ${ex.estado}`,
            description: `Tu excusa del ${ex.fecha} está en estado: ${ex.estado}.`,
            time: "Ayer",
            icon: AlertCircle,
            color: ex.estado === "Aprobada" ? "text-emerald-500" : "text-amber-500",
            bgColor: ex.estado === "Aprobada" ? "bg-emerald-500/10" : "bg-amber-500/10",
          }))
        ]
        setActivities(newActivities.slice(0, 5))

      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
        setStats(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchData()
  }, [user])

  const kpis = useMemo(() => [
    { 
      title: "Estado Pasantía", 
      value: "Activa", 
      desc: "Tech Solutions S.A.", 
      icon: Briefcase, 
      color: "text-blue-600", 
      borderColor: "border-blue-500", 
      bg: "bg-blue-500/5" 
    },
    { 
      title: "Documentos", 
      value: `${stats.docsPercentage}%`, 
      desc: `${stats.docsUploaded} de ${stats.docsTotal} validados`, 
      icon: FileText, 
      color: "text-emerald-600", 
      borderColor: "border-emerald-500", 
      bg: "bg-emerald-500/5" 
    },
    { 
      title: "Nota Promedio", 
      value: `${stats.avgCalificacion}/100`, 
      desc: `${stats.evalCount} evaluaciones registradas`, 
      icon: TrendingUp, 
      color: "text-purple-600", 
      borderColor: "border-purple-500", 
      bg: "bg-purple-500/5" 
    },
    { 
      title: "Mis Excusas", 
      value: stats.excusasTotal.toString(), 
      desc: `${stats.excusasAprobadas} aprobadas, ${stats.excusasPendientes} pendientes`, 
      icon: AlertCircle, 
      color: "text-amber-600", 
      borderColor: "border-amber-500", 
      bg: "bg-amber-500/5" 
    },
  ], [stats])

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Header con gradiente sutil */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10 shadow-xs">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            ¡Hola, {user?.name ?? 'Estudiante'}!
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Bienvenido a tu portal personal. Aquí puedes seguir el progreso de tu pasantía, 
            gestionar tus documentos y revisar tus evaluaciones en tiempo real.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Estado: Pasantía Activa
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Periodo: 2025-2026
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid de Resumen (KPIs) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className={`overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group ${kpi.bg}`}>
            <div className={`h-1 w-full ${kpi.borderColor.replace('border-', 'bg-')}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-background shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {stats.isLoading ? "..." : kpi.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Detalles de la Pasantía Actual */}
        <Card className="md:col-span-4 overflow-hidden border-muted/60 shadow-lg">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Mi Pasantía Actual</CardTitle>
                <CardDescription>Detalles del centro de trabajo y tutoría.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-linear-to-br from-muted/50 to-background border shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-white dark:bg-zinc-900 border flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                <Building2 className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-2xl text-foreground">Tech Solutions S.A.</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  Av. Winston Churchill #123, Santo Domingo
                </div>
              </div>
              <Button 
                variant="outline" 
                className="rounded-full px-6 shadow-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => setIsCenterDialogOpen(true)}
              >
                Ver Empresa
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>


            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-tight">
                  <User className="h-4 w-4" />
                  Tutor Empresarial
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-foreground text-lg">Ing. Roberto Martínez</p>
                  <p className="text-sm text-muted-foreground">Gerente de Proyectos IT</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-tight">
                  <Clock className="h-4 w-4" />
                  Horario Laboral
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-foreground text-lg">Lun - Vie, 8:00 - 14:00</p>
                  <p className="text-sm text-muted-foreground">30 horas semanales</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Progreso de Horas</span>
                  <div className="text-2xl font-black text-foreground">240 <span className="text-sm font-normal text-muted-foreground">/ 360 horas</span></div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">66%</span>
                </div>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner border border-muted-foreground/10">
                <div className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full w-[66%] shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card className="md:col-span-3 border-muted/60 shadow-lg">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-xl">Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas notificaciones.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 max-h-[350px] overflow-y-auto">
            <div className="divide-y divide-border">
              {stats.isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Cargando actividad...</div>
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-5 hover:bg-muted/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`p-3 rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-110 ${activity.bgColor} ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span className="text-xs font-medium text-muted-foreground/60">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">No hay actividad reciente.</div>
              )}
            </div>
          </CardContent>
          <div className="p-4 bg-muted/10 border-t">
            <Button variant="ghost" className="w-full text-sm font-bold text-primary hover:bg-primary/5 transition-all duration-300 rounded-xl" size="sm">
              Ver todo el historial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Calendario de Asistencia */}
        <div className="md:col-span-3">
          <AttendanceCalendar />
        </div>

        {/* Próximos Pasos / Acciones Rápidas */}
        <div className="md:col-span-4 grid gap-6 sm:grid-cols-2">
          {[
            { 
              title: "Subir Documentos", 
              desc: `Faltan ${stats.docsTotal - stats.docsUploaded} documentos por validar.`, 
              icon: FileText, 
              href: "/subir", 
              variant: "primary" as const,
              cta: "Ir a Documentación" 
            },
            { 
              title: "Enviar Excusa", 
              desc: "¿Faltaste? Registra tu excusa aquí.", 
              icon: AlertCircle, 
              href: "/excusas", 
              variant: "outline" as const,
              cta: "Gestionar Excusas" 
            },
            { 
              title: "Ver Calificaciones", 
              desc: "Revisa tu progreso académico detallado.", 
              icon: GraduationCap, 
              href: "/mis-calificaciones", 
              variant: "outline" as const,
              cta: "Ver Notas" 
            }
          ].map((action, i) => (
            <Card key={i} className={`relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-md ${action.variant === 'primary' ? 'bg-primary text-primary-foreground border-none' : ''}`}>
              <CardHeader className="pb-2">
                <div className={`h-10 w-10 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${action.variant === 'primary' ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold">{action.title}</CardTitle>
                <CardDescription className={`text-xs ${action.variant === 'primary' ? 'text-primary-foreground/80' : ''}`}>
                  {action.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button 
                  variant={action.variant === 'primary' ? 'secondary' : 'outline'} 
                  className={`w-full rounded-xl font-bold shadow-sm transition-all duration-300 text-xs h-9 ${action.variant === 'primary' ? 'hover:bg-white hover:scale-[1.02]' : 'hover:bg-primary hover:text-primary-foreground'}`} 
                  asChild
                >
                  <Link to={action.href}>
                    {action.cta}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ViewCenterDialog 
        open={isCenterDialogOpen} 
        onOpenChange={setIsCenterDialogOpen} 
        centro={MOCK_CENTRO} 
      />
    </div>
  )
}
