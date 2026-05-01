"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import {
  ClipboardCheck,
  Clock,
  ArrowRight,
  Calendar,
  Building2,
  AlertCircle,
  Users,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react"

const attendanceDays = {
  // 1: Completa, 2: Parcial, 3: Ausencia
  1: 1, 2: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
  12: 1, 13: 1, 14: 1, 15: 1, 16: 1,
  19: 1, 20: 1, 21: 2, 22: 1, 23: 1, 
  26: 1, 27: 1, 28: 1, 29: 3, 30: 1, 
}

function TeamAttendanceCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  
  return (
    <Card className="border-muted/60 shadow-lg overflow-hidden h-full">
      <CardHeader className="pb-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Calendario de Equipo</CardTitle>
          <Calendar className="h-5 w-5 text-emerald-600" />
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
                className={`aspect-square flex items-center justify-center text-[10px] rounded-lg transition-all cursor-default ${bgColor} ${textColor}`}
              >
                {day}
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 space-y-2 border-t pt-4">
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-primary/40" />
            Asistencia Completa
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-amber-500/40" />
            Incidencias
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-red-500/40" />
            Ausencias
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TutorBusinessDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: "Jean Carlos Bautista", puesto: "Pasante Frontend", progreso: 65, asistencia: "98%", estado: "Presente" },
    { id: 2, name: "María Elena González", puesto: "Pasante Backend", progreso: 80, asistencia: "95%", estado: "Presente" },
    { id: 3, name: "Luis Manuel Martínez", puesto: "Soporte Técnico", progreso: 45, asistencia: "90%", estado: "Ausente" },
  ]);

  const stats = useMemo(() => ({
    total: students.length,
    presentes: students.filter(s => s.estado === "Presente").length,
    evaluaciones: 2,
    promedioAsistencia: "94%"
  }), [students]);

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Header idéntico al de Estudiantes pero para Tutor */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600/10 via-emerald-600/5 to-transparent p-8 border border-emerald-500/10 shadow-xs">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            ¡Hola, Tutor! 👋
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Bienvenido a tu panel de supervisión. Aquí puedes gestionar la asistencia, 
            evaluar el desempeño y seguir el progreso de tus pasantes en tiempo real.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Estado: Supervisión Activa
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Empresa: Tech Solutions S.A.
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid de Resumen (KPIs) estilo Estudiante */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Pasantes Activos", value: stats.total, desc: "Bajo tu cargo", icon: Users, color: "text-blue-600", borderColor: "bg-blue-500" },
          { title: "Asistencia Hoy", value: `${Math.round((stats.presentes/stats.total)*100)}%`, desc: `${stats.presentes} presentes`, icon: Clock, color: "text-emerald-600", borderColor: "bg-emerald-500" },
          { title: "Evaluaciones", value: stats.evaluaciones, desc: "Pendientes este mes", icon: TrendingUp, color: "text-purple-600", borderColor: "bg-purple-500" },
          { title: "Alertas", value: "1", desc: "Ausencia reportada", icon: AlertCircle, color: "text-amber-600", borderColor: "bg-amber-500" },
        ].map((kpi, i) => (
          <Card key={i} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group bg-card">
            <div className={`h-1 w-full ${kpi.borderColor}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{kpi.title}</CardTitle>
              <div className="p-2 rounded-xl bg-background shadow-sm transition-transform group-hover:scale-110 duration-300">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">{kpi.value}</div>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{kpi.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Listado de Pasantes - Estilo "Mi Pasantía Actual" */}
        <Card className="md:col-span-4 overflow-hidden border-muted/60 shadow-lg">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Gestión de Equipo</CardTitle>
                <CardDescription>Listado y control de asistencia diaria.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {students.map((est) => (
                <div key={est.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-all duration-300 group">
                   <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xs border transition-all ${est.estado === 'Presente' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {est.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{est.name}</p>
                        <p className="text-xs text-muted-foreground">{est.puesto}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`rounded-xl text-[10px] font-bold uppercase tracking-tight h-8 ${est.estado === 'Presente' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        onClick={() => {
                          setStudents(prev => prev.map(s => 
                            s.id === est.id ? { ...s, estado: s.estado === "Presente" ? "Ausente" : "Presente" } : s
                          ))
                        }}
                      >
                        {est.estado === "Presente" ? "Marcar Falta" : "Marcar Llegada"}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 bg-muted/10 border-t">
            <Button variant="ghost" className="w-full text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-all duration-300 rounded-xl" size="sm">
              Ver histórico detallado
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Calendario - Derecha */}
        <div className="md:col-span-3">
          <TeamAttendanceCalendar />
        </div>
      </div>

      {/* Acciones Rápidas - Estilo idéntico a Estudiantes */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { title: "Evaluación Técnica", desc: "Evalúa las competencias de tus pasantes.", icon: ClipboardCheck, cta: "Ir a Evaluaciones", variant: "primary" },
          { title: "Registrar Incidencia", desc: "Reporta ausencias o problemas de conducta.", icon: AlertCircle, cta: "Crear Reporte", variant: "outline" },
          { title: "Configuración", desc: "Datos del centro y horarios de trabajo.", icon: Building2, cta: "Ver Perfil", variant: "outline" },
        ].map((action, i) => (
          <Card key={i} className={`relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 shadow-md ${action.variant === 'primary' ? 'bg-emerald-600 text-white border-none' : ''}`}>
            <CardHeader className="pb-2">
              <div className={`h-10 w-10 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${action.variant === 'primary' ? 'bg-white/20' : 'bg-emerald-500/10 text-emerald-600'}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">{action.title}</CardTitle>
              <CardDescription className={`text-xs ${action.variant === 'primary' ? 'text-white/80' : ''}`}>
                {action.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button 
                variant={action.variant === 'primary' ? 'secondary' : 'outline'} 
                className={`w-full rounded-xl font-bold shadow-sm transition-all duration-300 text-xs h-9 ${action.variant === 'primary' ? 'hover:bg-white hover:scale-[1.02]' : 'hover:bg-emerald-500 hover:text-white'}`}
              >
                {action.cta}
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
