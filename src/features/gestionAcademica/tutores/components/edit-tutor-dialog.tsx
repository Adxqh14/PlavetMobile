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
    cedula: tutor?.cedula || "",
    areaAsignada: tutor?.areaAsignada || "",
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
        cedula: formData.cedula,
        areaAsignada: formData.areaAsignada,
        status: formData.status,
      });
    }
    
    onOpenChange(false);
  };

  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={tutor?.id}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl">Editar Tutor Académico</DialogTitle>
          <DialogDescription>
            Modifica la información del tutor seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  required
                  placeholder="Ej: juan.perez@ipisa.edu.do"
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
                  placeholder="Ej: +1 809 123 4567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  required
                  placeholder="Ej: 001-0000000-0"
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaAsignada">Área Asignada *</Label>
                <Input
                  id="areaAsignada"
                  value={formData.areaAsignada}
                  onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
                  placeholder="Ej: Informática, Talleres, Académica"
                  required
                />
              </div>
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
          </form>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-form">Actualizar Tutor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
