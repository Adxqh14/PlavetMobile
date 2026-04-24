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
import type { CreateTutorData } from "../types"

interface RegisterTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTutor: (tutor: CreateTutorData) => void
}

export function RegisterTutorDialog({ open, onOpenChange, onAddTutor }: RegisterTutorDialogProps) {
  const [formData, setFormData] = useState<CreateTutorData>(() => ({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    especialidadTecnica: "",
    areaAsignada: "",
    fechaContratacion: "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddTutor({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      especialidadTecnica: formData.especialidadTecnica,
      areaAsignada: formData.areaAsignada,
      fechaContratacion: formData.fechaContratacion,
    });
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      especialidadTecnica: "",
      areaAsignada: "",
      fechaContratacion: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Nuevo Tutor</DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo tutor al sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                required
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                required
                placeholder="Ej: Pérez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Ej: juan.perez@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
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
                required
                placeholder="Ej: Redes, Electricidad, Mecánica"
                value={formData.especialidadTecnica}
                onChange={(e) => setFormData({ ...formData, especialidadTecnica: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaAsignada">Área Asignada *</Label>
              <Input
                id="areaAsignada"
                required
                placeholder="Ej: Producción, Mantenimiento, Calidad"
                value={formData.areaAsignada}
                onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaContratacion">Fecha de Contratación *</Label>
              <Input
                id="fechaContratacion"
                type="date"
                required
                value={formData.fechaContratacion}
                onChange={(e) => setFormData({ ...formData, fechaContratacion: e.target.value })}
              />
            </div>

                      </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Tutor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
