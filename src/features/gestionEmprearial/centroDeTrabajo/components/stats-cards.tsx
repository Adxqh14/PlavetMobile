import { Card, CardContent } from "../../../../shared/components/ui/card"
import { Building2, CheckCircle2, AlertCircle, Archive } from "lucide-react"
import type { CentroStats } from "../types"

interface Props {
  stats: CentroStats;
}

export function StatsCards({ stats }: Props) {
  const statsData = [
    {
      title: "Centros Activos",
      value: stats.activos.toString(),
      icon: Building2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Validados",
      value: stats.validados.toString(),
      icon: CheckCircle2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pendientes",
      value: stats.pendientes.toString(),
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Archivados",
      value: stats.archivados.toString(),
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border bg-card hover:shadow-md transition-shadow min-w-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.title.includes('Activos') ? 'text-foreground' : stat.color}`}>{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
