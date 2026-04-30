"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../shared/components/ui/card"
import { Button } from "../../../shared/components/ui/button"
import {
  BarChart3,
  Users,
  Building2,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Calendar,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../shared/components/ui/chart"
import Main from "@/features/main/pages/page"
import { useTour } from "../../../shared/hooks/useTour"
import { useAuth } from "@/features/auth/hooks/useAuth"

import { StudentDashboard } from "../components/StudentDashboard"

// Sample data for charts
const performanceData = [
  { month: "Ene", estudiantes: 45, centros: 12, pasantias: 38 },
  { month: "Feb", estudiantes: 52, centros: 15, pasantias: 45 },
  { month: "Mar", estudiantes: 61, centros: 18, pasantias: 54 },
  { month: "Abr", estudiantes: 58, centros: 19, pasantias: 51 },
  { month: "May", estudiantes: 67, centros: 22, pasantias: 61 },
  { month: "Jun", estudiantes: 73, centros: 24, pasantias: 68 },
]


const recentActivity = [
  {
    id: 1,
    type: "registro",
    title: "Nuevo estudiante registrado",
    description: "María González se registró en el sistema",
    time: "Hace 5 minutos",
    icon: Users,
    color: "text-blue-500",
  },
  {
    id: 2,
    type: "aprobacion",
    title: "Pasantía aprobada",
    description: "Centro de Trabajo Tech Solutions aprobó una solicitud",
    time: "Hace 15 minutos",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    id: 3,
    type: "validacion",
    title: "Empresa validada",
    description: "Innovatech S.A. completó su proceso de validación",
    time: "Hace 1 hora",
    icon: Building2,
    color: "text-purple-500",
  },
  {
    id: 4,
    type: "alerta",
    title: "Documentación pendiente",
    description: "3 estudiantes tienen documentos por actualizar",
    time: "Hace 2 horas",
    icon: AlertCircle,
    color: "text-amber-500",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Reunión de seguimiento",
    date: "15 Dic, 2025",
    time: "10:00 AM",
    type: "meeting",
  },
  {
    id: 2,
    title: "Fecha límite de documentos",
    date: "18 Dic, 2025",
    time: "11:59 PM",
    type: "deadline",
  },
  {
    id: 3,
    title: "Evaluación trimestral",
    date: "20 Dic, 2025",
    time: "2:00 PM",
    type: "evaluation",
  },
]

export default function DashboardPage() {
  const { userRole } = useAuth();

  useTour('tutorial_visto', [
    { element: '#tour-welcome', popover: { title: 'Bienvenido', description: 'Este es el Panel de Control principal de Plavet.', side: "bottom", align: 'start' }},
    { element: '#tour-kpis', popover: { title: 'Métricas Clave', description: 'Aquí puedes ver un resumen rápido de estudiantes, centros y pasantías.', side: "right", align: 'start' }},
    { element: '#tour-chart', popover: { title: 'Tendencia de Crecimiento', description: 'Gráfico interactivo de la evolución mensual de indicadores.', side: "left", align: 'start' }},
    { element: '#tour-activity', popover: { title: 'Actividad Reciente', description: 'Últimas acciones registradas en el sistema.', side: "top", align: 'start' }},
  ], 500);

  return (
    <Main>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        
        {userRole === "ESTUDIANTE" ? (
          <StudentDashboard />
        ) : (
          <>
            <div className="mb-8" id="tour-welcome">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Bienvenido al Panel de Control
              </h1>
              <p className="text-lg text-foreground mt-2">
                Visualiza el rendimiento y la actividad clave de Plavet de un vistazo.
              </p>
            </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
          
          {/* Columna 1: Cuadros de Métricas (KPIs) - Ocupan 4/7 columnas en LG */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full" id="tour-kpis">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Estudiantes Activos</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">0</div>
                <p className="text-xs text-foreground mt-1">Total de estudiantes en Pasantías</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Centros Asociados</CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">0</div>
                <p className="text-xs text-foreground mt-1">Centros colaboradores activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Pasantías en Curso</CardTitle>
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">0</div>
                <p className="text-xs text-foreground mt-1">Estudiantes realizando pasantías</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Tasa de Éxito</CardTitle>
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">94.2%</div>
                <p className="text-xs text-foreground mt-1">Pasantías completadas exitosamente</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Columna 2: Gráfico de Crecimiento - Ocupa 3/7 columnas en LG */}
          <Card className="lg:col-span-3" id="tour-chart">
            <CardHeader>
              <CardTitle>Tendencia de Crecimiento</CardTitle>
              <CardDescription>Evolución mensual de indicadores clave</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 pt-0">
              <ChartContainer
                config={{
                  estudiantes: {
                    label: "Estudiantes",
                    color: "hsl(217 91% 60%)",
                  },
                  centros: {
                    label: "Centros",
                    color: "hsl(271 81% 56%)",
                  },
                  pasantias: {
                    label: "Pasantías",
                    color: "hsl(142 71% 45%)",
                  },
                }}
                className="h-[300px] w-full" 
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={performanceData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="hsl(var(--muted))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      className="text-xs fill--muted-foreground"
                      stroke=""
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      className="text-xs fill-foreground"
                      stroke=""
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                      width={40}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend verticalAlign="top" height={36} /> 
                    <Line
                      type="monotone"
                      dataKey="estudiantes"
                      stroke="var(--color-estudiantes)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-estudiantes)" }}
                      activeDot={{ r: 6 }}
                      name="Estudiantes"
                    />
                    <Line
                      type="monotone"
                      dataKey="centros"
                      stroke="var(--color-centros)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-centros)" }}
                      activeDot={{ r: 6 }}
                      name="Centros"
                    />
                    <Line
                      type="monotone"
                      dataKey="pasantias"
                      stroke="var(--color-pasantias)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-pasantias)" }}
                      activeDot={{ r: 6 }}
                      name="Pasantías"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* --- SECCIÓN INFERIOR: Actividad y Eventos --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2" id="tour-activity">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg/50 hover:bg/80 transition-colors cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg bg-background ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{activity.title}</p>
                      <p className="text-sm text-foreground truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-foreground" />
                        <span className="text-xs text-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Fechas importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg/50 hover:bg/80 transition-colors cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{event.title}</p>
                    <p className="text-xs text-foreground mt-1">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </div>
    </div>
    </Main>
  )
}