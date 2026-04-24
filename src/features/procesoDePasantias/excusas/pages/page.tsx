"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../shared/components/ui/dialog"
import { Button } from "../../../../shared/components/ui/button"
import { FileText, Send } from "lucide-react"
import { useExcusas } from "../hooks/useExcusas"
import Main from "@/features/main/pages/page"
import { GetRoleConfigUseCase } from "../services/excusasConfig"
import { useMemo, lazy, Suspense } from "react"

const ExcusaForm = lazy(() => import("../components/ExcusaForm").then((mod) => ({ default: mod.ExcusaForm })));
const ExcusaTable = lazy(() => import("../components/ExcusaTable").then((mod) => ({ default: mod.ExcusaTable })));

// Supongamos que tienes un hook de auth, si no, puedes simularlo para probar
// import { useAuth } from "@/features/auth/hooks/useAuth"

export default function ExcusasPage() {
  const user = { role: 'ESTUDIANTE' as const }; 
  
  // Memoizamos para no reinstanciar el UseCase en cada render
  const roleConfig = useMemo(
    () => new GetRoleConfigUseCase().execute().roles_config[user.role],
    [user.role]
  );

  const {
    filteredExcuses,
    selectedFile,
    formData,
    filters,
    handleFileChange, 
    handleSubmit,
    updateFormData,
    updateFilters,
    handleEditExcuse,
    handleDeleteExcuse,
    handleApproveExcuse,
    getEstadoBadge,
    pdfPreview,
    openPdfPreview,
    closePdfPreview,
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
                    selectedFile={selectedFile}
                    onSubmit={handleSubmit}
                    onFileChange={handleFileChange}
                    onFormDataChange={updateFormData}
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
                    onOpenPdf={openPdfPreview}
                    permissions={roleConfig.permissions} 
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Preview Dialog */}
      <Dialog open={!!pdfPreview?.open} onOpenChange={(open) => { if (!open) closePdfPreview(); }}>
        <DialogContent className="sm:max-w-4xl w-full max-h-[90dvh] flex flex-col p-0 gap-0">
          {/* Header fijo */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>{pdfPreview?.title ?? "Vista previa"}</DialogTitle>
          </DialogHeader>

          {/* Iframe */}
          <div className="px-6 pb-0">
            <div className="rounded-lg border overflow-hidden" style={{ height: 'calc(90dvh - 130px)' }}>
              {pdfPreview?.url ? (
                <iframe title="pdf-preview" src={pdfPreview.url} className="w-full h-full" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">Cargando PDF...</div>
              )}
            </div>
          </div>

          {/* Footer fijo */}
          <DialogFooter className="px-6 py-4 border-t shrink-0">
            <Button onClick={closePdfPreview}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Main>
  )
}