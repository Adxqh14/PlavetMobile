"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
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
      <DialogContent showCloseButton={false} className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <DialogTitle className="sr-only">{tutor.nombre} {tutor.apellido}</DialogTitle>
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
          {/* Título Principal */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
              {tutor.nombre} {tutor.apellido}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
                Tutor Académico
              </Badge>
              {tutor.fechaCreacion && (
                <span className="text-xs text-muted-foreground font-medium">
                  • Miembro desde: {new Date(tutor.fechaCreacion).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Contact Card */}
            <div className="p-5 rounded-3xl bg-muted/20 border border-muted/40 shadow-xs">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-1">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-background/50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Email Institucional</p>
                    <p className="text-sm font-bold text-foreground truncate" title={tutor.email}>{tutor.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-background/50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Teléfono de Contacto</p>
                    <p className="text-sm font-bold text-foreground">{tutor.telefono}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Card */}
            <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 shadow-xs">
               <h3 className="text-[10px] font-black text-primary/70 uppercase tracking-[0.2em] mb-4 px-1">Asignación Académica</h3>
               <div className="flex items-center gap-4 p-2 rounded-2xl bg-background/40 border border-primary/5">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary/60 uppercase">Área / Taller de Especialidad</p>
                    <p className="text-sm font-black text-foreground">{tutor.areaAsignada || "Sin asignar"}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Estado de Baja */}
          {tutor.deletedAt && (
            <div className="mt-6 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-destructive uppercase tracking-tight">Registro Inhabilitado</p>
                <p className="text-xs text-destructive/70 font-medium">Fecha de baja: {tutor.deletedAt}</p>
              </div>
            </div>
          )}
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
