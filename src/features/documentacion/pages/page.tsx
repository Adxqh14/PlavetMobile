"use client"

import { useDocumentacion } from "../hooks/useDocumentacion"
import Main from "../../main/pages/page"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { FileText, Search, Upload, Eye, MoreHorizontal, User } from "lucide-react"
import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import type { Document, DocumentStatus } from "../types"

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
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Gestión de Documentos</h1>
            <p className="text-sm text-muted-foreground">Administra y revisa los documentos de los estudiantes</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3" />
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar estudiante..."
                  value={filters.searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => onFiltersChange({ searchTerm: e.target.value })}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.statusFilter}
                onValueChange={(value: string) => onFiltersChange({ statusFilter: value as DocumentStatus | "all" })}
              >
                <SelectTrigger className="w-full lg:w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="w-full lg:w-auto gap-2"
                onClick={() => navigate("/subir")}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
                Subir Documentos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Persona</TableHead>
                    <TableHead className="font-semibold">Pendientes</TableHead>
                    <TableHead className="font-semibold">Aprobados</TableHead>
                    <TableHead className="font-semibold">Rechazados</TableHead>
                    <TableHead className="font-semibold text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : grouped.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No se encontraron registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    grouped.map(row => (
                      <TableRow key={row.owner}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{row.owner}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-3">
                                <span className="inline-flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {ownerMeta[row.owner]?.id ?? "-"}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {ownerMeta[row.owner]?.program ?? "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 text-orange-700 px-3 py-1 text-xs font-medium">
                            {row.pendientes}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
                            {row.aprobados}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 text-red-700 px-3 py-1 text-xs font-medium">
                            {row.rechazados}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedOwner(row.owner)}>
                                Ver detalles
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!selectedOwner} onOpenChange={(open) => setSelectedOwner(open ? selectedOwner : null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Documentos de {selectedOwner}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Documento</TableHead>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="font-semibold text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDocs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No hay documentos
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedDocs.map(doc => {
                        const badge = getStatusBadge(doc.estado)
                        return (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.tipo}</TableCell>
                            <TableCell>{doc.fecha_creacion.split('T')[0]}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${badge.className}`}>
                                {badge.text}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openPdfPreview(doc)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDownloadDocument(doc.id)}>
                                    Descargar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "Pendiente")}>
                                    Marcar Pendiente
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "Validado")}>
                                    Validar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "Rechazado")}>
                                    Rechazar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onUpdateDocumentStatus(doc.id, "En Revisión")}>
                                    Marcar En Revisión
                                  </DropdownMenuItem>
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
              <Button onClick={() => setSelectedOwner(null)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!pdfPreview?.open} onOpenChange={(open) => (open ? undefined : closePdfPreview())}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{pdfPreview?.title ?? "Vista previa"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                {pdfPreview?.documentId && (
                  <Button variant="outline" onClick={() => onDownloadDocument(pdfPreview.documentId)}>
                    Descargar
                  </Button>
                )}
              </div>

              <div className="rounded-lg border overflow-hidden" style={{ height: "70vh" }}>
                {pdfPreview?.url ? (
                  <iframe title="pdf-preview" src={pdfPreview.url} className="w-full h-full" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">Cargando PDF...</div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={closePdfPreview}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  )
}
