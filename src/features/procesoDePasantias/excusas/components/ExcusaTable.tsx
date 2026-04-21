"use client";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import { Search, Eye, Download, Trash2, MoreHorizontal, Edit2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../shared/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { useState } from "react";
import type { Excuse, ExcuseFilters } from "../types";
import { ExcusaDetailsDialog } from "./ExcusaDetailsDialog";

interface Props {
  excuses: Excuse[];
  filters: ExcuseFilters;
  onFiltersChange: (filters: Partial<ExcuseFilters>) => void;
  getEstadoBadge: (estado: string) => { className: string; text: string; icon: string };
  onEdit?: (id: string, data: Partial<Excuse>) => void;
  onDelete?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-700",
  Aprobada: "bg-emerald-100 text-emerald-700",
  Rechazada: "bg-rose-100 text-rose-700",
};

export const ExcusaTable = ({ 
  excuses, 
  filters, 
  onFiltersChange, 
  getEstadoBadge,
  onEdit,
  onDelete 
}: Props) => {
  const [selectedExcuse, setSelectedExcuse] = useState<Excuse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [excuseToDelete, setExcuseToDelete] = useState<Excuse | null>(null);

  const handleDownloadCertificado = (certificado: string) => {
    console.log("[v0] Descargando certificado:", certificado);
  };

  const handleAction = (action: string, excuseId: string, certificado?: string) => {
    const excuse = excuses.find(e => e.id === excuseId);
    
    switch (action) {
      case "view":
        if (excuse) {
          setSelectedExcuse(excuse);
          setIsEditMode(false);
          setDetailsOpen(true);
        }
        break;
      case "edit":
        if (excuse) {
          setSelectedExcuse(excuse);
          setIsEditMode(true);
          setDetailsOpen(true);
        }
        break;
      case "download":
        console.log("[v0] Descargando certificado:", certificado);
        break;
      case "delete":
        if (excuse) {
          setExcuseToDelete(excuse);
          setDeleteDialogOpen(true);
        }
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por taller, estudiante o ID..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        <Select value={filters.filterEstado} onValueChange={(value) => onFiltersChange({ filterEstado: value })}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Aprobada">Aprobada</SelectItem>
            <SelectItem value="Rechazada">Rechazada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Pasantía</TableHead>
              <TableHead className="font-semibold">Estudiante</TableHead>
              <TableHead className="font-semibold">Tutor</TableHead>
              <TableHead className="font-semibold">Justificación</TableHead>
              <TableHead className="font-semibold">Certificado</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {excuses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No se encontraron excusas
                </TableCell>
              </TableRow>
            ) : (
              excuses.map((excuse) => {
                const badge = getEstadoBadge(excuse.estado);
                return (
                  <TableRow key={excuse.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-primary">{excuse.id}</TableCell>
                    <TableCell>{excuse.pasantia}</TableCell>
                    <TableCell>{excuse.estudiante}</TableCell>
                    <TableCell>{excuse.tutor}</TableCell>
                    <TableCell className="max-w-xs truncate">{excuse.justificacion}</TableCell>
                    <TableCell>{excuse.certificado}</TableCell>
                    <TableCell>{excuse.fecha}</TableCell>
                    <TableCell>
                      <Badge className={`${statusStyles[badge.text] || ""} border-none shadow-none`}>
                        {badge.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction("view", excuse.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("edit", excuse.id)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("download", excuse.id, excuse.certificado)}>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleAction("delete", excuse.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <ExcusaDetailsDialog
        key={`${selectedExcuse?.id}-${isEditMode}`}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        excuse={selectedExcuse}
        onDownload={handleDownloadCertificado}
        onEdit={onEdit}
        isEditMode={isEditMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
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
                    console.log("[v0] Eliminar excusa:", excuseToDelete.id);
                    onDelete(excuseToDelete.id);
                    console.log(`[v0] Excusa ${excuseToDelete.id} eliminada correctamente`);
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
  );
};
