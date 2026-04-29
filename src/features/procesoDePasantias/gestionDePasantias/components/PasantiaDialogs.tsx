"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../shared/components/ui/alert-dialog";
import { Button } from "../../../../shared/components/ui/button";
import { Label } from "../../../../shared/components/ui/label";
import { Input } from "../../../../shared/components/ui/input";
import { Textarea } from "../../../../shared/components/ui/textarea";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import {
  Briefcase,
  Eye,
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Layout,
} from "lucide-react";
import type { Pasantia, CreatePasantiaData } from "../types";
import { CENTROS, TUTORES, ESTUDIANTES } from "../types";

// ==========================================
// 1. DIALOGO DE CREACION
// ==========================================
export const CreatePasantiaDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: CreatePasantiaData) => void;
}) => {
  const [formData, setFormData] = useState<CreatePasantiaData>({
    estudiante: "",
    matricula: "",
    plazaAsignada: "",
    centroTrabajo: "Consultores RD",
    tutor: "Lic. Carlos Mendez",
    fechaInicio: "",
    fechaFin: "",
    observaciones: "",
    estado: "pendiente",
  });

  const [estudianteSearch, setEstudianteSearch] = useState("");
  const [centroSearch, setCentroSearch] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");

  const resetForm = () => {
    setFormData({
      estudiante: "",
      matricula: "",
      plazaAsignada: "",
      centroTrabajo: "",
      tutor: "",
      fechaInicio: "",
      fechaFin: "",
      observaciones: "",
      estado: "pendiente",
    });
    setEstudianteSearch("");
    setCentroSearch("");
    setTutorSearch("");
  };

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const filteredEstudiantes = ESTUDIANTES.filter(est => 
    est.nombre.toLowerCase().includes(estudianteSearch.toLowerCase()) ||
    est.matricula.includes(estudianteSearch)
  );
  const filteredCentros = CENTROS.filter(centro => 
    centro.toLowerCase().includes(centroSearch.toLowerCase())
  );
  const filteredTutores = TUTORES.filter(tutor => 
    tutor.toLowerCase().includes(tutorSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Nueva Pasantía
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estudiante</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiante..."
                    value={estudianteSearch}
                    onChange={(e) => setEstudianteSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {formData.estudiante && !estudianteSearch && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Seleccionado: <span className="font-medium">{formData.estudiante}</span>
                  </div>
                )}
                {estudianteSearch && (
                  <div className="border rounded-md max-h-32 overflow-y-auto">
                    {filteredEstudiantes.length > 0 ? (
                      filteredEstudiantes.map(est => (
                        <div
                          key={est.matricula}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setFormData({...formData, estudiante: est.nombre, matricula: est.matricula})
                            setEstudianteSearch("")
                          }}
                        >
                          {est.nombre} - {est.matricula}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No se encontraron estudiantes
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Plaza Asignada</Label>
                <div className="relative">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nombre de la plaza..."
                    value={formData.plazaAsignada}
                    onChange={(e) => setFormData({...formData, plazaAsignada: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Centro de Trabajo</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar centro..."
                    value={centroSearch}
                    onChange={(e) => setCentroSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {formData.centroTrabajo && !centroSearch && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Seleccionado: <span className="font-medium">{formData.centroTrabajo}</span>
                  </div>
                )}
                {centroSearch && (
                  <div className="border rounded-md max-h-32 overflow-y-auto">
                    {filteredCentros.length > 0 ? (
                      filteredCentros.map(centro => (
                        <div
                          key={centro}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setFormData({...formData, centroTrabajo: centro})
                            setCentroSearch("")
                          }}
                        >
                          {centro}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No se encontraron centros
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Tutor</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar tutor..."
                    value={tutorSearch}
                    onChange={(e) => setTutorSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {formData.tutor && !tutorSearch && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Seleccionado: <span className="font-medium">{formData.tutor}</span>
                  </div>
                )}
                {tutorSearch && (
                  <div className="border rounded-md max-h-32 overflow-y-auto">
                    {filteredTutores.length > 0 ? (
                      filteredTutores.map(tutor => (
                        <div
                          key={tutor}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setFormData({...formData, tutor: tutor})
                            setTutorSearch("")
                          }}
                        >
                          {tutor}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No se encontraron tutores
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Inicio</Label>
                <Input 
                  type="date" 
                  value={formData.fechaInicio}
                  onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Fin (Opcional)</Label>
                <Input 
                  type="date" 
                  value={formData.fechaFin || ""}
                  onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="Observaciones sobre la pasantía..."
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Pasantía</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 2. DIALOGO DE VISUALIZACION
// ==========================================
export const ViewPasantiaDialog = ({
  open,
  onOpenChange,
  pasantia,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  pasantia: Pasantia | null;
}) => {
  const getEstadoBadge = (estado: Pasantia["estado"]) => {
    const styles = {
      activa: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completada: "bg-blue-50 text-blue-700 border-blue-200",
      suspendida: "bg-red-50 text-red-700 border-red-200",
      pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    };
    const icons = {
      activa: <CheckCircle className="h-3.5 w-3.5" />,
      completada: <CheckCircle className="h-3.5 w-3.5" />,
      suspendida: <XCircle className="h-3.5 w-3.5" />,
      pendiente: <Clock className="h-3.5 w-3.5" />,
    };
    const labels = {
      activa: "Activa",
      completada: "Completada",
      suspendida: "Suspendida",
      pendiente: "Pendiente",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[estado]}`}>
        {icons[estado]}
        {labels[estado]}
      </span>
    );
  };

  if (!pasantia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Detalles de la Pasantía
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Información Personal */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información del Estudiante
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                    <p className="font-semibold text-lg">{pasantia.estudiante}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Matrícula</p>
                    <p className="font-semibold text-lg">{pasantia.matricula}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tutor Asignado</p>
                    <p className="font-semibold text-lg">{pasantia.tutor}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">ID de Pasantía</p>
                    <p className="text-lg font-semibold text-primary">{pasantia.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Pasantía */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Información de la Pasantía
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Plaza Asignada</p>
                    <div className="flex items-center gap-2">
                      <Layout className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold text-lg">{pasantia.plazaAsignada}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Centro de Trabajo</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold text-lg">{pasantia.centroTrabajo}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Inicio</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold text-lg">{pasantia.fechaInicio}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Fin</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold text-lg">{pasantia.fechaFin || "No definida"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progreso y Estado */}
          <Card className="border-2 border-muted/50">
            <CardHeader className="bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Progreso y Estado
              </h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Horas Completadas</p>
                    <p className="font-semibold text-lg">{pasantia.horasCompletadas}h</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                    {getEstadoBadge(pasantia.estado)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          {pasantia.observaciones && (
            <Card className="border-2 border-muted/50">
              <CardHeader className="bg-muted/30">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Observaciones
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm">{pasantia.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 3. DIALOGO DE ELIMINACION
// ==========================================
export const DeletePasantiaDialog = ({
  open,
  onOpenChange,
  onConfirm,
  pasantia,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (id: string) => void;
  pasantia: Pasantia | null;
}) => {
  if (!pasantia) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Está a punto de eliminar la pasantía de <strong>{pasantia.estudiante}</strong> ({pasantia.id}). 
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(pasantia.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
