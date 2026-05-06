"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/card"
import { FileText, Send } from "lucide-react"
import { useExcusas } from "../hooks/useExcusas"
import Main from "@/features/main/pages/page"
import { useExcusasConfig } from "../hooks/useExcusasConfig"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { lazy, Suspense } from "react"

const ExcusaForm = lazy(() => import("../components/ExcusaForm").then((mod) => ({ default: mod.ExcusaForm })));
const ExcusaTable = lazy(() => import("../components/ExcusaTable").then((mod) => ({ default: mod.ExcusaTable })));

export default function ExcusasPage() {
  const { userRole } = useAuth();

  const roleConfig = useExcusasConfig(userRole);

  const {
    filteredExcuses,
    formData,
    filters,
    submitting,
    handleSubmit,
    updateFormData,
    updateFilters,
    handleEditExcuse,
    handleDeleteExcuse,
    handleApproveExcuse,
    getEstadoBadge,
  } = useExcusas();

  return (
    <Main>
      <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        
          {/* Header Dinámico */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-foreground flex items-center gap-3">
              <FileText className="h-10 w-10" />
              {roleConfig.module_title}
            </h1>
            <p className="text-muted-foreground text-lg">Sistema de Gestión de Pasantías Plavet</p>
          </div>

          {/* Formulario: Solo si el permiso can_create es true */}
          {roleConfig.permissions.can_create && (
            <Card className="mb-8 border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Registrar Nueva Excusa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-muted-foreground animate-pulse">Cargando formulario...</div>}>
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
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle>Excusas Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px]">
                <Suspense fallback={<div className="h-[300px] flex items-center justify-center text-muted-foreground animate-pulse">Cargando datos...</div>}>
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