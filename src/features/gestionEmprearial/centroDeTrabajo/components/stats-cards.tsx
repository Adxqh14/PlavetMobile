import { Card } from "../../../../shared/components/ui/card"
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
      description: "En operación",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Validados",
      value: stats.validados.toString(),
      icon: CheckCircle2,
      description: "Empresas verificadas",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pendientes",
      value: stats.pendientes.toString(),
      icon: AlertCircle,
      description: "Requieren validación",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Archivados",
      value: stats.archivados.toString(),
      icon: Archive,
      description: "Inactivos o eliminados",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
