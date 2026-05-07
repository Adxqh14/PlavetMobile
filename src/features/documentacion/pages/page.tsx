"use client"

import { useDocumentacion } from "../hooks/useDocumentacion"
import Main from "../../main/pages/page"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu"
import { FileText, Search, Upload, Eye, MoreHorizontal, User, RefreshCw, Loader2, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isReadOnlyRole } from "@/shared/config/rbac"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { StatsCards } from "../components/StatsCards"
import type { Document, DocumentStatus } from "../types"
import { Badge } from "@/shared/components/ui/badge"

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

  const [selectedOwner, setSelectedOwner] = useState<string | null>(null)
  const [pdfPreview, setPdfPreview] = useState<{ open: boolean; url: string; title: string; documentId: number } | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, Document[]>()
    for (const doc of documents) {
      const key = doc.uploadedBy || "Sin asignar"
      map.set(key, [...(map.get(key) ?? []), doc])
    }
    return Array.from(map.entries()).map(([owner, docs]) => {
      const pendientes = docs.filter(d => d.estado === "Pendiente").length
      const aprobados = docs.filter(d => d.estado === "Validado").length
      const rechazados = docs.filter(d => d.estado === "Rechazado").length
      return { owner, docs, pendientes, aprobados, rechazados }
    })
  }, [documents])

  const stats = useMemo(() => {
    let total = 0, pendientes = 0, aprobados = 0, rechazados = 0;
    documents.forEach(d => {
      total++;
      if (d.estado === "Pendiente") pendientes++;
      else if (d.estado === "Validado") aprobados++;
      else if (d.estado === "Rechazado") rechazados++;
    });
    return { total, pendientes, aprobados, rechazados };
  }, [documents]);

  const ownerMeta = useMemo(() => {
    const meta: Record<string, { id: string; program: string }> = {
      "Juan Pérez": { id: "1234573", program: "Taller de Software" },
    }

    for (const g of grouped) {
      if (!meta[g.owner]) {
        meta[g.owner] = { id: "-", program: "-" }
      }
    }
    return meta
  }, [grouped])

  const selectedDocs = useMemo(() => {
    if (!selectedOwner) return []
    return grouped.find(g => g.owner === selectedOwner)?.docs ?? []
  }, [grouped, selectedOwner])

  useEffect(() => {
    return () => {
      if (pdfPreview?.url) {
        URL.revokeObjectURL(pdfPreview.url)
      }
    }
  }, [pdfPreview?.url])

  const openPdfPreview = (doc: Document) => {
    if (pdfPreview?.url) {
      URL.revokeObjectURL(pdfPreview.url)
    }

    const escapePdfText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
    const title = `Documento: ${doc.tipo}`
    const text = escapePdfText(title)

    const pdf = `%PDF-1.4\n` +
      `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
      `4 0 obj\n<< /Length 68 >>\nstream\nBT\n/F1 18 Tf\n72 720 Td\n(${text}) Tj\nET\nendstream\nendobj\n` +
      `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `xref\n0 6\n0000000000 65535 f \n` +
      `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`

    const blob = new Blob([pdf], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    setPdfPreview({ open: true, url, title: doc.tipo, documentId: doc.id })
  }

  const closePdfPreview = () => {
    if (pdfPreview?.url) {
      URL.revokeObjectURL(pdfPreview.url)
    }
    setPdfPreview(null)
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
                  <Select
                    value={filters.statusFilter}
                    onValueChange={(value: string) => onFiltersChange({ statusFilter: value as DocumentStatus | "all" })}
                  >
                    <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="all" className="text-xs font-bold">Todos los estados</SelectItem>
                      <SelectItem value="pendiente" className="text-xs font-bold">Pendiente</SelectItem>
                      <SelectItem value="validado" className="text-xs font-bold">Validado</SelectItem>
                      <SelectItem value="rechazado" className="text-xs font-bold">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Table */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <FileText className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando documentos...</p>
                </div>
              ) : grouped.length > 0 ? (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold py-4">Estudiante</TableHead>
                        <TableHead className="font-semibold py-4">Pendientes</TableHead>
                        <TableHead className="font-semibold py-4">Validados</TableHead>
                        <TableHead className="font-semibold py-4">Rechazados</TableHead>
                        <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped.map(row => (
                        <TableRow key={row.owner} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-bold text-foreground">{row.owner}</div>
                                <div className="text-xs text-muted-foreground font-medium flex items-center gap-3">
                                  <span>ID: {ownerMeta[row.owner]?.id ?? "-"}</span>
                                  <span className="opacity-30">|</span>
                                  <span>{ownerMeta[row.owner]?.program ?? "-"}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-orange-100 text-orange-700 border-none shadow-none font-bold">
                              {row.pendientes}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none font-bold">
                              {row.aprobados}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge className="bg-rose-100 text-rose-700 border-none shadow-none font-bold">
                              {row.rechazados}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
                                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setSelectedOwner(row.owner)}>
                                  <Eye className="mr-2 h-4 w-4" /> Ver detalles
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
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

        {/* Dialogs */}
        <Dialog open={!!selectedOwner} onOpenChange={(open) => setSelectedOwner(open ? selectedOwner : null)}>
          <DialogContent className="max-w-4xl rounded-2xl border-2">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Documentos de <span className="text-primary">{selectedOwner}</span></DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold py-4">Tipo de Documento</TableHead>
                      <TableHead className="font-semibold py-4">Fecha</TableHead>
                      <TableHead className="font-semibold py-4">Estado</TableHead>
                      <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDocs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground font-medium">
                          No hay documentos registrados
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedDocs.map(doc => {
                        const badge = getStatusBadge(doc.estado)
                        return (
                          <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-bold text-sm py-4">{doc.tipo}</TableCell>
                            <TableCell className="text-muted-foreground font-medium py-4 text-sm">{doc.fecha_creacion.split('T')[0]}</TableCell>
                            <TableCell className="py-4">
                              <Badge className={`border-none shadow-none font-bold ${badge.className}`}>
                                {badge.text}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem onClick={() => openPdfPreview(doc)}>
                                    <Eye className="h-4 w-4 mr-2" /> Ver PDF
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
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedOwner(null)} className="rounded-xl font-bold px-8">Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PDF Preview Dialog */}
        <Dialog open={!!pdfPreview?.open} onOpenChange={(open) => (open ? undefined : closePdfPreview())}>
          <DialogContent className="max-w-5xl rounded-2xl border-2">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">{pdfPreview?.title ?? "Vista previa"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-end gap-2">
                {pdfPreview?.documentId && (
                  <Button variant="outline" onClick={() => onDownloadDocument(pdfPreview.documentId)} className="rounded-xl font-bold">
                    <Download className="h-4 w-4 mr-2" /> Descargar Original
                  </Button>
                )}
              </div>

              <div className="rounded-xl border-2 overflow-hidden bg-muted/5" style={{ height: "70vh" }}>
                {pdfPreview?.url ? (
                  <iframe title="pdf-preview" src={pdfPreview.url} className="w-full h-full" />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-muted-foreground font-medium">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    Cargando PDF...
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={closePdfPreview} className="rounded-xl font-bold px-8">Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  )
}
