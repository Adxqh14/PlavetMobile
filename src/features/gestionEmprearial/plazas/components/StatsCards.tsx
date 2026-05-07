"use client";

import { Card, CardContent } from "../../../../shared/components/ui/card";
import { Briefcase, CheckCircle, User, XCircle } from "lucide-react";
import type { PlazaStats } from "../types";

export const StatsCards = ({ stats }: { stats: PlazaStats }) => {
  const statsData = [
    {
      title: "Total Plazas",
      value: stats.total.toString(),
      icon: Briefcase,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    {
      title: "Activas",
      value: stats.activas.toString(),
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Ocupadas",
      value: stats.ocupadas.toString(),
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Inhabilitadas",
      value: stats.inhabilitada.toString(),
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow border rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
