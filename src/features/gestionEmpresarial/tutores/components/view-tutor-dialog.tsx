"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "../../../../shared/components/ui/dialog"
import { Button } from "../../../../shared/components/ui/button"
import {
  Mail,
  Phone,
  Building2,
  User,
  Landmark,
  Contact,
  Fingerprint
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { canViewSensitiveData } from "@/shared/config/rbac";
import type { Tutor } from "../types"

interface ViewTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutor: Tutor | null
}

const getStatusStyles = (estado: string) => {
  const normalized = estado?.toLowerCase();
  if (normalized === "activo") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (normalized === "inactivo") return "bg-gray-100 text-gray-700 border-gray-200";
  return "bg-muted text-muted-foreground";
};

export function ViewTutorDialog({ open, onOpenChange, tutor }: ViewTutorDialogProps) {
  const { userRole } = useAuth();
  const showSensitiveData = canViewSensitiveData(userRole);

  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getStatusStyles(tutor.estado)}`}>
              {tutor.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {tutor.nombre} {tutor.apellido}
            </h2>
            {showSensitiveData && (
              <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" /> {tutor.cedula || "N/A"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Información de Contacto */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Contact className="h-3.5 w-3.5 text-primary" /> Información de Contacto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Correo Electrónico</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold truncate">{tutor.email || "—"}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{tutor.telefono || "—"}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Información Laboral */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Información Laboral
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Centro de Trabajo</p>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{tutor.nombreCentroTrabajo || "—"}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Departamento</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{tutor.departamento || "—"}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t shrink-0">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-8 font-semibold shadow-md active:scale-95 transition-all"
          >
            Cerrar Detalles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
