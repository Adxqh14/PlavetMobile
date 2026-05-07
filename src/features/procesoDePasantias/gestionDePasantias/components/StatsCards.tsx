"use client";

import { Card, CardContent } from "../../../../shared/components/ui/card";
import { Briefcase, CheckCircle, GraduationCap, Clock, XCircle } from "lucide-react";
import type { PasantiaStats } from "../types";

export const StatsCards = ({ stats }: { stats: PasantiaStats }) => {
  const cards = [
    {
      title: "Total Pasantías",
      value: stats.total,
      icon: Briefcase,
      color: "text-foreground",
      bg: "bg-slate-100",
    },
    {
      title: "Pasantías Activas",
      value: stats.activas,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Pasantías Completadas",
      value: stats.completadas,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Pasantías Pendientes",
      value: stats.pendientes,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Pasantías Suspendidas",
      value: stats.suspendidas,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
