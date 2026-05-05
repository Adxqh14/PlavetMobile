"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog"
import { Badge } from "../../../../shared/components/ui/badge"
import { Building2, User, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock } from "lucide-react"
import type { CentroTrabajo } from "../types"

interface ViewCenterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  centro: CentroTrabajo | null
}

export function ViewCenterDialog({ open, onOpenChange, centro }: ViewCenterDialogProps) {
  const getEstadoBadge = (status: string) => {
    switch (status) {
      case "activo":
        return <Badge className="bg-emerald-100 text-emerald-700 border-none">Activo</Badge>;
      case "pendiente":
        return <Badge className="bg-amber-100 text-amber-700 border-none">Pendiente</Badge>;
      case "rechazado":
        return <Badge className="bg-rose-100 text-rose-700 border-none">Rechazado</Badge>;
      case "inactivo":
        return <Badge className="bg-gray-100 text-gray-700 border-none">Inactivo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  if (!centro) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Detalles del Centro de Trabajo
          </DialogTitle>
          <DialogDescription>
            Información completa del centro de trabajo seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Columna Izquierda: Información General */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Información General</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nombre del Centro</p>
                    <p className="text-sm font-bold">{centro.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ubicación / Dirección</p>
                    <p className="text-sm">{centro.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estado y Validación</p>
                    <div className="flex gap-2 mt-1">
                      {getEstadoBadge(centro.status)}
                      <Badge className={centro.validated ? "bg-blue-100 text-blue-700 border-none" : "bg-gray-100 text-gray-700 border-none"}>
                        {centro.validated ? "Validado" : "No Validado"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Registro Temporada</h3>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de Creación</p>
                  <p className="text-sm">{formatDate(centro.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Contacto y Responsable */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contacto de la Empresa</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Responsable</p>
                    <p className="text-sm font-semibold">{centro.responsable || "No asignado"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm">{centro.telefono || "Sin teléfono"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{centro.email || "Sin correo electrónico"}</p>
                  </div>
                </div>
              </div>
            </div>

            {centro.descripcion && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Descripción</h3>
                <p className="text-sm bg-muted/50 p-3 rounded-lg border italic">
                  "{centro.descripcion}"
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
