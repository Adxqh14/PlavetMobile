"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog"
import { Badge } from "../../../../shared/components/ui/badge"
import { Button } from "../../../../shared/components/ui/button"
import type { CentroTrabajo } from "../types"

interface ViewCenterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  centro: CentroTrabajo | null
}

export function ViewCenterDialog({ open, onOpenChange, centro }: ViewCenterDialogProps) {
  const getEstadoBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Activo</Badge>;
      case "pending":
        return <Badge variant="orange-subtle">Pendiente</Badge>;
      case "rejected":
        return <Badge variant="danger">Rechazado</Badge>;
      case "deleted":
        return <Badge variant="grey">Eliminado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!centro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Centro de Trabajo</DialogTitle>
          <DialogDescription>
            Información completa del centro de trabajo seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{centro.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                <p className="text-sm font-semibold">{centro.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                <p className="text-sm">{centro.location}</p>
              </div>
            </div>
          </div>

          {/* Estado y validación */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Estado y Validación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <div className="mt-1">
                  {getEstadoBadge(centro.status)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Validación</label>
                <div className="mt-1">
                  {centro.validated ? (
                    <Badge variant="success">Validado</Badge>
                  ) : (
                    <Badge variant="orange-subtle">No Validado</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Fechas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                <p className="text-sm">{centro.createdAt}</p>
              </div>
              {centro.deletedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Eliminación</label>
                  <p className="text-sm">{centro.deletedAt}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
