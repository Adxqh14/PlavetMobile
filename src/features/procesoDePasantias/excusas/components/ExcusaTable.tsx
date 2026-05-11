import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../shared/components/ui/table"
import { cn } from "@/lib/utils"
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
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b">
            {columns.map((col) => (
              <TableHead 
                key={col.key} 
                className={cn(
                  "h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80",
                  (col.key === 'estado' || col.key === 'acciones') && "text-center"
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {excuses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground font-medium">
                No se encontraron excusas registradas.
              </TableCell>
            </TableRow>
          ) : (
            excuses.map((excuse) => (
              <TableRow key={excuse.id} className="group hover:bg-muted/30 transition-colors border-b last:border-0">
                {columns.map((col) => (
                  <TableCell 
                    key={`${excuse.id}-${col.key}`} 
                    className={cn(
                      "py-4",
                      (col.key === 'estado' || col.key === 'acciones') && "text-center"
                    )}
                  >
                    {/* Lógica según la columna */}
                    {col.key === 'estudiante' ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {excuse.estudiante}
                        </span>
                      </div>
                    ) : col.key === 'fecha' ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{excuse.fecha.split(" ")[0]}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{excuse.tipoExcusa}</span>
                      </div>
                    ) : col.key === 'estado' ? (() => {
                      const badge = getEstadoBadge(excuse.estado);
                      return (
                        <Badge variant="outline" className={cn("rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border-none shadow-none", badge.className)}>
                          {badge.text}
                        </Badge>
                      );
                    })() : col.key === 'acciones' ? (
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl border-border/50">
                          {permissions.can_view && (
                            <DropdownMenuItem onClick={() => handleView(excuse)} className="rounded-lg gap-2 text-xs font-bold py-2">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              Ver detalles
                            </DropdownMenuItem>
                          )}
                          {permissions.can_edit && (
                            <DropdownMenuItem onClick={() => handleEdit(excuse)} className="rounded-lg gap-2 text-xs font-bold py-2">
                              <Edit className="h-4 w-4 text-muted-foreground" />
                              Editar
                            </DropdownMenuItem>
                          )}
                          {permissions.can_approve && (
                            <DropdownMenuItem onClick={() => onApprove && onApprove(excuse.id)} className="rounded-lg gap-2 text-xs font-bold py-2 text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
                              <CheckCircle className="h-4 w-4" />
                              Aprobar
                            </DropdownMenuItem>
                          )}
                          {permissions.can_delete && (
                            <>
                              <div className="my-1 border-t border-border/50" />
                              <DropdownMenuItem 
                                className="rounded-lg gap-2 text-xs font-bold py-2 text-destructive focus:bg-destructive/10 focus:text-destructive" 
                                onClick={() => handleDeleteClick(excuse)}
                              >
                                <Trash className="h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{excuse[col.key as keyof Excuse]}</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
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