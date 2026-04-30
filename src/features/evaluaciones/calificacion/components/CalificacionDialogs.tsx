import React, { useMemo } from "react";
import { Button } from "../../../../shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Badge } from "../../../../shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import { Label } from "../../../../shared/components/ui/label";
import { GraduationCap, Award, Eye, Edit, X, Table } from "lucide-react";
import type { ViewCalificacionDialogProps, EditCalificacionDialogProps } from "../types";
import { useCalificacionForm } from "../hooks/useCalificacionForm";
import { CalificacionTableRows } from "./CalificacionTableRows";

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

export const ViewCalificacionDialog = React.memo(function ViewCalificacionDialog({ evaluacion, open, onClose }: ViewCalificacionDialogProps) {
  const notaBadge = useMemo(() => evaluacion ? getNotaBadge(evaluacion.notaFinal) : null, [evaluacion]);

  if (!evaluacion) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-[1200px] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto p-0 rounded-lg border shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5" />
            Detalles de Evaluación
          </DialogTitle>
          <DialogDescription>
            Información completa de la evaluación del estudiante
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Estudiante</Label>
                  <p className="text-lg font-semibold">{evaluacion.estudiante}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Empresa</Label>
                  <p className="text-lg font-semibold">{evaluacion.empresa}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha Evaluación</Label>
                  <p className="text-lg">{evaluacion.fechaEvaluacion}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">ID Evaluación</Label>
                  <p className="text-lg font-mono">#{evaluacion.id.slice(-6)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promedios */}
          <Card>
            <CardHeader>
              <CardTitle>Promedios por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">C</span>
                  </div>
                  <Label className="text-sm font-medium">Capacidades</Label>
                  <p className="text-2xl font-bold text-blue-600">{evaluacion.promedioCapacidades}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">H</span>
                  </div>
                  <Label className="text-sm font-medium">Habilidades</Label>
                  <p className="text-2xl font-bold text-purple-600">{evaluacion.promedioHabilidades}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">A</span>
                  </div>
                  <Label className="text-sm font-medium">Actitudes</Label>
                  <p className="text-2xl font-bold text-green-600">{evaluacion.promedioActitudes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nota Final */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Resultado Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <Award className="h-12 w-12 text-yellow-500" />
                  <div>
                    <p className="text-5xl font-bold text-primary">{evaluacion.notaFinal}</p>
                    <p className="text-sm text-muted-foreground">Nota Final</p>
                  </div>
                  <div className="text-2xl">
                    {notaBadge}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos Completos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Datos Completos de Evaluación
              </CardTitle>
              <CardDescription>
                Todos los valores de la evaluación en una tabla unificada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-border px-4 py-2 text-left font-semibold">Categoría</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">1</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">2</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">3</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">4</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">5</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">6</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">7</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">8</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">9</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">10</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">11</th>
                      <th className="border border-border px-2 py-2 text-center font-semibold">12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CalificacionTableRows evaluacion={evaluacion} />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <Button onClick={onClose}>Cerrar</Button>
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Evaluación
          </DialogTitle>
          <DialogDescription>
            Modifica los datos de la evaluación. Ten cuidado al cambiar las notas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estudiante">Estudiante</Label>
              <Input
                id="estudiante"
                value={formData.estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', e.target.value)}
                placeholder="Nombre del estudiante"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa || ''}
                onChange={(e) => handleInputChange('empresa', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>
          </div>

          {/* Promedios Editables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promedioCapacidades">Promedio Capacidades</Label>
              <Input
                id="promedioCapacidades"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.promedioCapacidades || ''}
                onChange={(e) => handleNumberInput('promedioCapacidades', e.target.value)}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promedioHabilidades">Promedio Habilidades</Label>
              <Input
                id="promedioHabilidades"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.promedioHabilidades || ''}
                onChange={(e) => handleNumberInput('promedioHabilidades', e.target.value)}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promedioActitudes">Promedio Actitudes</Label>
              <Input
                id="promedioActitudes"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.promedioActitudes || ''}
                onChange={(e) => handleNumberInput('promedioActitudes', e.target.value)}
                placeholder="0-100"
              />
            </div>
          </div>

          {/* Nota Final */}
          <div className="space-y-2">
            <Label htmlFor="notaFinal">Nota Final</Label>
            <Input
              id="notaFinal"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.notaFinal || ''}
              onChange={(e) => handleNumberInput('notaFinal', e.target.value)}
              placeholder="0-100"
              className="text-lg font-semibold"
            />
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <X className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  ⚠️ Advertencia
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Al modificar estos datos, estás cambiando los resultados oficiales de la evaluación. 
                  Asegúrate de tener autorización para realizar estos cambios.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveClick}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EditCalificacionDialog.displayName = 'EditCalificacionDialog';
