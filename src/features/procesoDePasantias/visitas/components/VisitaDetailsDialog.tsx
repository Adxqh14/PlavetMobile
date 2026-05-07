import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Users,
  FileText,
  CalendarCheck,
} from "lucide-react";
import type { Visita } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visita: Visita | null;
}

const estadoStyles: Record<string, string> = {
  programada: "bg-amber-100 text-amber-700 border-amber-200",
  realizada: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelada: "bg-red-100 text-red-700 border-red-200",
  reprogramada: "bg-blue-100 text-blue-700 border-blue-200",
};

const estadoLabel: Record<string, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
  reprogramada: "Reprogramada",
};

const formatTime = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : "—");
const formatDate = (d: string | null | undefined) => (d ? String(d).slice(0, 10) : "—");

export const VisitaDetailsDialog = ({ open, onOpenChange, visita }: Props) => {
  if (!visita) return null;

  const tutorName = visita.tutor
    ? `${visita.tutor.nombre} ${visita.tutor.apellido}`
    : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <CalendarCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${estadoStyles[visita.estado] ?? "bg-muted text-muted-foreground border-muted"}`}
            >
              {estadoLabel[visita.estado] ?? visita.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1 space-y-6">
          {/* Motivo y empresa */}
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">{visita.motivo}</h2>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {visita.centro_trabajo?.nombre ?? "—"}
            </p>
          </div>

          {/* Fecha, Hora, Tutor */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-primary" /> Detalles
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Fecha</p>
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary/70" />
                  <p className="text-sm font-semibold">{formatDate(visita.fecha)}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Hora</p>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary/70" />
                  <p className="text-sm font-semibold">{formatTime(visita.hora)}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Tutor</p>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary/70" />
                  <p className="text-sm font-semibold truncate">{tutorName}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Estudiantes */}
          {visita.estudiantes && visita.estudiantes.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" /> Estudiantes ({visita.estudiantes.length})
              </h3>
              <div className="space-y-2">
                {visita.estudiantes.map((ve, i) => (
                  <div key={ve.id_visita_estudiante ?? i} className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-primary/70" />
                      {ve.estudiante.nombre} {ve.estudiante.apellido}
                    </p>
                    {ve.observacion && (
                      <p className="text-xs text-muted-foreground mt-1 ml-5 italic">
                        "{ve.observacion}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Observación general */}
          {visita.observacion && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary" /> Observación
              </h3>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground leading-relaxed italic">
                  "{visita.observacion}"
                </p>
              </div>
            </section>
          )}
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t shrink-0">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-8 font-semibold shadow-md active:scale-95 transition-all"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
