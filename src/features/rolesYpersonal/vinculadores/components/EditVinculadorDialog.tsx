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
import { User, Mail, Phone, Edit, Landmark, CheckCircle2, Clock, Contact, Fingerprint } from "lucide-react"
import type { Vinculador, VinculadorStatus } from "../types"

interface EditVinculadorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vinculador: Vinculador | null
  onUpdateVinculador?: (data: Vinculador) => void
}

const EditVinculadorForm = ({ 
  vinculador, 
  onUpdateVinculador, 
  onCancel 
}: { 
  vinculador: Vinculador; 
  onUpdateVinculador?: (data: Vinculador) => void; 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<Vinculador>(vinculador);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateVinculador) {
      onUpdateVinculador(formData);
    }
  };

  return (
    <>
      <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Edit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Editar Vinculador</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Actualiza la información de <span className="font-bold text-foreground">{vinculador.nombre} {vinculador.apellido}</span>
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <form id="edit-vinculador-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Sección: Identidad Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Contact className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identidad Personal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre" className="text-sm font-semibold">Nombre *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-nombre"
                    required
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-apellido" className="text-sm font-semibold">Apellido *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-apellido"
                    required
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-cedula" className="text-sm font-semibold">Cédula de Identidad *</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-cedula"
                    required
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.cedula || ""}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Contacto y Estado */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Mail className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contacto y Estado</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-sm font-semibold">Correo Electrónico *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    required
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-telefono" className="text-sm font-semibold">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-telefono"
                    required
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-status" className="text-sm font-semibold">Estado *</Label>
                <Select value={formData.status} onValueChange={(value: VinculadorStatus) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="h-11 shadow-xs focus:ring-primary/30">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>Activo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>Pendiente</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sección: Asignación */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Landmark className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Asignación</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-area" className="text-sm font-semibold">Área Asignada *</Label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-area"
                  required
                  className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                  value={formData.areaAsignada}
                  onChange={(e) => setFormData({ ...formData, areaAsignada: e.target.value })}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          form="edit-vinculador-form"
          className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
        >
          Guardar Cambios
        </Button>
      </DialogFooter>
    </>
  );
};

export function EditVinculadorDialog({
  open,
  onOpenChange,
  vinculador,
  onUpdateVinculador,
}: EditVinculadorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {vinculador ? (
          <EditVinculadorForm 
            key={vinculador.id} 
            vinculador={vinculador} 
            onUpdateVinculador={(data) => {
              if (onUpdateVinculador) onUpdateVinculador(data);
              onOpenChange(false);
            }} 
            onCancel={() => onOpenChange(false)} 
          />
        ) : (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Cargando datos del vinculador...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
