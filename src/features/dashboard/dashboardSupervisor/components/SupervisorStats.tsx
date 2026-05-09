import { Users, Building2, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface SupervisorStatsProps {
  stats: {
    estudiantes: number | string
    empresas: number | string
    tasa_exito: string
    alertas_count: number | string
  } | null
  loading: boolean
}

export function SupervisorStats({ stats, loading }: SupervisorStatsProps) {
  const kpis = [
    { title: "Estudiantes", value: stats?.estudiantes ?? "—", desc: "En programas activos", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Empresas", value: stats?.empresas ?? "—", desc: "Centros de trabajo", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "Tasa Éxito", value: stats?.tasa_exito ?? "—", desc: "Promedio global", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "Alertas", value: stats?.alertas_count ?? "—", desc: "Casos críticos", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((s, i) => (
        <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.title}</p>
              <p className="text-2xl font-black text-foreground">
                {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : s.value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-tight">{s.desc}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${s.bg} group-hover:scale-110 transition-transform`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
