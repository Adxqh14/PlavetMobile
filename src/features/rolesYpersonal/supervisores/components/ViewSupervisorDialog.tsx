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
  User,
  Calendar,
  Info,
  Contact,
  Fingerprint,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { canViewSensitiveData } from "@/shared/config/rbac";
import type { Supervisor } from "../types"

interface ViewSupervisorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supervisor: Supervisor | null
}

const getEstadoStyles = (supervisor: Supervisor) => {
  if (supervisor.deleted_at) return "bg-red-100 text-red-700 border-red-200";
  if (supervisor.estado === "activo") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getEstadoLabel = (supervisor: Supervisor) => {
  if (supervisor.deleted_at) return "Eliminado";
  return supervisor.estado === "activo" ? "Activo" : "Inactivo";
};

export function ViewSupervisorDialog({ open, onOpenChange, supervisor }: ViewSupervisorDialogProps) {
  const { userRole } = useAuth();
  const showSensitiveData = canViewSensitiveData(userRole);

  if (!supervisor) return null;

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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getEstadoStyles(supervisor)}`}>
              {getEstadoLabel(supervisor)}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {supervisor.nombre} {supervisor.apellido}
            </h2>
            {showSensitiveData && (
              <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" /> {supervisor.cedula || "N/A"}
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
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Correo Electrónico</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary/70 shrink-0" />
                    <p className="text-sm font-semibold truncate">{supervisor.email}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{supervisor.telefono}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Fecha de creación */}
            {supervisor.fecha_creacion && (
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Registro en el Sistema
                </h3>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Fecha de Creación</p>
                  <p className="text-sm font-semibold">
                    {new Date(supervisor.fecha_creacion).toLocaleDateString("es-DO")}
                  </p>
                </div>
              </section>
            )}

            {/* Eliminado */}
            {supervisor.deleted_at && (
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-primary" /> Información del Sistema
                </h3>
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10">
                  <div className="flex items-center gap-2 text-destructive">
                    <Calendar className="h-4 w-4" />
                    <p className="text-sm font-semibold">
                      Eliminado el:{" "}
                      {new Date(supervisor.deleted_at).toLocaleDateString("es-DO")}
                    </p>
                  </div>
                </div>
              </section>
            )}
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
