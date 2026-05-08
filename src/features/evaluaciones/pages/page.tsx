"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  CheckCircle,
  User,
  Building2,
  ClipboardList,
  Search,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { pasantiaService } from "@/features/procesoDePasantias/gestionDePasantias/services/pasantiaService";
import type { Pasantia } from "@/features/procesoDePasantias/gestionDePasantias/types";
import { toast } from "sonner";
import { calificacionApiService } from "../services/calificacionApiService";
import { EvaluacionTable } from "../components/EvaluacionTable";
import type { EvaluacionForm } from "../hooks/useEvaluacion";

const EMPTY_FORM: EvaluacionForm = {
  identidadTitulo: "Desarrollo y administración de aplicaciones informáticas",
  codigoTitulo: "IFC006_3",
  nombreApellidos: "",
  horario: "",
  direccion: "",
  telefonos: "",
  fechaInicioPasantia: "",
  fechaTerminoPasantia: "",
  centroTrabajo: "",
  direccionEmpresa: "",
  telefonosEmpresa: "",
  personaContacto: "",
  nombreTutor: "",
  telefonosCorreoTutor: "",
  conocimientosTeoricos: Array(14).fill(""),
  asimilacionInstruccionesVerbales: Array(14).fill(""),
  asimilacionInstruccionesEscritas: Array(14).fill(""),
  asimilacionInstruccionesSimbolicas: Array(14).fill(""),
  subtotalCapacidad: Array(14).fill(""),
  organizacionPlanificacion: Array(14).fill(""),
  metodo: Array(14).fill(""),
  ritmoTrabajo: Array(14).fill(""),
  trabajoRealizado: Array(14).fill(""),
  subtotalHabilidad: Array(14).fill(""),
  iniciativa: Array(14).fill(""),
  trabajoEquipo: Array(14).fill(""),
  puntualidadAsistencia: Array(14).fill(""),
  responsabilidad: Array(14).fill(""),
  subtotalActitud: Array(14).fill(""),
  total: Array(14).fill(""),
  promedioCapacidades: "",
  promedioHabilidades: "",
  promedioActitudes: "",
  notaFinal: "",
  observaciones: "",
  raContenido: "RA9.2: Participar a su nivel en la creación de bases de datos y en el mantenimiento, tomando en consideración las políticas establecidas por la empresa.",
  criterio1: "Crear bases de datos, utilizando herramientas de tablas, índices, funciones, procedimientos, siguiendo las especificaciones de diseño recibidas, y documentar las actuaciones realizadas y los resultados obtenidos.",
  criterio2: "Aplicar mantenimiento a la base de datos según los resultados de la consulta (update, insert, delete, select).",
  criterio3: "Verificar el funcionamiento de la base de datos, tomando en consideración las reglas de la empresa.",
  criterio4: "Interpretar la documentación técnica de la base de datos, identificando sus características funcionales y la compatibilidad, siguiendo políticas de la empresa.",
  criterio5: "Documentar el análisis de los resultados obtenidos de las pruebas realizadas. Siguiendo las normas establecidas por la empresa.",
  criterio6: "Administrar las actividades de los datos para garantizar que los usuarios trabajen en forma cooperativa y complementaria al procesar datos en la base de datos.",
};

