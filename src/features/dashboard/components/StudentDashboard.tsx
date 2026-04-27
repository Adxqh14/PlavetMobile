"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
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
} from "lucide-react"

const studentActivities = [
  {
    id: 1,
    title: "Documento aprobado",
    description: "Tu 'Formulario de Inscripción' ha sido validado.",
    time: "Hace 2 horas",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 2,
    title: "Nueva calificación",
    description: "Se ha publicado la nota de 'Desempeño Técnico'.",
    time: "Hace 5 horas",
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    title: "Excusa pendiente",
    description: "Tu excusa del 12/04 está esperando revisión.",
    time: "Ayer",
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
]

export function StudentDashboard() {
  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Header con gradiente sutil */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10 shadow-xs">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            ¡Hola, Estudiante! 👋
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
        {[
          { title: "Estado Pasantía", value: "Activa", desc: "Tech Solutions S.A.", icon: Briefcase, color: "text-blue-600", borderColor: "border-blue-500", bg: "bg-blue-500/5" },
          { title: "Documentos", value: "85%", desc: "11 de 13 completados", icon: FileText, color: "text-emerald-600", borderColor: "border-emerald-500", bg: "bg-emerald-500/5" },
          { title: "Calificación Promedio", value: "92/100", desc: "4 evaluaciones", icon: TrendingUp, color: "text-purple-600", borderColor: "border-purple-500", bg: "bg-purple-500/5" },
          { title: "Excusas", value: "2", desc: "1 aprobada, 1 pendiente", icon: AlertCircle, color: "text-amber-600", borderColor: "border-amber-500", bg: "bg-amber-500/5" },
        ].map((kpi, i) => (
          <Card key={i} className={`overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group ${kpi.bg}`}>
            <div className={`h-1 w-full ${kpi.borderColor.replace('border-', 'bg-')}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-background shadow-sm transition-transform group-hover:scale-110 duration-300`}>
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
                <img src="/api/placeholder/64/64" alt="Company logo" className="w-10 h-10 object-contain opacity-50" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-2xl text-foreground">Tech Solutions S.A.</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  Av. Winston Churchill #123, Santo Domingo
                </div>
              </div>
              <Button variant="outline" className="rounded-full px-6 shadow-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300">
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
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {studentActivities.map((activity) => (
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
              ))}
            </div>
            <div className="p-4 bg-muted/10">
              <Button variant="ghost" className="w-full text-sm font-bold text-primary hover:bg-primary/5 transition-all duration-300 rounded-xl" size="sm">
                Ver todo el historial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Pasos / Acciones Rápidas */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { 
            title: "Subir Documentos", 
            desc: "Aún faltan 2 documentos obligatorios por subir para completar tu expediente.", 
            icon: FileText, 
            href: "/subir", 
            variant: "primary",
            cta: "Ir a Documentación" 
          },
          { 
            title: "Enviar Excusa", 
            desc: "¿Faltaste a tu pasantía? Registra tu excusa con soporte médico o institucional aquí.", 
            icon: AlertCircle, 
            href: "/excusas", 
            variant: "outline",
            cta: "Gestionar Excusas" 
          },
          { 
            title: "Ver Calificaciones", 
            desc: "Revisa tu progreso académico detallado y los comentarios de tus evaluadores.", 
            icon: GraduationCap, 
            href: "/mis-calificaciones", 
            variant: "outline",
            cta: "Ver Notas" 
          }
        ].map((action, i) => (
          <Card key={i} className={`relative overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-md ${action.variant === 'primary' ? 'bg-primary text-primary-foreground border-none' : ''}`}>
            <CardHeader className="pb-2">
              <div className={`h-12 w-12 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${action.variant === 'primary' ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">{action.title}</CardTitle>
              <CardDescription className={action.variant === 'primary' ? 'text-primary-foreground/80' : ''}>
                {action.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Button 
                variant={action.variant === 'primary' ? 'secondary' : 'outline'} 
                className={`w-full rounded-xl font-bold shadow-sm transition-all duration-300 ${action.variant === 'primary' ? 'hover:bg-white hover:scale-[1.02]' : 'hover:bg-primary hover:text-primary-foreground'}`} 
                asChild
              >
                <a href={action.href}>
                  {action.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
            {action.variant === 'primary' && (
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <action.icon className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
