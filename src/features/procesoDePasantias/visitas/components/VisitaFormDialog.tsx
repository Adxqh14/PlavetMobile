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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/shared/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Search,
  Loader2,
  Save,
  MapPin,
  User,
  Users,
  Plus,
  X,
  FileText,
  Check,
  BookOpen,
} from "lucide-react";
import type {
  VisitaFormData,
  EstudianteFormEntry,
  TutorResult,
  CentroResult,
  EstudianteResult,
} from "../types";
import { visitaService } from "../services/visitaService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VisitaFormData) => Promise<void>;
  defaultTutorId?: string;
  defaultTutorName?: string;
}

// Helper to extract nombre/apellido from search result (handles perfil nesting or direct fields)
const getNombre = (r: TutorResult | EstudianteResult) =>
  r.perfil ? `${r.perfil.nombre} ${r.perfil.apellido}` : `${r.nombre ?? ""} ${r.apellido ?? ""}`;

function useDebounceSearch<T>(
  searchFn: (q: string) => Promise<{ data: T[] }>,
  minLen = 2
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < minLen) { setResults([]); setShow(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchFn(query);
        setResults(res.data ?? []);
        setShow(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  return { query, setQuery, results, loading, show, setShow };
}

export const VisitaFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultTutorId = "",
  defaultTutorName = "",
}: Props) => {
  const [form, setForm] = useState<VisitaFormData>({
    id_tutor: defaultTutorId,
    id_centro_trabajo: "",
    motivo: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: "10:00",
    observacion: "",
    estado: "programada",
    estudiantes: [],
  });
  const [tutorDisplay, setTutorDisplay] = useState(defaultTutorName);
  const [centroDisplay, setCentroDisplay] = useState("");
  const [estudiantesAdded, setEstudiantesAdded] = useState<EstudianteFormEntry[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Taller del tutor seleccionado (filtra estudiantes)
  const selectedTallerIdRef = useRef<string | undefined>(undefined);
  const [selectedTallerNombre, setSelectedTallerNombre] = useState<string | undefined>();

  // Tutor search
  const tutorSearch = useDebounceSearch<TutorResult>((q) =>
    visitaService.searchTutores(q)
  );
  const tutorRef = useRef<HTMLDivElement>(null);

  // Centro search
  const centroSearch = useDebounceSearch<CentroResult>((q) =>
    visitaService.searchCentros(q)
  );
  const centroRef = useRef<HTMLDivElement>(null);

  // Estudiante search — usa el taller del tutor como filtro
  const estSearch = useDebounceSearch<EstudianteResult>((q) =>
    visitaService.searchEstudiantes(q, selectedTallerIdRef.current)
  );
  const estRef = useRef<HTMLDivElement>(null);
  const [estObservacion, setEstObservacion] = useState("");

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tutorRef.current && !tutorRef.current.contains(e.target as Node))
        tutorSearch.setShow(false);
      if (centroRef.current && !centroRef.current.contains(e.target as Node))
        centroSearch.setShow(false);
      if (estRef.current && !estRef.current.contains(e.target as Node))
        estSearch.setShow(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset on open
  useEffect(() => {
    if (open) {
      setForm({
        id_tutor: defaultTutorId,
        id_centro_trabajo: "",
        motivo: "",
        fecha: new Date().toISOString().split("T")[0],
        hora: "10:00",
        observacion: "",
        estado: "programada",
        estudiantes: [],
      });
      setTutorDisplay(defaultTutorName);
      setCentroDisplay("");
      setEstudiantesAdded([]);
      setSubmitError(null);
      selectedTallerIdRef.current = undefined;
      setSelectedTallerNombre(undefined);
      tutorSearch.setQuery(defaultTutorName);
      centroSearch.setQuery("");
      estSearch.setQuery("");
      setEstObservacion("");
    }
  }, [open]);

  const handleSelectTutor = (t: TutorResult) => {
    const name = getNombre(t);
    const tallerId = t.taller?.id ?? t.id_taller;
    const tallerNombre = t.taller?.nombre;

    // Actualizar taller ref antes de que el buscador lo use
    selectedTallerIdRef.current = tallerId;
    setSelectedTallerNombre(tallerNombre);

    // Limpiar estudiantes porque cambia el taller
    setEstudiantesAdded([]);
    estSearch.setQuery("");
    estSearch.setShow(false);

    setForm((f) => ({ ...f, id_tutor: t.id }));
    setTutorDisplay(name);
    tutorSearch.setQuery(name);
    tutorSearch.setShow(false);
  };

  const handleSelectCentro = (c: CentroResult) => {
    setForm((f) => ({ ...f, id_centro_trabajo: c.id }));
    setCentroDisplay(c.nombre);
    centroSearch.setQuery(c.nombre);
    centroSearch.setShow(false);
  };

  const handleAddEstudiante = (est: EstudianteResult) => {
    const name = getNombre(est);
    const already = estudiantesAdded.some((e) => e.id_estudiante === est.id);
    if (!already) {
      setEstudiantesAdded((prev) => [
        ...prev,
        { id_estudiante: est.id, nombre_display: name, observacion: estObservacion },
      ]);
    }
    estSearch.setQuery("");
    estSearch.setShow(false);
    setEstObservacion("");
  };

  const handleRemoveEstudiante = (id: string) => {
    setEstudiantesAdded((prev) => prev.filter((e) => e.id_estudiante !== id));
  };

  const updateEstObservacion = (id: string, obs: string) => {
    setEstudiantesAdded((prev) =>
      prev.map((e) => (e.id_estudiante === id ? { ...e, observacion: obs } : e))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_tutor || !form.id_centro_trabajo || estudiantesAdded.length === 0) {
      setSubmitError("Selecciona tutor, empresa y agrega al menos un estudiante.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        ...form,
        hora: form.hora ? `${form.hora}:00` : "",
        estudiantes: estudiantesAdded.map((e) => ({
          id_estudiante: e.id_estudiante,
          observacion: e.observacion || undefined,
        })),
      });
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al programar visita");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Programar Visita</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Registra una visita de supervisión a un centro de trabajo.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="visita-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Sección 1: Tutor y Centro */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tutor y Centro de Trabajo
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tutor */}
                <div className="space-y-1.5 relative" ref={tutorRef}>
                  <Label className="text-xs font-semibold">Tutor Académico *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {tutorSearch.loading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    <Input
                      placeholder="Buscar tutor..."
                      className="pl-10 h-10 text-sm"
                      value={tutorSearch.query}
                      onChange={(e) => {
                        tutorSearch.setQuery(e.target.value);
                        if (form.id_tutor) setForm((f) => ({ ...f, id_tutor: "" }));
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {tutorSearch.show && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-44 overflow-y-auto">
                      {tutorSearch.results.length > 0 ? (
                        tutorSearch.results.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            className="w-full px-4 py-2.5 text-left hover:bg-muted/50 flex items-center gap-2 border-b last:border-0 text-sm transition-colors"
                            onClick={() => handleSelectTutor(t)}
                          >
                            <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            {getNombre(t)}
                          </button>
                        ))
                      ) : (
                        <p className="p-3 text-sm text-muted-foreground text-center">Sin resultados</p>
                      )}
                    </div>
                  )}
                  {form.id_tutor && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {tutorDisplay}
                    </p>
                  )}
                </div>

                {/* Centro de Trabajo */}
                <div className="space-y-1.5 relative" ref={centroRef}>
                  <Label className="text-xs font-semibold">Centro de Trabajo *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    {centroSearch.loading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    <Input
                      placeholder="Buscar empresa..."
                      className="pl-10 h-10 text-sm"
                      value={centroSearch.query}
                      onChange={(e) => {
                        centroSearch.setQuery(e.target.value);
                        if (form.id_centro_trabajo) setForm((f) => ({ ...f, id_centro_trabajo: "" }));
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {centroSearch.show && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-44 overflow-y-auto">
                      {centroSearch.results.length > 0 ? (
                        centroSearch.results.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="w-full px-4 py-2.5 text-left hover:bg-muted/50 flex items-center gap-2 border-b last:border-0 text-sm transition-colors"
                            onClick={() => handleSelectCentro(c)}
                          >
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            {c.nombre}
                          </button>
                        ))
                      ) : (
                        <p className="p-3 text-sm text-muted-foreground text-center">Sin resultados</p>
                      )}
                    </div>
                  )}
                  {form.id_centro_trabajo && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {centroDisplay}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 2: Detalles de la Visita */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-muted">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Detalles de la Visita
                </h3>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="motivo" className="text-xs font-semibold">Motivo *</Label>
                <Input
                  id="motivo"
                  required
                  placeholder="Ej: Supervisión de primera etapa, revisión de bitácora..."
                  className="h-10 text-sm"
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fecha" className="text-xs font-semibold">Fecha *</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fecha"
                      type="date"
                      required
                      className="pl-10 h-10 text-sm"
                      value={form.fecha}
                      onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hora" className="text-xs font-semibold">Hora</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hora"
                      type="time"
                      className="pl-10 h-10 text-sm"
                      value={form.hora}
                      onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="estado" className="text-xs font-semibold">Estado</Label>
                  <Select
                    value={form.estado}
                    onValueChange={(v) => setForm({ ...form, estado: v })}
                  >
                    <SelectTrigger id="estado" className="h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programada">Programada</SelectItem>
                      <SelectItem value="realizada">Realizada</SelectItem>
                      <SelectItem value="reprogramada">Reprogramada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="observacion" className="text-xs font-semibold">Observación General</Label>
                <Textarea
                  id="observacion"
                  placeholder="Notas adicionales para la visita..."
                  className="min-h-[80px] text-sm resize-none"
                  value={form.observacion}
                  onChange={(e) => setForm({ ...form, observacion: e.target.value })}
                />
              </div>
            </div>

            {/* Sección 3: Estudiantes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-muted">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Estudiantes a Visitar *
                  </h3>
                </div>
                {selectedTallerNombre ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                    <BookOpen className="h-3 w-3" />
                    {selectedTallerNombre}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Selecciona un tutor para filtrar por taller
                  </span>
                )}
              </div>

              {/* Buscador de estudiantes */}
              <div className="space-y-2" ref={estRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  {estSearch.loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Input
                    placeholder={
                      form.id_tutor
                        ? "Buscar estudiante por nombre..."
                        : "Primero selecciona un tutor"
                    }
                    className="pl-10 h-10 text-sm"
                    disabled={!form.id_tutor}
                    value={estSearch.query}
                    onChange={(e) => estSearch.setQuery(e.target.value)}
                    autoComplete="off"
                  />
                  {estSearch.show && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-44 overflow-y-auto">
                      {estSearch.results.length > 0 ? (
                        estSearch.results.map((est) => {
                          const name = getNombre(est);
                          const added = estudiantesAdded.some((e) => e.id_estudiante === est.id);
                          return (
                            <button
                              key={est.id}
                              type="button"
                              disabled={added}
                              className="w-full px-4 py-2.5 text-left hover:bg-muted/50 flex items-center justify-between border-b last:border-0 text-sm transition-colors disabled:opacity-50"
                              onClick={() => handleAddEstudiante(est)}
                            >
                              <span className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                {name}
                              </span>
                              {added ? (
                                <span className="text-xs text-emerald-600">Agregado</span>
                              ) : (
                                <Plus className="h-3.5 w-3.5 text-primary" />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="p-3 text-sm text-muted-foreground text-center">Sin resultados</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de estudiantes agregados */}
              {estudiantesAdded.length > 0 ? (
                <div className="space-y-2">
                  {estudiantesAdded.map((est) => (
                    <div key={est.id_estudiante} className="flex gap-2 p-3 rounded-lg bg-muted/30 border">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-primary" />
                            {est.nombre_display}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEstudiante(est.id_estudiante)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <Input
                          placeholder="Observación (opcional)..."
                          className="h-8 text-xs"
                          value={est.observacion}
                          onChange={(e) => updateEstObservacion(est.id_estudiante, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3 border-2 border-dashed rounded-lg">
                  Busca y agrega al menos un estudiante
                </p>
              )}
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
            form="visita-form"
            disabled={isSubmitting || !form.id_tutor || !form.id_centro_trabajo || estudiantesAdded.length === 0}
            className="px-8 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Programar Visita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
