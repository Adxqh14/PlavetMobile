import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../shared/components/ui/table"
import { Button } from "../../../../shared/components/ui/button"
import { Edit, Trash, CheckCircle, Eye, MoreHorizontal } from "lucide-react"
import { Badge } from "../../../../shared/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../shared/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog"
import type { Excuse, ExcuseFilters } from "../types"
import { useState } from "react"
import { ExcusaDetailsDialog } from "./ExcusaDetailsDialog"

interface Props {
  columns: { key: string; label: string }[];
  excuses: Excuse[];
  filters: ExcuseFilters;
  onFiltersChange: (filters: Partial<ExcuseFilters>) => void;
  getEstadoBadge: (estado: string) => { className: string; text: string };
  onEdit: (id: string, data: Partial<Excuse>) => void;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  permissions: {
    can_view?: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_approve: boolean;
  };
}

export function ExcusaTable({ columns, excuses, getEstadoBadge, onEdit, onDelete, onApprove, permissions }: Props) {
  const [selectedExcuse, setSelectedExcuse] = useState<Excuse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [excuseToDelete, setExcuseToDelete] = useState<Excuse | null>(null);

  const handleView = (excuse: Excuse) => {
    setSelectedExcuse(excuse);
    setIsEditMode(false);
    setDetailsOpen(true);
  };

  const handleEdit = (excuse: Excuse) => {
    setSelectedExcuse(excuse);
    setIsEditMode(true);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (excuse: Excuse) => {
    setExcuseToDelete(excuse);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="rounded-md border min-h-[320px]">
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        {/* colgroup fija anchos para evitar CLS */}
        <colgroup>
          {columns.map((col) => {
            const widths: Record<string, string> = {
              fecha: '20%',
              tipoExcusa: '20%',
              estudiante: '25%',
              estado: '15%',
              acciones: '10%',
            };
            return <col key={col.key} style={{ width: widths[col.key] ?? 'auto' }} />;
          })}
        </colgroup>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead 
                key={col.key} 
                className={col.key === 'estado' || col.key === 'acciones' ? 'text-center' : ''}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {excuses.map((excuse) => (
            <TableRow key={excuse.id}>
              {columns.map((col) => (
                <TableCell 
                  key={`${excuse.id}-${col.key}`} 
                  className={col.key === 'estado' || col.key === 'acciones' ? 'text-center' : ''}
                >
                  {/* Lógica según la columna */}
                  {col.key === 'estado' ? (() => {
                    const badge = getEstadoBadge(excuse.estado);
                    return (
                      <Badge variant="outline" className={badge.className}>
                        {badge.text}
                      </Badge>
                    );
                  })() : col.key === 'acciones' ? (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {permissions.can_view && (
                          <DropdownMenuItem onClick={() => handleView(excuse)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                        )}
                        {permissions.can_edit && (
                          <DropdownMenuItem onClick={() => handleEdit(excuse)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {permissions.can_approve && (
                          <DropdownMenuItem onClick={() => onApprove && onApprove(excuse.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Aprobar
                          </DropdownMenuItem>
                        )}
                        {permissions.can_delete && (
                          <DropdownMenuItem 
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive" 
                            onClick={() => handleDeleteClick(excuse)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    excuse[col.key as keyof Excuse] // Muestra el dato normal (fecha, motivo, etc.)
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <ExcusaDetailsDialog
        key={`${selectedExcuse?.id}-${isEditMode}`}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        excuse={selectedExcuse}
        isEditMode={isEditMode}
        onEdit={onEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash className="h-5 w-5" />
              Confirmar Eliminación
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Está seguro que desea eliminar la excusa de <span className="font-medium text-foreground">{excuseToDelete?.estudiante}</span>?
            </p>
            <p className="text-xs text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (excuseToDelete && onDelete) {
                    onDelete(excuseToDelete.id);
                  }
                  setDeleteDialogOpen(false);
                  setExcuseToDelete(null);
                }}
                className="flex-1"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}