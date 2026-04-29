"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";

import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { Textarea } from "../../../../shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { FileText, Calendar, User, Briefcase, Building2, Save, X, Clock, History, Landmark } from "lucide-react";
import { useState, useDeferredValue } from "react";
import type { Excuse } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excuse: Excuse | null;
  onEdit?: (id: string, data: Partial<Excuse>) => void;
  isEditMode?: boolean;
}

export const ExcusaDetailsDialog = ({ open, onOpenChange, excuse, onEdit, isEditMode = false }: Props) => {
  const getEditData = () => {
    if (excuse && isEditMode) {
      return {
        pasantia: excuse.pasantia,
        estudiante: excuse.estudiante,
        tutor: excuse.tutor,
        justificacion: excuse.justificacion,
        tipoExcusa: excuse.tipoExcusa,
        hora: excuse.hora,
        duracion: excuse.duracion,
        fecha: excuse.fecha,
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tipoExcusa">Tipo de Excusa</Label>
                  <Select
                    value={editData.tipoExcusa || ""}
                    onValueChange={(value) => setEditData({ ...editData, tipoExcusa: value as Excuse["tipoExcusa"] })}
                  >
                    <SelectTrigger id="edit-tipoExcusa">
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inasistencia">Inasistencia</SelectItem>
                      <SelectItem value="Tardanza">Tardanza</SelectItem>
                      <SelectItem value="Salida Temprana">Salida Temprana</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-fecha">Fecha Evento</Label>
                  <Input
                    id="edit-fecha"
                    type="date"
                    value={editData.fecha || ""}
                    onChange={(e) => setEditData({ ...editData, fecha: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  value={editData.estado || ""}
                  onValueChange={(value) => setEditData({ ...editData, estado: value as Excuse["estado"] })}
                >
                  <SelectTrigger id="edit-estado">
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(editData.tipoExcusa === "Tardanza" || editData.tipoExcusa === "Salida Temprana") && (
                <div className="space-y-2">
                  <Label htmlFor="edit-hora">Hora de entrada/salida</Label>
                  <Input
                    id="edit-hora"
                    type="time"
                    value={editData.hora || ""}
                    onChange={(e) => setEditData({ ...editData, hora: e.target.value })}
                  />
                </div>
              )}

              {editData.tipoExcusa === "Salida Temprana" && (
                <div className="space-y-2">
                  <Label htmlFor="edit-duracion">Tiempo fuera</Label>
                  <Input
                    id="edit-duracion"
                    value={editData.duracion || ""}
                    onChange={(e) => setEditData({ ...editData, duracion: e.target.value })}
                    placeholder="Ej: 2 horas"
                  />
                </div>
              )}

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
            // View Mode (Design inspired by Supervisors module)
            <div className="-mx-6 -mt-4 space-y-0">
              {/* Header Visual */}
              <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
                <div className="absolute -bottom-8 left-6">
                  <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
                    <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${
                    excuse.estado === "Aprobada" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                    excuse.estado === "Pendiente" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    "bg-red-100 text-red-700 border-red-200"
                  }`}>
                    {excuse.estado}
                  </div>
                </div>
              </div>

              <div className="pt-12 pb-6 px-6 space-y-6">
                {/* Nombre e ID */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground leading-tight">
                    {excuse.estudiante}
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
                    <History className="h-3.5 w-3.5" /> ID: {excuse.id} <span className="mx-2">•</span> <Calendar className="h-3.5 w-3.5" /> Enviada: {excuse.fechaCreacion}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Información Académica */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b pb-2">
                      <Briefcase className="h-3.5 w-3.5 text-primary" /> Información Académica
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Pasantía</p>
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-primary/70" />
                          <p className="text-sm font-semibold truncate">{excuse.pasantia}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Tutor Asignado</p>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary/70" />
                          <p className="text-sm font-semibold">{excuse.tutor}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Detalles de la Excusa */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b pb-2">
                      <Clock className="h-3.5 w-3.5 text-primary" /> Detalles de la Excusa
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                        <p className="text-sm font-semibold">{excuse.tipoExcusa}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                        <p className="text-sm font-semibold">{excuse.fecha}</p>
                      </div>
                      {excuse.hora && (
                        <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Hora</p>
                          <p className="text-sm font-semibold">{excuse.hora}</p>
                        </div>
                      )}
                      {excuse.duracion && (
                        <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Duración</p>
                          <p className="text-sm font-semibold">{excuse.duracion}</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Justificación */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b pb-2">
                      <FileText className="h-3.5 w-3.5 text-primary" /> Justificación
                    </h3>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-sm text-foreground leading-relaxed italic">
                        "{excuse.justificacion}"
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer fijo */}
        {!isEditMode && (
          <DialogFooter className="p-4 bg-muted/20 border-t shrink-0">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto px-8 font-semibold shadow-md active:scale-95 transition-all"
            >
              Cerrar Detalles
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
