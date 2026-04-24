"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Badge } from "../../../../shared/components/ui/badge";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { Textarea } from "../../../../shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { FileText, Calendar, User, Briefcase, Building2, Download, Save, X, Eye } from "lucide-react";
import { useState, useDeferredValue } from "react";
import type { Excuse } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excuse: Excuse | null;
  onDownload?: (certificado: string) => void;
  onEdit?: (id: string, data: Partial<Excuse>) => void;
  onOpenPdf?: (certificado: string, title: string) => void;
  isEditMode?: boolean;
}

export const ExcusaDetailsDialog = ({ open, onOpenChange, excuse, onDownload, onEdit, onOpenPdf, isEditMode = false }: Props) => {
  const getEditData = () => {
    if (excuse && isEditMode) {
      return {
        pasantia: excuse.pasantia,
        estudiante: excuse.estudiante,
        tutor: excuse.tutor,
        justificacion: excuse.justificacion,
        estado: excuse.estado,
      };
    }
    return {};
  };

  const [editData, setEditData] = useState<Partial<Excuse>>(getEditData);
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

  const cancelEdit = () => {
    onOpenChange(false);
  };

  const saveEdit = () => {
    if (excuse && onEdit && editData) {
      onEdit(excuse.id, editData);
      onOpenChange(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return <Badge variant="success">{estado}</Badge>;
      case "Pendiente":
        return <Badge variant="orange-subtle">{estado}</Badge>;
      case "Rechazada":
        return <Badge variant="danger">{estado}</Badge>;
      default:
        return <Badge variant="grey">{estado}</Badge>;
    }
  };

  if (!excuse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col p-0 gap-0">
        {/* Header fijo */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {isEditMode ? "Editar Excusa" : "Detalles de la Excusa"}
          </DialogTitle>
        </DialogHeader>

        {/* Área scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isEditMode ? (
            // Edit Form
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pasantia">Pasantía</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-pasantia"
                    placeholder="Buscar pasantía..."
                    value={pasantiaSearch}
                    onChange={(e) => setPasantiaSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {editData.pasantia && !pasantiaSearch && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Seleccionado: <span className="font-medium">{editData.pasantia}</span>
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
                            setEditData({ ...editData, pasantia: pasantia });
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
                <Label htmlFor="edit-estudiante">Estudiante</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-estudiante"
                    placeholder="Buscar estudiante por nombre..."
                    value={estudianteSearch}
                    onChange={(e) => setEstudianteSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {editData.estudiante && !estudianteSearch && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Seleccionado: <span className="font-medium">{editData.estudiante}</span>
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
                            setEditData({ ...editData, estudiante: estudiante });
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
                <Label htmlFor="edit-tutor">Tutor</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-tutor"
                    placeholder="Buscar tutor por nombre..."
                    value={tutorSearch}
                    onChange={(e) => setTutorSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {editData.tutor && !tutorSearch && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    Seleccionado: <span className="font-medium">{editData.tutor}</span>
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
                            setEditData({ ...editData, tutor: tutor });
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
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  value={editData.estado || ""}
                  onValueChange={(value) => setEditData({ ...editData, estado: value as Excuse["estado"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-justificacion">Justificación</Label>
                <Textarea
                  id="edit-justificacion"
                  value={editData.justificacion || ""}
                  onChange={(e) => setEditData({ ...editData, justificacion: e.target.value })}
                  placeholder="Describa la razón de la excusa..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveEdit} className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={cancelEdit} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              {/* ID y Estado */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">ID:</span>
                  <span className="font-mono text-sm font-semibold">{excuse.id}</span>
                </div>
                {getEstadoBadge(excuse.estado)}
              </div>

              {/* Información del Estudiante */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Estudiante</p>
                    <p className="font-medium">{excuse.estudiante}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Pasantía</p>
                    <p className="font-medium">{excuse.pasantia}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Tutor</p>
                    <p className="font-medium">{excuse.tutor}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                    <p className="font-medium">{excuse.fecha}</p>
                  </div>
                </div>
              </div>

              {/* Justificación */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Justificación</p>
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">{excuse.justificacion}</p>
                </div>
              </div>

              {/* Certificado */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Certificado</p>
                {excuse.certificado ? (
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate flex-1">{excuse.certificado}</span>
                    <div className="flex items-center gap-1 ml-auto shrink-0">
                      {onOpenPdf && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenPdf(excuse.certificado, excuse.certificado)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver PDF
                        </Button>
                      )}
                      {onDownload && (
                        <button
                          onClick={() => onDownload(excuse.certificado)}
                          className="p-1.5 hover:bg-muted rounded-md transition-colors inline-flex items-center justify-center"
                          title="Descargar certificado"
                        >
                          <Download className="h-4 w-4 text-primary" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">Sin certificado adjunto</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer fijo */}
        {!isEditMode && (
          <DialogFooter className="px-6 py-4 border-t shrink-0">
            <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
