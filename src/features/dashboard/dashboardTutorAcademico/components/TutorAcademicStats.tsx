import { Users, TrendingUp, AlertTriangle, UserCheck, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface TutorAcademicStatsProps {
  stats: {
    total_estudiantes: number
    en_proceso: number
    en_riesgo: number
    finalizados: number
  } | null
  loading: boolean
}

export function TutorAcademicStats({ stats, loading }: TutorAcademicStatsProps) {
  const kpis = [
    { title: "Total Estudiantes", value: stats ? String(stats.total_estudiantes) : "—", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "En Proceso", value: stats ? String(stats.en_proceso) : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "En Riesgo", value: stats ? String(stats.en_riesgo) : "—", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
    { title: "Finalizados", value: stats ? String(stats.finalizados) : "—", icon: UserCheck, color: "text-primary", bg: "bg-primary/10" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.title}</p>
              <p className="text-2xl font-black text-foreground">
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : kpi.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${kpi.bg} group-hover:scale-110 transition-transform`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
