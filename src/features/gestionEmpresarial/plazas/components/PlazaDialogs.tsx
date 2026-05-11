"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

import { 
  Briefcase, 
  Edit, 
  Building2, 
  User, 
  Calendar, 
  Wrench, 
  RotateCcw, 
  Trash2,
  Users,
  CalendarDays,
  Info,
  FileText
} from "lucide-react";
import type { Plaza, CreatePlazaData } from "../types";
import type { CentroOption, TallerOption } from "../hooks/usePlazas";
import { PlazaForm } from "./PlazaForm";

// ==========================================
// Interfaces compartidas
// ==========================================
interface SharedProps {
  centros: CentroOption[];
  talleres: TallerOption[];
}

// Helper para badges de estado
const getEstadoStyles = (estado: string) => {
  switch (estado) {
    case "Activa":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Ocupada":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Inhabilitada":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// ==========================================
// 1. DIALOGO DE CREACION
// ==========================================

const CreatePlazaDialogContent = ({
  onSubmit,
  onCancel,
  centros,
  talleres,
  initialCentro,
}: {
  onSubmit: (data: CreatePlazaData) => Promise<boolean | void>;
  onCancel: () => void;
  centros: CentroOption[];
  talleres: TallerOption[];
  initialCentro?: string;
}) => {
  const initialData: CreatePlazaData = {
    centro: initialCentro || "",
    titulo: "",
    nombre: "",
    genero: "Indistinto",
    descripcion: "",
    estado: "Activa",
    taller: "",
    idTaller: "",
    cantidadPersonas: 1,
    cupoTotal: 1,
    edadMinima: 18,
  };
  const [formData, setFormData] = useState<CreatePlazaData>(initialData);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.centro) return setFormError("Selecciona un centro de trabajo.");
    if (!formData.idTaller && !formData.taller) return setFormError("Selecciona un taller.");
    if (!formData.nombre) return setFormError("Escribe el nombre de la plaza.");
    const success = await onSubmit(formData);
    if (success !== false) {
      // handled by parent
    }
  };

  return (
    <>
      <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Nueva Plaza</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Registra una nueva vacante para pasantías en una empresa.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-8 py-2">
        <form id="create-plaza-form" onSubmit={handleSubmit}>
          <PlazaForm
            formData={formData}
            onChange={(d) => setFormData(d as CreatePlazaData)}
            centros={centros}
            talleres={talleres}
            lockedCentro={initialCentro}
          />
        </form>
      </div>

      <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0 flex-col items-stretch gap-2">
        {formError && (
          <p className="text-sm text-destructive font-medium text-center">{formError}</p>
        )}
        <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="create-plaza-form"
          className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
        >
          Guardar Plaza
        </Button>
        </div>
      </DialogFooter>
    </>
  );
};

