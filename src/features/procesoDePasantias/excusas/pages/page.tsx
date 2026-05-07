"use client"

import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import { FileText, Send, User } from "lucide-react"
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
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <FileText className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Excusas</span>
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
          {/* Section heading */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">{roleConfig.module_title}</h2>
              <p className="text-muted-foreground font-medium text-sm">Control operativo y administrativo de justificaciones</p>
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
              <h3 className="text-lg font-bold">Excusas Registradas</h3>
              <p className="text-xs text-muted-foreground font-medium">Historial completo de solicitudes y sus estados actuales</p>
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