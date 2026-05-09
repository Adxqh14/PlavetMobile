import { Link } from "react-router-dom"
import { Users, ClipboardCheck, Briefcase, ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent } from "../../../../shared/components/ui/card"

interface BusinessStatsProps {
  pasantesCount: number
  evaluacionesPendientes: number
  loading: boolean
}

export function BusinessStats({ pasantesCount, evaluacionesPendientes, loading }: BusinessStatsProps) {
  const kpis = [
    { title: "Pasantes Asignados", value: loading ? null : pasantesCount, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "Evaluaciones Pendientes", value: loading ? null : evaluacionesPendientes, icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-500/10" },
    { title: "Gestión de Plazas", value: "Ver plazas", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-500/10", href: "/plaza" },
  ]

  return (
    <>
      {kpis.map((kpi, i) => (
        <Card key={i} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all h-full">
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div className="min-w-0 pr-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">{kpi.title}</p>
              {kpi.href ? (
                <Link to={kpi.href} className="text-lg font-black text-primary hover:underline flex items-center gap-1">
                  {kpi.value} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <div className="text-2xl font-black text-foreground truncate leading-none">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : kpi.value}
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${kpi.bg} group-hover:scale-110 transition-transform shrink-0`}>
              <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
