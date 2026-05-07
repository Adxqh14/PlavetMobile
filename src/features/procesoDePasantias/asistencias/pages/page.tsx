"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/card"
import { Button } from "../../../../shared/components/ui/button"
import { Input } from "../../../../shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import { ClipboardCheck, Plus, Search, Filter, Download, AlertCircle, Loader2 } from "lucide-react"
import Main from '../../../main/pages/page'
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAsistencias } from "../hooks/useAsistencias"
import { ASISTENCIAS_MODULE_CONFIG } from "@/shared/config/rbac"
import type { Asistencia, AsistenciaFormData, AsistenciaFilters } from "../types"

const AsistenciasTable = lazy(() => import("../components/AsistenciasTable").then((mod) => ({ default: mod.AsistenciasTable })));
const AsistenciaFormDialog = lazy(() => import("../components/AsistenciaFormDialog").then((mod) => ({ default: mod.AsistenciaFormDialog })));
const AsistenciaDetailsDialog = lazy(() => import("../components/AsistenciaDetailsDialog").then((mod) => ({ default: mod.AsistenciaDetailsDialog })));

export default function AsistenciasPage() {
  const { userRole, user } = useAuth();
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

  const handleCreate = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: AsistenciaFormData) => {
    await addAsistencia(data);
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              {config.module_title}
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Seguimiento y control de la jornada diaria de los estudiantes en sus centros de trabajo
          </p>
          {userRole === "TUTOR ACADEMICO" && user?.taller && (
            <div className="mt-2 ml-12 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span>Taller: {user.taller.nombre}</span>
            </div>
          )}
        </div>

        {/* Main Content Card */}
        <Card className="border shadow-sm">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Historial de Asistencias</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" /> Exportar
                </Button>
                {config.permissions.can_create && (
                  <Button
                    size="sm"
                    onClick={handleCreate}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" /> Registrar Asistencia
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por estudiante o empresa..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.filterAsistencia}
                onValueChange={(val: AsistenciaFilters['filterAsistencia']) =>
                  setFilters({ ...filters, filterAsistencia: val })
                }
              >
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Asistencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="presente">Presente</SelectItem>
                  <SelectItem value="ausente">Ausente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Cargando asistencias...
              </div>
            )}

            {/* Table Area */}
            {!isLoading && (
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

        {/* Dialogs */}
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
              onSubmit={handleFormSubmit}
            />
          )}
        </Suspense>
      </div>
    </Main>
  );
}
