"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import {
  GraduationCap,
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Building2,
  ChevronRight,
  FileText,
  Users
} from "lucide-react"

const managedTaller = {
  id: "desarrollo-web",
  nombre: "Desarrollo Web",
  ubicacion: "Laboratorio 3 - Planta Alta"
}

const academicMilestones = {
  // 1: Completado, 2: Pendiente, 3: Alerta
  1: 1, 2: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
  12: 1, 13: 1, 14: 1, 15: 1, 16: 1,
  19: 1, 20: 1, 21: 2, 22: 1, 23: 1, 
  26: 1, 27: 1, 28: 1, 29: 3, 30: 1, 
}

function AcademicCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  
  return (
    <Card className="border-muted/60 shadow-lg overflow-hidden h-full">
      <CardHeader className="pb-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Hitos Académicos</CardTitle>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>Seguimiento Abril 2026</CardDescription>
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
            const status = academicMilestones[day as keyof typeof academicMilestones]
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
            Revisiones al Día
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-amber-500/40" />
            Pendiente Validación
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <div className="h-2 w-2 rounded-full bg-red-500/40" />
            Alerta de Retraso
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TutorAcademicDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: "Jean Carlos Bautista", empresa: "TechCorp Software", progreso: 65, estado: "En Proceso" },
    { id: 2, name: "María Elena González", empresa: "Innovatech Solutions", progreso: 80, estado: "En Proceso" },
    { id: 3, name: "Luis Manuel Martínez", empresa: "Web Systems Ltd", progreso: 100, estado: "Finalizado" },
    { id: 4, name: "Ana Karina López", empresa: "CodeFlow Agency", progreso: 45, estado: "En Proceso" },
  ]);

  const stats = useMemo(() => ({
    total: students.length,
    pendientes: 5,
    promedio: Math.round(students.reduce((acc, s) => acc + s.progreso, 0) / students.length),
    finalizados: students.filter(s => s.progreso === 100).length
  }), [students]);

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Header idéntico al de Estudiantes */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10 shadow-xs">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            ¡Hola, Tutor! 👋
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Bienvenido a tu portal de gestión académica. Supervisa el progreso de tus estudiantes 
            en el taller de <span className="text-primary font-bold">{managedTaller.nombre}</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Estado: Taller Activo
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Ubicación: {managedTaller.ubicacion}
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid de Resumen (KPIs) estilo Estudiante */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Estudiantes", value: stats.total.toString(), desc: "Inscritos en el taller", icon: Users, color: "text-blue-600", borderColor: "bg-blue-500" },
          { title: "Rendimiento", value: `${stats.promedio}%`, desc: "Promedio del grupo", icon: TrendingUp, color: "text-emerald-600", borderColor: "bg-emerald-500" },
          { title: "Finalizados", value: stats.finalizados.toString(), desc: "Pasantías completadas", icon: CheckCircle2, color: "text-purple-600", borderColor: "bg-purple-500" },
          { title: "Revisiones", value: stats.pendientes.toString(), desc: "Tareas por calificar", icon: AlertCircle, color: "text-amber-600", borderColor: "bg-amber-500" },
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
        {/* Listado de Seguimiento - Estilo "Mi Pasantía Actual" */}
        <Card className="md:col-span-4 overflow-hidden border-muted/60 shadow-lg">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Seguimiento de Estudiantes</CardTitle>
                <CardDescription>Progreso académico y validación de horas.</CardDescription>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {students.map((est) => (
                <div key={est.id} className="flex items-center justify-between p-5 hover:bg-muted/30 transition-all duration-300 group">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-xs border border-primary/10 bg-primary/5 text-primary transition-all group-hover:rotate-6">
                        {est.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{est.name}</p>
                        <p className="text-xs text-muted-foreground">{est.empresa}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="text-right mr-4 hidden sm:block">
                        <p className="text-xs font-bold text-primary">{est.progreso}%</p>
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${est.progreso}%` }} />
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl text-[10px] font-bold uppercase tracking-tight h-8 text-primary hover:bg-primary/5"
                        onClick={() => {
                          setStudents(prev => prev.map(s => 
                            s.id === est.id ? { ...s, progreso: Math.min(100, s.progreso + 5) } : s
                          ))
                        }}
                      >
                        Validar +5%
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
            <Button variant="ghost" className="w-full text-sm font-bold text-primary hover:bg-primary/5 transition-all duration-300 rounded-xl" size="sm">
              Ver reporte de rendimiento completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Calendario Académico - Derecha */}
        <div className="md:col-span-3">
          <AcademicCalendar />
        </div>
      </div>

      {/* Acciones Rápidas - Estilo Estudiante */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { title: "Generar Reporte", desc: "Obtén el resumen mensual del taller.", icon: FileText, cta: "Descargar PDF", variant: "primary" },
          { title: "Validar Excusas", desc: "Revisa las inasistencias reportadas.", icon: AlertCircle, cta: "Ir a Excusas", variant: "outline" },
          { title: "Visitas Técnicas", desc: "Programa supervisiones a las empresas.", icon: Building2, cta: "Calendario Visitas", variant: "outline" },
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
