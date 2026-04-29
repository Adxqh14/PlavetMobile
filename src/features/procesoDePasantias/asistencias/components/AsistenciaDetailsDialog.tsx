import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { 
  Calendar, 
  Clock, 
  ClipboardCheck, 
  History, 
  Briefcase, 
  Landmark, 
  FileText,
  UserCircle
} from "lucide-react";
import type { Asistencia } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asistencia: Asistencia | null;
}

const getEstadoStyles = (estado: string) => {
  switch (estado) {
    case "Presente":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Ausente":
      return "bg-red-100 text-red-700 border-red-200";
    case "Tardanza":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Justificado":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const AsistenciaDetailsDialog = ({ open, onOpenChange, asistencia }: Props) => {
  if (!asistencia) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getEstadoStyles(asistencia.estado)}`}>
              {asistencia.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre e ID */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {asistencia.estudiante}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <History className="h-3.5 w-3.5" /> Registrado por: {asistencia.registradoPor}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Información Académica */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-primary" /> Información Académica
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Pasantía</p>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold truncate">{asistencia.pasantia}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Tutor Asignado</p>
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold">{asistencia.tutor}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Detalles de Asistencia */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary" /> Detalles de Jornada
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    <p className="text-sm font-semibold">{asistencia.fecha}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Entrada</p>
                  <p className="text-sm font-semibold">{asistencia.horaEntrada}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Salida</p>
                  <p className="text-sm font-semibold">{asistencia.horaSalida}</p>
                </div>
              </div>
            </section>

            {/* Observaciones */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary" /> Observaciones
              </h3>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground leading-relaxed italic">
                  {asistencia.observaciones ? `"${asistencia.observaciones}"` : "Sin observaciones registradas."}
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
