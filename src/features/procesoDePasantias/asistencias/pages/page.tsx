"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import Main from '../../../main/pages/page'
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAsistencias } from "../hooks/useAsistencias"
import { ASISTENCIAS_MODULE_CONFIG } from "@/shared/config/rbac"
import type { Asistencia } from "../types"
import { AsistenciasHero } from "../components/AsistenciasHero"
import { AsistenciasActionBar } from "../components/AsistenciasActionBar"
import { AsistenciasFilters } from "../components/AsistenciasFilters"

const AsistenciasTable = lazy(() => import("../components/AsistenciasTable").then((mod) => ({ default: mod.AsistenciasTable })));
const AsistenciaFormDialog = lazy(() => import("../components/AsistenciaFormDialog").then((mod) => ({ default: mod.AsistenciaFormDialog })));
const AsistenciaDetailsDialog = lazy(() => import("../components/AsistenciaDetailsDialog").then((mod) => ({ default: mod.AsistenciaDetailsDialog })));

export default function AsistenciasPage() {
  const { userRole, user } = useAuth();
  const centroTrabajoId = userRole === "TUTOR EMPRESARIAL"
    ? user?.datos_rol?.centro_trabajo?.id
    : undefined;
    
  const {
    asistencias,
    isLoading,
    error,
    filters,
    setFilters,
    addAsistencia,
  } = useAsistencias();

  const [selectedAsistencia, setSelectedAsistencia] = useState<Asistencia | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const config = ASISTENCIAS_MODULE_CONFIG[userRole || 'ESTUDIANTE'];

  const handleView = (asistencia: Asistencia) => {
    setSelectedAsistencia(asistencia);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Estudiante', 'Empresa', 'Fecha', 'Entrada', 'Salida', 'Horas', 'Asistencia'],
      ...asistencias.map(a => [
        a.id,
        a.estudiante ? `${a.estudiante.nombre} ${a.estudiante.apellido}` : '',
        a.centro_trabajo?.nombre ?? '',
        String(a.fecha).slice(0, 10),
        String(a.hora_entrada ?? '').slice(0, 5),
        String(a.hora_salida ?? '').slice(0, 5),
        String(a.horas ?? ''),
        a.asistencia ? 'Presente' : 'Ausente',
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `asistencias_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <AsistenciasHero userRole={userRole} userTaller={user?.taller} />

        <div className="w-full pb-12 px-6 md:px-12">
          <AsistenciasActionBar 
            onExport={handleExport}
            canCreate={config.permissions.can_create}
            onOpenForm={() => setIsFormOpen(true)}
          />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              {error}
            </div>
          )}

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <AsistenciasFilters 
                filters={filters}
                onFiltersChange={setFilters}
              />
            </CardHeader>

            <CardContent className="p-6">
              {!isLoading && asistencias.length > 0 && (
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  Mostrando {asistencias.length} de {asistencias.length} registros
                  <span className="mx-2 opacity-30">|</span>
                  Página 1 de 1
                </p>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando asistencias...</p>
                </div>
              ) : (
                <div className="min-h-[300px]">
                  <Suspense fallback={
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">
                      Cargando tabla...
                    </div>
                  }>
                    <AsistenciasTable
                      data={asistencias}
                      columns={config.table_schema}
                      onView={handleView}
                    />
                  </Suspense>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={null}>
          <AsistenciaDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            asistencia={selectedAsistencia}
          />

          {config.permissions.can_create && (
            <AsistenciaFormDialog
              key={isFormOpen ? 'open' : 'closed'}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={addAsistencia}
              centroTrabajoId={centroTrabajoId}
            />
          )}
        </Suspense>
      </div>
    </Main>
  );
}
