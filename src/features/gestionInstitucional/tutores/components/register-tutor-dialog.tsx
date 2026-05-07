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
import type { CreateTutorData } from "../types"
import { centroTrabajoService } from "@/features/gestionEmprearial/centroDeTrabajo/services/centroTrabajoService"
import type { PaginatedResponse } from "@/lib/api"
import type { CentroTrabajo } from "@/features/gestionEmprearial/centroDeTrabajo/types"

interface CentroOption {
  id: string;
  name: string;
}

interface RegisterTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTutor: (tutor: CreateTutorData) => void
}

export function RegisterTutorDialog({ open, onOpenChange, onAddTutor }: RegisterTutorDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    idCentroTrabajo: "",
  });
  const [centros, setCentros] = useState<CentroOption[]>([]);
  const [loadingCentros, setLoadingCentros] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingCentros(true);
      centroTrabajoService
        .getAll({ pageSize: 100, estado: "Activo" })
        .then((res: PaginatedResponse<CentroTrabajo>) => {
          setCentros(res.data.map((c: CentroTrabajo) => ({ id: String(c.id), name: c.name })));
        })
        .catch((err: Error) => console.error("Error loading centros:", err))
        .finally(() => setLoadingCentros(false));
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAddTutor({
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      correo: formData.correo || undefined,
      idCentroTrabajo: formData.idCentroTrabajo
        ? Number(formData.idCentroTrabajo)
        : undefined,
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      idCentroTrabajo: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Registrar Nuevo Tutor Institucional</DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo tutor institucional al sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                required
                placeholder="Ej: Laura"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                required
                placeholder="Ej: Martínez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                required
                placeholder="Ej: +1 809 555 8181"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: laura@empresa.com"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="idCentroTrabajo">Centro de Trabajo</Label>
              <Select
                value={formData.idCentroTrabajo}
                onValueChange={(value) =>
                  setFormData({ ...formData, idCentroTrabajo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCentros ? "Cargando..." : "Seleccionar centro de trabajo"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {centros.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Tutor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}