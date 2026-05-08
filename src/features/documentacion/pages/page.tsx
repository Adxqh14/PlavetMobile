"use client"

import { useDocumentacion } from "../hooks/useDocumentacion"
import Main from "../../main/pages/page"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu"
import { FileText, Search, Upload, Eye, MoreHorizontal, User, RefreshCw, Loader2, Download, CheckCircle, XCircle, Clock, GraduationCap } from "lucide-react"
import { useMemo, useState, useEffect, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isReadOnlyRole } from "@/shared/config/rbac"
import { StatsCards } from "../components/StatsCards"
import type { DocumentStatus } from "../types"
import { Badge } from "@/shared/components/ui/badge"
import { estudiantesService } from "@/features/gestionAcademica/estudiantes/services/estudiantesService"
import { talleresService } from "@/features/gestionAcademica/talleres/services/talleresService"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"

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
    getStatusBadge
  } = useDocumentacion()
  const { userRole, user } = useAuth()
  const isReadOnly = isReadOnlyRole(userRole)

  const [studentMap, setStudentMap] = useState<Map<string, StudentInfo>>(new Map())
  const [talleres, setTalleres] = useState<{ id: string; nombre: string }[]>([])
  const [selectedTaller, setSelectedTaller] = useState<string>("all")
  const [preview, setPreview] = useState<{ open: boolean; url: string; title: string; documentId: string } | null>(null)

  // Load students + talleres for name/taller mapping
  useEffect(() => {
    if (userRole === "ESTUDIANTE") return
    estudiantesService.getAll({ pageSize: 500 }).then(res => {
      const map = new Map<string, StudentInfo>()
      for (const e of res.data) {
        map.set(String(e.id), {
          name: `${e.nombre} ${e.apellido}`.trim(),
          id_taller: String(e.id_taller ?? ""),
        })
      }
      setStudentMap(map)
    }).catch(() => {/* silent */})

    talleresService.getAll({ pageSize: 200 }).then(res => {
      setTalleres(res.data.map(t => ({ id: String(t.id), nombre: t.nombre })))
    }).catch(() => {/* silent */})
  }, [userRole])

  // Apply taller filter on top of hook-level filters
  const visibleDocuments = useMemo(() => {
    if (selectedTaller === "all") return documents
    return documents.filter(doc => {
      const info = studentMap.get(doc.id_estudiante)
      return info?.id_taller === selectedTaller
    })
  }, [documents, selectedTaller, studentMap])

  const stats = useMemo(() => {
    let total = 0, pendientes = 0, aprobados = 0, rechazados = 0
    visibleDocuments.forEach(d => {
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

        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <FileText className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Documentación</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra, revisa y valida la documentación académica y administrativa de los estudiantes en el sistema.
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
              <h2 className="text-3xl font-black tracking-tight">Expedientes de Estudiantes</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y validación de archivos por estudiante</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFiltersChange({})}
                disabled={isLoading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>

              {!isReadOnly && userRole !== "TUTOR ACADEMICO" && (
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

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiante..."
                    value={filters.searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onFiltersChange({ searchTerm: e.target.value })}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  {/* Estado filter */}
                  <Select
                    value={filters.statusFilter}
                    onValueChange={(value: string) => onFiltersChange({ statusFilter: value as DocumentStatus | "all" })}
                  >
                    <SelectTrigger className="w-full md:w-44 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="all" className="text-xs font-bold">Todos los estados</SelectItem>
                      <SelectItem value="Pendiente" className="text-xs font-bold">Pendiente</SelectItem>
                      <SelectItem value="Validado" className="text-xs font-bold">Validado</SelectItem>
                      <SelectItem value="Rechazado" className="text-xs font-bold">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Taller filter — only for non-student roles */}
                  {userRole !== "ESTUDIANTE" && talleres.length > 0 && (
                    <Select value={selectedTaller} onValueChange={setSelectedTaller}>
                      <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <SelectValue placeholder="Taller" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2">
                        <SelectItem value="all" className="text-xs font-bold">Todos los talleres</SelectItem>
                        {talleres.map(t => (
                          <SelectItem key={t.id} value={t.id} className="text-xs font-bold">{t.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
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
              ) : visibleDocuments.length > 0 ? (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold py-4">Estudiante</TableHead>
                        <TableHead className="font-semibold py-4">Tipo de Documento</TableHead>
                        <TableHead className="font-semibold py-4">Fecha</TableHead>
                        <TableHead className="font-semibold py-4">Estado</TableHead>
                        <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleDocuments.map(doc => {
                        const studentInfo = studentMap.get(doc.id_estudiante)
                        const badge = getStatusBadge(doc.estado)
                        return (
                          <TableRow
                            key={doc.id}
                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => openPreview(doc.url_descarga, doc.tipo, doc.id)}
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div className="font-semibold text-sm text-foreground">
                                  {studentInfo?.name ?? "—"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 font-medium text-sm">{doc.tipo}</TableCell>
                            <TableCell className="py-4 text-muted-foreground text-sm">{doc.fecha_creacion.split('T')[0]}</TableCell>
                            <TableCell className="py-4">
                              <Badge className={`border-none shadow-none font-bold ${badge.className}`}>
                                {badge.text}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-right" onClick={e => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem onClick={() => openPreview(doc.url_descarga, doc.tipo, doc.id)}>
                                    <Eye className="h-4 w-4 mr-2" /> Ver documento
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDownloadDocument(doc.id)}>
                                    <Download className="h-4 w-4 mr-2" /> Descargar
                                  </DropdownMenuItem>
                                  {!isReadOnly && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "Pendiente")} className="text-orange-600">
                                        <Clock className="h-4 w-4 mr-2" /> Marcar Pendiente
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "Validado")} className="text-emerald-600">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Validar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "Rechazado")} className="text-rose-600">
                                        <XCircle className="h-4 w-4 mr-2" /> Rechazar
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
                  <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                    <Search className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    No se encontraron registros
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                    Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document preview dialog */}
      <Dialog open={!!preview?.open} onOpenChange={(open) => { if (!open) setPreview(null) }}>
        <DialogContent style={{ maxWidth: "96vw", width: "96vw", height: "96vh", display: "flex", flexDirection: "column", padding: "16px" }}>
          <DialogHeader style={{ flexShrink: 0 }}>
            <DialogTitle className="text-xl font-black">{preview?.title ?? "Vista previa"}</DialogTitle>
          </DialogHeader>
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            {preview?.documentId && (
              <Button variant="outline" onClick={() => onDownloadDocument(preview.documentId)} className="rounded-xl font-bold">
                <Download className="h-4 w-4 mr-2" /> Descargar
              </Button>
            )}
          </div>
          <div style={{ flex: 1, minHeight: 0, borderRadius: "8px", border: "1px solid var(--border)", overflow: "auto", display: "flex", justifyContent: "center", backgroundColor: "var(--muted)" }}>
            {preview?.url ? (
              <iframe title="doc-preview" src={preview.url} style={{ width: "100%", maxWidth: "960px", height: "100%", border: "none", flexShrink: 0 }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Cargando...
              </div>
            )}
          </div>
          <DialogFooter style={{ flexShrink: 0, marginTop: "8px" }}>
            <Button onClick={() => setPreview(null)} className="rounded-xl font-bold px-8">Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Main>
  )
}
