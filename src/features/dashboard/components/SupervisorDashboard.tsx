"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  BarChart3,
  Search,
  Calendar
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"

const globalPerformanceData = [
  { month: "Ene", performance: 78, attendance: 92 },
  { month: "Feb", performance: 82, attendance: 90 },
  { month: "Mar", performance: 85, attendance: 94 },
  { month: "Abr", performance: 88, attendance: 93 },
]

export function SupervisorDashboard() {
  const stats = useMemo(() => ({
    totalStudents: 156,
    activeCompanies: 42,
    successRate: "94.5%",
    criticalAlerts: 3,
    pendingDocs: 12,
  }), []);

  const criticalStudents = [
    { id: 1, name: "Lucas Ferreira", taller: "Electrónica", motivo: "Bajo Rendimiento", valor: "62%" },
    { id: 2, name: "Elena Pérez", taller: "Desarrollo Web", motivo: "Alta Inasistencia", valor: "70%" },
    { id: 3, name: "Marco Polo", taller: "Mecánica", motivo: "Documentación Vencida", valor: "2 docs" },
  ]

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Header Estilo Estudiante para Supervisor */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600/10 via-indigo-600/5 to-transparent p-8 border border-blue-500/10 shadow-xs">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">Modo Observación y Supervisión</p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Dashboard de Supervisión 👋
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Vista panorámica del sistema Plavet. Monitorea el rendimiento global, 
            detecta anomalías y supervisa el éxito de los programas académicos.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Lectura Global: Activada
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border backdrop-blur-sm shadow-sm text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Periodo Académico Actual
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* KPIs Globales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Estudiantes", value: stats.totalStudents.toString(), desc: "En programas activos", icon: Users, color: "text-blue-600", borderColor: "bg-blue-500" },
          { title: "Empresas Aliadas", value: stats.activeCompanies.toString(), desc: "Centros de trabajo", icon: Building2, color: "text-emerald-600", borderColor: "bg-emerald-500" },
          { title: "Tasa de Éxito", value: stats.successRate, desc: "Promedio aprobación", icon: TrendingUp, color: "text-purple-600", borderColor: "bg-purple-500" },
          { title: "Alertas Críticas", value: stats.criticalAlerts.toString(), desc: "Requieren atención", icon: AlertCircle, color: "text-red-600", borderColor: "bg-red-500" },
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
        {/* Gráfico de Tendencia Global */}
        <Card className="md:col-span-4 overflow-hidden border-muted/60 shadow-lg bg-card">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Tendencia de Rendimiento Global</CardTitle>
                <CardDescription>Evolución de notas y asistencia promedio del sistema.</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={globalPerformanceData}>
                  <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPerf)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={0}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex justify-center gap-8">
               <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="h-2 w-6 rounded-full bg-primary" />
                  Rendimiento Académico
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="h-2 w-6 rounded-full bg-emerald-500" />
                  Asistencia Promedio
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas de Supervisión */}
        <Card className="md:col-span-3 border-muted/60 shadow-lg bg-card">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Casos a Revisar</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <CardDescription>Estudiantes detectados por el sistema de alertas.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 max-h-[400px] overflow-y-auto">
            <div className="divide-y divide-border">
              {criticalStudents.map((student) => (
                <div key={student.id} className="p-5 hover:bg-muted/30 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-black text-xs border border-red-500/20 group-hover:scale-110 transition-transform">
                       {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{student.name}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{student.taller}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-red-600 uppercase mb-1">{student.motivo}</p>
                    <p className="text-sm font-black text-foreground">{student.valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 bg-muted/10 border-t">
            <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-xl h-10 uppercase tracking-widest">
              Ver Reporte de Alertas Completo
            </Button>
          </div>
        </Card>
      </div>

      {/* Acciones de Observador */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Reportes Consolidados", desc: "Genera estadísticas globales de todos los talleres y empresas.", icon: FileText, cta: "Explorar Datos", variant: "primary" },
          { title: "Búsqueda Avanzada", desc: "Encuentra cualquier estudiante, tutor o centro en el sistema.", icon: Search, cta: "Buscar Ahora", variant: "outline" },
          { title: "Directorio Global", desc: "Visualiza la red completa de centros y contactos de Plavet.", icon: Building2, cta: "Ver Directorio", variant: "outline" },
        ].map((action, i) => (
          <Card key={i} className={`relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300 shadow-md ${action.variant === 'primary' ? 'bg-blue-600 text-white border-none' : ''}`}>
            <CardHeader className="pb-2">
              <div className={`h-10 w-10 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${action.variant === 'primary' ? 'bg-white/20' : 'bg-blue-500/10 text-blue-600'}`}>
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
                className={`w-full rounded-xl font-bold shadow-sm transition-all duration-300 text-xs h-9 ${action.variant === 'primary' ? 'hover:bg-white hover:scale-[1.02]' : 'hover:bg-blue-600 hover:text-white'}`}
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
