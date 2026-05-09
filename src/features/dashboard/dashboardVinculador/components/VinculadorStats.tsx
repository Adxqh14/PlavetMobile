import { Building2, UserPlus, Users, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface VinculadorStatsProps {
  stats: {
    convenios: number
    plazas_libres: number
    por_asignar: number
    alertas: number
  } | null
  loading: boolean
}

export function VinculadorStats({ stats, loading }: VinculadorStatsProps) {
  const kpis = [
    { title: "Convenios", value: stats ? String(stats.convenios) : "—", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
    { title: "Plazas Libres", value: stats ? String(stats.plazas_libres) : "—", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { title: "Por Asignar", value: stats ? String(stats.por_asignar) : "—", icon: Users, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    { title: "Alertas", value: stats ? String(stats.alertas) : "—", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-500/10" },
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
