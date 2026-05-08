"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../shared/components/ui/dialog";
import { Button } from "../../../../shared/components/ui/button";
import { Label } from "../../../../shared/components/ui/label";
import { Input } from "../../../../shared/components/ui/input";
import { UserPlus, Search, Building2, Briefcase } from "lucide-react";
const ESTUDIANTES: any[] = [];
const CENTROS: any[] = [];
import type { Pasantia } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pasantia: Pasantia | null;
  onAssign: (data: {
    id: string;
    estudiante: string;
    matricula: string;
    centroTrabajo: string;
    plaza: string;
  }) => void;
}

export const AsignarEstudianteDialog = ({ open, onOpenChange, pasantia, onAssign }: Props) => {
  const [asignarSearch, setAsignarSearch] = useState("");
  const [centroSearch, setCentroSearch] = useState("");
  const [plazaSearch, setPlazaSearch] = useState("");
  
  const [selectedEstudiante, setSelectedEstudiante] = useState<{nombre: string, matricula: string} | null>(null);
  const [selectedCentro, setSelectedCentro] = useState<string>("");
  const [selectedPlaza, setSelectedPlaza] = useState<string>("");

  const filteredEstudiantes = ESTUDIANTES.filter((est: any) => 
    est.nombre.toLowerCase().includes(asignarSearch.toLowerCase()) ||
    est.matricula.includes(asignarSearch)
  );
  const filteredCentros = CENTROS.filter((centro: any) => 
    centro.toLowerCase().includes(centroSearch.toLowerCase())
  );

  const plazasDisponibles = [
    "Desarrollador Junior - TechCorp",
    "Asistente Administrativo - Consultores RD", 
    "Tecnico Automotriz - AutoService",
    "Analista de Datos - DataSoft Inc",
    "Electricista - ElectroTec"
  ];

  const filteredPlazas = plazasDisponibles.filter(plaza => 
    plaza.toLowerCase().includes(plazaSearch.toLowerCase())
  );

  const resetForm = () => {
    setAsignarSearch("");
    setCentroSearch("");
    setPlazaSearch("");
    setSelectedEstudiante(null);
    setSelectedCentro("");
    setSelectedPlaza("");
  };

  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = () => {
    if (selectedEstudiante && selectedCentro && selectedPlaza && pasantia) {
      onAssign({
        id: pasantia.id,
        estudiante: selectedEstudiante.nombre,
        matricula: selectedEstudiante.matricula,
        centroTrabajo: selectedCentro,
        plaza: selectedPlaza
      });
      onOpenChange(false);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Asignar Estudiante a Pasantía
          </DialogTitle>
        </DialogHeader>
        
        {/* Current Assignment Display */}
        {pasantia && (
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Asignación Actual</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Estudiante:</span>
                <p className="font-medium">{pasantia.estudiante?.nombre} {pasantia.estudiante?.apellido}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cédula:</span>
                <p className="font-medium">{pasantia.estudiante?.cedula || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Centro:</span>
                <p className="font-medium">{pasantia.centro_trabajo?.nombre || "No asignado"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <p className="font-medium capitalize">{pasantia.estado}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Seleccionar Estudiante</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estudiante por nombre o matrícula..."
                value={asignarSearch}
                onChange={(e) => setAsignarSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedEstudiante && !asignarSearch && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                Seleccionado: <span className="font-medium">{selectedEstudiante.nombre} - {selectedEstudiante.matricula}</span>
              </div>
            )}
            {asignarSearch && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {filteredEstudiantes.length > 0 ? (
                  filteredEstudiantes.map((est: any) => (
                    <div
                      key={est.matricula}
                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedEstudiante(est);
                        setAsignarSearch("");
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
            <Label>Seleccionar Centro de Trabajo</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar centro de trabajo..."
                value={centroSearch}
                onChange={(e) => setCentroSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedCentro && !centroSearch && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                Seleccionado: <span className="font-medium">{selectedCentro}</span>
              </div>
            )}
            {centroSearch && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {filteredCentros.length > 0 ? (
                  filteredCentros.map((centro: any) => (
                    <div
                      key={centro}
                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedCentro(centro);
                        setCentroSearch("");
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
            <Label>Seleccionar Plaza</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar plaza disponible..."
                value={plazaSearch}
                onChange={(e) => setPlazaSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedPlaza && !plazaSearch && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                Seleccionado: <span className="font-medium">{selectedPlaza}</span>
              </div>
            )}
            {plazaSearch && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {filteredPlazas.length > 0 ? (
                  filteredPlazas.map((plaza, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedPlaza(plaza);
                        setPlazaSearch("");
                      }}
                    >
                      {plaza}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No se encontraron plazas
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedEstudiante || !selectedCentro || !selectedPlaza}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Asignar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
