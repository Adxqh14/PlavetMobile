"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { pasantiaService } from "@/features/procesoDePasantias/gestionDePasantias/services/pasantiaService";
import type { Pasantia } from "@/features/procesoDePasantias/gestionDePasantias/types";
import { toast } from "sonner";
import { calificacionApiService } from "../services/calificacionApiService";
import { EvaluacionHero } from "../components/EvaluacionHero";
import { PasantiaDetails } from "../components/PasantiaDetails";
import { EvaluacionFormSection } from "../components/EvaluacionFormSection";
import { EMPTY_FORM } from "../constants/evaluationConstants";
import type { EvaluacionForm } from "../types";

export default function EvaluacionesPage() {
  const { user, userRole } = useAuth();

  const [pasantias, setPasantias] = useState<Pasantia[]>([]);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);
  const [loadingPasantias, setLoadingPasantias] = useState(false);

  const [evaluationForm, setEvaluationForm] = useState<EvaluacionForm>(EMPTY_FORM);
  const [tablaGuardada, setTablaGuardada] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar pasantías al montar
  useEffect(() => {
    const fetchPasantias = async () => {
      setLoadingPasantias(true);
      try {
        const response = await pasantiaService.getAll({ pageSize: 200 });
        let data = response.data;
        // Filtrar solo las pasantías del tutor logueado
        if (userRole === "TUTOR EMPRESARIAL" && user?.datos_rol?.id) {
          data = data.filter((p: Pasantia) => p.id_tutor_empresarial === user.datos_rol!.id);
        }
        setPasantias(data);
        console.log("Pasantías cargadas:", data.length);
      } catch (err) {
        console.error("Error al cargar pasantías:", err);
        toast.error("No se pudieron cargar las pasantías.");
      } finally {
        setLoadingPasantias(false);
      }
    };
    fetchPasantias();
  }, [user, userRole]);


  const handleClearPasantia = () => {
    setSelectedPasantia(null);
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
  const studentCedula = selectedPasantia?.estudiante?.cedula ?? "";
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
          <EvaluacionHero />

          <div className="space-y-6">
            <PasantiaDetails
              pasantias={pasantias}
              selectedPasantia={selectedPasantia}
              onPasantiaSelect={setSelectedPasantia}
              onPasantiaClear={handleClearPasantia}
              loadingPasantias={loadingPasantias}
              studentCedula={studentCedula}
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              tutorName={tutorName}
              pasantiaEstado={selectedPasantia?.estado ?? ""}
              horasAcumuladas={selectedPasantia != null ? String(selectedPasantia.horas_acumuladas) : ""}
            />

            <EvaluacionFormSection
              evaluationForm={evaluationForm}
              setEvaluationForm={setEvaluationForm}
              tablaGuardada={tablaGuardada}
              setTablaGuardada={setTablaGuardada}
              setUploadedFile={setUploadedFile}
            />

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
