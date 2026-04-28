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
    cedula: "",
    areaAsignada: "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAddTutor({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      cedula: formData.cedula,
      areaAsignada: formData.areaAsignada,
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
      cedula: "",
      areaAsignada: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl">Registrar Nuevo Tutor Académico</DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo tutor al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Ej: juan.perez@ipisa.edu.do"
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
                  required
                  placeholder="Ej: Informática, Talleres, Académica"
                  value={formData.areaAsignada}
                  onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
                />
              </div>
            </div>
          </form>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="register-form">Registrar Tutor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
