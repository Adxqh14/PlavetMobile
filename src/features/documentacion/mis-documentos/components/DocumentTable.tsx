import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Eye, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import type { Document, DocumentStatus } from "../../types"

interface DocumentTableProps {
  documents: Document[]
  isLoading: boolean
  getStatusBadge: (status: DocumentStatus) => { text: string; className: string }
  onOpenPdf: (doc: Document) => void
  onDeleteDocument: (id: number) => void
}

export function DocumentTable({ documents, isLoading, getStatusBadge, onOpenPdf, onDeleteDocument }: DocumentTableProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Documento</TableHead>
            <TableHead className="font-semibold">Fecha de Creación</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                Cargando documentos...
              </TableCell>
            </TableRow>
          ) : documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                No se encontraron documentos
              </TableCell>
            </TableRow>
          ) : (
            documents.map((doc) => {
              const badge = getStatusBadge(doc.estado)
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.tipo}</TableCell>
                  <TableCell>{doc.fecha_creacion.split('T')[0]}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
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
                        <DropdownMenuItem onClick={() => onOpenPdf(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Documento
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteDocument(doc.id)}
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
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
