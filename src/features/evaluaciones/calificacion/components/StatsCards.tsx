import { GraduationCap, Award, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../../../shared/components/ui/card";
import type { CalificacionStats } from "../types";

interface StatsCardsProps {
  stats: CalificacionStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Evaluaciones",
      value: stats.total,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Promedio General",
      value: stats.promedioGeneral,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Estudiantes Aprobados",
      value: stats.aprobados,
      icon: Award,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Estudiantes Reprobados",
      value: stats.reprobados,
      icon: BookOpen,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="border bg-card hover:shadow-md transition-shadow min-w-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.title.includes('Total') ? 'text-foreground' : card.color}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
