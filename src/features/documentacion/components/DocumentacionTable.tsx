import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { Search, Eye, Download, Trash2, MoreHorizontal, Upload, FileText, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, type ChangeEvent } from "react"
import type { Document, DocumentFilters, DocumentStatus } from "../types"

interface Props {
  documents: Document[]
  filters: DocumentFilters
  onFiltersChange: (filters: Partial<DocumentFilters>) => void
  onDeleteDocument: (id: string) => void
  onDownloadDocument: (id: string) => void
  getStatusBadge: (status: string) => { className: string; text: string; icon?: string }
  isLoading: boolean
}

const statusStyles: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  aprobado: "bg-emerald-100 text-emerald-700",
  rechazado: "bg-rose-100 text-rose-700",
};

export function DocumentacionTable({
  documents,
  filters,
  onFiltersChange,
  onDeleteDocument,
  onDownloadDocument,
  getStatusBadge,
  isLoading
}: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Paginación
  const totalPages = Math.ceil(documents.length / itemsPerPage)
  const paginatedDocuments = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page when filters change
  const resetPage = () => setCurrentPage(1)

  const handleAction = (action: string, documentId: string) => {
    switch (action) {
      case "view":
        console.log("Ver documento:", documentId)
        alert(`Ver detalles del documento ${documentId}`)
        break
      case "download":
        onDownloadDocument(documentId)
        break
      case "delete":
        onDeleteDocument(documentId)
        break
    }
  }

  const handleFilterChange = (value: string) => {
    onFiltersChange({ statusFilter: value as DocumentStatus | "all" })
    resetPage()
  }

  const handleTypeFilterChange = (value: string) => {
    onFiltersChange({ typeFilter: value })
    resetPage()
  }

  const handleSearchChange = (value: string) => {
    onFiltersChange({ searchTerm: value })
    resetPage()
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, tipo o usuario..."
            value={filters.searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          value={filters.statusFilter}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="aprobado">Aprobado</SelectItem>
            <SelectItem value="rechazado">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.typeFilter}
          onValueChange={handleTypeFilterChange}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los tipos</SelectItem>
            <SelectItem value="acta">Acta</SelectItem>
            <SelectItem value="carta">Carta</SelectItem>
            <SelectItem value="informe">Informe</SelectItem>
            <SelectItem value="certificado">Certificado</SelectItem>
            <SelectItem value="plan">Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Mostrando {paginatedDocuments.length} de {documents.length} documentos (Página {currentPage} de {totalPages})
      </p>

      {/* Table */}
      {documents.length > 0 ? (
        <>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Tamaño</TableHead>
                  <TableHead className="font-semibold">Subido por</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Upload className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Cargando documentos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedDocuments.map((document) => {
                  const statusBadge = getStatusBadge(document.estado)
                  return (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.tipo}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium">
                          {document.tipo}
                        </span>
                      </TableCell>
                      <TableCell>{document.fecha_creacion.split('T')[0]}</TableCell>
                      <TableCell>
                        <Badge className={`${statusStyles[document.estado.toLowerCase()] || ""} border-none shadow-none`}>
                          {statusBadge.text}
                        </Badge>
                      </TableCell>
                      <TableCell>{document.size}</TableCell>
                      <TableCell>{document.uploadedBy}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction("view", document.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("download", document.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleAction("delete", document.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4 inline-block">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay documentos
          </h3>
          <p className="text-sm text-muted-foreground">
            No se encontraron documentos con los filtros seleccionados
          </p>
        </div>
      )}
    </div>
  )
}
