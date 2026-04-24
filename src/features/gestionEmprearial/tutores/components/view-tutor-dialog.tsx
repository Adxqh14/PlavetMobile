"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog"
import { Badge } from "../../../../shared/components/ui/badge"
import { Button } from "../../../../shared/components/ui/button"
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Tutor</DialogTitle>
          <DialogDescription>
            Información completa del tutor seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información Personal */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Información Personal
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                    <p className="font-semibold text-lg">{tutor.nombre} {tutor.apellido}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm break-all">{tutor.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{tutor.telefono}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Contratación</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{tutor.fechaContratacion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Técnica */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Información Técnica
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Especialidad Técnica</p>
                  <p className="font-semibold text-lg">{tutor.especialidadTecnica}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Área Asignada</p>
                  <p className="font-semibold text-lg">{tutor.areaAsignada}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Estado del Tutor
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                  <Badge
                    className={`${statusStyles[tutor.status] || ""} border-none shadow-none`}
                  >
                    {statusLabels[tutor.status] || tutor.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ID del Tutor</p>
                  <p className="text-sm text-muted-foreground">{tutor.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          {tutor.deletedAt && (
            <Card className="border-2 border-muted/50">
              <CardHeader className="bg-muted/30">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Información de Eliminación
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Eliminación</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{tutor.deletedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
