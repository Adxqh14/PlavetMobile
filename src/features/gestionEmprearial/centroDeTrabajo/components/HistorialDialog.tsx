"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../shared/components/ui/table";
import {
  MapPin,
  Calendar,
  RotateCcw,
  Trash2,
} from "lucide-react";
import type { CentroTrabajo } from "../types";

interface HistorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deletedCentros: CentroTrabajo[];
  onRestore: (centro: CentroTrabajo) => void;
  onPermanentDelete: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  deleted: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  deleted: "Eliminado",
};

export const HistorialDialog = ({ 
  open, 
  onOpenChange, 
  deletedCentros, 
  onRestore, 
  onPermanentDelete 
}: HistorialDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0 bg-background">
          <div className="flex items-center gap-2 text-primary mb-1">
            <RotateCcw className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold">Historial de Centros Eliminados</DialogTitle>
          </div>
          <DialogDescription>
            Visualiza y gestiona los centros de trabajo que han sido eliminados del sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {deletedCentros.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Historial vacío</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                No hay centros eliminados en el historial actualmente.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-muted/60 overflow-hidden shadow-sm bg-background">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold">Ubicación</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Fecha Eliminación</TableHead>
                    <TableHead className="font-semibold text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedCentros.map((centro) => (
                    <TableRow key={centro.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{centro.id}</TableCell>
                      <TableCell>
                        <p className="font-medium">{centro.name}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{centro.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${statusStyles[centro.status] || ""} border-none shadow-none`}
                        >
                          {statusLabels[centro.status] || centro.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {centro.deletedAt ? new Date(centro.deletedAt).toLocaleDateString('es-ES') : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestore(centro)}
                            className="gap-1"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Restaurar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPermanentDelete(centro.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8 font-semibold shadow-sm">
            Cerrar Historial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
