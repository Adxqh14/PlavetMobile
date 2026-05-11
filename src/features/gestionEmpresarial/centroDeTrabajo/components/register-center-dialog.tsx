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
import { Mail, Phone, MapPin, Building2, Globe, Map } from "lucide-react"
import { cleanAlphanumeric, cleanNumbersOnly } from "@/shared/utils/validation"

import type { CreateCentroData } from "../types"

interface RegisterCenterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCentro: (centro: CreateCentroData) => Promise<boolean | void>;
}

interface FormData {
  nombre: string;
  telefono: string;
  email: string;
  restriccion_edad: boolean;
  pais: string;
  provincia: string;
  calle: string;
  referencia: string;
}

export function RegisterCenterDialog({
  open,
  onOpenChange,
  onAddCentro
}: RegisterCenterDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    telefono: "",
    email: "",
    restriccion_edad: false,
    pais: "",
    provincia: "",
    calle: "",
    referencia: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const centroTrabajo: CreateCentroData = {
      name: formData.nombre,
      telefono: formData.telefono,
      email: formData.email,
      restriccion_edad: formData.restriccion_edad,
      status: "activo",
      direccion: {
        pais: formData.pais || undefined,
        provincia: formData.provincia || undefined,
        calle: formData.calle || undefined,
        referencia: formData.referencia || undefined,
      },
    }

    const success = await onAddCentro(centroTrabajo)

    if (success !== false) {
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        restriccion_edad: false,
        pais: "",
        provincia: "",
        calle: "",
        referencia: "",
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nuevo Centro de Trabajo</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Registra una nueva empresa o sucursal asociada al programa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="register-center-form" onSubmit={handleSubmit} className="space-y-8">

            {/* Sección: Datos de la Empresa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Datos de la Empresa</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="nombre" className="text-xs font-semibold">Nombre Comercial / Razón Social *</Label>
                  <Input
                    id="nombre"
                    required
                    placeholder="Ej: Industrias del Norte S.A."
                    className="h-10 text-sm shadow-xs"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: cleanAlphanumeric(e.target.value) }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="text-xs font-semibold">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefono"
                      required
                      className="pl-10 h-10 text-sm shadow-xs"
                      placeholder="809-000-0000"
                      value={formData.telefono}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: cleanNumbersOnly(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Correo Electrónico *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10 h-10 text-sm shadow-xs"
                      placeholder="contacto@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Dirección */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección y Ubicación</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pais" className="text-xs font-semibold">País</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pais"
                      className="pl-10 h-10 text-sm shadow-xs"
                      placeholder="Ej: República Dominicana"
                      value={formData.pais}
                      onChange={(e) => setFormData(prev => ({ ...prev, pais: cleanAlphanumeric(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="provincia" className="text-xs font-semibold">Provincia</Label>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="provincia"
                      className="pl-10 h-10 text-sm shadow-xs"
                      placeholder="Ej: Santiago"
                      value={formData.provincia}
                      onChange={(e) => setFormData(prev => ({ ...prev, provincia: cleanAlphanumeric(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="calle" className="text-xs font-semibold">Calle</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="calle"
                      className="pl-10 h-10 text-sm shadow-xs"
                      placeholder="Ej: Av. Juan Pablo Duarte #10"
                      value={formData.calle}
                      onChange={(e) => setFormData(prev => ({ ...prev, calle: cleanAlphanumeric(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="referencia" className="text-xs font-semibold">Referencia</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="referencia"
                      className="pl-10 h-10 text-sm shadow-xs"
                      placeholder="Ej: Frente al Monumento"
                      value={formData.referencia}
                      onChange={(e) => setFormData(prev => ({ ...prev, referencia: cleanAlphanumeric(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Requisitos */}
            <div className="pt-2">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/30 border border-muted/50 transition-all hover:bg-muted/50">
                <Checkbox
                  id="restriccion_edad"
                  className="h-5 w-5"
                  checked={formData.restriccion_edad}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, restriccion_edad: Boolean(checked) }))
                  }
                />
                <div className="space-y-0.5">
                  <Label htmlFor="restriccion_edad" className="text-sm font-bold cursor-pointer">
                    Restricción de Edad
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Marcar si el centro requiere que el estudiante sea mayor de edad.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="register-center-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Registrar Centro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
