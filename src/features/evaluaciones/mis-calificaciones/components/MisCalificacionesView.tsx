import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  FileText,
  Download,
  Loader2,
  Table as TableIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { calificacionApiService, type MisNotasResponse } from "../../evaluacion/services/calificacionApiService";
import { EvaluacionTable } from "../../evaluacion/components/EvaluacionTable";
import { getNotaBadge, mapResponseToForm } from "../utils/misCalificacionesUtils";

export function MisCalificacionesView() {
  const [notas, setNotas] = useState<MisNotasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await calificacionApiService.getMisNotas();
        setNotas(data);
      } catch (err: unknown) {
        // Si el error es un "no encontrado" o un error de JSON (pasan cuando no hay datos), lo tratamos como notas vacías
        const msg = err instanceof Error ? err.message.toLowerCase() : "";
        const isNotFound =
          msg.includes("not found") ||
          msg.includes("404") ||
          msg.includes("no existe") ||
          msg.includes("unexpected end of json input") ||
          msg.includes("failed to execute 'json'");

        if (isNotFound) {
          setNotas(null);
        } else {
          setError(err instanceof Error ? err.message : "Error al cargar las calificaciones.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Transformar datos para la tabla de Main
  const evaluationForm = useMemo(() => (notas ? mapResponseToForm(notas) : null), [notas]);
  const notaBadge = useMemo(() => (evaluationForm ? getNotaBadge(evaluationForm.notaFinal) : null), [evaluationForm]);

  return (
    <div className="w-full pb-12 px-6 md:px-12">
      {/* Section heading + actions (Design from Main) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div className="border-l-4 border-primary pl-6">
          <h2 className="text-3xl font-black tracking-tight">Registro de Rendimiento</h2>
          <p className="text-muted-foreground font-medium text-sm">Monitoreo detallado de competencias y habilidades</p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="rounded-xl px-6 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          disabled={!notas}
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card className="border-destructive/30 bg-destructive/5 rounded-2xl mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Contenido principal (Basado en el diseño de Main) */}
      {!loading && !error && (!notas || !evaluationForm) ? (
        <Card className="border-dashed border-2 shadow-none bg-muted/20 rounded-2xl">
          <CardContent className="p-16 text-center flex flex-col items-center justify-center">
            <div className="p-6 rounded-3xl bg-background shadow-sm mb-6">
              <FileText className="h-14 w-14 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Usted no tiene registrada una calificación todavía
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-lg font-medium leading-relaxed">
              Su evaluación académica aparecerá aquí una vez que sea procesada y publicada por su tutor correspondiente.
            </p>
          </CardContent>
        </Card>
      ) : !loading && !error && evaluationForm && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">

          {/* Matriz Detallada (El componente que trae Main) */}
          <div className="space-y-4">
            <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="border-b bg-muted/10 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <TableIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Matriz de Evaluación Detallada</h3>
                      <p className="text-xs text-muted-foreground font-medium">Formato oficial con Resultados de Aprendizaje y criterios técnicos</p>
                    </div>
                  </div>
                  <div className="sm:ml-auto flex items-center gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Nota Final</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-2xl font-black text-primary">{evaluationForm.notaFinal}</span>
                        {notaBadge}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 overflow-x-auto bg-card">
                {/* Componente oficial de Main */}
                <EvaluacionTable
                  evaluationForm={evaluationForm}
                  readOnly={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
