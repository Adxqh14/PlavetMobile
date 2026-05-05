"use client"

import { useState, useMemo } from "react"
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
  Briefcase
} from "lucide-react"

export function TutorBusinessDashboard() {
  const { user } = useAuth()
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
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      
      {/* --- Header Seccion --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Tutor Empresarial · Supervisión Activa
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            ¡Bienvenido, {user?.name ?? "Tutor"}! 
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Supervisando el desempeño en <span className="font-semibold text-foreground">Tech Solutions S.A.</span> Tienes {stats.evaluaciones} evaluaciones pendientes para esta semana.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Centro de Trabajo</p>
          <div className="flex items-center gap-2 text-sm font-semibold bg-muted px-3 py-1.5 rounded-md border border-border/50">
            <Building2 className="h-4 w-4 text-primary" />
            Tech Solutions S.A.
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Principal: Gestion de Pasantes (Hero Card) */}
        <div className="lg:col-span-8">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Equipo de Pasantes
                  </CardTitle>
                  <CardDescription className="text-xs">Monitoreo de asistencia y desempeño diario.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-wider h-8" asChild>
                  <Link to="/asistencias">Ver Historial</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {students.map((est) => (
                  <div key={est.id} className="flex items-center justify-between px-6 py-5 hover:bg-muted/20 transition-all group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xs border shadow-sm transition-transform group-hover:scale-105 ${est.estado === 'Presente' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                        {est.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{est.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {est.puesto}
                          </p>
                          <span className="h-1 w-1 rounded-full bg-border" />
                          <p className="text-[11px] text-muted-foreground">Asistencia: <span className="font-bold text-foreground">{est.asistencia}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border-none ${est.estado === 'Presente' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                        {est.estado}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant={est.estado === 'Presente' ? 'ghost' : 'default'}
                        className={`text-[10px] h-8 px-4 font-bold rounded-lg transition-all ${est.estado === 'Presente' ? 'text-red-500 hover:bg-red-50 border-transparent hover:border-red-100' : 'bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/20'}`}
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

        {/* Columna Lateral: Acciones */}
        <div className="lg:col-span-4">
          {/* Acciones Rápidas */}
          <Card className="border border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 pb-3 bg-muted/30">
              <CardTitle className="text-[11px] font-bold text-foreground uppercase tracking-widest">Panel de Control</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {[
                { title: "Evaluaciones Técnicas", icon: ClipboardCheck, href: "/evaluaciones", color: "text-primary" },
                { title: "Gestión de Excusas", icon: AlertCircle, href: "/excusas", color: "text-amber-600" },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start font-medium text-sm h-12 px-3 hover:bg-muted group rounded-xl border border-transparent hover:border-border/50 transition-all"
                  asChild
                >
                  <Link to={action.href}>
                    <div className={`p-1.5 rounded-lg mr-3 bg-background border border-border group-hover:border-primary/30 shadow-xs transition-colors`}>
                      <action.icon className={`h-4 w-4 ${action.color}`} />
                    </div>
                    <span className="flex-1 text-left text-sm font-semibold">{action.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
