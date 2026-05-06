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
import type { CentroTrabajo, CentroStatus } from "@/features/gestionEmprearial/centroDeTrabajo/types"

interface RegisterCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCentro: (centro: Partial<CentroTrabajo>) => void;
}

export function RegisterCenterDialog({ 
  open, 
  onOpenChange, 
  onAddCentro 
}: RegisterCenterDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    tipo: "oficina",
    responsable: "",
    telefono: "",
    email: "",
    descripcion: "",
    status: "pendiente" as CentroStatus,
    restriccion_edad: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onAddCentro({
      name: formData.nombre,
      location: formData.ubicacion,
      status: formData.status,
      tipo: formData.tipo,
      responsable: formData.responsable,
      telefono: formData.telefono,
      email: formData.email,
      descripcion: formData.descripcion,
      restriccion_edad: formData.restriccion_edad,
      employees: 1,
      validated: false
    })
    
    // Reset form
    setFormData({
      nombre: "",
      ubicacion: "",
      tipo: "oficina",
      responsable: "",
      telefono: "",
      email: "",
      descripcion: "",
      status: "pendiente",
      restriccion_edad: false,
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Nuevo Centro de Trabajo</DialogTitle>
          <DialogDescription>
            Complete la información para registrar un nuevo centro de trabajo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Centro *</Label>
              <Input
                id="nombre"
                required
                placeholder="Ej: Centro Norte"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                required
                placeholder="Ej: Ciudad de México"
                value={formData.ubicacion}
                onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: CentroStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Centro</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
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
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                placeholder="Nombre del responsable"
                value={formData.responsable}
                onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                placeholder="+52 555 123 4567"
                value={formData.telefono}
                onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="centro@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Breve descripción del centro de trabajo..."
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Centro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
