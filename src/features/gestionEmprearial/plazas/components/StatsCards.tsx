"use client";

import { Card, CardContent } from "../../../../shared/components/ui/card";
import { Briefcase, CheckCircle, User, XCircle } from "lucide-react";
import type { PlazaStats } from "../types";

export const StatsCards = ({ stats }: { stats: PlazaStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total */}
      <Card className="border bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Plazas</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-slate-100">
              <Briefcase className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activas */}
      <Card className="border bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activas</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.activas}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ocupadas */}
      <Card className="border bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ocupadas</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.ocupadas}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inhabilitadas */}
      <Card className="border bg-card hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inhabilitadas</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.inhabilitada}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <XCircle className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
