"use client"

import { useState, lazy, Suspense } from "react"
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import { Button } from "../../../../shared/components/ui/button"
import { Input } from "../../../../shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import { ClipboardCheck, Plus, Search, Filter, Download, AlertCircle, Loader2, User } from "lucide-react"
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
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <ClipboardCheck className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Control de <span className="text-primary">Asistencias</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Seguimiento y control de la jornada diaria de los estudiantes en sus centros de trabajo para el cumplimiento del programa.
              </p>
              {userRole === "TUTOR ACADEMICO" && user?.taller && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                  <span>Taller: {user.taller.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Registro de Jornadas</h2>
              <p className="text-muted-foreground font-medium text-sm">Monitoreo de horas y presencialidad laboral</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" /> Exportar CSV
              </Button>

              {config.permissions.can_create && (
                <Button
                  size="sm"
                  onClick={handleCreate}
                  className="rounded-xl font-bold h-10 text-xs shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Registrar Asistencia
                </Button>
              )}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              {error}
            </div>
          )}

          {/* Main Content Card */}
          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiante o empresa..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <Select
                  value={filters.filterAsistencia}
                  onValueChange={(val: AsistenciaFilters['filterAsistencia']) =>
                    setFilters({ ...filters, filterAsistencia: val })
                  }
                >
                  <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0">
                      <Filter className="h-4 w-4 text-primary shrink-0" />
                      <div className="truncate text-left">
                        <SelectValue placeholder="Asistencia" />
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    <SelectItem value="all" className="text-xs font-bold">Todos</SelectItem>
                    <SelectItem value="presente" className="text-xs font-bold">Presente</SelectItem>
                    <SelectItem value="ausente" className="text-xs font-bold">Ausente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Results Summary */}
              {!isLoading && asistencias.length > 0 && (
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  Mostrando {asistencias.length} de {asistencias.length} registros
                  <span className="mx-2 opacity-30">|</span>
                  Página 1 de 1
                </p>
              )}

              {/* Table Area */}
              {/* Loading state */}
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
              centroTrabajoId={centroTrabajoId}
            />
          )}
        </Suspense>
      </div>
    </Main>
  );
}
