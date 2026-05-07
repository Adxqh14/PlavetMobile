"use client"

import { useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import { Badge } from "../../../shared/components/ui/badge"
import { Link } from "react-router-dom"
import {
  ClipboardCheck,
  Building2,
  AlertCircle,
  Users,
  ChevronRight,
  Briefcase,
  LayoutDashboard
} from "lucide-react"

export function TutorBusinessDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState([
    { id: 1, name: "Jean Carlos Bautista", puesto: "Pasante Frontend", progreso: 65, asistencia: "98%", estado: "Presente" },
    { id: 2, name: "María Elena González", puesto: "Pasante Backend", progreso: 80, asistencia: "95%", estado: "Presente" },
    { id: 3, name: "Luis Manuel Martínez", puesto: "Soporte Técnico", progreso: 45, asistencia: "90%", estado: "Ausente" },
  ]);

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
              Tutor Empresarial · Supervisión Activa
            </div>
            <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
              Gestión de <span className="text-primary">Talento</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              ¡Bienvenido, <span className="font-bold text-foreground">{user?.username ?? "Tutor"}</span>! Supervisando el desempeño en <span className="text-primary font-bold">Tech Solutions S.A.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Columna Principal: Gestión de Pasantes */}
        <div className="lg:col-span-8">
          <Card className="border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-black text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Equipo de Pasantes
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-muted-foreground">Monitoreo de asistencia y desempeño diario.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-wider h-8 rounded-xl" asChild>
                  <Link to="/asistencias">Ver Historial Completo</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {students.map((est) => (
                  <div key={est.id} className="flex items-center justify-between px-6 py-5 hover:bg-muted/30 transition-all group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xs border shadow-sm transition-transform group-hover:scale-105 ${est.estado === 'Presente' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                        {est.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{est.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {est.puesto}
                          </p>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <p className="text-[11px] text-muted-foreground font-medium">Asistencia: <span className="font-black text-foreground">{est.asistencia}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold border-none shadow-sm ${est.estado === 'Presente' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {est.estado}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant={est.estado === 'Presente' ? 'ghost' : 'default'}
                        className={`text-[10px] h-8 px-4 font-black rounded-xl transition-all ${est.estado === 'Presente' ? 'text-rose-600 hover:bg-rose-50 border-transparent' : 'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/20'}`}
                        onClick={() => {
                          setStudents(prev => prev.map(s => 
                            s.id === est.id ? { ...s, estado: s.estado === "Presente" ? "Ausente" : "Presente" } : s
                          ))
                        }}
                      >
                        {est.estado === "Presente" ? "Reportar Falta" : "Marcar Llegada"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral: Panel de Control */}
        <div className="lg:col-span-4">
          <Card className="border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-muted/10 pb-3">
              <CardTitle className="text-xs font-black text-foreground uppercase tracking-widest">Panel de Control</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {[
                { title: "Evaluaciones Técnicas", icon: ClipboardCheck, href: "/evaluaciones", color: "text-primary" },
                { title: "Gestión de Excusas", icon: AlertCircle, href: "/excusas", color: "text-amber-600" },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start h-14 px-4 hover:bg-muted group rounded-2xl border border-transparent hover:border-border/50 transition-all shadow-sm"
                  asChild
                >
                  <Link to={action.href}>
                    <div className={`p-2 rounded-xl mr-3 bg-background border border-border group-hover:border-primary/30 shadow-sm transition-colors`}>
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <span className="flex-1 text-left text-sm font-bold">{action.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              ))}
            </CardContent>
            <div className="p-6 mt-auto">
               <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 shadow-inner">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Centro de Trabajo</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-foreground leading-tight">Tech Solutions S.A.</span>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
