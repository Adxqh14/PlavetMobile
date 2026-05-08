"use client";

import { useState, useEffect } from "react";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import { Users } from "lucide-react";
import type { Plaza, Genero } from "../types";
import { talleresService } from "../../../gestionAcademica/talleres/services/talleresService";
import type { CentroOption } from "../../../gestionEmprearial/plazas/hooks/usePlazas";

interface TallerOption {
  id: string | number;
  nombre: string;
}

interface PlazaFormProps {
  formData: Partial<Plaza>;
  onChange: (data: Partial<Plaza>) => void;
  isEditing?: boolean;
  centros?: CentroOption[];
}

export const PlazaForm = ({
  formData,
  onChange,
  isEditing = false,
  centros = [],
}: PlazaFormProps) => {
  const [talleres, setTalleres] = useState<TallerOption[]>([]);
  const [loadingTalleres, setLoadingTalleres] = useState(true);

  useEffect(() => {
    talleresService.getAll({ pageSize: 100, estado: "Activo" })
      .then(res => {
        console.log("Talleres cargados:", res.data);
        setTalleres(res.data);
      })
      .catch(err => console.error("Error loading talleres:", err))
      .finally(() => setLoadingTalleres(false));
  }, []);

  return (
    <div className="space-y-4 py-4">
      {/* Centro de Trabajo — usa ID del backend */}
      <div className="space-y-2">
        <Label htmlFor="centro">Centro de Trabajo</Label>
        <Select
          value={formData.empresaId ? String(formData.empresaId) : ""}
          onValueChange={(v) => {
            const selected = centros.find((c) => String(c.id) === v);
            onChange({
              ...formData,
              empresaId: String(v),
              centro: selected?.nombre || "",
            });
          }}
        >
          <SelectTrigger id="centro">
            <SelectValue placeholder="Seleccione un centro de trabajo" />
          </SelectTrigger>
          <SelectContent>
            {centros.map((centro) => (
              <SelectItem key={centro.id} value={String(centro.id)}>
                {centro.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Taller */}
      <div className="space-y-2">
        <Label htmlFor="taller">Taller</Label>
        <Select
          value={formData.idTaller ? String(formData.idTaller) : ""}
          onValueChange={(v) => {
            const selected = talleres.find(t => String(t.id) === v);
            onChange({ 
              ...formData, 
              idTaller: v,
              taller: selected?.nombre || "",
              nombre: selected?.nombre || "" 
            });
          }}
        >
          <SelectTrigger id="taller">
            <SelectValue placeholder={loadingTalleres ? "Cargando..." : "Seleccione un taller"} />
          </SelectTrigger>
          <SelectContent>
            {loadingTalleres ? (
              <SelectItem value="loading" disabled>Cargando talleres...</SelectItem>
            ) : talleres.length === 0 ? (
              <SelectItem value="none" disabled>No hay talleres activos disponibles</SelectItem>
            ) : (
              talleres.map((taller) => (
                <SelectItem key={taller.id} value={String(taller.id)}>
                  {taller.nombre}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Cupo Total */}
      <div className="space-y-2">
        <Label htmlFor="cupoTotal">Cupo Total</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="cupoTotal"
            type="number"
            min={1}
            className="pl-10"
            value={formData.cupoTotal ?? ""}
            onChange={(e) =>
              onChange({ ...formData, cupoTotal: Number(e.target.value) })
            }
            placeholder="Ej: 5"
          />
        </div>
      </div>

      {/* Genero */}
      <div className="space-y-2">
        <Label>Género</Label>
        <Select
          value={formData.genero}
          onValueChange={(v) => onChange({ ...formData, genero: v as Genero })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Indistinto">Indistinto</SelectItem>
            <SelectItem value="Masculino">Masculino</SelectItem>
            <SelectItem value="Femenino">Femenino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estado (solo lectura en edición) */}
      {isEditing && (
        <div className="space-y-2 opacity-70">
          <Label>Estado</Label>
          <Select
            value={formData.estado}
            disabled
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activa">Activa</SelectItem>
              <SelectItem value="Ocupada">Ocupada</SelectItem>
              <SelectItem value="Inhabilitada">Inhabilitada</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            El estado se gestiona automáticamente o mediante acciones específicas.
          </p>
        </div>
      )}
    </div>
  );
};
