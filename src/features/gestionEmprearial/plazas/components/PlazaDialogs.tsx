"use client";

import React, { useEffect, useState } from "react";
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
} from "../../../../shared/components/ui/alert-dialog"; // Importante: Asegúrate de tener este componente
import { Button } from "../../../../shared/components/ui/button";

import { Briefcase, Eye, Edit, Building2, User, Calendar, Wrench, RotateCcw, Trash2 } from "lucide-react";
import type { Plaza,  CreatePlazaData } from "../types";
import { PlazaForm } from "./PlazaForm";

// ==========================================
// Interfaces compartidas
// ==========================================
interface SharedProps {
  centros: string[];
  titulos: string[];
}

// ==========================================
// 1. DIALOGO DE CREACION
// ==========================================
export const CreatePlazaDialog = ({
  open,
  onOpenChange,
  onSubmit,
  centros,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: CreatePlazaData) => void;
} & SharedProps) => {
  const initialData: CreatePlazaData = {
    centro: "",
    titulo: "",
    nombre: "",
    genero: "Indistinto",
    descripcion: "",
    estado: "Activa",
    taller: "Mecanizado",
  };
  const [formData, setFormData] = useState<CreatePlazaData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
    setFormData(initialData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> Nueva Plaza
          </DialogTitle>
          <DialogDescription>
            Registra una nueva plaza en el centro de trabajo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <PlazaForm
            formData={formData}
            onChange={(d) => setFormData(d as CreatePlazaData)}
            centros={centros}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 2. DIALOGO DE EDICION
// ==========================================
export const EditPlazaDialog = ({
  open,
  onOpenChange,
  plaza,
  onSubmit,
  centros,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  plaza: Plaza | null;
  onSubmit: (data: Plaza) => void;
} & SharedProps) => {
  const [formData, setFormData] = useState<Plaza | null>(plaza);

  useEffect(() => {
    if (open && plaza) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(plaza);
    }
  }, [open, plaza]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSubmit(formData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {formData ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" /> Editar Plaza
              </DialogTitle>
              <DialogDescription>
                Modifica los datos de la plaza <span className="font-mono font-bold text-foreground">#{formData.id}</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <PlazaForm
                formData={formData}
                onChange={(d) => setFormData(d as Plaza)}
                isEditing
                centros={centros}
              />


              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="p-8 text-center text-muted-foreground">Cargando datos...</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 3. DIALOGO DE DETALLES
// ==========================================
interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const DetailItem = ({ label, value, icon, fullWidth }: DetailItemProps) => (
  <div className={fullWidth ? "col-span-2" : ""}>
    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">{label}</p>
    <div className="text-sm font-medium flex items-center gap-2">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      {value}
    </div>
  </div>
);

export const ViewPlazaDialog = ({
  open,
  onOpenChange,
  plaza,
  getEstadoBadge,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  plaza: Plaza | null;
  getEstadoBadge: (estado: string) => React.ReactNode;
}) => {
  if (!plaza) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" /> Detalles de Plaza
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 py-4">
          <DetailItem label="ID" value={plaza.id} />
          <DetailItem label="Estado" value={getEstadoBadge(plaza.estado)} />
          <DetailItem label="Nombre de la Plaza" value={plaza.nombre} fullWidth />
          <DetailItem
            label="Centro de Trabajo"
            value={plaza.centro}
            icon={<Building2 className="h-4 w-4" />}
          />
          <DetailItem label="Título Requerido" value={plaza.titulo} />
          <DetailItem
            label="Taller"
            value={plaza.taller}
            icon={<Wrench className="h-4 w-4" />}
          />
          <DetailItem
            label="Género Requerido"
            value={plaza.genero}
            icon={<User className="h-4 w-4" />}
          />
          <DetailItem
            label="Fecha de Creación"
            value={plaza.fechaCreacion}
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 4. DIALOGO DE ELIMINACION (POP-OVER STYLE)
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 ${isInhabilitada ? 'text-red-600' : 'text-orange-600'}`}>
            {isInhabilitada ? (
              <><Trash2 className="h-5 w-5" /> ¿Confirmar eliminación definitiva?</>
            ) : (
              <><RotateCcw className="h-5 w-5" /> ¿Confirmar inhabilitación?</>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isInhabilitada ? (
              <>
                ¿Estás seguro de que deseas eliminar definitivamente la plaza 
                <span className="font-bold text-foreground italic"> "{plazaNombre}"</span>?
                <br /><br />
                <strong className="text-destructive">Esta acción es irreversible y eliminará permanentemente todos los registros asociados.</strong>
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas inhabilitar la plaza 
                <span className="font-bold text-foreground italic"> "{plazaNombre}"</span>?
                <br /><br />
                La plaza cambiará su estado a "Inhabilitada" y no aparecerá en las búsquedas habituales. 
                Podrás restaurarla más tarde si es necesario.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-input hover:bg-muted">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={isInhabilitada ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-orange-600 text-white hover:bg-orange-700'}
          >
            {isInhabilitada ? 'Eliminar Definitivamente' : 'Inhabilitar Plaza'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};