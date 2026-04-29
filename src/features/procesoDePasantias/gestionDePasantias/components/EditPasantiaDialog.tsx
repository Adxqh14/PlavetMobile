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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import { Button } from "../../../../shared/components/ui/button";
import { Label } from "../../../../shared/components/ui/label";
import { Input } from "../../../../shared/components/ui/input";
import { Textarea } from "../../../../shared/components/ui/textarea";
import { 
  Edit,
  Search, 
  Layout, 
  Building2, 
  Calendar, 
  ClipboardList, 
  GraduationCap,
  Activity
} from "lucide-react";
import type { Pasantia, EstadoPasantia } from "../types";
import { ESTUDIANTES, CENTROS, TUTORES } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pasantia: Pasantia | null;
  onUpdate: (data: Partial<Pasantia>) => void;
}

export const EditPasantiaDialog = ({ open, onOpenChange, pasantia, onUpdate }: Props) => {
  const [formData, setFormData] = useState<Partial<Pasantia>>({});
  const [estudianteSearch, setEstudianteSearch] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");
  const [centroSearch, setCentroSearch] = useState("");

  // Update formData when pasantia changes or dialog opens
  React.useEffect(() => {
    if (pasantia && open) {
      setFormData({
        estudiante: pasantia.estudiante,
        matricula: pasantia.matricula,
        plazaAsignada: pasantia.plazaAsignada,
        centroTrabajo: pasantia.centroTrabajo,
        tutor: pasantia.tutor,
        fechaInicio: pasantia.fechaInicio,
        fechaFin: pasantia.fechaFin,
        observaciones: pasantia.observaciones,
        estado: pasantia.estado,
      });
    }
  }, [pasantia, open]);

  const filteredEstudiantes = ESTUDIANTES.filter(est => 
    est.nombre.toLowerCase().includes(estudianteSearch.toLowerCase()) ||
    est.matricula.includes(estudianteSearch)
  );
  const filteredTutores = TUTORES.filter(tutor => 
    tutor.toLowerCase().includes(tutorSearch.toLowerCase())
  );
  const filteredCentros = CENTROS.filter(centro => 
    centro.toLowerCase().includes(centroSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pasantia && formData) {
      onUpdate({
        ...formData,
        id: pasantia.id,
        horasCompletadas: pasantia.horasCompletadas,
      });
      onOpenChange(false);
    }
  };

  if (!pasantia) return null;

  return (
    <Dialog key={pasantia.id} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Pasantía</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Modifica los detalles del proceso de pasantía para {pasantia.estudiante}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="edit-pasantia-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Estudiante y Plaza */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estudiante y Plaza</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Estudiante</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar estudiante..."
                      value={estudianteSearch}
                      onChange={(e) => setEstudianteSearch(e.target.value)}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                    />
                  </div>
                  <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 flex items-center gap-2 mt-2">
                    <Activity className="h-3.5 w-3.5" />
                    Actual: {formData.estudiante} ({formData.matricula})
                  </div>
                  {estudianteSearch && (
                    <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card absolute z-50 w-full">
                      {filteredEstudiantes.map(est => (
                        <div
                          key={est.matricula}
                          className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm flex flex-col"
                          onClick={() => {
                            setFormData({...formData, estudiante: est.nombre, matricula: est.matricula})
                            setEstudianteSearch("")
                          }}
                        >
                          <span className="font-semibold">{est.nombre}</span>
                          <span className="text-xs text-muted-foreground">{est.matricula}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Plaza Asignada *</Label>
                  <div className="relative">
                    <Layout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ej: Auxiliar de TI"
                      value={formData.plazaAsignada || ""}
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
                    <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 mt-2">
                      {formData.centroTrabajo}
                    </div>
                  )}
                  {centroSearch && (
                    <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card absolute z-50 w-full">
                      {filteredCentros.map(centro => (
                        <div
                          key={centro}
                          className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setFormData({...formData, centroTrabajo: centro})
                            setCentroSearch("")
                          }}
                        >
                          {centro}
                        </div>
                      ))}
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
                    <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 mt-2">
                      {formData.tutor}
                    </div>
                  )}
                  {tutorSearch && (
                    <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card absolute z-50 w-full">
                      {filteredTutores.map(tutor => (
                        <div
                          key={tutor}
                          className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setFormData({...formData, tutor: tutor})
                            setTutorSearch("")
                          }}
                        >
                          {tutor}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Estado y Cronograma */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estado y Cronograma</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-primary">Estado del Proceso</Label>
                  <Select
                    value={formData.estado || ""}
                    onValueChange={(value) => setFormData({...formData, estado: value as EstadoPasantia})}
                  >
                    <SelectTrigger className="h-11 rounded-xl shadow-xs focus:ring-primary/30 border-primary/20 bg-primary/5 font-semibold text-primary">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa" className="font-medium text-emerald-600">Activa</SelectItem>
                      <SelectItem value="completada" className="font-medium text-blue-600">Completada</SelectItem>
                      <SelectItem value="pendiente" className="font-medium text-amber-600">Pendiente</SelectItem>
                      <SelectItem value="suspendida" className="font-medium text-red-600">Suspendida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Fecha de Inicio *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="date" 
                      value={formData.fechaInicio || ""}
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
                      placeholder="Observaciones sobre la pasantía..."
                      value={formData.observaciones || ""}
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
            form="edit-pasantia-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Actualizar Pasantía
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
