"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../shared/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../shared/components/ui/alert-dialog";
import { Button } from "../../../../shared/components/ui/button";
import { Label } from "../../../../shared/components/ui/label";
import { Input } from "../../../../shared/components/ui/input";
import {
  Briefcase,
  Eye,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  Search,
  Layout,
  ClipboardList,
  GraduationCap,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react";
import type { Pasantia, CreatePasantiaPayload, CentroTrabajo, Plaza, TutorEmpresarial, EstudianteBackend } from "../types";
import { pasantiaService } from "../services/pasantiaService";

// ── Helper ────────────────────────────────────────────────────────────────────

const useDebounce = (value: string, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ==========================================
// 1. DIALOGO DE CREACION
// ==========================================
export const CreatePasantiaDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (data: CreatePasantiaPayload) => Promise<void>;
}) => {
  // ── Form state ──
  const [estudianteSearch, setEstudianteSearch] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState<EstudianteBackend | null>(null);

  const [centroSearch, setCentroSearch] = useState("");
  const [selectedCentro, setSelectedCentro] = useState<CentroTrabajo | null>(null);

  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<TutorEmpresarial | null>(null);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── API data ──
  const [estudiantes, setEstudiantes] = useState<EstudianteBackend[]>([]);
  const [centros, setCentros] = useState<CentroTrabajo[]>([]);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [tutores, setTutores] = useState<TutorEmpresarial[]>([]);
  const [allTutores, setAllTutores] = useState<TutorEmpresarial[]>([]);

  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [loadingCentros, setLoadingCentros] = useState(false);
  const [loadingPlazas, setLoadingPlazas] = useState(false);

  const debouncedEstudiante = useDebounce(estudianteSearch);
  const debouncedCentro = useDebounce(centroSearch);

  const resetForm = useCallback(() => {
    setEstudianteSearch("");
    setSelectedEstudiante(null);
    setCentroSearch("");
    setSelectedCentro(null);
    setSelectedPlaza(null);
    setSelectedTutor(null);
    setFechaInicio("");
    setFechaFin("");
    setObservaciones("");
    setEstudiantes([]);
    setCentros([]);
    setPlazas([]);
    setTutores([]);
  }, []);

  useEffect(() => {
    if (open) {
      resetForm();
      // Preload all tutores once
      pasantiaService.getTutores().then(r => setAllTutores(r.data)).catch(() => {});
    }
  }, [open, resetForm]);

  // Search estudiantes by name
  useEffect(() => {
    if (!debouncedEstudiante) { setEstudiantes([]); return; }
    setLoadingEstudiantes(true);
    pasantiaService.getEstudiantes(debouncedEstudiante)
      .then(r => setEstudiantes(r.data))
      .catch(() => setEstudiantes([]))
      .finally(() => setLoadingEstudiantes(false));
  }, [debouncedEstudiante]);

  // Search centros by name
  useEffect(() => {
    if (!debouncedCentro) { setCentros([]); return; }
    setLoadingCentros(true);
    pasantiaService.getCentrosTrabajo(debouncedCentro)
      .then(r => setCentros(r.data))
      .catch(() => setCentros([]))
      .finally(() => setLoadingCentros(false));
  }, [debouncedCentro]);

  // Load plazas & tutores when centro selected
  useEffect(() => {
    if (!selectedCentro) { setPlazas([]); setTutores([]); return; }
    setLoadingPlazas(true);
    pasantiaService.getPlazasByCentro(selectedCentro.id)
      .then(r => setPlazas(r.data))
      .catch(() => setPlazas([]))
      .finally(() => setLoadingPlazas(false));

    // Filter tutores client-side by centro
    setTutores(allTutores.filter(t => t.id_centro_trabajo === selectedCentro.id));
    setSelectedPlaza(null);
    setSelectedTutor(null);
  }, [selectedCentro, allTutores]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudiante || !selectedCentro || !selectedTutor || !fechaInicio) return;

    const estudianteNombre = [
      selectedEstudiante.perfil?.nombre,
      selectedEstudiante.perfil?.apellido,
    ].filter(Boolean).join(" ");

    const tutorNombre = [
      selectedTutor.perfil?.nombre,
      selectedTutor.perfil?.apellido,
    ].filter(Boolean).join(" ");

    const payload: CreatePasantiaPayload = {
      estudiante_nombre: estudianteNombre,
      centro_trabajo_nombre: selectedCentro.nombre,
      tutor_empresarial_nombre: tutorNombre,
      plaza_nombre: selectedPlaza!.nombre_plaza ?? "",
      fecha_inicio: fechaInicio,
      estado: "activa",
      ...(fechaFin ? { fecha_fin: fechaFin } : {}),
      horas_acumuladas: 0,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !!selectedEstudiante && !!selectedCentro && !!selectedTutor && !!selectedPlaza && !!fechaInicio;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[660px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nueva Pasantía</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Asigna un estudiante a un centro de trabajo y plaza específica.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="create-pasantia-form" onSubmit={handleSubmit} className="space-y-8">

            {/* ── Sección: Estudiante ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estudiante</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Buscar Estudiante *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Escribe el nombre del estudiante..."
                    value={estudianteSearch}
                    onChange={(e) => { setEstudianteSearch(e.target.value); setSelectedEstudiante(null); }}
                    className="pl-10 h-11"
                  />
                  {loadingEstudiantes && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {selectedEstudiante && !estudianteSearch && (
                  <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {selectedEstudiante.perfil?.nombre} {selectedEstudiante.perfil?.apellido}
                    {selectedEstudiante.perfil?.cedula && (
                      <span className="text-xs text-muted-foreground ml-1">({selectedEstudiante.perfil.cedula})</span>
                    )}
                  </div>
                )}
                {estudianteSearch && estudiantes.length > 0 && (
                  <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card">
                    {estudiantes.map(est => (
                      <div
                        key={est.id}
                        className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm transition-colors flex flex-col"
                        onClick={() => {
                          setSelectedEstudiante(est);
                          setEstudianteSearch("");
                        }}
                      >
                        <span className="font-semibold">{est.perfil?.nombre} {est.perfil?.apellido}</span>
                        {est.perfil?.cedula && (
                          <span className="text-xs text-muted-foreground">{est.perfil.cedula}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {estudianteSearch && !loadingEstudiantes && estudiantes.length === 0 && (
                  <div className="border rounded-xl px-4 py-3 text-sm text-muted-foreground italic bg-card">
                    No se encontraron estudiantes
                  </div>
                )}
              </div>
            </div>

            {/* ── Sección: Centro de Trabajo ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Centro de Trabajo</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Buscar Centro *</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Escribe el nombre del centro..."
                    value={centroSearch}
                    onChange={(e) => { setCentroSearch(e.target.value); setSelectedCentro(null); }}
                    className="pl-10 h-11"
                  />
                  {loadingCentros && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {selectedCentro && !centroSearch && (
                  <div className="text-sm text-primary font-medium bg-primary/5 p-2 rounded-lg border border-primary/10 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {selectedCentro.nombre}
                  </div>
                )}
                {centroSearch && centros.length > 0 && (
                  <div className="border rounded-xl shadow-lg max-h-40 overflow-y-auto bg-card">
                    {centros.map(c => (
                      <div
                        key={c.id}
                        className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm transition-colors"
                        onClick={() => { setSelectedCentro(c); setCentroSearch(""); }}
                      >
                        {c.nombre}
                      </div>
                    ))}
                  </div>
                )}
                {centroSearch && !loadingCentros && centros.length === 0 && (
                  <div className="border rounded-xl px-4 py-3 text-sm text-muted-foreground italic bg-card">
                    No se encontraron centros
                  </div>
                )}
              </div>

              {/* Plaza y Tutor — solo cuando hay centro seleccionado */}
              {selectedCentro && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Plaza */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Plaza *</Label>
                    {loadingPlazas ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Cargando plazas...
                      </div>
                    ) : plazas.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-2">Sin plazas disponibles</p>
                    ) : (
                      <div className="border rounded-xl max-h-40 overflow-y-auto bg-card">
                        {plazas.map(p => (
                          <div
                            key={p.id}
                            className={`px-4 py-2.5 cursor-pointer text-sm transition-colors flex items-center gap-2 ${
                              selectedPlaza?.id === p.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                            }`}
                            onClick={() => setSelectedPlaza(selectedPlaza?.id === p.id ? null : p)}
                          >
                            <Layout className="h-3.5 w-3.5 shrink-0" />
                            {p.nombre_plaza ?? "Sin nombre"}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedPlaza && (
                      <div className="text-xs text-primary font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Seleccionada: {selectedPlaza.nombre_plaza}
                      </div>
                    )}
                  </div>

                  {/* Tutor */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Tutor Empresarial *</Label>
                    {tutores.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-2">Sin tutores en este centro</p>
                    ) : (
                      <div className="border rounded-xl max-h-40 overflow-y-auto bg-card">
                        {tutores.map(t => (
                          <div
                            key={t.id}
                            className={`px-4 py-2.5 cursor-pointer text-sm transition-colors flex flex-col ${
                              selectedTutor?.id === t.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                            }`}
                            onClick={() => setSelectedTutor(t)}
                          >
                            <span>{t.perfil?.nombre} {t.perfil?.apellido}</span>
                            {t.departamento && (
                              <span className="text-xs text-muted-foreground">{t.departamento}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedTutor && (
                      <div className="text-xs text-primary font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {selectedTutor.perfil?.nombre} {selectedTutor.perfil?.apellido}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sección: Cronograma ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cronograma</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Fecha de Inicio *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Fecha de Fin (Opcional)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-semibold">Observaciones</Label>
                  <div className="relative">
                    <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      placeholder="Observaciones relevantes sobre la pasantía..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={3}
                      className="pl-10 w-full rounded-xl border bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:text-foreground">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-pasantia-form"
            disabled={!canSubmit || submitting}
            className="px-8 font-bold shadow-lg shadow-primary/20"
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Crear Pasantía
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 2. DIALOGO DE VISUALIZACION
// ==========================================
export const ViewPasantiaDialog = ({
  open,
  onOpenChange,
  pasantia,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  pasantia: Pasantia | null;
}) => {
  const getEstadoBadge = (estado: Pasantia["estado"]) => {
    const styles: Record<string, string> = {
      activa: "bg-emerald-100 text-emerald-700 border-emerald-200",
      completada: "bg-blue-100 text-blue-700 border-blue-200",
      suspendida: "bg-red-100 text-red-700 border-red-200",
      pendiente: "bg-amber-100 text-amber-700 border-amber-200",
      cancelada: "bg-gray-100 text-gray-700 border-gray-200",
    };
    const labels: Record<string, string> = {
      activa: "Activa", completada: "Completada",
      suspendida: "Suspendida", pendiente: "Pendiente", cancelada: "Cancelada",
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${styles[estado] ?? ""}`}>
        {labels[estado] ?? estado}
      </span>
    );
  };

  if (!pasantia) return null;

  const estudianteNombre = [pasantia.estudiante?.nombre, pasantia.estudiante?.apellido]
    .filter(Boolean).join(" ") || "—";
  const tutorNombre = [pasantia.tutor_empresarial?.nombre, pasantia.tutor_empresarial?.apellido]
    .filter(Boolean).join(" ") || "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">Detalles de Pasantía</DialogTitle>
                <DialogDescription className="text-muted-foreground font-medium">
                  Información completa sobre el proceso académico.
                </DialogDescription>
              </div>
            </div>
            {getEstadoBadge(pasantia.estado)}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Ficha Estudiante */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ficha del Estudiante</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Nombre Completo</p>
                <p className="text-base font-semibold">{estudianteNombre}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Cédula</p>
                <p className="text-base font-semibold font-mono">{pasantia.estudiante?.cedula ?? "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Tutor Asignado</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <User className="h-4 w-4 text-primary" />
                  {tutorNombre}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles Pasantía */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detalles del Puesto</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Plaza Asignada</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Layout className="h-4 w-4 text-primary" />
                  {pasantia.plaza?.nombre_plaza ?? "Sin plaza asignada"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Centro de Trabajo</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="h-4 w-4 text-primary" />
                  {pasantia.centro_trabajo?.nombre ?? "—"}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Fecha de Inicio</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  {pasantia.fecha_inicio}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Fecha Estimada Fin</p>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="h-4 w-4 text-primary" />
                  {pasantia.fecha_fin ?? "No definida"}
                </div>
              </div>
            </div>
          </div>

          {/* Progreso */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-muted">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progreso Académico</h3>
            </div>
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-primary uppercase">Horas Acumuladas</p>
                <span className="text-2xl font-black text-primary">{pasantia.horas_acumuladas}h</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Horas registradas y validadas por el tutor hasta la fecha.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button className="w-full sm:w-auto px-8 font-bold" onClick={() => onOpenChange(false)}>
            Cerrar Ventana
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// 3. DIALOGO DE ELIMINACION
// ==========================================
export const DeletePasantiaDialog = ({
  open,
  onOpenChange,
  onConfirm,
  pasantia,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
  pasantia: Pasantia | null;
}) => {
  const [loading, setLoading] = useState(false);

  if (!pasantia) return null;

  const estudianteNombre = [pasantia.estudiante?.nombre, pasantia.estudiante?.apellido]
    .filter(Boolean).join(" ") || "este estudiante";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(pasantia.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <AlertDialogHeader className="px-8 pt-8 pb-4">
          <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4 border border-red-200">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold">¿Eliminar Pasantía?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground">
            Estás a punto de eliminar el registro de <strong>{estudianteNombre}</strong>.
            Esta acción es irreversible y afectará los reportes académicos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="px-8 py-6 bg-muted/20 border-t flex gap-3">
          <AlertDialogCancel className="font-semibold rounded-xl border-none bg-transparent hover:bg-muted transition-colors">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirmar Eliminación
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
