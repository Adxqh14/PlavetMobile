"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "../../../../shared/components/ui/dialog"
import { Button } from "../../../../shared/components/ui/button"
import {
  Building2,
  MapPin,
  UserCircle2,
  Calendar,
  ShieldCheck,
  ShieldAlert} from "lucide-react"
import type { CentroTrabajo } from "../types"

interface ViewCenterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  centro: CentroTrabajo | null
}

export function ViewCenterDialog({ open, onOpenChange, centro }: ViewCenterDialogProps) {
  const getEstadoStyles = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pendiente":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "rechazado":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "inactivo":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20";
    }
  };

  const getEstadoLabel = (status: string) => {
    switch (status) {
      case "activo": return "Activo";
      case "pendiente": return "Pendiente";
      case "rechazado": return "Rechazado";
      case "inactivo": return "Inactivo";
      default: return status;
    }
  };

  if (!centro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getEstadoStyles(centro.status)}`}>
              {getEstadoLabel(centro.status)}
            </span>
            {centro.validated ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-3 w-3" /> Validado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm backdrop-blur-sm">
                <ShieldAlert className="h-3 w-3" /> No Validado
              </span>
            )}
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {centro.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Ubicación
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Ubicación General</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{centro.location || "No especificada"}</p>
                  </div>
                </div>
                {centro.direccion && (
                  <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-bold">Dirección Detallada</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      <p className="text-sm font-semibold">{centro.direccion}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Información de Contacto */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <UserCircle2 className="h-3.5 w-3.5 text-primary" /> Datos de Contacto
              </h3>
              <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Persona de Contacto</p>
                <div className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4 text-primary/70" />
                  <p className="text-sm font-semibold">{centro.contacto || "No asignado"}</p>
                </div>
              </div>
            </section>

            {/* Metadatos */}
            {centro.deletedAt && (
              <section className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-rose-600">
                    <Calendar className="h-4 w-4" />
                    <div className="text-xs">
                      <p>Eliminado el</p>
                      <p className="font-semibold">{centro.deletedAt}</p>
                    </div>
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
