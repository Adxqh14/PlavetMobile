"use client";

import React, { useState, useDeferredValue, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { Textarea } from "../../../../shared/components/ui/textarea";
import { Send, Briefcase, User, Building2, MapPin, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import type { ExcuseFormData } from "../types";
import { excusaService, type PasantiaOption } from "../services/excusaService";

interface Props {
  formData: ExcuseFormData;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: Partial<ExcuseFormData>) => void;
  submitting?: boolean;
}

export const ExcusaForm = ({
  formData,
  onSubmit,
  onFormDataChange,
  submitting = false,
}: Props) => {
  const [pasantiaSearch, setPasantiaSearch] = useState("");
  const [pasantiaOptions, setPasantiaOptions] = useState<PasantiaOption[]>([]);
  const [loadingPasantias, setLoadingPasantias] = useState(false);

  const deferredSearch = useDeferredValue(pasantiaSearch);

  useEffect(() => {
    if (!deferredSearch.trim()) {
      setPasantiaOptions([]);
      return;
    }
    let cancelled = false;
    setLoadingPasantias(true);
    excusaService
      .searchPasantias(deferredSearch)
      .then((opts) => {
        if (!cancelled) setPasantiaOptions(opts);
      })
      .catch(() => {
        if (!cancelled) setPasantiaOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingPasantias(false);
      });
    return () => {
      cancelled = true;
    };
  }, [deferredSearch]);

  const handleSelectPasantia = (opt: PasantiaOption) => {
    onFormDataChange({
      id_pasantia: opt.id,
      pasantia: opt.label,
      estudiante: opt.estudiante,
      tutor: opt.tutor,
      centroDeTrabajo: opt.centroDeTrabajo,
    });
    setPasantiaSearch("");
    setPasantiaOptions([]);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Buscar pasantía ── */}
        <div className="space-y-2">
          <Label htmlFor="pasantia-search">Pasantía *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="pasantia-search"
              placeholder="Buscar por nombre del estudiante..."
              value={pasantiaSearch}
              onChange={(e) => setPasantiaSearch(e.target.value)}
              className="pl-10"
              autoComplete="off"
            />
          </div>
          {/* Seleccionada */}
          {formData.pasantia && !pasantiaSearch && (
            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
              Seleccionada: <span className="font-medium text-foreground">{formData.pasantia}</span>
            </div>
          )}
          {/* Dropdown resultados */}
          {pasantiaSearch && (
            <div className="border rounded-md max-h-48 overflow-y-auto shadow-md z-10 bg-background">
              {loadingPasantias ? (
                <div className="px-3 py-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Buscando pasantías...
                </div>
              ) : pasantiaOptions.length > 0 ? (
                pasantiaOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer text-sm border-b last:border-0"
                    onClick={() => handleSelectPasantia(opt)}
                  >
                    <div className="font-medium">{opt.estudiante}</div>
                    <div className="text-xs text-muted-foreground">
                      Tutor: {opt.tutor}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-3 text-sm text-muted-foreground">
                  No se encontraron pasantías
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Tipo de Excusa ── */}
        <div className="space-y-2">
          <Label htmlFor="tipoExcusa">Tipo de Excusa *</Label>
          <Select
            value={formData.tipoExcusa}
            onValueChange={(value) =>
              onFormDataChange({ tipoExcusa: value as ExcuseFormData["tipoExcusa"] })
            }
          >
            <SelectTrigger id="tipoExcusa">
              <SelectValue placeholder="Seleccione el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ausencia">Ausencia</SelectItem>
              <SelectItem value="tardanza">Tardanza</SelectItem>
              <SelectItem value="salir temprano">Salida Temprana</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ── Estudiante (solo lectura, auto-llenado) ── */}
        <div className="space-y-2">
          <Label>Estudiante</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={formData.estudiante}
              readOnly
              placeholder="Se llena automáticamente al seleccionar la pasantía"
              className="pl-10 bg-muted/40 cursor-default"
            />
          </div>
        </div>

        {/* ── Tutor (solo lectura, auto-llenado) ── */}
        <div className="space-y-2">
          <Label>Tutor Empresarial</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={formData.tutor}
              readOnly
              placeholder="Se llena automáticamente al seleccionar la pasantía"
              className="pl-10 bg-muted/40 cursor-default"
            />
          </div>
        </div>

        {/* ── Centro de Trabajo (solo lectura, auto-llenado) ── */}
        <div className="space-y-2">
          <Label>Centro de Trabajo</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={formData.centroDeTrabajo}
              readOnly
              placeholder="Se llena automáticamente al seleccionar la pasantía"
              className="pl-10 bg-muted/40 cursor-default"
            />
          </div>
        </div>

      </div>

      {/* ── Justificación ── */}
      <div className="space-y-2">
        <Label htmlFor="justificacion">Justificación *</Label>
        <Textarea
          id="justificacion"
          placeholder="Describa la razón de la excusa..."
          value={formData.justificacion}
          onChange={(e) => onFormDataChange({ justificacion: e.target.value })}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {submitting ? "Enviando excusa..." : "Enviar Excusa"}
      </Button>
    </form>
  );
};
