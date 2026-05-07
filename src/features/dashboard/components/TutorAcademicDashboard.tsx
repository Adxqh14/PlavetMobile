"use client"

import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Link } from "react-router-dom"
import { Badge } from "../../../shared/components/ui/badge"
import {
  Calendar,
  Building2,
  FileText,
  Users,
  Clock,
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  LayoutDashboard
} from "lucide-react"

const TALLER = {
  nombre: "Desarrollo Web",
  ubicacion: "Laboratorio 3 - Planta Alta",
  periodo: "2025–2026",
}

const GRUPO_RESUMEN = {
  total: 28,
  enProceso: 18,
  finalizados: 6,
  enRiesgo: 3,
  inactivos: 1,
  promedioProgreso: 67,
  horasPromedioValidadas: 241,
  horasRequeridas: 360,
  docsCompletados: 19,
}

interface Excusa {
  id: number
  estudiante: string
  fecha: string
  motivo: string
  diasHace: number
}

const EXCUSAS_PENDIENTES: Excusa[] = [
  { id: 1, estudiante: "Jean Carlos Bautista", fecha: "28 Abr", motivo: "Cita médica",          diasHace: 7 },
  { id: 2, estudiante: "Ana Karina López",     fecha: "29 Abr", motivo: "Problema familiar",    diasHace: 6 },
  { id: 3, estudiante: "Pedro Antonio Reyes",  fecha: "02 May", motivo: "Trámite institucional", diasHace: 3 },
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
  { id: 1, empresa: "TechCorp Software",    estudiante: "Jean Bautista",  fecha: "08 May", hora: "10:00 AM", tipo: "Presencial" },
  { id: 2, empresa: "CodeFlow Agency",      estudiante: "Ana López",      fecha: "09 May", hora: "2:00 PM",  tipo: "Presencial" },
  { id: 3, empresa: "Innovatech Solutions", estudiante: "María González",  fecha: "12 May", hora: "11:00 AM", tipo: "Virtual"    },
]

export function TutorAcademicDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">

      {/* Hero Section - Estilo Estudiante Premium */}
      <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
        <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
          <LayoutDashboard className="w-80 h-80 text-primary -rotate-12" />
        </div>
        <div className="w-full relative px-6 md:px-12 z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Tutor Académico · Taller Activo
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Gestión <span className="text-primary">Académica</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Bienvenido, <span className="font-bold text-foreground">{user?.username ?? "Tutor"}</span>. Supervisando el taller de <span className="text-primary font-bold">{TALLER.nombre}</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="grid gap-8">
          {/* Resumen del Grupo */}
          <Card className="border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Resumen del Grupo — {GRUPO_RESUMEN.total} Estudiantes
                </CardTitle>
                <Button size="sm" className="rounded-xl font-bold h-9 shadow-sm" asChild>
                  <Link to="/estudiantes">
                    Gestionar Taller
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Distribución por estado */}
                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Distribución Operativa</p>
                  <div className="space-y-4">
                    {[
                      { label: "En Proceso", value: GRUPO_RESUMEN.enProceso,  total: GRUPO_RESUMEN.total, color: "bg-primary",      text: "text-primary"      },
                      { label: "Finalizados",value: GRUPO_RESUMEN.finalizados, total: GRUPO_RESUMEN.total, color: "bg-emerald-500",  text: "text-emerald-600"  },
                      { label: "En Riesgo",  value: GRUPO_RESUMEN.enRiesgo,   total: GRUPO_RESUMEN.total, color: "bg-rose-500",     text: "text-rose-600"      },
                      { label: "Inactivos",  value: GRUPO_RESUMEN.inactivos,  total: GRUPO_RESUMEN.total, color: "bg-muted-foreground/40", text: "text-muted-foreground" },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-24 shrink-0">{row.label}</span>
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${row.color} transition-all`}
                            style={{ width: `${Math.round((row.value / row.total) * 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-black w-8 text-right ${row.text}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas y Barra de Horas */}
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: `${GRUPO_RESUMEN.promedioProgreso}%`, label: "Progreso", color: "text-primary" },
                      { val: `${GRUPO_RESUMEN.horasPromedioValidadas}h`, label: "Horas", color: "text-emerald-600" },
                      { val: GRUPO_RESUMEN.docsCompletados, label: "Documentos", color: "text-indigo-600" }
                    ].map((m, i) => (
                      <div key={i} className="p-4 rounded-2xl border bg-muted/30 text-center shadow-inner">
                        <p className={`text-xl font-black ${m.color}`}>{m.val}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tight">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Progreso de Horas Institucional</p>
                      <p className="text-sm font-black text-primary">{GRUPO_RESUMEN.horasPromedioValidadas} <span className="text-muted-foreground font-medium">/ {GRUPO_RESUMEN.horasRequeridas}h</span></p>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full shadow-lg"
                        style={{ width: `${Math.round((GRUPO_RESUMEN.horasPromedioValidadas / GRUPO_RESUMEN.horasRequeridas) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección inferior: 3 Columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Acciones Rápidas */}
            <Card className="border bg-card shadow-sm h-full flex flex-col rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-muted/10 pb-3">
                <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid gap-3 flex-1">
                {[
                  { title: "Gestión Académica",  icon: BookOpen,      href: "/estudiantes", color: "text-primary" },
                  { title: "Revisar Excusas",    icon: ClipboardCheck,href: "/excusas", color: "text-amber-600" },
                  { title: "Mis Reportes",       icon: FileText,      href: "/reportes", color: "text-indigo-600" },
                  { title: "Calendario Visitas", icon: Calendar,      href: "/visitas", color: "text-rose-600" },
                ].map((action, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start h-14 px-4 hover:bg-muted group rounded-2xl border border-transparent hover:border-border/50 transition-all shadow-sm"
                    asChild
                  >
                    <Link to={action.href}>
                      <div className="p-2 rounded-xl mr-3 bg-background border border-border group-hover:border-primary/30 shadow-sm transition-colors">
                        <action.icon className={`h-4 w-4 ${action.color}`} />
                      </div>
                      <span className="text-sm font-bold text-foreground">{action.title}</span>
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Excusas Pendientes */}
            <Card className="border bg-card shadow-sm h-full flex flex-col rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-muted/10 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-amber-500" />
                    Validación Pendiente
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[10px] px-2 py-0.5 rounded-lg">
                    {EXCUSAS_PENDIENTES.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-auto">
                <div className="divide-y divide-border/50">
                  {EXCUSAS_PENDIENTES.map(excusa => (
                    <div key={excusa.id} className="flex items-start justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{excusa.estudiante}</p>
                        <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">{excusa.motivo}</p>
                        <p className="text-[10px] text-muted-foreground/60 font-bold mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {excusa.fecha}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="text-[10px] font-black h-8 px-3 rounded-xl shrink-0 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        Revisar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Próximas Visitas */}
            <Card className="border bg-card shadow-sm h-full flex flex-col rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-muted/10 pb-3">
                <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Próximas Visitas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-auto">
                <div className="divide-y divide-border/50">
                  {PROXIMAS_VISITAS.map(visita => (
                    <div key={visita.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-all group">
                      <div className="h-10 w-10 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all">
                        <span className="text-[9px] font-black text-primary uppercase group-hover:text-white">{visita.fecha.split(" ")[1]}</span>
                        <span className="text-base font-black text-primary leading-none group-hover:text-white">{visita.fecha.split(" ")[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{visita.empresa}</p>
                        <p className="text-[11px] text-muted-foreground font-medium truncate">{visita.estudiante}</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0 shadow-sm ${visita.tipo === "Virtual" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
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
    </div>
  )
}