export const CreatePlazaDialog = ({
  open,
  onOpenChange,
  onSubmit,
  centros,
  talleres,
  initialCentro,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: CreatePlazaData) => Promise<boolean | void>;
  initialCentro?: string;
} & SharedProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {open && (
          <CreatePlazaDialogContent
            onSubmit={async (data) => {
              const success = await onSubmit(data);
              if (success !== false) {
                onOpenChange(false);
              }
              return success;
            }}
            onCancel={() => onOpenChange(false)}
            centros={centros}
            talleres={talleres}
            initialCentro={initialCentro}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 2. DIALOGO DE EDICION
// ==========================================

const EditPlazaDialogContent = ({
  plaza,
  onSubmit,
  onCancel,
  centros,
  talleres,
}: {
  plaza: Plaza;
  onSubmit: (data: Plaza) => Promise<boolean | void>;
  onCancel: () => void;
  centros: CentroOption[];
  talleres: TallerOption[];
}) => {
  const [formData, setFormData] = useState<Plaza>(plaza);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <>
      <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Edit className="h-6 w-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Editar Plaza</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Modifica los datos de la plaza seleccionada.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-8 py-2">
        <form id="edit-plaza-form" onSubmit={handleSubmit}>
          <PlazaForm
            formData={formData}
            onChange={(d) => setFormData(d as Plaza)}
            isEditing
            centros={centros}
            talleres={talleres}
          />
        </form>
      </div>

      <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          form="edit-plaza-form"
          className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
        >
          Guardar Cambios
        </Button>
      </DialogFooter>
    </>
  );
};

export const EditPlazaDialog = ({
  open,
  onOpenChange,
  plaza,
  onSubmit,
  centros,
  talleres,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  plaza: Plaza | null;
  onSubmit: (data: Plaza) => Promise<boolean | void>;
} & SharedProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {plaza ? (
          <EditPlazaDialogContent
            key={plaza.id}
            plaza={plaza}
            onSubmit={async (data) => {
              const success = await onSubmit(data);
              if (success !== false) {
                onOpenChange(false);
              }
              return success;
            }}
            onCancel={() => onOpenChange(false)}
            centros={centros}
            talleres={talleres}
          />
        ) : (
          <div className="p-12 text-center text-muted-foreground animate-pulse">Cargando datos de la plaza...</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 3. DIALOGO DE DETALLES
// ==========================================
export const ViewPlazaDialog = ({
  open,
  onOpenChange,
  plaza,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  plaza: Plaza | null;
  getEstadoBadge?: (estado: string) => React.ReactNode;
}) => {
  if (!plaza) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getEstadoStyles(plaza.estado)}`}>
              {plaza.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {plaza.nombre}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> {plaza.fechaCreacion}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Información General */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-primary" /> Clasificación
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Centro de Trabajo</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{plaza.centro}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Taller / Área</p>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{plaza.taller}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Requisitos y Capacidad */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" /> Requisitos y Capacidad
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Cantidad</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{plaza.cantidadPersonas || 1} personas</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Edad Mínima</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{plaza.edadMinima || 18} años</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Género</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{plaza.genero}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Descripción */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary" /> Descripción y Requisitos
              </h3>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {plaza.descripcion || "Sin descripción detallada disponible."}
                </p>
              </div>
            </section>
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t shrink-0">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-8 font-semibold shadow-md active:scale-95 transition-all"
          >
            Cerrar Detalles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 4. DIALOGO DE ELIMINACION
// ==========================================
export const DeletePlazaDialog = ({
  open,
  onOpenChange,
  onConfirm,
  plazaNombre,
  isInhabilitada = false,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  plazaNombre?: string;
  isInhabilitada?: boolean;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-none shadow-2xl overflow-hidden p-0">
        <div className={`h-2 ${isInhabilitada ? 'bg-destructive' : 'bg-orange-500'}`} />
        <div className="p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-3 text-2xl font-bold ${isInhabilitada ? 'text-destructive' : 'text-orange-600'}`}>
              {isInhabilitada ? (
                <><Trash2 className="h-6 w-6" /> Eliminar Definitivamente</>
              ) : (
                <><RotateCcw className="h-6 w-6" /> Inhabilitar Plaza</>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-4 leading-relaxed">
              {isInhabilitada ? (
                <>
                  ¿Estás seguro de que deseas eliminar la plaza 
                  <span className="font-bold text-foreground"> "{plazaNombre}"</span>?
                  <br /><br />
                  <span className="inline-block p-3 bg-destructive/10 rounded-lg text-destructive font-semibold border border-destructive/20">
                    Esta acción es irreversible y eliminará permanentemente todos los registros asociados.
                  </span>
                </>
              ) : (
                <>
                  ¿Estás seguro de que deseas inhabilitar la plaza 
                  <span className="font-bold text-foreground"> "{plazaNombre}"</span>?
                  <br /><br />
                  La plaza cambiará su estado a <span className="font-bold">"Inhabilitada"</span>. Podrás restaurarla más tarde si es necesario.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-8 gap-3">
            <AlertDialogCancel className="bg-transparent border-input hover:bg-muted font-semibold px-6">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={`font-bold px-6 shadow-lg ${isInhabilitada ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200'}`}
            >
              {isInhabilitada ? 'Eliminar Ahora' : 'Inhabilitar Plaza'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};