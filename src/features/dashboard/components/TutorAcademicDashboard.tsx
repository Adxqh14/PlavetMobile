// Componente para el Dashboard del Tutor Académico
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import {
  GraduationCap,
  ClipboardCheck,
  AlertCircle,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Search,
  UserCheck,
  BookOpen,
  Building2
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const performanceData = [
  { month: "Ene", promedio: 75, completado: 10 },
  { month: "Feb", promedio: 82, completado: 15 },
  { month: "Mar", promedio: 78, completado: 22 },
  { month: "Abr", promedio: 85, completado: 30 },
]

const managedTaller = {
  id: "desarrollo-web",
  nombre: "Desarrollo Web",
  ubicacion: "Laboratorio 3 - Planta Alta"
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
    pendientes: 5, // Mock value for tasks
    promedio: Math.round(students.reduce((acc, s) => acc + s.progreso, 0) / students.length),
    finalizados: students.filter(s => s.progreso === 100).length
  }), [students]);

  const recentActivities = [
    {
      id: 1,
      title: "Nueva Evaluación",
      description: `${students[0].name} ha completado su primera fase.`,
      time: "Hace 10 min",
      icon: ClipboardCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      id: 2,
      title: "Excusa Recibida",
      description: `${students[1].name} envió una excusa por falta médica.`,
      time: "Hace 2 horas",
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      id: 3,
      title: "Documento Pendiente",
      description: `${students[3].name} requiere validación de convenio.`,
      time: "Ayer",
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ]

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header con gradiente premium y diseño más limpio */}
      <div id="tour-welcome" className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600/10 via-indigo-600/5 to-transparent p-8 border border-indigo-500/10 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl rotate-3">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Gestión Académica</p>
                <h1 className="text-3xl font-black tracking-tight text-foreground">{managedTaller.nombre}</h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed font-medium">
              Panel de control para el seguimiento de pasantías y validación de competencias académicas.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-background/60 border border-border backdrop-blur-md shadow-sm">
              <span className="text-2xl font-black text-primary">{stats.total}</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Estudiantes</span>
            </div>
            <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-background/60 border border-border backdrop-blur-md shadow-sm">
              <span className="text-2xl font-black text-amber-600">{stats.pendientes}</span>
              <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Pendientes</span>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Columna Principal (Gráfico y Tabla) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fila de KPIs Rápidos */}
          <div id="tour-kpis" className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Promedio General", value: `${stats.promedio}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
              { title: "Completados", value: stats.finalizados.toString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-500/10" },
              { title: "Alertas", value: "2", icon: AlertCircle, color: "text-red-600", bg: "bg-red-500/10" },
            ].map((kpi, i) => (
              <Card key={i} className="border-none shadow-sm bg-card hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
                    <p className="text-xl font-black text-foreground">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de Rendimiento Expandido */}
          <Card id="tour-chart" className="border-muted/60 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-xl font-bold">Rendimiento Mensual</CardTitle>
                <CardDescription>Evolución del desempeño académico del taller</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  En Tiempo Real
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--muted-foreground)' }}
                    dy={10}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="promedio" 
                    stroke="var(--primary)" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: "var(--primary)", strokeWidth: 3, stroke: "#fff" }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabla de Estudiantes Refinada */}
          <Card className="border-muted/60 shadow-lg overflow-hidden">
            <CardHeader className="border-b bg-muted/30 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Listado de Seguimiento</CardTitle>
                  <CardDescription>Progreso detallado por estudiante</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold h-9">
                    <Search className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/10">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Estudiante</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Empresa</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progreso</th>
                      <th className="px-6 py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {students.map((est) => (
                      <tr key={est.id} className="hover:bg-muted/20 transition-all group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-xs border border-primary/10 group-hover:scale-110 transition-transform">
                              {est.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="font-bold text-sm text-foreground">{est.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{est.empresa}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-full max-w-[120px] space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-black ${est.progreso === 100 ? 'text-emerald-600' : 'text-primary'}`}>{est.progreso}%</span>
                              {est.progreso === 100 && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-px">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 shadow-xs ${est.progreso === 100 ? 'bg-emerald-500' : 'bg-linear-to-r from-primary to-primary/60'}`} 
                                style={{ width: `${est.progreso}%` }} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="rounded-lg font-bold h-8 text-[10px] uppercase tracking-tighter"
                              onClick={() => {
                                setStudents(prev => prev.map(s => 
                                  s.id === est.id ? { ...s, progreso: Math.min(100, s.progreso + 5) } : s
                                ))
                              }}
                            >
                              Validar +5%
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral (Actividad y Acciones) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel de Acciones Rápidas */}
          <Card className="border-none bg-primary shadow-xl shadow-primary/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <GraduationCap className="h-32 w-32" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-primary-foreground text-xl font-black">Acciones Rápidas</CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium">Tareas de gestión académica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Button variant="secondary" className="w-full rounded-2xl font-black h-12 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                Generar Reporte Mensual
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button className="w-full rounded-2xl font-black h-12 bg-white/10 hover:bg-white/20 border-white/10 text-white shadow-sm transition-all">
                Programar Visita
                <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Panel de Actividad Reciente */}
          <Card id="tour-activity" className="border-muted/60 shadow-lg overflow-hidden flex flex-col h-fit">
            <CardHeader className="pb-3 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Actividad Reciente</CardTitle>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-5 flex items-start gap-4 hover:bg-muted/30 transition-all cursor-pointer group">
                    <div className={`p-3 rounded-2xl ${act.bgColor} ${act.color} group-hover:rotate-6 transition-transform shadow-sm`}>
                      <act.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground mb-0.5">{act.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{act.description}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                        <Clock className="h-3 w-3" />
                        {act.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-muted/10">
                <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl h-10">
                  Ver Todo el Historial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card de Taller */}
          <Card className="border-muted/60 bg-muted/20 shadow-sm border-dashed">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-background border shadow-inner flex items-center justify-center mx-auto">
                <UserCheck className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Asignado a: {managedTaller.nombre}</p>
                <p className="text-xs text-muted-foreground">{managedTaller.ubicacion}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full text-[10px] font-black px-6 h-8">
                CAMBIAR TALLER
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
