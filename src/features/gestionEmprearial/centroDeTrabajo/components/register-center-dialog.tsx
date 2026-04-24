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
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import type { CentroTrabajo, CentroStatus } from "../types"

interface RegisterCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCentro: (centro: Omit<CentroTrabajo, 'id' | 'createdAt' | 'deletedAt'>) => void;
}

interface FormData {
  nombre: string;
  direccion: string;
  contacto: string;
  estado: string;
  restriccion_edad: boolean;
  ubicacion: string;
  tipo: string;
  id_usuario?: number | null;
  validacion?: string | null;
}

export function RegisterCenterDialog({ 
  open, 
  onOpenChange, 
  onAddCentro 
}: RegisterCenterDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    direccion: "",
    contacto: "",
    estado: "activo",
    restriccion_edad: false,
    ubicacion: "",
    tipo: "oficina",
    id_usuario: null,
    validacion: null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que se hayan ingresado dirección y contacto
    if (!formData.direccion || !formData.contacto) {
      alert('Por favor complete todos los campos obligatorios')
      return
    }

    const centroTrabajo: Omit<CentroTrabajo, 'id' | 'createdAt' | 'deletedAt'> = {
      name: formData.nombre,
      location: formData.ubicacion,
      employees: 1, // Valor por defecto requerido por la interfaz
      status: formData.estado as CentroStatus,
      validated: false,
      // Campos adicionales para la base de datos
      direccion: formData.direccion,
      contacto: formData.contacto,
      restriccion_edad: formData.restriccion_edad,
      id_usuario: formData.id_usuario || null,
      validacion: formData.validacion || null
    }

    onAddCentro(centroTrabajo)
    
    // Reset form
    setFormData({
      nombre: "",
      direccion: "",
      contacto: "",
      estado: "activo",
      restriccion_edad: false,
      ubicacion: "",
      tipo: "oficina",
      id_usuario: null,
      validacion: null
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Nuevo Centro de Trabajo</DialogTitle>
          <DialogDescription>
            Complete la información para registrar un nuevo centro de trabajo en el sistema
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
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                required
                placeholder="Ej: Av. Principal 123"
                value={formData.direccion}
                onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contacto">Contacto *</Label>
              <Input
                id="contacto"
                required
                placeholder="Ej: Juan Pérez"
                value={formData.contacto}
                onChange={(e) => setFormData(prev => ({ ...prev, contacto: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select 
                value={formData.estado} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="restriccion_edad" 
                checked={formData.restriccion_edad}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, restriccion_edad: Boolean(checked) }))
                }
              />
              <Label htmlFor="restriccion_edad">¿Tiene restricción de edad?</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                required
                placeholder="Ej: Ciudad de México"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Centro *</Label>
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