export default function EvaluacionesPage() {
  const { user, userRole } = useAuth();

  const [pasantias, setPasantias] = useState<Pasantia[]>([]);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingPasantias, setLoadingPasantias] = useState(false);

  const [evaluationForm, setEvaluationForm] = useState<EvaluacionForm>(EMPTY_FORM);
  const [tablaGuardada, setTablaGuardada] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar pasantías al montar
  useEffect(() => {
    const fetchPasantias = async () => {
      setLoadingPasantias(true);
      try {
        const response = await pasantiaService.getAll({ pageSize: 200 });
        let data = response.data;
        // Filtrar solo las pasantías del tutor logueado
        if (userRole === "TUTOR EMPRESARIAL" && user?.datos_rol?.id) {
          data = data.filter((p) => p.id_tutor_empresarial === user.datos_rol!.id);
        }
        setPasantias(data);
      } catch {
        toast.error("No se pudieron cargar las pasantías.");
      } finally {
        setLoadingPasantias(false);
      }
    };
    fetchPasantias();
  }, [user, userRole]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredPasantias = pasantias.filter((p) => {
    const nombre = `${p.estudiante?.nombre ?? ""} ${p.estudiante?.apellido ?? ""}`.toLowerCase();
    const empresa = (p.centro_trabajo?.nombre ?? "").toLowerCase();
    const cedula = (p.estudiante?.cedula ?? "").toLowerCase();
    const q = search.toLowerCase();
    return nombre.includes(q) || empresa.includes(q) || cedula.includes(q);
  });

  const handleSelectPasantia = (p: Pasantia) => {
    setSelectedPasantia(p);
    const fullName = `${p.estudiante?.nombre ?? ""} ${p.estudiante?.apellido ?? ""}`.trim();
    setSearch(fullName || p.id);
    setShowDropdown(false);
    // Resetear tabla y archivo al cambiar de pasantía
    setEvaluationForm(EMPTY_FORM);
    setTablaGuardada(false);
    setUploadedFile(null);
  };

  const handleClearPasantia = () => {
    setSelectedPasantia(null);
    setSearch("");
    setEvaluationForm(EMPTY_FORM);
    setTablaGuardada(false);
    setUploadedFile(null);
  };

  const canSubmit = selectedPasantia !== null && uploadedFile !== null;

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Selecciona una pasantía y sube el archivo Excel primero.");
      return;
    }
    const cedula = selectedPasantia!.estudiante?.cedula;
    if (!cedula) {
      toast.error("La pasantía seleccionada no tiene cédula del estudiante registrada.");
      return;
    }

    setIsSubmitting(true);
    try {
      await calificacionApiService.importar(
        cedula,
        uploadedFile!,
        evaluationForm.observaciones.trim() || undefined
      );
      toast.success("Evaluación enviada correctamente.");
      handleClearPasantia();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al enviar la evaluación.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Valores derivados de la pasantía seleccionada
  const studentName = selectedPasantia
    ? `${selectedPasantia.estudiante?.nombre ?? ""} ${selectedPasantia.estudiante?.apellido ?? ""}`.trim()
    : "";
  const studentCedula = selectedPasantia?.estudiante?.cedula ?? "";
  const companyName = selectedPasantia?.centro_trabajo?.nombre ?? "";
  const tutorName = selectedPasantia
    ? `${selectedPasantia.tutor_empresarial?.nombre ?? ""} ${selectedPasantia.tutor_empresarial?.apellido ?? ""}`.trim()
    : "";
  const fechaInicio = selectedPasantia?.fecha_inicio
    ? selectedPasantia.fecha_inicio.slice(0, 10)
    : "";
  const fechaFin = selectedPasantia?.fecha_fin
    ? selectedPasantia.fecha_fin.slice(0, 10)
    : "";

  return (
    <Main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">

          {/* Hero */}
          <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
            <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
              <ClipboardList className="w-80 h-80 text-primary -rotate-12" />
            </div>
            <div className="w-full relative px-6 md:px-12 z-10">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                  Evaluación de <span className="text-primary">Pasantías</span>
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                  Selecciona una pasantía, descarga la plantilla, complétala y súbela para registrar la evaluación.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">

            {/* ── Selector de Pasantía ── */}
            <Card className="shadow-sm border-border">
              <CardHeader className="border-b bg-muted/30 py-3 px-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Seleccionar Pasantía</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Input
                      className="h-9 pr-8 text-sm"
                      placeholder="Buscar por nombre del estudiante, empresa o cédula..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                        if (selectedPasantia) setSelectedPasantia(null);
                      }}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {selectedPasantia ? (
                      <button
                        type="button"
                        className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                        onClick={handleClearPasantia}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    )}
                  </div>

                  {showDropdown && !selectedPasantia && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-auto">
                      {loadingPasantias ? (
                        <div className="p-3 text-sm text-muted-foreground flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cargando pasantías...
                        </div>
                      ) : filteredPasantias.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground">
                          No se encontraron pasantías
                        </div>
                      ) : (
                        filteredPasantias.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent cursor-pointer flex flex-col gap-0.5 border-b border-border/40 last:border-0"
                            onClick={() => handleSelectPasantia(p)}
                          >
                            <span className="font-medium text-foreground">
                              {p.estudiante?.nombre} {p.estudiante?.apellido}
                              {p.estudiante?.cedula && (
                                <span className="text-muted-foreground font-normal ml-1.5">
                                  · {p.estudiante.cedula}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {p.centro_trabajo?.nombre}
                              <span className="ml-2 capitalize bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                {p.estado}
                              </span>
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {selectedPasantia && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span>
                      Pasantía seleccionada:{" "}
                      <strong>{studentName}</strong> en{" "}
                      <strong>{companyName}</strong>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Fila: Datos Personales | Datos Empresa ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Datos Personales */}
              <Card className="flex flex-col shadow-sm border-border">
                <CardHeader className="border-b bg-muted/30 py-3 px-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">1. Datos Personales y Académicos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Nombre Completo
                      </Label>
                      <Input
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        placeholder="Se completa al seleccionar pasantía"
                        value={studentName}
                        readOnly
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Cédula
                      </Label>
                      <Input
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        placeholder="—"
                        value={studentCedula}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Fecha Inicio
                      </Label>
                      <Input
                        type="date"
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        value={fechaInicio}
                        readOnly
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Fecha Fin
                      </Label>
                      <Input
                        type="date"
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        value={fechaFin}
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Datos de la Empresa */}
              <Card className="flex flex-col shadow-sm border-border">
                <CardHeader className="border-b bg-muted/30 py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">2. Datos de la Empresa</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Centro Laboral
                      </Label>
                      <Input
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        placeholder="Se completa al seleccionar pasantía"
                        value={companyName}
                        readOnly
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Tutor Empresarial
                      </Label>
                      <Input
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        placeholder="—"
                        value={tutorName}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Estado de Pasantía
                      </Label>
                      <Input
                        className="h-8 text-xs bg-muted/30 border-transparent capitalize cursor-not-allowed"
                        placeholder="—"
                        value={selectedPasantia?.estado ?? ""}
                        readOnly
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Horas Acumuladas
                      </Label>
                      <Input
                        className="h-8 text-xs bg-muted/30 border-transparent cursor-not-allowed"
                        placeholder="—"
                        value={selectedPasantia != null ? String(selectedPasantia.horas_acumuladas) : ""}
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Sección 3: Tabla de Evaluación ── */}
            <Card>
              <CardHeader className="border-b bg-muted/30 py-3 px-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">3. Evaluación</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 px-4 pb-4">
                <EvaluacionTable
                  evaluationForm={evaluationForm}
                  setEvaluationForm={setEvaluationForm}
                  tablaGuardada={tablaGuardada}
                  setTablaGuardada={setTablaGuardada}
                  onFileChange={setUploadedFile}
                />
              </CardContent>
            </Card>

            {/* ── Botón Enviar ── */}
            <div className="flex justify-end pb-6">
              <div className="relative group">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={!canSubmit || isSubmitting}
                  className={(!canSubmit || isSubmitting) ? "gap-2 px-8 opacity-50 cursor-not-allowed" : "gap-2 px-8"}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Enviando..." : "Enviar Evaluación"}
                </Button>
                {!canSubmit && !isSubmitting && (
                  <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-[260px] p-2 bg-slate-800 text-white text-xs rounded-md shadow-lg z-50 text-center">
                    {!selectedPasantia
                      ? "Selecciona una pasantía primero."
                      : "Sube el archivo Excel de evaluación."}
                    <div className="absolute top-full right-10 border-4 border-transparent border-t-slate-800" />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Main>
  );
}
