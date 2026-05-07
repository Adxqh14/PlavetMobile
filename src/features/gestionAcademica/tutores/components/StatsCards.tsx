"use client";

import { Card, CardContent } from "../../../../shared/components/ui/card";
import { Users, CheckCircle, UserX, AlertCircle } from "lucide-react";

interface TutorStats {
  total: number;
  activos: number;
  pendientes: number;
  inhabilitados: number;
}

export const StatsCards = ({ stats }: { stats: TutorStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total */}
      <Card className="border bg-card hover:shadow-md transition-shadow min-w-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tutores</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-slate-100">
              <Users className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activos */}
      <Card className="border bg-card hover:shadow-md transition-shadow min-w-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.activos}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pendientes */}
      <Card className="border bg-card hover:shadow-md transition-shadow min-w-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendientes}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inhabilitados */}
      <Card className="border bg-card hover:shadow-md transition-shadow min-w-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inhabilitados</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.inhabilitados}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <UserX className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
