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

interface Props {
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
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Historial de Centros Eliminados</DialogTitle>
          <DialogDescription>
            Aquí puedes ver todos los centros que han sido eliminados. 
            Puedes restaurarlos o eliminarlos permanentemente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {deletedCentros.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                No hay centros eliminados en el historial.
              </div>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
