"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../shared/components/ui/dialog"
import { Button } from "../../../../shared/components/ui/button"
import { Input } from "../../../../shared/components/ui/input"
import { Label } from "../../../../shared/components/ui/label"
import { Textarea } from "../../../../shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import type { CentroTrabajo, CentroStatus } from "../types"

interface EditCenterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  centro: CentroTrabajo | null
  onUpdateCentro?: (centro: CentroTrabajo) => void
}

export function EditCenterDialog({ open, onOpenChange, centro, onUpdateCentro }: EditCenterDialogProps) {
  const [formData, setFormData] = useState({
    nombre: centro?.name || "",
    codigo: centro?.id || "",
    ubicacion: centro?.location || "",
    tipo: "oficina",
    responsable: "",
    telefono: "",
    email: "",
    descripcion: "",
    status: centro?.status || "pending" as CentroStatus,
    validated: centro?.validated || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onUpdateCentro && centro) {
      onUpdateCentro({
        id: centro.id,
        name: formData.nombre,
        location: formData.ubicacion,
        employees: 1, // Valor mínimo por defecto
        status: formData.status,
        validated: formData.validated,
        createdAt: centro.createdAt,
        deletedAt: centro.deletedAt,
      });
    }
    
    onOpenChange(false);
  };

  if (!centro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={centro?.id}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Centro de Trabajo</DialogTitle>
          <DialogDescription>
            Modifica la información del centro de trabajo seleccionado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre del Centro *</Label>
              <Input
                id="edit-nombre"
                required
                placeholder="Ej: Centro Norte"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-codigo">Código</Label>
              <Input
                id="edit-codigo"
                placeholder="Ej: CT-001"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-ubicacion">Ubicación *</Label>
              <Input
                id="edit-ubicacion"
                required
                placeholder="Ej: Ciudad de México"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Estado *</Label>
              <Select value={formData.status} onValueChange={(value: CentroStatus) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-validated">Validación</Label>
              <Select value={formData.validated.toString()} onValueChange={(value) => setFormData({ ...formData, validated: value === "true" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar validación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Validado</SelectItem>
                  <SelectItem value="false">No Validado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tipo">Tipo de Centro</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produccion">Producción</SelectItem>
                  <SelectItem value="oficina">Oficina</SelectItem>
                  <SelectItem value="almacen">Almacén</SelectItem>
                  <SelectItem value="distribucion">Distribución</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-responsable">Responsable</Label>
              <Input
                id="edit-responsable"
                placeholder="Nombre del responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                type="tel"
                placeholder="+52 555 123 4567"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="centro@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-descripcion">Descripción</Label>
              <Textarea
                id="edit-descripcion"
                placeholder="Breve descripción del centro de trabajo..."
                rows={4}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Actualizar Centro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
