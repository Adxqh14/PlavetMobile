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
  Landmark,
} from "lucide-react";
import type { Asistencia } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asistencia: Asistencia | null;
}

const formatTime = (t: string | null | undefined) => {
  if (!t) return "—";
  return String(t).slice(0, 5);
};

const formatDate = (d: string | null | undefined) => {
  if (!d) return "—";
  return String(d).slice(0, 10);
};

export const AsistenciaDetailsDialog = ({ open, onOpenChange, asistencia }: Props) => {
  if (!asistencia) return null;

  const studentName = asistencia.estudiante
    ? `${asistencia.estudiante.nombre} ${asistencia.estudiante.apellido}`
    : "—";

  const empresa = asistencia.centro_trabajo?.nombre ?? "—";

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
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${
                asistencia.asistencia
                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                  : "bg-red-100 text-red-700 border-red-200"
              }`}
            >
              {asistencia.asistencia ? "Presente" : "Ausente"}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          {/* Nombre del estudiante */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">{studentName}</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Landmark className="h-3.5 w-3.5" /> {empresa}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Detalles de Asistencia */}
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary" /> Detalles de Jornada
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    <p className="text-sm font-semibold">{formatDate(asistencia.fecha)}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors text-center">
                  <p className="text-xs text-muted-foreground mb-1">Entrada</p>
                  <p className="text-sm font-semibold">{formatTime(asistencia.hora_entrada)}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors text-center">
                  <p className="text-xs text-muted-foreground mb-1">Salida</p>
                  <p className="text-sm font-semibold">{formatTime(asistencia.hora_salida)}</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors text-center">
                  <p className="text-xs text-muted-foreground mb-1">Horas</p>
                  <p className="text-sm font-semibold">
                    {asistencia.horas != null ? `${asistencia.horas}h` : "—"}
                  </p>
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
