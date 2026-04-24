"use client";

import React, { useState, useDeferredValue } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { Textarea } from "../../../../shared/components/ui/textarea";
import { Send, Upload, Briefcase, User, Building2 } from "lucide-react";
import type { ExcuseFormData } from "../types";

interface Props {
  formData: ExcuseFormData;
  selectedFile: File | null;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (file: File | null) => void;
  onFormDataChange: (data: Partial<ExcuseFormData>) => void;
}

export const ExcusaForm = ({ 
  formData, 
  selectedFile, 
  onSubmit, 
  onFileChange, 
  onFormDataChange 
}: Props) => {
  const [pasantiaSearch, setPasantiaSearch] = useState("");
  const [estudianteSearch, setEstudianteSearch] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");

  const pasantiasDisponibles = [
    "Pasantía Desarrollo Web",
    "Pasantía Marketing Digital", 
    "Pasantía Gestión",
    "Pasantía Diseño Gráfico"
  ];

  const estudiantesDisponibles = [
    "Juan Pérez",
    "Ana Martínez", 
    "Pedro López",
    "María García",
    "Carlos Ruiz",
    "Laura Sánchez"
  ];

  const tutoresDisponibles = [
    "María González",
    "Carlos Ruiz",
    "Laura Sánchez", 
    "Roberto Fernández",
    "José Martínez",
    "Carmen Rodríguez"
  ];

  const deferredPasantiaSearch = useDeferredValue(pasantiaSearch);
  const deferredEstudianteSearch = useDeferredValue(estudianteSearch);
  const deferredTutorSearch = useDeferredValue(tutorSearch);

  const filteredPasantias = pasantiasDisponibles.filter(pasantia => 
    pasantia.toLowerCase().includes(deferredPasantiaSearch.toLowerCase())
  );

  const filteredEstudiantes = estudiantesDisponibles.filter(est => 
    est.toLowerCase().includes(deferredEstudianteSearch.toLowerCase())
  );

  const filteredTutores = tutoresDisponibles.filter(tutor => 
    tutor.toLowerCase().includes(deferredTutorSearch.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pasantia">Pasantía *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pasantía..."
              value={pasantiaSearch}
              onChange={(e) => setPasantiaSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {formData.pasantia && !pasantiaSearch && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              Seleccionado: <span className="font-medium">{formData.pasantia}</span>
            </div>
          )}
          {deferredPasantiaSearch && (
            <div className="border rounded-md max-h-32 overflow-y-auto">
              {filteredPasantias.length > 0 ? (
                filteredPasantias.map((pasantia, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => {
                      onFormDataChange({ pasantia: pasantia });
                      setPasantiaSearch("");
                    }}
                  >
                    {pasantia}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No se encontraron pasantías
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estudiante">Estudiante *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar estudiante por nombre..."
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
          {deferredEstudianteSearch && (
            <div className="border rounded-md max-h-32 overflow-y-auto">
              {filteredEstudiantes.length > 0 ? (
                filteredEstudiantes.map((estudiante, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => {
                      onFormDataChange({ estudiante: estudiante });
                      setEstudianteSearch("");
                    }}
                  >
                    {estudiante}
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
          <Label htmlFor="tutor">Tutor *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tutor por nombre..."
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
          {deferredTutorSearch && (
            <div className="border rounded-md max-h-32 overflow-y-auto">
              {filteredTutores.length > 0 ? (
                filteredTutores.map((tutor, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => {
                      onFormDataChange({ tutor: tutor });
                      setTutorSearch("");
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

        <div className="space-y-2">
          <Label htmlFor="certificado">Certificado (PNG o PDF)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="certificado"
              type="file"
              accept=".png,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => document.getElementById("certificado")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {selectedFile ? selectedFile.name : "Seleccionar archivo"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="justificacion">Justificación *</Label>
        <Textarea
          id="justificacion"
          placeholder="Describa la razón de la excusa..."
          value={formData.justificacion}
          onChange={(e) => onFormDataChange({ justificacion: e.target.value })}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        <Send className="mr-2 h-4 w-4" />
        Enviar Excusa
      </Button>
    </form>
  );
};
