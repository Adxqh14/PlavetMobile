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
import { Edit, Search, Layout } from "lucide-react";
import type { Pasantia, Tutor, EstadoPasantia } from "../types";
import { ESTUDIANTES, CENTROS, TUTORES } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pasantia: Pasantia | null;
  onUpdate: (data: Partial<Pasantia>) => void;
}

export const EditPasantiaDialog = ({ open, onOpenChange, pasantia, onUpdate }: Props) => {
  const [formData, setFormData] = useState<Partial<Pasantia>>(() => {
    if (!pasantia) return {};
    return {
      estudiante: pasantia.estudiante,
      matricula: pasantia.matricula,
      plazaAsignada: pasantia.plazaAsignada,
      centroTrabajo: pasantia.centroTrabajo,
      tutor: pasantia.tutor,
      fechaInicio: pasantia.fechaInicio,
      fechaFin: pasantia.fechaFin,
      observaciones: pasantia.observaciones,
      estado: pasantia.estado,
    };
  });
  const [estudianteSearch, setEstudianteSearch] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");
  const [centroSearch, setCentroSearch] = useState("");

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

  const handleEstudianteSelect = (est: { nombre: string, matricula: string }) => {
    setFormData({
      ...formData,
      estudiante: est.nombre,
      matricula: est.matricula
    });
    setEstudianteSearch("");
  };

  const handleTutorSelect = (tutor: Tutor) => {
    setFormData({
      ...formData,
      tutor
    });
    setTutorSearch("");
  };

  if (!pasantia) return null;

  return (
    <Dialog key={pasantia.id} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Editar Pasantía
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
                    Seleccionado: <span className="font-medium">{formData.estudiante} - {formData.matricula}</span>
                  </div>
                )}
                {estudianteSearch && (
                  <div className="border rounded-md max-h-32 overflow-y-auto">
                    {filteredEstudiantes.length > 0 ? (
                      filteredEstudiantes.map(est => (
                        <div
                          key={est.matricula}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => handleEstudianteSelect(est)}
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
                    value={formData.plazaAsignada || ""}
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
                    placeholder="Buscar centro de trabajo..."
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
                          onClick={() => handleTutorSelect(tutor)}
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
                  value={formData.fechaInicio || ""}
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
              <Label>Estado</Label>
              <Select
                value={formData.estado || ""}
                onValueChange={(value) => setFormData({...formData, estado: value as EstadoPasantia})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="suspendida">Suspendida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="Observaciones sobre la pasantía..."
                value={formData.observaciones || ""}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Actualizar Pasantía</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
