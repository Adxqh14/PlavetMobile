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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import { User, Mail, Phone, Building2, Edit, Landmark, Contact, Fingerprint, Activity } from "lucide-react"
import type { Tutor, UpdateTutorData } from "../types"
import { centroTrabajoService } from "../../centroDeTrabajo/services/centroTrabajoService"

interface EditTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutor: Tutor | null
  onUpdateTutor?: (id: string, data: UpdateTutorData) => Promise<boolean | void>
}

const EditTutorForm = ({
  tutor,
  onUpdateTutor,
  onCancel
}: {
  tutor: Tutor;
  onUpdateTutor?: (id: string, data: UpdateTutorData) => Promise<boolean | void>;
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<UpdateTutorData>({
    nombre: tutor.nombre,
    apellido: tutor.apellido,
    cedula: tutor.cedula,
    email: tutor.email,
    telefono: tutor.telefono,
    centro_trabajo_nombre: tutor.nombreCentroTrabajo,
    departamento: tutor.departamento,
    estado: tutor.estado,
  });

  const [centros, setCentros] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    centroTrabajoService.getAll({ pageSize: 200 }).then((res) => {
      setCentros(res.data.map((c) => ({ id: c.id, name: c.name })));
    }).catch(() => setCentros([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTutor) {
      await onUpdateTutor(tutor.id, formData);
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
            <DialogTitle className="text-2xl font-bold tracking-tight">Editar Tutor</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Actualiza la información de <span className="font-bold text-foreground">{tutor.nombre} {tutor.apellido}</span>
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <form id="edit-tutor-form" onSubmit={handleSubmit} className="space-y-8">
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
                    value={formData.nombre ?? ""}
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
                    value={formData.apellido ?? ""}
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
                    value={formData.cedula ?? ""}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Contacto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Mail className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Información de Contacto</h3>
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
                    value={formData.email ?? ""}
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
                    value={formData.telefono ?? ""}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Ubicación Laboral */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ubicación Laboral</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-centro" className="text-sm font-semibold">Centro de Trabajo *</Label>
                <Select
                  value={formData.centro_trabajo_nombre ?? ""}
                  onValueChange={(value) => setFormData({ ...formData, centro_trabajo_nombre: value })}
                >
                  <SelectTrigger className="h-11 shadow-xs focus:ring-primary/30">
                    <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Seleccionar centro de trabajo" />
                  </SelectTrigger>
                  <SelectContent>
                    {centros.length === 0 ? (
                      <SelectItem value="__loading__" disabled>Cargando centros...</SelectItem>
                    ) : (
                      centros.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-depto" className="text-sm font-semibold">Departamento *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-depto"
                    required
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.departamento ?? ""}
                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Estado de la Cuenta */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estado del tutor</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-estado" className="text-sm font-semibold">Estado *</Label>
                <Select
                  value={formData.estado ?? "Activo"}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger id="edit-estado" className="h-11 shadow-xs focus:ring-primary/30">
                    <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
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
          form="edit-tutor-form"
          className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
        >
          Actualizar Tutor
        </Button>
      </DialogFooter>
    </>
  );
};

export function EditTutorDialog({ open, onOpenChange, tutor, onUpdateTutor }: EditTutorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {tutor ? (
          <EditTutorForm
            key={tutor.id}
            tutor={tutor}
            onUpdateTutor={async (id, data) => {
              if (onUpdateTutor) {
                const success = await onUpdateTutor(id, data);
                if (success !== false) {
                  onOpenChange(false);
                }
                return success;
              }
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Cargando datos del tutor...</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
