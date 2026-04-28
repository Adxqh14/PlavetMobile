// ==========================================
// Componentes de diálogo para Talleres
// ==========================================

import { useState } from "react";
import { Button } from "../../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { 
  Wrench, 
  Info, 
  Layers, 
  Hash, 
  Clock 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import type { Taller } from "../types";

// Estados disponibles
const ESTADOS = [
  "Activo",
  "Inactivo",
  "En Mantenimiento",
] as const;

// Helper para badges de estado
const getEstadoStyles = (estado: string) => {
  switch (estado) {
    case "Activo":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Inactivo":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "En Mantenimiento":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// ==========================================
// Diálogo para crear taller
// ==========================================
interface CreateTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Taller) => void;
}

export const CreateTallerDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateTallerDialogProps) => {
  const [formData, setFormData] = useState<Partial<Taller>>({
    nombre: "",
    id_familia: "",
    codigo_titulo: "",
    horas_pasantia: 0,
    estado: "Activo",
    id: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTaller: Taller = {
      ...formData,
      id: Date.now(),
    } as Taller;
    onSubmit(newTaller);
    setFormData({
      nombre: "",
      id_familia: "",
      codigo_titulo: "",
      horas_pasantia: 0,
      estado: "Activo",
      id: 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            Registrar Nuevo Taller
          </DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo taller para el sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <form id="create-taller-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Taller *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Taller de Informática"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_familia">Familia Académica *</Label>
                <Input
                  id="id_familia"
                  placeholder="Ej: Informática"
                  value={formData.id_familia || ""}
                  onChange={(e) => setFormData({ ...formData, id_familia: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo_titulo">Código de Título *</Label>
                <Input
                  id="codigo_titulo"
                  placeholder="Ej: TIT-001"
                  value={formData.codigo_titulo || ""}
                  onChange={(e) => setFormData({ ...formData, codigo_titulo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horas_pasantia">Horas de Pasantía *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="horas_pasantia"
                    type="number"
                    min="1"
                    className="pl-10"
                    placeholder="0"
                    value={formData.horas_pasantia || ""}
                    onChange={(e) => setFormData({ ...formData, horas_pasantia: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado Inicial</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map(estado => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="create-taller-form">Registrar Taller</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// Diálogo para ver detalles
// ==========================================
interface ViewTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taller: Taller | null;
}

export const ViewTallerDialog = ({ open, onOpenChange, taller }: ViewTallerDialogProps) => {
  if (!taller) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getEstadoStyles(taller.estado)}`}>
              {taller.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {taller.nombre}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Hash className="h-3.5 w-3.5" /> ID de Taller: {taller.id}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Información Principal */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-primary" /> Información General
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Familia Académica</p>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{taller.id_familia}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Código de Título</p>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{taller.codigo_titulo}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Configuración de Pasantía */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary" /> Requisitos de Pasantía
              </h3>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">Horas Requeridas</p>
                  <p className="text-xs text-muted-foreground">Total de horas para completar pasantía</p>
                </div>
                <div className="text-2xl font-black text-primary">
                  {taller.horas_pasantia}<span className="text-xs font-normal ml-1">hrs</span>
                </div>
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
// Diálogo para editar taller
// ==========================================
interface EditTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Taller) => void;
  taller: Taller | null;
  allTalleres: Taller[];
}

export const EditTallerDialog = ({ open, onOpenChange, onSubmit, taller, allTalleres }: EditTallerDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  
  // Usar key para resetear el formulario cuando el taller cambia
  const [formData, setFormData] = useState<Partial<Taller>>(taller || {});

  // Filtrar talleres para el selector
  const filteredTalleres = allTalleres.filter(t =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.codigo_titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cambiar a un taller diferente
  const handleSelectTaller = (selectedTaller: Taller) => {
    setFormData(selectedTaller);
    setSearchTerm("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taller) {
      const updatedTaller: Taller = { ...formData, id: taller.id } as Taller;
      onSubmit(updatedTaller);
      onOpenChange(false);
    }
  };

  if (!taller) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto" key={taller?.id}>
        <DialogHeader>
          <DialogTitle>Editar Taller</DialogTitle>
          <DialogDescription>
            Modifica los datos del taller seleccionado o busca otro taller para editar.
          </DialogDescription>
        </DialogHeader>
        
        {/* Selector de Taller */}
        <div className="mb-6 p-4 border rounded-lg bg-muted/30">
          <div className="mb-3">
            <Label className="text-sm font-medium">Buscar y Seleccionar Taller</Label>
          </div>
          

            <div className="space-y-3">
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              
              {searchTerm && (
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {filteredTalleres.length > 0 ? (
                    <div className="p-2 space-y-1">
                      {filteredTalleres.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTaller(t)}
                          className="p-2 rounded hover:bg-muted cursor-pointer text-sm"
                        >
                          <div className="font-medium">{t.nombre}</div>
                          <div className="text-muted-foreground">{t.codigo_titulo} - {t.id_familia}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No se encontraron talleres
                    </div>
                  )}
                </div>
              )}
            </div>

          
          {/* Taller Actual */}
          <div className="mt-3 p-3 bg-background rounded border">
            <div className="text-sm font-medium text-muted-foreground">Taller Actual:</div>
            <div className="font-medium">{formData.nombre || "No seleccionado"}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit_nombre">Nombre del Taller *</Label>
            <Input
              id="edit_nombre"
              value={formData.nombre || ""}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_id_familia">Familia Académica *</Label>
              <Input
                id="edit_id_familia"
                value={formData.id_familia || ""}
                onChange={(e) => setFormData({ ...formData, id_familia: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_codigo_titulo">Código de Título *</Label>
              <Input
                id="edit_codigo_titulo"
                value={formData.codigo_titulo || ""}
                onChange={(e) => setFormData({ ...formData, codigo_titulo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_horas_pasantia">Horas de Pasantía *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit_horas_pasantia"
                  type="number"
                  min="1"
                  className="pl-10"
                  value={formData.horas_pasantia || ""}
                  onChange={(e) => setFormData({ ...formData, horas_pasantia: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_estado">Estado</Label>
              <Select
                value={formData.estado || "Activo"}
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger id="edit_estado">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="px-0 pt-4 border-t shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Actualizar Taller</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// Diálogo para eliminar taller
// ==========================================
interface DeleteTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  taller: Taller | null;
}

export const DeleteTallerDialog = ({ open, onOpenChange, onConfirm, taller }: DeleteTallerDialogProps) => {
  if (!taller) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Taller</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar el taller "{taller.nombre}"? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
