"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Button } from "../../../../shared/components/ui/button";
import { FileText, Calendar, User, Briefcase, Building2, Clock, History, Landmark } from "lucide-react";
import type { Excuse } from "../types";
import { TIPO_EXCUSA_LABELS } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excuse: Excuse | null;
  /** kept for API compat with ExcusaTable but not used (no PATCH endpoint) */
  onEdit?: (id: string, data: Partial<Excuse>) => void;
  isEditMode?: boolean;
}

export const ExcusaDetailsDialog = ({ open, onOpenChange, excuse }: Props) => {
  if (!excuse) return null;

  const tipoLabel = TIPO_EXCUSA_LABELS[excuse.tipoExcusa] ?? excuse.tipoExcusa;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] flex flex-col p-0 gap-0">
        {/* Header fijo */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalles de la Excusa
          </DialogTitle>
        </DialogHeader>

        {/* Área scrolleable */}
        <div className="flex-1 overflow-y-auto">
          <div className="-mx-0 space-y-0">
            {/* Banner visual */}
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
                  excuse.estado === "Aprobada"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : excuse.estado === "Pendiente"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : "bg-red-100 text-red-700 border-red-200"
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
                <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2 flex-wrap">
                  <History className="h-3.5 w-3.5" />
                  ID: {excuse.id}
                  <span className="mx-1">•</span>
                  <Calendar className="h-3.5 w-3.5" />
                  Registrada: {excuse.fecha}
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
                        <Landmark className="h-4 w-4 text-primary/70 shrink-0" />
                        <p className="text-sm font-semibold truncate">{excuse.pasantia}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Tutor Asignado</p>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary/70 shrink-0" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                      <p className="text-sm font-semibold">{tipoLabel}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/30 border border-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Fecha de Registro</p>
                      <p className="text-sm font-semibold">{excuse.fecha}</p>
                    </div>
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
        </div>

        {/* Footer fijo */}
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
