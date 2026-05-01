"use client"

import { useMemo } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import {
  Users,
  Building2,
  Handshake,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Link as LinkIcon,
  FileCheck,
  MapPin,
  ChevronRight
} from "lucide-react"

export function VinculadorDashboard() {
  const { user } = useAuth()
  const stats = useMemo(() => ({
    activeAgreements: 24,
    availablePlazas: 85,
    studentsToAssign: 12,
    pendingValidations: 4,
  }), []);

  const pendingLinks = [
    { id: 1, student: "Roberto Gómez", taller: "Electrónica", empresa: "TechCorp", estado: "Validando Doc" },
    { id: 2, student: "Sofía Martínez", taller: "Desarrollo Web", empresa: "Innovatech", estado: "Pendiente Firma" },
    { id: 3, student: "Carlos Ruiz", taller: "Mecánica", empresa: "Logis RD", estado: "Entrevista" },
  ]

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Header Estilo Estudiante para Vinculador */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-600/10 via-purple-600/5 to-transparent p-8 border border-purple-500/10 shadow-xs">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Handshake className="h-5 w-5 text-purple-600" />
            <p className="text-xs font-black uppercase tracking-widest text-purple-600">Gestión de Vinculación y Convenios</p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            ¡Hola, {user?.name ?? 'Vinculador'}! 👋
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Conecta el talento con las mejores oportunidades. Gestiona convenios empresariales, 
            asigna plazas y valida centros de trabajo de manera eficiente.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button className="rounded-full px-6 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all font-bold">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Convenio
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              Conexiones Activas: {stats.activeAgreements}
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* KPIs de Vinculación */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Convenios", value: stats.activeAgreements.toString(), desc: "Empresas aliadas", icon: Building2, color: "text-blue-600", borderColor: "bg-blue-500" },
          { title: "Plazas Libres", value: stats.availablePlazas.toString(), desc: "Cupos disponibles", icon: UserPlus, color: "text-emerald-600", borderColor: "bg-emerald-500" },
          { title: "Por Asignar", value: stats.studentsToAssign.toString(), desc: "Estudiantes en espera", icon: Users, color: "text-purple-600", borderColor: "bg-purple-500" },
          { title: "Pendientes", value: stats.pendingValidations.toString(), desc: "Centros por validar", icon: AlertCircle, color: "text-amber-600", borderColor: "bg-amber-500" },
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
        {/* Seguimiento de Vinculaciones en Curso */}
        <Card className="md:col-span-4 overflow-hidden border-muted/60 shadow-lg bg-card">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Vinculaciones en Curso</CardTitle>
                <CardDescription>Procesos de asignación y firmas de convenios.</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pendingLinks.map((link) => (
                <div key={link.id} className="p-5 hover:bg-muted/30 transition-all group flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-500/20 group-hover:rotate-6 transition-all">
                        {link.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{link.student}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{link.taller}</span>
                           <ArrowRight className="h-2 w-2 text-muted-foreground/50" />
                           <span className="text-[10px] font-bold text-primary uppercase">{link.empresa}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                         <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                            {link.estado}
                         </span>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 hover:bg-muted transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 bg-muted/10 border-t">
            <Button variant="ghost" className="w-full text-xs font-bold text-purple-600 hover:bg-purple-50 transition-all duration-300 rounded-xl h-10 uppercase tracking-widest">
              Gestionar Todas las Vinculaciones
            </Button>
          </div>
        </Card>

        {/* Acciones Rápidas / Próximos Pasos */}
        <div className="md:col-span-3 space-y-6">
           <Card className="border-muted/60 shadow-lg bg-card overflow-hidden">
              <CardHeader className="bg-purple-600 text-white">
                 <CardTitle className="text-lg">Validaciones Pendientes</CardTitle>
                 <CardDescription className="text-purple-100">4 Centros de Trabajo requieren visita.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                 {[
                   { name: "Logis RD", loc: "Haina, San Cristóbal", icon: MapPin },
                   { name: "AgroTech S.A.", loc: "La Vega, RD", icon: MapPin },
                 ].map((center, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20 hover:border-purple-500/50 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform">
                            <center.icon className="h-4 w-4 text-purple-600" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-foreground">{center.name}</p>
                            <p className="text-[10px] text-muted-foreground">{center.loc}</p>
                         </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors" />
                   </div>
                 ))}
                 <Button variant="outline" className="w-full rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50 font-bold h-10 mt-2">
                    Ver Mapa de Centros
                 </Button>
              </CardContent>
           </Card>

           <Card className="border-none bg-zinc-900 text-white shadow-xl">
              <CardHeader className="pb-2">
                 <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center mb-3">
                    <FileCheck className="h-5 w-5 text-white" />
                 </div>
                 <CardTitle className="text-lg font-bold">Documentación Legal</CardTitle>
                 <CardDescription className="text-zinc-400">Revisa los contratos y pólizas de seguro.</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                 <Button className="w-full rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 font-bold h-10">
                    Ir a Repositorio
                    <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
