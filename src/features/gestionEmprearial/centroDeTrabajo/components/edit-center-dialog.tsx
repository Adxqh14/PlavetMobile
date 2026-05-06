"use client"

import { useState, useEffect } from "react"
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
import { Building2, MapPin, UserCircle2, Phone, Mail, ShieldCheck } from "lucide-react"
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
    direccion: centro?.direccion || "",
    contacto: centro?.contacto || "",
    telefono: centro?.telefono || "",
    email: centro?.email || "",
    restriccion_edad: centro?.restriccion_edad || false,
    status: centro?.status || ("pending" as CentroStatus),
    validated: centro?.validated || false,
  });

  useEffect(() => {
    if (centro) {
      setFormData({
        nombre: centro.name || "",
        direccion: centro.direccion || centro.location || "",
        contacto: centro.contacto || "",
        telefono: centro.telefono || "",
        email: centro.email || "",
        restriccion_edad: centro.restriccion_edad || false,
        status: centro.status || "pending",
        validated: centro.validated || false,
      });
    }
  }, [centro]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onUpdateCentro && centro) {
      onUpdateCentro({
        ...centro,
        name: formData.nombre,
        location: formData.direccion, // Sincronizado con dirección
        direccion: formData.direccion,
        contacto: formData.contacto,
        telefono: formData.telefono,
        email: formData.email,
        restriccion_edad: formData.restriccion_edad,
        status: formData.status,
        validated: formData.validated,
      });
    }
    
    onOpenChange(false);
  };

  if (!centro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={centro.id} className="sm:max-w-[600px] max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Editar Centro de Trabajo
          </DialogTitle>
          <DialogDescription>
            Actualiza la información de la empresa o sucursal seleccionada.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form id="edit-center-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre del Centro / Empresa *</Label>
                <Input
                  id="edit-nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-direccion">Dirección Física *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-direccion"
                    required
                    className="pl-10"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-telefono">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-telefono"
                    required
                    className="pl-10"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    required
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Estado del Centro</Label>
                <Select value={formData.status} onValueChange={(value: CentroStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox 
                  id="edit-restriccion_edad" 
                  checked={formData.restriccion_edad}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, restriccion_edad: Boolean(checked) }))
                  }
                />
                <Label htmlFor="edit-restriccion_edad" className="text-sm font-medium leading-none cursor-pointer">
                  ¿Tiene restricción de edad?
                </Label>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <Checkbox 
                  id="edit-validated" 
                  checked={formData.validated}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, validated: Boolean(checked) }))
                  }
                />
                <Label htmlFor="edit-validated" className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Centro Validado
                </Label>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-center-form">Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
