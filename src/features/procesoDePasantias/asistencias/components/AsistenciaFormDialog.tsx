import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { useState } from "react";
import type { Asistencia, AsistenciaFormData } from "../types";
import { 
  Save, 
  ClipboardCheck, 
  User, 
  Briefcase, 
  CalendarDays, 
  Clock, 
  FileText,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AsistenciaFormData) => void;
  initialData?: Asistencia | null;
}

export const AsistenciaFormDialog = ({ open, onOpenChange, onSubmit, initialData }: Props) => {
  const [formData, setFormData] = useState<AsistenciaFormData>(() => {
    if (initialData) {
      return {
        estudiante: initialData.estudiante,
        pasantia: initialData.pasantia,
        tutor: initialData.tutor,
        fecha: initialData.fecha,
        horaEntrada: initialData.horaEntrada,
        horaSalida: initialData.horaSalida,
        estado: initialData.estado,
        observaciones: initialData.observaciones || ""
      };
    }
    return {
      estudiante: "",
      pasantia: "",
      tutor: "",
      fecha: new Date().toISOString().split('T')[0],
      horaEntrada: "08:00",
      horaSalida: "16:00",
      estado: "Presente",
      observaciones: ""
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {initialData ? "Editar Registro" : "Registrar Asistencia"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                {initialData 
                  ? "Actualiza los detalles de la jornada seleccionada." 
                  : "Registra la entrada, salida y estado de la jornada del estudiante."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="asistencia-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Información del Estudiante */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Información del Estudiante</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="estudiante" className="text-xs font-semibold">Estudiante *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="estudiante" 
                      required 
                      placeholder="Nombre del estudiante" 
                      className="pl-10 h-10 text-sm shadow-xs" 
                      value={formData.estudiante} 
                      onChange={(e) => setFormData({ ...formData, estudiante: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pasantia" className="text-xs font-semibold">Pasantía / Empresa *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="pasantia" 
                      required 
                      placeholder="Nombre de la pasantía" 
                      className="pl-10 h-10 text-sm shadow-xs" 
                      value={formData.pasantia} 
                      onChange={(e) => setFormData({ ...formData, pasantia: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Detalles de la Jornada */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detalles de la Jornada</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fecha" className="text-xs font-semibold">Fecha *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="fecha" 
                      type="date" 
                      required 
                      className="pl-10 h-10 text-sm shadow-xs" 
                      value={formData.fecha} 
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="estado" className="text-xs font-semibold">Estado *</Label>
                  <Select value={formData.estado} onValueChange={(value: Asistencia['estado']) => setFormData({ ...formData, estado: value })}>
                    <SelectTrigger id="estado" className="h-10 text-sm shadow-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Presente">Presente</SelectItem>
                      <SelectItem value="Tardanza">Tardanza</SelectItem>
                      <SelectItem value="Ausente">Ausente</SelectItem>
                      <SelectItem value="Justificado">Justificado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="horaEntrada" className="text-xs font-semibold">Hora Entrada</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="horaEntrada" 
                      type="time" 
                      className="pl-10 h-10 text-sm shadow-xs" 
                      value={formData.horaEntrada} 
                      onChange={(e) => setFormData({ ...formData, horaEntrada: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="horaSalida" className="text-xs font-semibold">Hora Salida</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="horaSalida" 
                      type="time" 
                      className="pl-10 h-10 text-sm shadow-xs" 
                      value={formData.horaSalida} 
                      onChange={(e) => setFormData({ ...formData, horaSalida: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 3: Observaciones */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Observaciones</h3>
              </div>
              <div className="space-y-1.5">
                <Textarea 
                  id="observaciones" 
                  placeholder="Notas adicionales sobre el desempeño o incidencias del día..." 
                  className="min-h-[100px] text-sm shadow-xs resize-none" 
                  value={formData.observaciones} 
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} 
                />
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
            form="asistencia-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            <Save className="mr-2 h-4 w-4" /> {initialData ? "Guardar Cambios" : "Registrar Asistencia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
