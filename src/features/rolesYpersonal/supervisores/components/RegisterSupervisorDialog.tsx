import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { useState } from "react";
import type { SupervisorFormData } from "../types";

interface RegisterSupervisorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSupervisor: (data: SupervisorFormData) => void;
}

export function RegisterSupervisorDialog({
  open,
  onOpenChange,
  onAddSupervisor,
}: RegisterSupervisorDialogProps) {
  const [formData, setFormData] = useState<SupervisorFormData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    id_centro_trabajo: 0,
    estado: "activo",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSupervisor(formData);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      id_centro_trabajo: 0,
      estado: "activo",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Supervisor</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo supervisor para el sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="id_centro_trabajo">Centro de Trabajo</Label>
            <Select
              value={formData.id_centro_trabajo ? formData.id_centro_trabajo.toString() : ""}
              onValueChange={(value) => setFormData({ ...formData, id_centro_trabajo: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un centro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Centro Educativo Norte</SelectItem>
                <SelectItem value="2">Centro Educativo Sur</SelectItem>
                <SelectItem value="3">Centro Educativo Este</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => setFormData({ ...formData, estado: value as 'activo' | 'inactivo' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Registrar Supervisor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
