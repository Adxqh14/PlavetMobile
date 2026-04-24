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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import type { Tutor, TutorStatus } from "../types"

interface EditTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutor: Tutor | null
  onUpdateTutor?: (tutor: Tutor) => void
}

export function EditTutorDialog({ open, onOpenChange, tutor, onUpdateTutor }: EditTutorDialogProps) {
  const [formData, setFormData] = useState<Tutor>(() => ({
    id: tutor?.id || "",
    nombre: tutor?.nombre || "",
    apellido: tutor?.apellido || "",
    email: tutor?.email || "",
    telefono: tutor?.telefono || "",
    especialidadTecnica: tutor?.especialidadTecnica || "",
    areaAsignada: tutor?.areaAsignada || "",
    fechaContratacion: tutor?.fechaContratacion || "",
    status: tutor?.status || "pending",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onUpdateTutor && tutor) {
      onUpdateTutor({
        id: tutor.id,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        especialidadTecnica: formData.especialidadTecnica,
        areaAsignada: formData.areaAsignada,
        fechaContratacion: formData.fechaContratacion,
        status: formData.status,
      });
    }
    
    onOpenChange(false);
  };

  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={tutor?.id}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Tutor</DialogTitle>
          <DialogDescription>
            Modifica la información del tutor seleccionado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre *</Label>
              <Input
                id="edit-nombre"
                required
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-apellido">Apellido *</Label>
              <Input
                id="edit-apellido"
                required
                placeholder="Ej: Pérez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                required
                placeholder="Ej: juan.perez@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono *</Label>
              <Input
                id="edit-telefono"
                type="tel"
                required
                placeholder="Ej: +52 555 123 4567"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidadTecnica">Especialidad Técnica *</Label>
              <Input
                id="especialidadTecnica"
                value={formData.especialidadTecnica}
                onChange={(e) => setFormData({ ...formData, especialidadTecnica: e.target.value })}
                placeholder="Ej: Redes, Electricidad, Mecánica"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaAsignada">Área Asignada *</Label>
              <Input
                id="areaAsignada"
                value={formData.areaAsignada}
                onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
                placeholder="Ej: Producción, Mantenimiento, Calidad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-fechaContratacion">Fecha de Contratación *</Label>
              <Input
                id="edit-fechaContratacion"
                type="date"
                required
                value={formData.fechaContratacion}
                onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Estado *</Label>
              <Select value={formData.status} onValueChange={(value: TutorStatus) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Actualizar Tutor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
