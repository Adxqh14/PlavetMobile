"use client";

import React, { useState, useEffect } from "react";
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
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  CreditCard,
  Briefcase,
  IdCard,
  MapPinned
} from "lucide-react";
import type { Estudiante, CreateEstudianteData, Genero, EstadoEstudiante, Carrera } from "../types";
import { CARRERAS } from "../types";

// Helper para badges de estado
const getEstadoStyles = (estado: string) => {
  switch (estado) {
    case "Activo":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Inactivo":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "Suspendido":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

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
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Nuevo Estudiante
          </DialogTitle>
          <DialogDescription>
            Crea un nuevo registro de estudiante en el sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form id="create-student-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Juan"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  placeholder="Ej: Pérez"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cedula"
                    placeholder="001-0000000-0"
                    className="pl-10"
                    value={formData.cedula}
                    onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Institucional *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="estudiante@ipisa.edu.do"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telefono"
                    placeholder="809-000-0000"
                    className="pl-10"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) => setFormData({ ...formData, genero: value as Genero })}
                >
                  <SelectTrigger id="genero">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <div className="relative">
                <MapPinned className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="direccion"
                  placeholder="Calle, Sector, Ciudad..."
                  className="pl-10"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera Académica *</Label>
              <Select
                value={formData.carrera}
                onValueChange={(value) => setFormData({ ...formData, carrera: value as Carrera })}
              >
                <SelectTrigger id="carrera">
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
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="create-student-form">Crear Estudiante</Button>
        </DialogFooter>
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

  useEffect(() => {
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
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Editar Estudiante
          </DialogTitle>
          <DialogDescription>
            Modifica la información del estudiante seleccionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-apellido">Apellido *</Label>
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
                <Label htmlFor="edit-cedula">Cédula *</Label>
                <Input
                  id="edit-cedula"
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
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
                <Label htmlFor="edit-telefono">Teléfono *</Label>
                <Input
                  id="edit-telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-genero">Género</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) => setFormData({ ...formData, genero: value as Genero })}
                >
                  <SelectTrigger id="edit-genero">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-direccion">Dirección *</Label>
              <Input
                id="edit-direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-carrera">Carrera *</Label>
                <Select
                  value={formData.carrera}
                  onValueChange={(value) => setFormData({ ...formData, carrera: value as Carrera })}
                >
                  <SelectTrigger id="edit-carrera">
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
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado *</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value as EstadoEstudiante })}
                >
                  <SelectTrigger id="edit-estado">
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
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-student-form">Guardar Cambios</Button>
        </DialogFooter>
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
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getEstadoStyles(estudiante.estado)}`}>
              {estudiante.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {estudiante.nombre} {estudiante.apellido}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <IdCard className="h-3.5 w-3.5" /> {estudiante.cedula} <span className="mx-2">•</span> Ingreso: {estudiante.fechaIngreso}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Información de Contacto */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" /> Datos de Contacto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Email Institucional</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold truncate">{estudiante.email}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.telefono}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Dirección Residencial</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <p className="text-sm font-semibold">{estudiante.direccion}</p>
                </div>
              </div>
            </section>

            {/* Datos Académicos */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-primary" /> Información Académica
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Carrera / Taller</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.carrera}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Género</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.genero}</p>
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
            Cerrar Perfil
          </Button>
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
