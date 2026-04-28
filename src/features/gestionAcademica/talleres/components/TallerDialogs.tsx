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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Taller</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo taller para el sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Taller</Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_familia">Familia</Label>
              <Input
                id="id_familia"
                value={formData.id_familia || ""}
                onChange={(e) => setFormData({ ...formData, id_familia: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo_titulo">Código Título</Label>
              <Input
                id="codigo_titulo"
                value={formData.codigo_titulo || ""}
                onChange={(e) => setFormData({ ...formData, codigo_titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horas_pasantia">Horas Pasantía</Label>
              <Input
                id="horas_pasantia"
                type="number"
                min="1"
                value={formData.horas_pasantia || ""}
                onChange={(e) => setFormData({ ...formData, horas_pasantia: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>



          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Taller</Button>
          </DialogFooter>
        </form>
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

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            Activo
          </span>
        );
      case "Inactivo":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Inactivo
          </span>
        );
      case "En Mantenimiento":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            En Mantenimiento
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {estado}
          </span>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Taller</DialogTitle>
          <DialogDescription>
            Información completa del taller seleccionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="text-base font-semibold">{taller.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre del Taller</label>
              <p className="text-base font-semibold">{taller.nombre}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Familia</label>
              <p className="text-base">{taller.id_familia}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Código Título</label>
              <p className="text-base">{taller.codigo_titulo}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Horas Pasantía</label>
              <p className="text-base">{taller.horas_pasantia} horas</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Estado</label>
              <div className="mt-1">{getEstadoBadge(taller.estado)}</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_nombre">Nombre del Taller</Label>
              <Input
                id="edit_nombre"
                value={formData.nombre || ""}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_id_familia">Familia</Label>
              <Input
                id="edit_id_familia"
                value={formData.id_familia || ""}
                onChange={(e) => setFormData({ ...formData, id_familia: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_codigo_titulo">Código Título</Label>
              <Input
                id="edit_codigo_titulo"
                value={formData.codigo_titulo || ""}
                onChange={(e) => setFormData({ ...formData, codigo_titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_horas_pasantia">Horas Pasantía</Label>
              <Input
                id="edit_horas_pasantia"
                type="number"
                min="1"
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
              <SelectTrigger>
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

          <DialogFooter>
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
