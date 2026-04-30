"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "../../../../shared/components/ui/dialog"
import { Badge } from "../../../../shared/components/ui/badge"
import { Button } from "../../../../shared/components/ui/button"
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";
import type { Tutor } from "../types"

interface ViewTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutor: Tutor | null
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 border-none shadow-none",
  pending: "bg-amber-100 text-amber-700 border-none shadow-none",
  deleted: "bg-gray-100 text-gray-700 border-none shadow-none",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  pending: "Pendiente",
  deleted: "Inhabilitado",
};

export function ViewTutorDialog({ open, onOpenChange, tutor }: ViewTutorDialogProps) {
  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header con Perfil */}
        <div className="relative h-32 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className={`${statusStyles[tutor.status]} px-3 py-1 text-sm font-semibold shadow-sm backdrop-blur-sm`}>
              {statusLabels[tutor.status]}
            </Badge>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {tutor.nombre} {tutor.apellido}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Tutor Académico <span className="mx-2">•</span> ID: {tutor.id}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Contacto */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" /> Información de Contacto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Email Institucional</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold truncate">{tutor.email}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{tutor.telefono}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Datos Académicos */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Ubicación y Asignación
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Área Asignada</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{tutor.areaAsignada}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Cédula</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{tutor.cedula}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Información del Sistema (si aplica) */}
            {tutor.deletedAt && (
              <section className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                <div className="flex items-center gap-3 text-destructive">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-bold">Registro Inhabilitado</p>
                    <p className="text-xs opacity-80">Fecha de baja: {tutor.deletedAt}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t flex items-center justify-end gap-3 shrink-0">
          <Button 
            onClick={() => onOpenChange(false)}
            className="px-8 font-semibold shadow-md transition-all active:scale-95"
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
