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
import { User, Mail, Phone, Building2, Landmark, Contact, Fingerprint } from "lucide-react"
import { cleanLettersOnly, cleanNumbersOnly, cleanCedula, cleanAlphanumeric } from "@/shared/utils/validation"
import type { CreateTutorData } from "../types"
import { centroTrabajoService } from "../../centroDeTrabajo/services/centroTrabajoService"

interface RegisterTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTutor: (tutor: CreateTutorData) => Promise<boolean | void>
}

const RegisterTutorForm = ({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: CreateTutorData) => Promise<boolean | void>;
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<CreateTutorData>({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    centro_trabajo_nombre: "",
    departamento: "",
  });

  const [centros, setCentros] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    centroTrabajoService.getAll({ pageSize: 200 }).then((res) => {
      setCentros(res.data.map((c) => ({ id: c.id, name: c.name })));
    }).catch(() => setCentros([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <>
      <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Nuevo Tutor Empresarial</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Registra un nuevo supervisor de la empresa para el seguimiento de pasantías.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <form id="register-tutor-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Sección: Identidad Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Contact className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identidad Personal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-semibold">Nombre *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    required
                    placeholder="Ej: Juan"
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: cleanLettersOnly(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-sm font-semibold">Apellido *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apellido"
                    required
                    placeholder="Ej: Pérez"
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: cleanLettersOnly(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cedula" className="text-sm font-semibold">Cédula de Identidad *</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cedula"
                    required
                    placeholder="40200000000"
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: cleanCedula(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Contacto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Phone className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Información de Contacto</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Correo Electrónico *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="juan.perez@empresa.com"
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-semibold">Teléfono / WhatsApp *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    type="tel"
                    required
                    placeholder="8090000000"
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: cleanNumbersOnly(e.target.value) })}
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
                <Label htmlFor="centroTrabajo" className="text-sm font-semibold">Centro de Trabajo *</Label>
                <Select
                  value={formData.centro_trabajo_nombre}
                  onValueChange={(value) => setFormData({ ...formData, centro_trabajo_nombre: value })}
                  required
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
                <Label htmlFor="departamento" className="text-sm font-semibold">Departamento *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="departamento"
                    required
                    placeholder="Ej: Mantenimiento, TI..."
                    className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    value={formData.departamento}
                    onChange={(e) => setFormData({ ...formData, departamento: cleanAlphanumeric(e.target.value) })}
                  />
                </div>
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
          form="register-tutor-form"
          className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
        >
          Registrar Tutor
        </Button>
      </DialogFooter>
    </>
  );
};

export function RegisterTutorDialog({ open, onOpenChange, onAddTutor }: RegisterTutorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {open && (
          <RegisterTutorForm
            onSubmit={async (data) => {
              const success = await onAddTutor(data);
              if (success !== false) {
                onOpenChange(false);
              }
              return success;
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
