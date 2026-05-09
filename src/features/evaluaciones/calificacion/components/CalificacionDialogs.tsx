import React, { useMemo } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Badge } from "../../../../shared/components/ui/badge";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { GraduationCap, Edit, BadgeCheck, AlertCircle, Award, Save } from "lucide-react";
import type { ViewCalificacionDialogProps, EditCalificacionDialogProps, EvaluacionGuardada } from "../types";
import { useCalificacionForm } from "../hooks/useCalificacionForm";
import { CalificacionService } from "../services/calificacionService";
import { toast } from "sonner";

const getNotaBadge = (notaFinal: string) => {
  const nota = parseFloat(notaFinal || '0');
  if (nota >= 90) {
    // Excelente → golden-orange-subtle
    return <Badge className="[--badge-bg:oklch(95.01%_0.047_80.81)] [--badge-fg:oklch(40.83%_0.087_72.86)] [--badge-border:oklch(90.49%_0.092_81.19)] bg-(--badge-bg) text-(--badge-fg) border border-(--badge-border)">Excelente</Badge>;
  } else if (nota >= 80) {
    // Muy bueno → blue-slate-subtle
    return <Badge className="[--badge-bg:oklch(92.23%_0.008_241.67)] [--badge-fg:oklch(41.61%_0.026_241.93)] [--badge-border:oklch(84.35%_0.014_240.99)] bg-(--badge-bg) text-(--badge-fg) border border-(--badge-border)">Muy Bueno</Badge>;
  } else if (nota >= 70) {
    // Aprobado → golden-orange-200 toned
    return <Badge className="[--badge-bg:oklch(90.49%_0.092_81.19)] [--badge-fg:oklch(54.11%_0.117_70.57)] [--badge-border:oklch(86.11%_0.131_79.28)] bg-(--badge-bg) text-(--badge-fg) border border-(--badge-border)">Aprobado</Badge>;
  } else {
    // Reprobado → scarlet-subtle
    return <Badge className="[--badge-bg:oklch(89.13%_0.058_10.39)] [--badge-fg:oklch(42.99%_0.175_25.91)] [--badge-border:oklch(79.14%_0.123_12.67)] bg-(--badge-bg) text-(--badge-fg) border border-(--badge-border)">Reprobado</Badge>;
  }
};

import { EvaluacionTable } from "../../evaluacion/components/EvaluacionTable";
import type { EvaluacionForm } from "../../evaluacion/types";

export const ViewCalificacionDialog = React.memo(function ViewCalificacionDialog({ evaluacion, open, onClose, onSave }: ViewCalificacionDialogProps) {
  const notaBadge = useMemo(() => evaluacion ? getNotaBadge(evaluacion.notaFinal) : null, [evaluacion]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [tablaGuardada, setTablaGuardada] = React.useState(false);
  const [localForm, setLocalForm] = React.useState<EvaluacionForm | null>(null);

  React.useEffect(() => {
    if (evaluacion) {
      setLocalForm(evaluacion.evaluacionCompleta as unknown as EvaluacionForm);
      setIsEditing(false);
    }
  }, [evaluacion, open]);

  const handleSave = () => {
    if (!evaluacion || !localForm) return;

    try {
      const notaFinal = localForm.total?.[0] ? parseFloat(localForm.total[0]).toFixed(2) : "0.00";

      const updatedEvaluacion = {
        ...evaluacion,
        evaluacionCompleta: localForm as unknown as EvaluacionGuardada["evaluacionCompleta"],
        notaFinal: notaFinal,
        promedioCapacidades: localForm.subtotalCapacidad?.[0] || "0.00",
        promedioHabilidades: localForm.subtotalHabilidad?.[0] || "0.00",
        promedioActitudes: localForm.subtotalActitud?.[0] || "0.00",
      };

      const evaluaciones = CalificacionService.getEvaluaciones();
      const index = evaluaciones.findIndex(e => e.id === updatedEvaluacion.id);

      if (index !== -1) {
        evaluaciones[index] = updatedEvaluacion;
        CalificacionService.saveEvaluaciones(evaluaciones);
        toast.success("Evaluación actualizada correctamente");
        setIsEditing(false);
        setTablaGuardada(false); // Resetear estado de la tabla
        if (onSave) {
          onSave(updatedEvaluacion);
        }
      }
    } catch {
      toast.error("Error al guardar los cambios");
    }
  };

  if (!evaluacion || !localForm) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-[1200px] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto p-0 rounded-lg border shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                <GraduationCap className="h-6 w-6 text-primary" />
                Evaluación: {evaluacion.estudiante}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground uppercase">
                {evaluacion.empresa} • Finalizada el {evaluacion.fechaEvaluacion}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Nota Final</p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-3xl font-black text-primary">{evaluacion.notaFinal}</span>
                  {notaBadge}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 bg-muted/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Tabla de Evaluación</h3>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="w-4 h-4" />
                Editar Evaluación
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancelar</Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!tablaGuardada}
                  className={!tablaGuardada ? "gap-2 opacity-50 cursor-not-allowed" : "gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"}
                >
                  <Save className="w-4 h-4" />
                  Enviar Evaluación Modificada
                </Button>
              </div>
            )}
          </div>

          <EvaluacionTable
            evaluationForm={localForm}
            setEvaluationForm={setLocalForm as React.Dispatch<React.SetStateAction<EvaluacionForm>>}
            readOnly={!isEditing}
            tablaGuardada={tablaGuardada}
            setTablaGuardada={setTablaGuardada}
          />
        </div>

        <DialogFooter className="px-8 py-4 border-t bg-muted/30">
          <Button onClick={onClose} variant="secondary" className="font-bold uppercase text-xs">Cerrar Visualización</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ViewCalificacionDialog.displayName = 'ViewCalificacionDialog';

