"use client"

import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import { Send } from "lucide-react"
import { useExcusas } from "../hooks/useExcusas"
import Main from "@/features/main/pages/page"
import { useExcusasConfig } from "../hooks/useExcusasConfig"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { lazy, Suspense } from "react"
import { ExcusasHero } from "../components/ExcusasHero"
import { ExcusasActionBar } from "../components/ExcusasActionBar"
import { ExcusasFilters } from "../components/ExcusasFilters"
import { ExcusasTableHeader } from "../components/ExcusasTableHeader"

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
        <ExcusasHero userRole={userRole} userTaller={user?.taller} />

        <div className="w-full pb-12 px-6 md:px-12">
          <ExcusasActionBar 
            title={roleConfig.module_title}
            onExport={handleExport}
            onRefresh={() => fetchExcuses(1)}
            isLoading={loading}
          />

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

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <ExcusasTableHeader />
              <ExcusasFilters 
                filters={filters}
                onFiltersChange={updateFilters}
                userRole={userRole}
              />
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
