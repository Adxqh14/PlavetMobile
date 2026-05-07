import { Users, UserCheck, UserX } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    activos: number;
    inactivos: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Tutores",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Activos",
      value: stats.activos,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Inactivos",
      value: stats.inactivos,
      icon: UserX,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="border bg-card hover:shadow-md transition-shadow min-w-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color.includes('blue') ? 'text-foreground' : card.color}`}>{card.value}</p>
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
