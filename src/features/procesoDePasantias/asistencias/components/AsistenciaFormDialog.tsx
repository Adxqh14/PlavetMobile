import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useState, useEffect, useRef } from "react";
import type { AsistenciaFormData, PasantiaSearchResult } from "../types";
import { asistenciaService } from "../services/asistenciaService";
import {
  Save,
  ClipboardCheck,
  User,
  Briefcase,
  CalendarDays,
  Clock,
  Search,
  Loader2,
  Check,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AsistenciaFormData) => void;
  centroTrabajoId?: string;
}

const toTimeWithSeconds = (t: string) =>
  t && t.split(":").length === 2 ? `${t}:00` : t;

const calcHoras = (entrada: string, salida: string): number | undefined => {
  if (!entrada || !salida) return undefined;
  const [hE, mE] = entrada.split(":").map(Number);
  const [hS, mS] = salida.split(":").map(Number);
  const minutos = hS * 60 + mS - (hE * 60 + mE) - 60; // -1h almuerzo
  return minutos > 0 ? Math.round((minutos / 60) * 10) / 10 : undefined;
};

export const AsistenciaFormDialog = ({ open, onOpenChange, onSubmit, centroTrabajoId }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PasantiaSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<PasantiaSearchResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<AsistenciaFormData>({
    id_pasantia: "",
    id_estudiante: "",
    fecha: new Date().toISOString().split("T")[0],
    hora_entrada: "08:00",
    hora_salida: "17:00",
    horas: 8,
    asistencia: true,
  });

  // Reset on open
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPasantia(null);
      setShowDropdown(false);
      setSubmitError(null);
      setIsSubmitting(false);
      setFormData({
        id_pasantia: "",
        id_estudiante: "",
        fecha: new Date().toISOString().split("T")[0],
        hora_entrada: "08:00",
        hora_salida: "17:00",
        horas: 8,
        asistencia: true,
      });
    }
  }, [open]);

  // Debounced pasantia search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await asistenciaService.searchPasantias(searchQuery, centroTrabajoId);
        setSearchResults(result.data ?? []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectPasantia = (pasantia: PasantiaSearchResult) => {
    const nombre = pasantia.estudiante?.nombre ?? "";
    const apellido = pasantia.estudiante?.apellido ?? "";
    setSelectedPasantia(pasantia);
    setSearchQuery(`${nombre} ${apellido}`.trim());
    setShowDropdown(false);
    setFormData((prev) => ({
      ...prev,
      id_pasantia: pasantia.id,
      id_estudiante: pasantia.id_estudiante,
    }));
  };

  const handleHoraChange = (field: "hora_entrada" | "hora_salida", value: string) => {
    const entrada = field === "hora_entrada" ? value : formData.hora_entrada;
    const salida = field === "hora_salida" ? value : formData.hora_salida;
    setFormData((prev) => ({ ...prev, [field]: value, horas: calcHoras(entrada, salida) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_pasantia) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        ...formData,
        hora_entrada: formData.hora_entrada ? toTimeWithSeconds(formData.hora_entrada) : "",
        hora_salida: formData.hora_salida ? toTimeWithSeconds(formData.hora_salida) : "",
      });
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al registrar asistencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentName = selectedPasantia
    ? `${selectedPasantia.estudiante?.nombre ?? ""} ${selectedPasantia.estudiante?.apellido ?? ""}`.trim()
    : "";

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
                Registrar Asistencia
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Busca la pasantía por nombre de estudiante y registra la jornada.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="asistencia-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Sección 1: Pasantía y Estudiante */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <Briefcase className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Pasantía y Estudiante
                </h3>
              </div>

              {/* Buscar pasantía por nombre de estudiante */}
              <div className="space-y-1.5 relative" ref={dropdownRef}>
                <Label className="text-xs font-semibold">
                  Buscar pasantía (por estudiante o empresa) *
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  )}
                  <Input
                    placeholder="Nombre del estudiante o empresa..."
                    className="pl-10 h-10 text-sm shadow-xs"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedPasantia) {
                        setSelectedPasantia(null);
                        setFormData((prev) => ({ ...prev, id_pasantia: "", id_estudiante: "" }));
                      }
                    }}
                    autoComplete="off"
                  />
                </div>

                {/* Dropdown resultados */}
                {showDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => {
                        const nombre = `${p.estudiante?.nombre ?? ""} ${p.estudiante?.apellido ?? ""}`.trim();
                        const empresa = p.centro_trabajo?.nombre ?? "Sin empresa";
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-center gap-3 border-b last:border-b-0 transition-colors"
                            onClick={() => handleSelectPasantia(p)}
                          >
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{empresa}</p>
                              <p className="text-xs text-muted-foreground">{nombre || "Estudiante sin nombre"}</p>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground text-center">
                        No se encontraron pasantías con ese nombre
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pasantía seleccionada + Estudiante (readonly) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Pasantía / Empresa</Label>
                  <div className="flex items-center gap-2 px-3 h-10 text-sm bg-muted/30 border rounded-md">
                    {selectedPasantia ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={`truncate font-medium ${!selectedPasantia ? "text-muted-foreground" : ""}`}>
                      {selectedPasantia?.centro_trabajo?.nombre ?? "Selecciona una pasantía"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Estudiante</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      readOnly
                      tabIndex={-1}
                      className="pl-10 h-10 text-sm bg-muted/30 cursor-not-allowed select-none"
                      placeholder="Se completa al seleccionar"
                      value={studentName}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Detalles de la Jornada */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Detalles de la Jornada
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fecha */}
                <div className="space-y-1.5">
                  <Label htmlFor="fecha" className="text-xs font-semibold">
                    Fecha *
                  </Label>
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

                {/* Asistencia toggle */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Asistencia *</Label>
                  <div className="grid grid-cols-2 gap-2 h-10">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, asistencia: true })}
                      className={`rounded-md border text-sm font-semibold transition-colors ${
                        formData.asistencia
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                          : "bg-muted/30 border-muted text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      Presente
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, asistencia: false })}
                      className={`rounded-md border text-sm font-semibold transition-colors ${
                        !formData.asistencia
                          ? "bg-red-100 border-red-300 text-red-700"
                          : "bg-muted/30 border-muted text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      Ausente
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Hora Entrada */}
                <div className="space-y-1.5">
                  <Label htmlFor="hora_entrada" className="text-xs font-semibold">
                    Hora Entrada
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hora_entrada"
                      type="time"
                      className="pl-10 h-10 text-sm shadow-xs"
                      value={formData.hora_entrada}
                      onChange={(e) => handleHoraChange("hora_entrada", e.target.value)}
                    />
                  </div>
                </div>

                {/* Hora Salida */}
                <div className="space-y-1.5">
                  <Label htmlFor="hora_salida" className="text-xs font-semibold">
                    Hora Salida
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hora_salida"
                      type="time"
                      className="pl-10 h-10 text-sm shadow-xs"
                      value={formData.hora_salida}
                      onChange={(e) => handleHoraChange("hora_salida", e.target.value)}
                    />
                  </div>
                </div>

                {/* Horas (auto-calculado) */}
                <div className="space-y-1.5">
                  <Label htmlFor="horas" className="text-xs font-semibold">
                    Horas
                  </Label>
                  <Input
                    id="horas"
                    type="number"
                    step="0.5"
                    min="0"
                    className="h-10 text-sm shadow-xs"
                    value={formData.horas ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horas: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {submitError}
              </p>
            )}
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
            disabled={!formData.id_pasantia || isSubmitting}
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Registrar Asistencia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
