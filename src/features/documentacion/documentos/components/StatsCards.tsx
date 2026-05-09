import { FileText, FileCheck, FileClock, FileX } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    pendientes: number;
    aprobados: number;
    rechazados: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Documentos",
      value: stats.total,
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: FileClock,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
    {
      title: "Validados",
      value: stats.aprobados,
      icon: FileCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Rechazados",
      value: stats.rechazados,
      icon: FileX,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="border-none bg-muted/30 shadow-none rounded-2xl group hover:bg-primary/5 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{card.title}</p>
              <p className="text-2xl font-black text-foreground">
                {card.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${card.bg} group-hover:scale-110 transition-transform`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
