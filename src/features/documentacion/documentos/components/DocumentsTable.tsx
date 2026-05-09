import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { User, MoreHorizontal, Eye, Download, Clock, CheckCircle, XCircle, Search } from "lucide-react"
import { type Document, type DocumentStatus } from "../types"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface StudentInfo {
  name: string
  id_taller: string
}

interface DocumentsTableProps {
  documents: Document[]
  studentMap: Map<string, StudentInfo>
  getStatusBadge: (status: DocumentStatus) => { text: string; className: string }
  onPreview: (url: string | undefined, title: string, id: string) => void
  onDownload: (id: string) => void
  onUpdateStatus: (id: string, status: DocumentStatus) => void
}

export function DocumentsTable({
  documents,
  studentMap,
  getStatusBadge,
  onPreview,
  onDownload,
  onUpdateStatus
}: DocumentsTableProps) {
  const { userRole } = useAuth()

  if (documents.length === 0) {
    return (
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
    )
  }

  return (
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
          {documents.map(doc => {
            const studentInfo = studentMap.get(doc.id_estudiante)
            const badge = getStatusBadge(doc.estado)
            return (
              <TableRow
                key={doc.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onPreview(doc.url_descarga, doc.tipo, doc.id)}
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
                      <DropdownMenuItem onClick={() => onPreview(doc.url_descarga, doc.tipo, doc.id)}>
                        <Eye className="h-4 w-4 mr-2" /> Ver documento
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(doc.id)}>
                        <Download className="h-4 w-4 mr-2" /> Descargar
                      </DropdownMenuItem>
                      {userRole === "VINCULADOR" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onUpdateStatus(doc.id, "Pendiente")} className="text-orange-600">
                            <Clock className="h-4 w-4 mr-2" /> Marcar Pendiente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(doc.id, "Validado")} className="text-emerald-600">
                            <CheckCircle className="h-4 w-4 mr-2" /> Validar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateStatus(doc.id, "Rechazado")} className="text-rose-600">
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
  )
}
