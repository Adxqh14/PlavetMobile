"use client";

import React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import { useState } from "react";
import type { Estudiante, CreateEstudianteData, Genero, EstadoEstudiante, Carrera } from "../types";
import { CARRERAS } from "../types";

interface CreateEstudianteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateEstudianteData) => void;
}

export const CreateEstudianteDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateEstudianteDialogProps) => {
  const [formData, setFormData] = useState<CreateEstudianteData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    genero: "Masculino",
    estado: "Activo",
    carrera: "Informática",
    direccion: "",
    cedula: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      genero: "Masculino",
      estado: "Activo",
      carrera: "Informática",
      direccion: "",
      cedula: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Estudiante</DialogTitle>
          <DialogDescription>
            Crea un nuevo registro de estudiante en el sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
              />
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => setFormData({ ...formData, genero: value as Genero })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Select
                value={formData.carrera}
                onValueChange={(value) => setFormData({ ...formData, carrera: value as Carrera })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARRERAS.map((carrera) => (
                    <SelectItem key={carrera} value={carrera}>
                      {carrera}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
          </div>
                    <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Estudiante</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EditEstudianteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estudiante: Estudiante | null;
  onSubmit: (data: Estudiante) => void;
}

export const EditEstudianteDialog = ({
  open,
  onOpenChange,
  estudiante,
  onSubmit,
}: EditEstudianteDialogProps) => {
  const [formData, setFormData] = useState<Estudiante | null>(estudiante);

  React.useEffect(() => {
    setFormData(estudiante);
  }, [estudiante]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSubmit(formData);
      onOpenChange(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogDescription>
            Modifica la información del estudiante seleccionado.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apellido">Apellido</Label>
              <Input
                id="edit-apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cedula">Cédula</Label>
              <Input
                id="edit-cedula"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-direccion">Dirección</Label>
              <Input
                id="edit-direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => setFormData({ ...formData, genero: value as Genero })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-carrera">Carrera</Label>
              <Select
                value={formData.carrera}
                onValueChange={(value) => setFormData({ ...formData, carrera: value as Carrera })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARRERAS.map((carrera) => (
                    <SelectItem key={carrera} value={carrera}>
                      {carrera}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData({ ...formData, estado: value as EstadoEstudiante })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="Suspendido">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ViewEstudianteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estudiante: Estudiante | null;
  getEstadoBadge: (estado: string) => React.ReactNode;
}

export const ViewEstudianteDialog = ({
  open,
  onOpenChange,
  estudiante,
  getEstadoBadge,
}: ViewEstudianteDialogProps) => {
  if (!estudiante) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles del Estudiante</DialogTitle>
          <DialogDescription>
            Información completa del estudiante seleccionado
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <p className="text-base font-semibold">{estudiante.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Apellido</label>
              <p className="text-base font-semibold">{estudiante.apellido}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Cédula</label>
              <p className="text-base">{estudiante.cedula}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-base break-all">{estudiante.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Teléfono</label>
              <p className="text-base">{estudiante.telefono}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dirección</label>
              <p className="text-base">{estudiante.direccion}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Carrera</label>
              <p className="text-base">{estudiante.carrera}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Género</label>
              <p className="text-base">{estudiante.genero}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <div className="mt-1">
                {getEstadoBadge(estudiante.estado)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha de Ingreso</label>
              <p className="text-base">{estudiante.fechaIngreso}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteEstudianteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  estudianteNombre?: string;
  isInactivo?: boolean;
}

export const DeleteEstudianteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  estudianteNombre,
  isInactivo = false,
}: DeleteEstudianteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isInactivo ? "Eliminar Permanentemente" : "Cambiar Estado"}
          </DialogTitle>
          <DialogDescription>
            {isInactivo
              ? `¿Estás seguro de eliminar permanentemente a ${estudianteNombre}? Esta acción no se puede deshacer.`
              : `¿Estás seguro de cambiar el estado de ${estudianteNombre} a Inactivo? Podrás restaurarlo más tarde.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {isInactivo ? "Eliminar Permanentemente" : "Cambiar Estado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
