"use client"

import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import { Button } from "../../../../shared/components/ui/button"
import { Input } from "../../../../shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import { FileText, Send, User, RefreshCw, Loader2, Search, Filter, Download } from "lucide-react"
import { useExcusas } from "../hooks/useExcusas"
import Main from "@/features/main/pages/page"
import { useExcusasConfig } from "../hooks/useExcusasConfig"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { lazy, Suspense } from "react"

const ExcusaForm = lazy(() => import("../components/ExcusaForm").then((mod) => ({ default: mod.ExcusaForm })));
const ExcusaTable = lazy(() => import("../components/ExcusaTable").then((mod) => ({ default: mod.ExcusaTable })));

export default function ExcusasPage() {
  const { userRole, user } = useAuth();

  const roleConfig = useExcusasConfig(userRole);

  const {
    filteredExcuses,
    formData,
    filters,
    submitting,
    loading,
    handleSubmit,
    updateFormData,
    updateFilters,
    handleEditExcuse,
    handleDeleteExcuse,
    handleApproveExcuse,
    getEstadoBadge,
    fetchExcuses,
  } = useExcusas();

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Estudiante', 'Fecha', 'Tipo', 'Justificacion', 'Estado'],
      ...filteredExcuses.map(e => [
        e.id,
        e.estudiante,
        e.fecha,
        e.tipoExcusa,
        e.justificacion.replace(/\n/g, " "),
        e.estado
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `excusas_${new Date().toISOString().split('T')[0]}.csv`);
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
            <FileText className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                {userRole === "ESTUDIANTE" ? "Historial de" : "Gestión de"} <span className="text-primary">Excusas</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Sistema para el registro, seguimiento y validación de inasistencias justificadas en el programa de pasantías.
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
              <h2 className="text-3xl font-black tracking-tight">{roleConfig.module_title}</h2>
              <p className="text-muted-foreground font-medium text-sm">Control operativo y administrativo de justificaciones</p>
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

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchExcuses(1)}
                disabled={loading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Actualizar
              </Button>
            </div>
          </div>

          {/* Formulario: Solo si el permiso can_create es true */}
          {roleConfig.permissions.can_create && (
            <Card className="mb-10 border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b bg-muted/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Registrar Nueva Excusa</h3>
                    <p className="text-xs text-muted-foreground font-medium">Complete el formulario para enviar su justificación</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-muted-foreground animate-pulse font-bold">Cargando formulario...</div>}>
                  <ExcusaForm
                    formData={formData}
                    onSubmit={handleSubmit}
                    onFormDataChange={updateFormData}
                    submitting={submitting}
                  />
                </Suspense>
              </CardContent>
            </Card>
          )}

          {/* Tabla: Pasamos el esquema de columnas y permisos de acción */}
          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold">Excusas Registradas</h3>
                  <p className="text-xs text-muted-foreground font-medium">Historial completo de solicitudes y sus estados actuales</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={userRole === "ESTUDIANTE" ? "Buscar en mis excusas..." : "Buscar por estudiante, ID o justificación..."}
                    value={filters.searchTerm}
                    onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <Select
                  value={filters.filterEstado}
                  onValueChange={(val: string) => updateFilters({ filterEstado: val })}
                >
                  <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0">
                      <Filter className="h-4 w-4 text-primary shrink-0" />
                      <div className="truncate text-left">
                        <SelectValue placeholder="Estado" />
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    <SelectItem value="all" className="text-xs font-bold">Todos los estados</SelectItem>
                    <SelectItem value="Pendiente" className="text-xs font-bold">Pendiente</SelectItem>
                    <SelectItem value="Aprobada" className="text-xs font-bold">Aprobada</SelectItem>
                    <SelectItem value="Rechazada" className="text-xs font-bold">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="min-h-[300px]">
                <Suspense fallback={<div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse font-bold">Cargando datos...</div>}>
                  <ExcusaTable
                    columns={roleConfig.table_schema}
                    excuses={filteredExcuses}
                    filters={filters}
                    onFiltersChange={updateFilters}
                    getEstadoBadge={getEstadoBadge}
                    onEdit={handleEditExcuse}
                    onDelete={handleDeleteExcuse}
                    onApprove={handleApproveExcuse}
                    permissions={roleConfig.permissions} 
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  )
}