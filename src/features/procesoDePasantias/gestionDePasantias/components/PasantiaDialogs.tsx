"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import {
  Briefcase,
  Eye,
  Building2,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Layout,
  ClipboardList,
  GraduationCap,
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
    centroTrabajo: "",
    tutor: "",
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nueva Pasantía</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Asigna un estudiante a un centro de trabajo y plaza específica.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="create-pasantia-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Estudiante y Plaza */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estudiante y Plaza</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Estudiante *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar estudiante..."
                      value={estudianteSearch}
                      onChange={(e) => setEstudianteSearch(e.target.value)}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    />
                  </div>
                  {formData.estudiante && !estudianteSearch && (
                    <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {formData.estudiante} ({formData.matricula})
                    </div>
                  )}
                  {estudianteSearch && (
                    <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card">
                      {filteredEstudiantes.length > 0 ? (
                        filteredEstudiantes.map(est => (
                          <div
                            key={est.matricula}
                            className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm transition-colors flex flex-col"
                            onClick={() => {
                              setFormData({...formData, estudiante: est.nombre, matricula: est.matricula})
                              setEstudianteSearch("")
                            }}
                          >
                            <span className="font-semibold">{est.nombre}</span>
                            <span className="text-xs text-muted-foreground">{est.matricula}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-muted-foreground italic">
                          No se encontraron resultados
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Plaza Asignada *</Label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ej: Auxiliar de TI"
                      value={formData.plazaAsignada}
                      onChange={(e) => setFormData({...formData, plazaAsignada: e.target.value})}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Ubicación y Tutoría */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ubicación y Tutoría</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Centro de Trabajo *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar centro..."
                      value={centroSearch}
                      onChange={(e) => setCentroSearch(e.target.value)}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    />
                  </div>
                  {formData.centroTrabajo && !centroSearch && (
                    <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {formData.centroTrabajo}
                    </div>
                  )}
                  {centroSearch && (
                    <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card">
                      {filteredCentros.length > 0 ? (
                        filteredCentros.map(centro => (
                          <div
                            key={centro}
                            className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm transition-colors"
                            onClick={() => {
                              setFormData({...formData, centroTrabajo: centro})
                              setCentroSearch("")
                            }}
                          >
                            {centro}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-muted-foreground italic">
                          No hay centros sugeridos
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Tutor Empresarial *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar tutor..."
                      value={tutorSearch}
                      onChange={(e) => setTutorSearch(e.target.value)}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    />
                  </div>
                  {formData.tutor && !tutorSearch && (
                    <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {formData.tutor}
                    </div>
                  )}
                  {tutorSearch && (
                    <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card">
                      {filteredTutores.length > 0 ? (
                        filteredTutores.map(tutor => (
                          <div
                            key={tutor}
                            className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm transition-colors"
                            onClick={() => {
                              setFormData({...formData, tutor: tutor})
                              setTutorSearch("")
                            }}
                          >
                            {tutor}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-muted-foreground italic">
                          No hay tutores sugeridos
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Cronograma y Otros */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cronograma y Detalles</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Fecha de Inicio *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date" 
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Fecha de Fin (Opcional)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date" 
                      value={formData.fechaFin || ""}
                      onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold">Observaciones</Label>
                  <div className="relative">
                    <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      placeholder="Agrega cualquier observación relevante sobre la pasantía..."
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                      rows={3}
                      className="pl-10 shadow-xs focus-visible:ring-primary/30 resize-none rounded-xl"
                    />
                  </div>
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
            form="create-pasantia-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Crear Pasantía
          </Button>
        </DialogFooter>
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
      activa: "bg-emerald-100 text-emerald-700 border-emerald-200",
      completada: "bg-blue-100 text-blue-700 border-blue-200",
      suspendida: "bg-red-100 text-red-700 border-red-200",
      pendiente: "bg-amber-100 text-amber-700 border-amber-200",
    };
    const labels = {
      activa: "Activa",
      completada: "Completada",
      suspendida: "Suspendida",
      pendiente: "Pendiente",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${styles[estado]}`}>
        {labels[estado]}
      </span>
    );
  };

  if (!pasantia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">Detalles de Pasantía</DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Información completa sobre el proceso académico actual.
                </DialogDescription>
              </div>
            </div>
            {getEstadoBadge(pasantia.estado)}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Ficha Estudiante */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ficha del Estudiante</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Nombre Completo</p>
                <p className="text-base font-semibold">{pasantia.estudiante}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Matrícula</p>
                <p className="text-base font-semibold font-mono">{pasantia.matricula}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Tutor Asignado</p>
                <p className="text-base font-semibold">{pasantia.tutor}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">ID de Proceso</p>
                <p className="text-base font-semibold text-primary">{pasantia.id}</p>
              </div>
            </div>
          </div>

          {/* Detalles Pasantía */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detalles del Puesto</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Plaza Asignada</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Layout className="h-4 w-4 text-primary" />
                  {pasantia.plazaAsignada}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Centro de Trabajo</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="h-4 w-4 text-primary" />
                  {pasantia.centroTrabajo}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Fecha de Inicio</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  {pasantia.fechaInicio}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Fecha Estimada Fin</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  {pasantia.fechaFin || "No definida"}
                </div>
              </div>
            </div>
          </div>

          {/* Progreso */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progreso Académico</h3>
            </div>
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-primary uppercase">Horas Acumuladas</p>
                <span className="text-2xl font-black text-primary">{pasantia.horasCompletadas}h</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Horas registradas y validadas por el tutor hasta la fecha.
              </p>
            </div>
          </div>

          {/* Observaciones */}
          {pasantia.observaciones && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <ClipboardList className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Observaciones</h3>
              </div>
              <div className="bg-muted/30 rounded-2xl p-6 italic text-sm text-muted-foreground leading-relaxed border border-muted">
                "{pasantia.observaciones}"
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button 
            className="w-full sm:w-auto px-8 font-bold" 
            onClick={() => onOpenChange(false)}
          >
            Cerrar Ventana
          </Button>
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
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <AlertDialogHeader className="px-8 pt-8 pb-4">
          <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4 border border-red-200">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold">¿Eliminar Pasantía?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground">
            Estás a punto de eliminar el registro de <strong>{pasantia.estudiante}</strong>. 
            Esta acción es irreversible y afectará los reportes académicos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-8 py-6 bg-muted/20 border-t flex gap-3">
          <AlertDialogCancel className="font-semibold rounded-xl border-none bg-transparent hover:bg-muted transition-colors">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(pasantia.id)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all"
          >
            Confirmar Eliminación
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
