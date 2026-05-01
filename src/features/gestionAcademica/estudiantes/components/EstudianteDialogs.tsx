"use client";

import React, { useState } from "react";
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
  Briefcase,
  IdCard,
  MapPinned,
  UserCircle,
  CalendarDays,
  Globe
} from "lucide-react";
import type { Estudiante, CreateEstudianteData, Genero, EstadoEstudiante } from "../types";
import { useTalleresOptions } from "../hooks/useTalleresOptions";

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

// ==========================================
// Diálogo para crear estudiante
// ==========================================
interface CreateEstudianteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateEstudianteData) => Promise<void>;
}

export const CreateEstudianteDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateEstudianteDialogProps) => {
  const { talleres, isLoading: talleresLoading } = useTalleresOptions();
  const [formData, setFormData] = useState<CreateEstudianteData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    genero: "Masculino",
    estado: "Activo",
    fechaNacimiento: "",
    direccionCompleta: "",
    calle: "",
    provincia: "",
    pais: "",
    esExtranjero: false,
    cedula: "",
    pasaporte: "",
    id_taller: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      genero: "Masculino",
      estado: "Activo",
      fechaNacimiento: "",
      direccionCompleta: "",
      calle: "",
      provincia: "",
      pais: "",
      esExtranjero: false,
      cedula: "",
      pasaporte: "",
      id_taller: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nuevo Estudiante</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Registra un nuevo estudiante en el programa académico.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="create-student-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Personal y Contacto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Información Personal y Contacto</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="text-xs font-semibold">Nombre *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="nombre" required placeholder="Ej: Juan" className="pl-10 h-10 text-sm shadow-xs" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="apellido" className="text-xs font-semibold">Apellido *</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="apellido" required placeholder="Ej: Pérez" className="pl-10 h-10 text-sm shadow-xs" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col justify-center">
                  <Label className="text-xs font-semibold">Tipo de Nacionalidad *</Label>
                  <div className="flex w-full rounded-md shadow-xs p-1 bg-muted/50">
                    <Button
                      type="button"
                      variant={!formData.esExtranjero ? "default" : "ghost"}
                      className={`flex-1 h-8 text-xs ${!formData.esExtranjero ? "shadow-sm" : ""}`}
                      onClick={() => setFormData({ ...formData, esExtranjero: false, pasaporte: "" })}
                    >
                      Dominicana/o
                    </Button>
                    <Button
                      type="button"
                      variant={formData.esExtranjero ? "default" : "ghost"}
                      className={`flex-1 h-8 text-xs ${formData.esExtranjero ? "shadow-sm" : ""}`}
                      onClick={() => setFormData({ ...formData, esExtranjero: true, cedula: "" })}
                    >
                      Extranjero
                    </Button>
                  </div>
                </div>
                {!formData.esExtranjero ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="cedula" className="text-xs font-semibold">Cédula *</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="cedula" required placeholder="001-0000000-0" className="pl-10 h-10 text-sm shadow-xs" value={formData.cedula || ""} onChange={(e) => setFormData({ ...formData, cedula: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="pasaporte" className="text-xs font-semibold">Número de Pasaporte *</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="pasaporte" required placeholder="Ej: P0000000" className="pl-10 h-10 text-sm shadow-xs" value={formData.pasaporte || ""} onChange={(e) => setFormData({ ...formData, pasaporte: e.target.value })} />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="genero" className="text-xs font-semibold">Género *</Label>
                  <Select value={formData.genero} onValueChange={(value) => setFormData({ ...formData, genero: value as Genero })}>
                    <SelectTrigger id="genero" className="h-10 text-sm shadow-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fechaNacimiento" className="text-xs font-semibold">Fecha de Nacimiento *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      id="fechaNacimiento" 
                      type="date" 
                      required 
                      className="pl-10 h-10 text-sm shadow-xs block w-full appearance-none bg-background border border-input rounded-md focus:ring-primary focus:border-primary scheme-dark relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                      value={formData.fechaNacimiento} 
                      onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Email Institucional *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" required placeholder="estudiante@ipisa.edu.do" className="pl-10 h-10 text-sm shadow-xs" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="text-xs font-semibold">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="telefono" required placeholder="809-000-0000" className="pl-10 h-10 text-sm shadow-xs" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Dirección y Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección y Ubicación</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="calle" className="text-xs font-semibold">Calle *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="calle" required placeholder="Ej: Calle Principal #12" className="pl-10 h-10 text-sm shadow-xs" value={formData.calle} onChange={(e) => setFormData({ ...formData, calle: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="direccionCompleta" className="text-xs font-semibold">Dirección Completa *</Label>
                  <div className="relative">
                    <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="direccionCompleta" required placeholder="Ej: Sector Los Jardines, Casa #14, Color Azul" className="pl-10 h-10 text-sm shadow-xs" value={formData.direccionCompleta} onChange={(e) => setFormData({ ...formData, direccionCompleta: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="provincia" className="text-xs font-semibold">Provincia *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="provincia" required placeholder="Ej: Santiago" className="pl-10 h-10 text-sm shadow-xs" value={formData.provincia} onChange={(e) => setFormData({ ...formData, provincia: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pais" className="text-xs font-semibold">País *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="pais" required placeholder="Ej: República Dominicana" className="pl-10 h-10 text-sm shadow-xs" value={formData.pais} onChange={(e) => setFormData({ ...formData, pais: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 3: Información Académica */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Información Académica</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="carrera" className="text-xs font-semibold">Carrera / Taller *</Label>
                  <Select value={formData.id_taller ?? ""} onValueChange={(value) => setFormData({ ...formData, id_taller: value })}>
                    <SelectTrigger id="carrera" className="h-10 text-sm shadow-xs">
                      <SelectValue placeholder={talleresLoading ? "Cargando talleres…" : "Selecciona un taller"} />
                    </SelectTrigger>
                    <SelectContent>
                      {talleres.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="estado" className="text-xs font-semibold">Estado Inicial</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value as EstadoEstudiante })}>
                    <SelectTrigger id="estado" className="h-10 text-sm shadow-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="create-student-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Crear Estudiante
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// Diálogo para editar estudiante
// ==========================================
interface EditEstudianteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estudiante: Estudiante | null;
  onSubmit: (data: Estudiante) => Promise<void>;
}

export const EditEstudianteDialog = ({
  open,
  onOpenChange,
  estudiante,
  onSubmit,
}: EditEstudianteDialogProps) => {
  const { talleres, isLoading: talleresLoading } = useTalleresOptions();
  const [formData, setFormData] = useState<Estudiante>(estudiante || {} as Estudiante);

  // Sincronizar formData cuando el estudiante cambia (patrón recomendado para evitar renders en cascada)
  const [prevEstudiante, setPrevEstudiante] = useState(estudiante);
  if (estudiante !== prevEstudiante) {
    setPrevEstudiante(estudiante);
    setFormData(estudiante || {} as Estudiante);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      await onSubmit(formData);
      onOpenChange(false);
    }
  };

  if (!estudiante) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={estudiante.id} className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Estudiante</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Actualiza los datos personales o académicos del estudiante.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="edit-student-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información Personal y Contacto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Información Personal y Contacto</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-nombre" className="text-xs font-semibold">Nombre *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-nombre" required className="pl-10 h-10 text-sm shadow-xs" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-apellido" className="text-xs font-semibold">Apellido *</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-apellido" required className="pl-10 h-10 text-sm shadow-xs" value={formData.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col justify-center">
                  <Label className="text-xs font-semibold">Tipo de Nacionalidad *</Label>
                  <div className="flex w-full rounded-md shadow-xs p-1 bg-muted/50">
                    <Button
                      type="button"
                      variant={!formData.esExtranjero ? "default" : "ghost"}
                      className={`flex-1 h-8 text-xs ${!formData.esExtranjero ? "shadow-sm" : ""}`}
                      onClick={() => setFormData({ ...formData, esExtranjero: false, pasaporte: "" })}
                    >
                      Dominicana/o
                    </Button>
                    <Button
                      type="button"
                      variant={formData.esExtranjero ? "default" : "ghost"}
                      className={`flex-1 h-8 text-xs ${formData.esExtranjero ? "shadow-sm" : ""}`}
                      onClick={() => setFormData({ ...formData, esExtranjero: true, cedula: "" })}
                    >
                      Extranjero
                    </Button>
                  </div>
                </div>
                {!formData.esExtranjero ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-cedula" className="text-xs font-semibold">Cédula *</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="edit-cedula" required className="pl-10 h-10 text-sm shadow-xs" value={formData.cedula || ""} onChange={(e) => setFormData({ ...formData, cedula: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-pasaporte" className="text-xs font-semibold">Número de Pasaporte *</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="edit-pasaporte" required className="pl-10 h-10 text-sm shadow-xs" value={formData.pasaporte || ""} onChange={(e) => setFormData({ ...formData, pasaporte: e.target.value })} />
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="edit-genero" className="text-xs font-semibold">Género *</Label>
                  <Select value={formData.genero} onValueChange={(value) => setFormData({ ...formData, genero: value as Genero })}>
                    <SelectTrigger id="edit-genero" className="h-10 text-sm shadow-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-fechaNacimiento" className="text-xs font-semibold">Fecha de Nacimiento *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input 
                      id="edit-fechaNacimiento" 
                      type="date" 
                      required 
                      className="pl-10 h-10 text-sm shadow-xs block w-full appearance-none bg-background border border-input rounded-md focus:ring-primary focus:border-primary scheme-dark relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                      value={formData.fechaNacimiento} 
                      onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-email" className="text-xs font-semibold">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-email" type="email" required className="pl-10 h-10 text-sm shadow-xs" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-telefono" className="text-xs font-semibold">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-telefono" required className="pl-10 h-10 text-sm shadow-xs" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Dirección y Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección y Ubicación</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-calle" className="text-xs font-semibold">Calle *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-calle" required className="pl-10 h-10 text-sm shadow-xs" value={formData.calle} onChange={(e) => setFormData({ ...formData, calle: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-direccionCompleta" className="text-xs font-semibold">Dirección Completa *</Label>
                  <div className="relative">
                    <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-direccionCompleta" required placeholder="Ej: Sector Los Jardines, Casa #14, Color Azul" className="pl-10 h-10 text-sm shadow-xs" value={formData.direccionCompleta} onChange={(e) => setFormData({ ...formData, direccionCompleta: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-provincia" className="text-xs font-semibold">Provincia *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-provincia" required className="pl-10 h-10 text-sm shadow-xs" value={formData.provincia} onChange={(e) => setFormData({ ...formData, provincia: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-pais" className="text-xs font-semibold">País *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="edit-pais" required className="pl-10 h-10 text-sm shadow-xs" value={formData.pais} onChange={(e) => setFormData({ ...formData, pais: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 3: Perfil Académico */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Perfil Académico</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-carrera" className="text-xs font-semibold">Carrera / Taller *</Label>
                  <Select
                    value={formData.id_taller ?? ""}
                    onValueChange={(value) => {
                      const taller = talleres.find((t) => t.id === value);
                      setFormData({ ...formData, id_taller: value, carrera: taller?.nombre ?? formData.carrera });
                    }}
                  >
                    <SelectTrigger id="edit-carrera" className="h-10 text-sm shadow-xs">
                      <SelectValue placeholder={talleresLoading ? "Cargando talleres…" : (formData.carrera || "Selecciona un taller")} />
                    </SelectTrigger>
                    <SelectContent>
                      {talleres.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-estado" className="text-xs font-semibold">Estado *</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value as EstadoEstudiante })}>
                    <SelectTrigger id="edit-estado" className="h-10 text-sm shadow-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                      <SelectItem value="Suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="edit-student-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// Diálogo para ver detalles
// ==========================================
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
              <IdCard className="h-3.5 w-3.5" /> {estudiante.esExtranjero ? estudiante.pasaporte : estudiante.cedula} <span className="mx-2">•</span> Ingreso: {estudiante.fechaIngreso}
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
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Fecha de Nacimiento</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.fechaNacimiento}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Nacionalidad</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.esExtranjero ? "Extranjero" : "Dominicana/o"}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Dirección Completa</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.direccionCompleta}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Calle</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.calle}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Provincia</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.provincia}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">País</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{estudiante.pais}</p>
                  </div>
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

// ==========================================
// Diálogo para eliminar estudiante
// ==========================================
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
