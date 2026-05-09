"use client"

import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RefreshCw, Upload, Loader2, FileText } from "lucide-react"

import Main from "../../../main/pages/page"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isReadOnlyRole } from "@/shared/config/rbac"
import { estudiantesService } from "@/features/gestionAcademica/estudiantes/services/estudiantesService"
import { talleresService } from "@/features/gestionAcademica/talleres/services/talleresService"
import type { Estudiante } from "@/features/gestionAcademica/estudiantes/types"
import type { Taller } from "@/features/gestionAcademica/talleres/types"

import { useDocumentacion } from "../hooks/useDocumentacion"
import { StatsCards } from "../components/StatsCards"
import { DocumentationHero } from "../components/DocumentationHero"
import { DocumentationFilters } from "../components/DocumentationFilters"
import { DocumentsTable } from "../components/DocumentsTable"
import { DocumentPreviewDialog } from "../components/DocumentPreviewDialog"
import type { Document } from "../types"

interface StudentInfo {
  name: string
  id_taller: string
}

export default function DocumentacionPage() {
  const navigate = useNavigate()
  const {
    documents,
    filters,
    isLoading,
    onFiltersChange,
    onDownloadDocument,
    onUpdateDocumentStatus,
    getStatusBadge,
    reload
  } = useDocumentacion()

  const { userRole } = useAuth()
  const isReadOnly = isReadOnlyRole(userRole)

  const [studentMap, setStudentMap] = useState<Map<string, StudentInfo>>(new Map())
  const [talleres, setTalleres] = useState<{ id: string; nombre: string }[]>([])
  const [selectedTaller, setSelectedTaller] = useState<string>("all")
  const [preview, setPreview] = useState<{ open: boolean; url: string; title: string; documentId: string } | null>(null)

  // Load student mapping and talleres
  useEffect(() => {
    if (userRole === "ESTUDIANTE") return

    estudiantesService.getAll({ pageSize: 500 }).then((res) => {
      const map = new Map<string, StudentInfo>()
      res.data.forEach((e: Estudiante) => {
        map.set(String(e.id), {
          name: `${e.nombre} ${e.apellido}`.trim(),
          id_taller: String(e.id_taller ?? ""),
        })
      })
      setStudentMap(map)
    }).catch(() => { })

    talleresService.getAll({ pageSize: 200 }).then((res) => {
      setTalleres(res.data.map((t: Taller) => ({ id: String(t.id), nombre: t.nombre })))
    }).catch(() => { })
  }, [userRole])

  // Apply taller filter
  const visibleDocuments = useMemo(() => {
    if (selectedTaller === "all") return documents
    return documents.filter((doc: Document) => studentMap.get(doc.id_estudiante)?.id_taller === selectedTaller)
  }, [documents, selectedTaller, studentMap])

  // Stats calculation
  const stats = useMemo(() => {
    let total = 0, pendientes = 0, aprobados = 0, rechazados = 0
    visibleDocuments.forEach((d: Document) => {
      total++
      if (d.estado === "Pendiente") pendientes++
      else if (d.estado === "Validado") aprobados++
      else if (d.estado === "Rechazado") rechazados++
    })
    return { total, pendientes, aprobados, rechazados }
  }, [visibleDocuments])

  const openPreview = (url: string | undefined, title: string, documentId: string) => {
    if (url) setPreview({ open: true, url, title, documentId })
  }

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">

        <DocumentationHero />

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Header Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Expedientes de Estudiantes</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y validación de archivos por estudiante</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => reload()}
                disabled={isLoading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>

              {!isReadOnly && userRole !== "TUTOR ACADEMICO" && userRole !== "VINCULADOR" && (
                <Button
                  size="sm"
                  onClick={() => navigate("/subir")}
                  disabled={isLoading}
                  className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Upload className="h-4 w-4 mr-2" /> Subir Documentos
                </Button>
              )}
            </div>
          </div>

          <StatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <DocumentationFilters
                searchTerm={filters.searchTerm}
                statusFilter={filters.statusFilter}
                selectedTaller={selectedTaller}
                talleres={talleres}
                onFiltersChange={onFiltersChange}
                onTallerChange={setSelectedTaller}
              />
            </CardHeader>

            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <FileText className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando documentos...</p>
                </div>
              ) : (
                <DocumentsTable
                  documents={visibleDocuments}
                  studentMap={studentMap}
                  getStatusBadge={getStatusBadge}
                  onPreview={openPreview}
                  onDownload={onDownloadDocument}
                  onUpdateStatus={onUpdateDocumentStatus}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentPreviewDialog
        preview={preview}
        onClose={() => setPreview(null)}
        onDownload={onDownloadDocument}
      />
    </Main>
  )
}