export const EditCalificacionDialog = React.memo(function EditCalificacionDialog({ evaluacion, open, onClose, onSave }: EditCalificacionDialogProps) {
  const { formData, handleInputChange, handleNumberInput, handleSave } = useCalificacionForm({ evaluacion });

  const handleSaveClick = () => {
    handleSave(onSave);
    onClose();
  };

  if (!evaluacion) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        {/* Header con Degradado Corporativo */}
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-[#d1323b]/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-[#d1323b]/20 flex items-center justify-center border border-[#d1323b]/30">
              <Edit className="h-6 w-6 text-[#d1323b]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Calificación</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Actualiza los resultados de <span className="font-bold text-foreground">{evaluacion.estudiante}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {/* Sección: Información General */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <GraduationCap className="h-4 w-4 text-[#d1323b]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Información General</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="estudiante" className="text-sm font-semibold">Nombre del Estudiante *</Label>
                  <Input
                    id="estudiante"
                    value={formData.estudiante || ''}
                    onChange={(e) => handleInputChange('estudiante', e.target.value)}
                    className="h-11 shadow-xs focus-visible:ring-[#d1323b]/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresa" className="text-sm font-semibold">Empresa / Institución *</Label>
                  <Input
                    id="empresa"
                    value={formData.empresa || ''}
                    onChange={(e) => handleInputChange('empresa', e.target.value)}
                    className="h-11 shadow-xs focus-visible:ring-[#d1323b]/30"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Métricas de Evaluación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <BadgeCheck className="h-4 w-4 text-[#d1323b]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Métricas de Evaluación</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="promedioCapacidades" className="text-sm font-semibold">Capacidades</Label>
                  <Input
                    id="promedioCapacidades"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.promedioCapacidades || ''}
                    onChange={(e) => handleNumberInput('promedioCapacidades', e.target.value)}
                    className="h-11 shadow-xs border-blue-500/20 focus-visible:ring-blue-500/30 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promedioHabilidades" className="text-sm font-semibold">Habilidades</Label>
                  <Input
                    id="promedioHabilidades"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.promedioHabilidades || ''}
                    onChange={(e) => handleNumberInput('promedioHabilidades', e.target.value)}
                    className="h-11 shadow-xs border-purple-500/20 focus-visible:ring-purple-500/30 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promedioActitudes" className="text-sm font-semibold">Actitudes</Label>
                  <Input
                    id="promedioActitudes"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.promedioActitudes || ''}
                    onChange={(e) => handleNumberInput('promedioActitudes', e.target.value)}
                    className="h-11 shadow-xs border-green-500/20 focus-visible:ring-green-500/30 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Resultado Final */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Award className="h-4 w-4 text-[#d1323b]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resultado Final</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notaFinal" className="text-sm font-semibold">Calificación Final Autorizada *</Label>
                <Input
                  id="notaFinal"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.notaFinal || ''}
                  onChange={(e) => handleNumberInput('notaFinal', e.target.value)}
                  className="h-12 text-xl font-black text-[#d1323b] shadow-xs focus-visible:ring-[#d1323b]/30"
                />
              </div>
            </div>

            {/* Nota Informativa */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-200">Aviso Administrativo</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    La modificación de estos promedios altera los registros académicos oficiales. Asegúrese de que los cambios coincidan con el formulario de evaluación firmado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Estilizado */}
        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0 gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveClick}
            className="px-8 font-bold bg-[#d1323b] hover:bg-[#d1323b]/90 text-white shadow-lg shadow-[#d1323b]/20 active:scale-95 transition-all"
          >
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EditCalificacionDialog.displayName = 'EditCalificacionDialog';
