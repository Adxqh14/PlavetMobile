"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog"
import { Badge } from "../../../../shared/components/ui/badge"
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card"
import {
  Mail,
  Phone,
  Calendar,
  Building2,
  Users,
} from "lucide-react";
import type { Tutor } from "../types"

interface ViewTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutor: Tutor | null
}

const statusStyles: Record<string, string> = {
  Activo: "bg-emerald-100 text-emerald-700 border-none shadow-none",
  Inactivo: "bg-gray-100 text-gray-700 border-none shadow-none",
};

export function ViewTutorDialog({ open, onOpenChange, tutor }: ViewTutorDialogProps) {
  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalles del Tutor Institucional</DialogTitle>
          <DialogDescription>
            Información completa del tutor institucional seleccionado
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
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                  <p className="font-semibold text-lg">{tutor.nombre} {tutor.apellido}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Correo electrónico</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm break-all">{tutor.email || "No asignado"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{tutor.telefono}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Creación</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{tutor.fechaCreacion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Centro de Trabajo */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Centro de Trabajo
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Centro de Trabajo Asignado</p>
                <p className="font-semibold text-lg">
                  {tutor.nombreCentroTrabajo
                    || (tutor.idCentroTrabajo ? `ID: ${tutor.idCentroTrabajo}` : "Sin asignar")}
                </p>
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
                    className={`${statusStyles[tutor.estado] || ""} border-none shadow-none`}
                  >
                    {tutor.estado}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">ID del Tutor</p>
                  <p className="text-sm text-muted-foreground">{tutor.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
