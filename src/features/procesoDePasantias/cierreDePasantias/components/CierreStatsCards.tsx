"use client";

import { Card, CardContent } from "../../../../shared/components/ui/card";
import { RotateCcw, Clock, CheckCircle } from "lucide-react";
import type { CierreStats } from "../types";

export const CierreStatsCards = ({ stats }: { stats: CierreStats }) => {
  const cards = [
    {
      title: "Total Procesos",
      value: stats.total,
      icon: RotateCcw,
      color: "text-foreground",
      bg: "bg-slate-100",
    },
    {
      title: "Cierres Pendientes",
      value: stats.pendientes,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "En Proceso",
      value: stats.enProceso,
      icon: RotateCcw,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Cierres Completados",
      value: stats.completados,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
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
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
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
};
