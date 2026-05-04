// ==========================================
// Componentes de diálogo para Talleres
// ==========================================

import { useState, useEffect } from "react";
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
import type { Taller, CreateTallerData } from "../types";
import { talleresService } from "../services/talleresService";

// Estados disponibles
const ESTADOS = [
  "Activo",
  "Inactivo",
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
  onSubmit: (data: CreateTallerData) => Promise<boolean | void>;
}

export const CreateTallerDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateTallerDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo_taller: "",
    familia_nombre: "",
    familia_codigo: "",
    codigo_titulo: "",
    horas_pasantia: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newTaller: CreateTallerData = {
        nombre: formData.nombre,
        codigo_taller: formData.codigo_taller,
        familia_nombre: formData.familia_nombre,
        familia_codigo: formData.familia_codigo,
        codigo_titulo: formData.codigo_titulo,
        horas_pasantia: formData.horas_pasantia,
      };
      const success = await onSubmit(newTaller);
      if (success !== false) {
        setFormData({
          nombre: "",
          codigo_taller: "",
          familia_nombre: "",
          familia_codigo: "",
          codigo_titulo: "",
          horas_pasantia: 0,
        });
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nuevo Taller Académico</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Registra un nuevo taller o área técnica para el programa.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="create-taller-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Información del Taller */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Wrench className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Datos del Taller</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-semibold">Nombre del Taller *</Label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nombre"
                      required
                      placeholder="Ej: Taller de Informática y Redes"
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.nombre || ""}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_taller" className="text-sm font-semibold">Código del Taller *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="codigo_taller"
                      required
                    placeholder="Ej: INF, GAT, MEC, ELDAD"
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.codigo_taller || ""}
                      onChange={(e) => setFormData({ ...formData, codigo_taller: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Clasificación Académica */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Clasificación Académica</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="familia_nombre" className="text-sm font-semibold">Nombre de la Familia *</Label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="familia_nombre"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="Ej: Test para ismael"
                      value={formData.familia_nombre}
                      onChange={(e) => setFormData({ ...formData, familia_nombre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familia_codigo" className="text-sm font-semibold">Código de Familia *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="familia_codigo"
                      required
                      maxLength={3}
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="Ej: TT1 (máx. 3 caracteres)"
                      value={formData.familia_codigo}
                      onChange={(e) => setFormData({ ...formData, familia_codigo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="codigo_titulo" className="text-sm font-semibold">Código del Título *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="codigo_titulo"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="Ej: TEST-001"
                      value={formData.codigo_titulo}
                      onChange={(e) => setFormData({ ...formData, codigo_titulo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Configuración de Pasantía */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Configuración de Pasantía</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horas_pasantia" className="text-sm font-semibold">Horas Requeridas *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="horas_pasantia"
                      type="number"
                      min="1"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="Ej: 720"
                      value={formData.horas_pasantia || ""}
                      onChange={(e) => setFormData({ ...formData, horas_pasantia: parseInt(e.target.value) || 0 })}
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
            form="create-taller-form"
            disabled={isSubmitting}
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            {isSubmitting ? "Registrando..." : "Registrar Taller"}
          </Button>
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
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
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
              <Hash className="h-3.5 w-3.5" /> Código Taller: {taller.codigo_taller}
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
  onSubmit: (id: string, data: Partial<CreateTallerData>) => Promise<boolean | void>;
  taller: Taller | null;
}

export const EditTallerDialog = ({ open, onOpenChange, onSubmit, taller }: EditTallerDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Taller>>(() => taller || {});
  const [familias, setFamilias] = useState<{ id: string; nombre: string }[]>([]);
  const [loadingFamilias, setLoadingFamilias] = useState(false);

  useEffect(() => {
    if (taller) {
      setFormData(taller);
    }
  }, [taller]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingFamilias(true);
    talleresService
      .getAll({ pageSize: 500, estado: "todos" })
      .then((res) => {
        if (cancelled) return;
        const seen = new Set<string>();
        const unique: { id: string; nombre: string }[] = [];
        for (const t of res.data) {
          if (t.id_familia && !seen.has(t.id_familia)) {
            seen.add(t.id_familia);
            unique.push({ id: t.id_familia, nombre: t.familia_nombre || t.id_familia });
          }
        }
        setFamilias(unique);
      })
      .catch((err) => console.error("Error cargando familias:", err))
      .finally(() => { if (!cancelled) setLoadingFamilias(false); });
    return () => { cancelled = true; };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taller) {
      setIsSubmitting(true);
      try {
        const updatedData: Partial<CreateTallerData> = {
          nombre: formData.nombre,
          codigo_taller: formData.codigo_taller,
          id_familia: formData.id_familia,
          codigo_titulo: formData.codigo_titulo,
          horas_pasantia: formData.horas_pasantia,
          estado: formData.estado,
        };
        const success = await onSubmit(taller.id, updatedData);
        if (success !== false) {
          onOpenChange(false);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!taller) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Taller</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Modifica los requisitos o selecciona otro taller para gestionar.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">

          <form id="edit-taller-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Información del Taller */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Wrench className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Datos del Taller</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_nombre" className="text-sm font-semibold">Nombre del Taller *</Label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit_nombre"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.nombre || ""}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_codigo_taller" className="text-sm font-semibold">Código del Taller *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit_codigo_taller"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.codigo_taller || ""}
                      onChange={(e) => setFormData({ ...formData, codigo_taller: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Clasificación Académica */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Clasificación Académica</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit_id_familia" className="text-sm font-semibold">Familia Profesional *</Label>
                  <Select
                    value={formData.id_familia || ""}
                    onValueChange={(value) => setFormData({ ...formData, id_familia: value })}
                    disabled={loadingFamilias}
                  >
                    <SelectTrigger id="edit_id_familia" className="h-11 shadow-xs">
                      <SelectValue placeholder={loadingFamilias ? "Cargando familias…" : "Seleccionar familia"} />
                    </SelectTrigger>
                    <SelectContent>
                      {familias.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_codigo_titulo" className="text-sm font-semibold">Código del Título *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit_codigo_titulo"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.codigo_titulo || ""}
                      onChange={(e) => setFormData({ ...formData, codigo_titulo: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Configuración de Pasantía */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Configuración de Pasantía</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit_horas_pasantia" className="text-sm font-semibold">Horas Requeridas *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit_horas_pasantia"
                      type="number"
                      min="1"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.horas_pasantia || ""}
                      onChange={(e) => setFormData({ ...formData, horas_pasantia: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_estado" className="text-sm font-semibold">Estado del Taller</Label>
                  <Select
                    value={formData.estado || ""}
                    onValueChange={(value) => setFormData({ ...formData, estado: value })}
                  >
                    <SelectTrigger id="edit_estado" className="h-11 shadow-xs">
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
            form="edit-taller-form"
            disabled={isSubmitting}
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
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
  onConfirm: () => Promise<void>;
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
