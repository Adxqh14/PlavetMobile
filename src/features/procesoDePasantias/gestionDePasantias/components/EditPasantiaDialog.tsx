"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import { Button } from "../../../../shared/components/ui/button";
import { Label } from "../../../../shared/components/ui/label";
import { Input } from "../../../../shared/components/ui/input";
import {
  Edit,
  Layout,
  Building2,
  Calendar,
  Activity,
  Clock,
  Loader2,
} from "lucide-react";
import type { Pasantia, EstadoPasantia, UpdatePasantiaPayload, Plaza } from "../types";
import { pasantiaService } from "../services/pasantiaService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pasantia: Pasantia | null;
  onUpdate: (id: string, data: UpdatePasantiaPayload) => Promise<void>;
}

export const EditPasantiaDialog = ({ open, onOpenChange, pasantia, onUpdate }: Props) => {
  const [estado, setEstado] = useState<EstadoPasantia>("pendiente");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horasAcumuladas, setHorasAcumuladas] = useState(0);
  const [selectedPlazaId, setSelectedPlazaId] = useState<string | null>(null);

  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loadingPlazas, setLoadingPlazas] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pasantia && open) {
      setEstado(pasantia.estado);
      setFechaInicio(pasantia.fecha_inicio ?? "");
      setFechaFin(pasantia.fecha_fin ?? "");
      setHorasAcumuladas(pasantia.horas_acumuladas);
      setSelectedPlazaId(pasantia.id_plaza ?? null);

      // Load plazas for this centro
      if (pasantia.id_centro_trabajo) {
        setLoadingPlazas(true);
        pasantiaService.getPlazasByCentro(pasantia.id_centro_trabajo)
          .then(r => setPlazas(r.data))
          .catch(() => setPlazas([]))
          .finally(() => setLoadingPlazas(false));
      }
    }
  }, [pasantia, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasantia) return;

    const payload: UpdatePasantiaPayload = {
      estado,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin: fechaFin || null,
      horas_acumuladas: horasAcumuladas,
      id_plaza: selectedPlazaId,
    };

    setSubmitting(true);
    try {
      await onUpdate(pasantia.id, payload);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!pasantia) return null;

  const estudianteNombre = [pasantia.estudiante?.nombre, pasantia.estudiante?.apellido]
    .filter(Boolean).join(" ") || "—";
  const tutorNombre = [pasantia.tutor_empresarial?.nombre, pasantia.tutor_empresarial?.apellido]
    .filter(Boolean).join(" ") || "—";

  return (
    <Dialog key={pasantia.id} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Edit className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Pasantía</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Modifica estado, fechas, plaza u horas de la pasantía.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Información de solo lectura */}
          <div className="mb-6 rounded-xl bg-muted/30 border p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Información del Registro</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Estudiante:</span>
                <span className="ml-2 font-semibold">{estudianteNombre}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Centro:</span>
                <span className="ml-2 font-semibold">{pasantia.centro_trabajo?.nombre ?? "—"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Tutor:</span>
                <span className="ml-2 font-semibold">{tutorNombre}</span>
              </div>
            </div>
          </div>

          <form id="edit-pasantia-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Estado y Horas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Estado del Proceso
                </Label>
                <Select
                  value={estado}
                  onValueChange={(v) => setEstado(v as EstadoPasantia)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-primary/20 bg-primary/5 font-semibold text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa" className="font-medium text-emerald-600">Activa</SelectItem>
                    <SelectItem value="completada" className="font-medium text-blue-600">Completada</SelectItem>
                    <SelectItem value="pendiente" className="font-medium text-amber-600">Pendiente</SelectItem>
                    <SelectItem value="suspendida" className="font-medium text-red-600">Suspendida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" /> Horas Acumuladas
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={horasAcumuladas}
                  onChange={(e) => setHorasAcumuladas(Number(e.target.value))}
                  className="h-11"
                />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> Fecha de Inicio *
                </Label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> Fecha de Fin (Opcional)
                </Label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Plaza */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Layout className="h-4 w-4 text-muted-foreground" />
                Plaza Asignada
                {pasantia.centro_trabajo?.nombre && (
                  <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> {pasantia.centro_trabajo.nombre}
                  </span>
                )}
              </Label>
              {loadingPlazas ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando plazas...
                </div>
              ) : plazas.length === 0 ? (
                <p className="text-sm text-muted-foreground italic py-2">Sin plazas disponibles para este centro</p>
              ) : (
                <div className="border rounded-xl max-h-40 overflow-y-auto bg-card">
                  <div
                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                      !selectedPlazaId ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedPlazaId(null)}
                  >
                    Sin plaza asignada
                  </div>
                  {plazas.map(p => (
                    <div
                      key={p.id}
                      className={`px-4 py-2.5 cursor-pointer text-sm transition-colors flex items-center gap-2 ${
                        selectedPlazaId === p.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedPlazaId(p.id)}
                    >
                      <Layout className="h-3.5 w-3.5 shrink-0" />
                      {p.nombre_plaza ?? "Sin nombre"}
                    </div>
                  ))}
                </div>
              )}
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
            form="edit-pasantia-form"
            disabled={submitting}
            className="px-8 font-bold shadow-lg shadow-primary/20"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Actualizar Pasantía
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
