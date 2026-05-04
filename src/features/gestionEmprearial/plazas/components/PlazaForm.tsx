"use client";

import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import { Briefcase, Building2, FileText, Users, CalendarDays } from "lucide-react";
import type { Plaza, Genero, EstadoPlaza } from "../types";

interface PlazaFormProps {
  formData: Partial<Plaza>;
  onChange: (data: Partial<Plaza>) => void;
  isEditing?: boolean;
  centros?: any[]; // Recibe CentroOption[] [{id, nombre}]
  talleres?: { id: string; nombre: string }[]; // Talleres desde la DB
}

export const PlazaForm = ({
  formData,
  onChange,
  isEditing = false,
  centros = [],
  talleres = [],
}: PlazaFormProps) => {
  return (
    <div className="space-y-8 py-4">
      {/* Sección: Ubicación y Clasificación */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-muted">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ubicación y Clasificación</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="centro" className="text-sm font-semibold">Centro de Trabajo *</Label>
            <Select
              value={formData.centro || ""}
              onValueChange={(v) => onChange({ ...formData, centro: v })}
            >
              <SelectTrigger id="centro" className="h-11 shadow-xs">
                <SelectValue placeholder="Seleccione un centro" />
              </SelectTrigger>
              <SelectContent>
                {centros.map((centro) => (
                  <SelectItem key={centro.id} value={centro.nombre}>
                    {centro.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taller" className="text-sm font-semibold">Taller / Área Técnica *</Label>
            <Select
              value={formData.idTaller || ""}
              onValueChange={(v) => {
                const selected = talleres.find((t) => t.id === v);
                onChange({ ...formData, idTaller: v, taller: selected?.nombre || v });
              }}
            >
              <SelectTrigger id="taller" className="h-11 shadow-xs">
                <SelectValue placeholder="Seleccione un taller" />
              </SelectTrigger>
              <SelectContent>
                {talleres.map((taller) => (
                  <SelectItem key={taller.id} value={taller.id}>
                    {taller.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sección: Detalles de la Plaza */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-muted">
          <Briefcase className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detalles de la Plaza</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-sm font-semibold">Nombre de la Plaza *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nombre"
                className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                value={formData.nombre || ""}
                onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Auxiliar de Mantenimiento Industrial"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="genero" className="text-sm font-semibold">Género Requerido</Label>
              <Select
                value={formData.genero || ""}
                onValueChange={(v) => onChange({ ...formData, genero: v as Genero })}
              >
                <SelectTrigger className="h-11 shadow-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indistinto">Indistinto</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Femenino">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edadMinima" className="text-sm font-semibold">Edad Mínima</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edadMinima"
                  type="number"
                  min="14"
                  className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                  value={formData.edadMinima ?? ""}
                  onChange={(e) => onChange({ ...formData, edadMinima: parseInt(e.target.value) || 0 })}
                  placeholder="18"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cantidadPersonas" className="text-sm font-semibold">Cantidad de Personas</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cantidadPersonas"
                  type="number"
                  min="1"
                  className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                  value={formData.cantidadPersonas ?? formData.cupoTotal ?? ""}
                  onChange={(e) => onChange({ ...formData, cantidadPersonas: parseInt(e.target.value) || 1 })}
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-semibold">Estado de la Plaza</Label>
              <Select
                value={formData.estado || ""}
                onValueChange={(v) => onChange({ ...formData, estado: v as EstadoPlaza })}
              >
                <SelectTrigger id="estado" className="h-11 shadow-xs">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Ocupada">Completa</SelectItem>
                  <SelectItem value="Inhabilitada">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-sm font-semibold">Descripción y Requisitos</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="descripcion"
                className="w-full min-h-[120px] p-3 pl-10 border rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-xs"
                placeholder="Describe las responsabilidades, beneficios o requisitos específicos..."
                value={formData.descripcion || ""}
                onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
