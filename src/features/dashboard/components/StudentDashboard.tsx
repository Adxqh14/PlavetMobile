"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { useAuth } from "../../auth/hooks/useAuth"
import { Button } from "../../../shared/components/ui/button"
import { Link } from "react-router-dom"
import {
  Briefcase,
  FileText,
  AlertCircle,
  Calendar,
  ExternalLink,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Building2,
  type LucideIcon,
} from "lucide-react"

// Importar servicios
import { CalificacionService } from "../../evaluaciones/calificacion/services/calificacionService"
import { DocumentacionService } from "../../documentacion/services/documentacionService"
import { excusaService } from "../../procesoDePasantias/excusas/services/excusaService"
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
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // 0 = Lunes, 6 = Domingo
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySpaces = Array.from({ length: adjustedFirstDay }, (_, i) => i);
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  
  return (
    <Card className="border border-border bg-card shadow-sm h-full flex flex-col">
      <CardHeader className="border-b border-border/50 pb-3 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Asistencia de {monthNames[currentMonth]} {currentYear}
          </CardTitle>
          <div className="flex gap-2.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Laboral</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Feriado</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />No Operable</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase pb-1">
              {d}
            </div>
          ))}
          {emptySpaces.map(i => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const status = attendanceDays[day as keyof typeof attendanceDays];
            let bgColor = "hover:bg-muted/50 bg-muted/10 border-transparent text-muted-foreground";
            
            if (status === 1) bgColor = "bg-red-500/10 text-red-600 border-red-500/20 font-bold";
            if (status === 2) bgColor = "bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold";
            if (status === 3) bgColor = "bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold";
            
            return (
              <div 
                key={day} 
                className={`flex items-center justify-center h-7 w-full text-[11px] rounded border transition-colors cursor-default ${bgColor}`}
                title={status === 2 ? "Feriado" : status === 3 ? "Empresa no labora" : "Asistencia"}
              >
                {day}
              </div>
            )
          })}
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
        const excusasRes = await excusaService.getAll()
        const excusas = excusasRes.data
        // Filtramos por el nombre del usuario actual si existe
        const myExcusas = excusas.filter(e => e.estudiante === (user?.name || ""))

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
      title: "Documentos", 
      value: `${stats.docsPercentage}%`, 
      desc: `${stats.docsUploaded} de ${stats.docsTotal} validados`, 
      icon: FileText, 
      color: "text-emerald-600", 
      borderColor: "border-emerald-500", 
      bg: "bg-emerald-500/5" 
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
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header Institucional Limpio */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Pasantía Activa
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard Estudiantil
          </h1>
          <p className="text-muted-foreground text-base">
            Bienvenido, <span className="font-semibold text-foreground">{user?.name ?? 'Estudiante'}</span>. Resumen de tu progreso académico y laboral.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Periodo Académico</p>
          <div className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-md">
            <Calendar className="h-4 w-4 text-primary" />
            2025-2026
          </div>
        </div>
      </div>



      {/* Grid Principal de Contenido */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Columna Izquierda: Información de Pasantía */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="border border-border bg-card shadow-sm shrink-0">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Mi Pasantía Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Información de la Empresa */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border border-border">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-foreground">Tech Solutions S.A.</h4>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Santo Domingo, DN
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-lg shadow-sm"
                  onClick={() => setIsCenterDialogOpen(true)}
                >
                  Ver Perfil Empresa
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Detalles Operativos */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Tutor Asignado</p>
                  <p className="font-semibold text-foreground text-sm">Ing. Roberto Martínez</p>
                  <p className="text-xs text-muted-foreground">Gerente IT</p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Horario Oficial</p>
                  <p className="font-semibold text-foreground text-sm">Lun - Vie, 8:00 - 14:00</p>
                  <p className="text-xs text-muted-foreground">30h semanales</p>
                </div>
              </div>

              {/* Progreso */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Progreso de Horas</p>
                  <p className="text-sm font-bold">240 / 360h <span className="text-primary ml-1">(66%)</span></p>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[66%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendario de Asistencia */}
          <div className="flex-1">
            <AttendanceCalendar />
          </div>
        </div>

        {/* Columna Derecha: Acciones y Actividad */}
        <div className="flex flex-col gap-6">
          
          {/* Acciones Rápidas */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid gap-2">
              {[
                { title: "Subir Documento", icon: FileText, href: "/subir" },
                { title: "Registrar Excusa", icon: AlertCircle, href: "/excusas" },
                { title: "Ver Evaluación", icon: GraduationCap, href: "/mis-calificaciones" }
              ].map((action, i) => (
                <Button 
                  key={i} 
                  variant="ghost" 
                  className="w-full justify-start font-medium text-sm h-10 px-3 hover:bg-muted"
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon className="mr-3 h-4 w-4 text-muted-foreground" />
                    {action.title}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Actividad Reciente */}
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {stats.isLoading ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">Cargando...</div>
                ) : activities.length > 0 ? (
                  activities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-4">
                      <activity.icon className={`h-4 w-4 shrink-0 mt-0.5 ${activity.color}`} />
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground leading-none">{activity.title}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{activity.description}</p>
                        <p className="text-[10px] text-muted-foreground/70">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">Sin actividad.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grid de Resumen (KPIs) Minimalista */}
          <div className="flex-1 grid gap-4 grid-cols-2">
            {kpis.map((kpi, i) => (
              <Card key={i} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-center">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-1.5 rounded-md ${kpi.bg}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {stats.isLoading ? "..." : kpi.value}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 font-medium">{kpi.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
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
