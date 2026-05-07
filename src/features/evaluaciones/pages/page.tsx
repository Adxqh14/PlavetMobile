"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FileText, CheckCircle, User, Building2, ClipboardList, MessageSquare } from "lucide-react";
import { useEvaluacion } from "../hooks/useEvaluacion";
import { EvaluacionTable } from "../components/EvaluacionTable";
import { SearchSelect } from "../components";
import type { Estudiante, Empresa } from "../types";
import Main from "@/features/main/pages/page";

export default function EvaluacionesPage() {
  const {
    showConfirmDialog,
    estudianteSeleccionado,
    empresaSeleccionada,
    evaluationForm,
    confirmSubmit,
    handleEstudianteSelect,
    handleEmpresaSelect,
    setShowConfirmDialog,
    setEvaluationForm,
  } = useEvaluacion();

  const [seccion1Lista, setSeccion1Lista] = useState(false);
  const [seccion2Lista, setSeccion2Lista] = useState(false);

  const isSeccion1Valida = !!(
    evaluationForm.nombreApellidos &&
    evaluationForm.horario &&
    evaluationForm.direccion &&
    evaluationForm.telefonos &&
    evaluationForm.fechaInicioPasantia &&
    evaluationForm.fechaTerminoPasantia
  );

  const isSeccion2Valida = !!(
    evaluationForm.centroTrabajo &&
    evaluationForm.personaContacto &&
    evaluationForm.direccionEmpresa &&
    evaluationForm.nombreTutor &&
    evaluationForm.telefonosEmpresa &&
    evaluationForm.telefonosCorreoTutor
  );

  const handleEstudianteSelectWrapper = (item: Estudiante | Empresa | null) => {
    if (item && 'nombreCompleto' in item) {
      handleEstudianteSelect(item);
      setEvaluationForm({
        ...evaluationForm,
        nombreApellidos: item.nombreCompleto,
        identidadTitulo: item.identidadTitulo,
        codigoTitulo: item.codigoTitulo,
        horario: item.horario,
        direccion: item.direccion,
        telefonos: item.telefono
      });
    }
  };

  const handleEmpresaSelectWrapper = (item: Estudiante | Empresa | null) => {
    if (item && 'razonSocial' in item) {
      handleEmpresaSelect(item);
      setEvaluationForm({
        ...evaluationForm,
        centroTrabajo: item.razonSocial,
        direccionEmpresa: item.direccion,
        telefonosEmpresa: item.telefono
      });
    }
  };

  return (
    <Main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Evaluación de Pasantías</h1>
            </div>
            <p className="text-sm text-muted-foreground ml-11">
              Formulario de seguimiento y evaluación del programa formativo
            </p>
          </div>

          <div className="space-y-6">

            {/* ── Fila 1: Datos Personales | Datos Empresa (lado a lado) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

              {/* Datos Personales */}
              <Card className="flex flex-col shadow-sm border-border">
                <CardHeader className="border-b bg-muted/30 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base font-semibold">1. Datos Personales y Académicos</CardTitle>
                    </div>
                    <SearchSelect
                      type="estudiante"
                      onSelect={handleEstudianteSelectWrapper}
                      selectedItem={estudianteSeleccionado}
                      placeholder="Buscar estudiante..."
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Nombre Completo</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Nombre del estudiante"
                          value={evaluationForm.nombreApellidos}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, nombreApellidos: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Horario de Práctica</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Ej: 08:00 - 14:00"
                          value={evaluationForm.horario}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, horario: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dirección de Domicilio</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Dirección completa"
                          value={evaluationForm.direccion}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, direccion: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Teléfonos</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Teléfonos de contacto"
                          value={evaluationForm.telefonos}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, telefonos: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha Inicio</Label>
                        <Input
                          type="date"
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          value={evaluationForm.fechaInicioPasantia}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, fechaInicioPasantia: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fecha Término</Label>
                        <Input
                          type="date"
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          value={evaluationForm.fechaTerminoPasantia}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, fechaTerminoPasantia: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
                    <Button 
                      variant={seccion1Lista && isSeccion1Valida ? "default" : "outline"}
                      className={seccion1Lista && isSeccion1Valida 
                        ? "h-8 text-xs bg-green-600 hover:bg-green-700 text-white gap-2" 
                        : "h-8 text-xs gap-2 transition-all opacity-100 disabled:opacity-50"}
                      onClick={() => setSeccion1Lista(!seccion1Lista)}
                      disabled={!isSeccion1Valida}
                      title={!isSeccion1Valida ? "Llene todos los campos para continuar" : ""}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {seccion1Lista && isSeccion1Valida ? "Completado" : "Marcar como Completado"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Datos de la Empresa */}
              <Card className="flex flex-col shadow-sm border-border">
                <CardHeader className="border-b bg-muted/30 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base font-semibold">2. Datos de la Empresa</CardTitle>
                    </div>
                    <SearchSelect
                      type="empresa"
                      onSelect={handleEmpresaSelectWrapper}
                      selectedItem={empresaSeleccionada}
                      placeholder="Buscar empresa..."
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Centro Laboral</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Nombre de la empresa"
                          value={evaluationForm.centroTrabajo}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, centroTrabajo: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Persona de Contacto</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Contacto en empresa"
                          value={evaluationForm.personaContacto}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, personaContacto: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dirección Empresa</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Dirección física"
                          value={evaluationForm.direccionEmpresa}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, direccionEmpresa: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tutor Empresarial</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Tutor asignado"
                          value={evaluationForm.nombreTutor}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, nombreTutor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Teléfonos Empresa</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Teléfonos"
                          value={evaluationForm.telefonosEmpresa}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, telefonosEmpresa: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contacto Tutor</Label>
                        <Input
                          className="h-8 text-xs bg-muted/30 border-transparent focus:border-border transition-colors"
                          placeholder="Tel/Correo"
                          value={evaluationForm.telefonosCorreoTutor}
                          onChange={(e) => setEvaluationForm({ ...evaluationForm, telefonosCorreoTutor: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-border/40 flex justify-end">
                    <Button 
                      variant={seccion2Lista && isSeccion2Valida ? "default" : "outline"}
                      className={seccion2Lista && isSeccion2Valida 
                        ? "h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white gap-2" 
                        : "h-8 text-xs gap-2 text-amber-700 border-amber-200 hover:bg-amber-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"}
                      onClick={() => setSeccion2Lista(!seccion2Lista)}
                      disabled={!isSeccion2Valida}
                      title={!isSeccion2Valida ? "Llene todos los campos para continuar" : ""}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {seccion2Lista && isSeccion2Valida ? "Completado" : "Marcar como Completado"}
                    </Button>
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
                />
              </CardContent>
            </Card>

            {/* ── Sección 4: Observaciones y Firmas ── */}
            <Card>
              <CardHeader className="border-b bg-muted/30 py-3 px-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">4. Observaciones y Firmas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 px-4 pb-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Observaciones generales</Label>
                  <Textarea
                    placeholder="Ingrese observaciones generales sobre el desempeño del estudiante..."
                    value={evaluationForm.observaciones}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, observaciones: e.target.value })}
                    rows={3}
                    className="text-xs resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Firma del tutor del centro</Label>
                    <Input
                      className="h-8 text-xs"
                      placeholder="Nombre completo del tutor"
                      value={evaluationForm.firmaTutorCentro}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, firmaTutorCentro: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Firma del tutor educativo</Label>
                    <Input
                      className="h-8 text-xs"
                      placeholder="Nombre completo del tutor educativo"
                      value={evaluationForm.firmaTutorEducativo}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, firmaTutorEducativo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Fecha de firma</Label>
                    <Input
                      className="h-8 text-xs"
                      type="date"
                      value={evaluationForm.fechaFirma}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, fechaFirma: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Botón Enviar ── */}
            <div className="flex justify-end pb-6">
              <Button
                onClick={() => setShowConfirmDialog(true)}
                size="lg"
                className="gap-2 px-8"
              >
                <CheckCircle className="h-4 w-4" />
                Enviar Evaluación
              </Button>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Confirmar Envío
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ¿Está seguro de enviar esta evaluación? Una vez enviada no podrá modificarla.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                    <p><strong>Estudiante:</strong> {evaluationForm.nombreApellidos}</p>
                    <p><strong>Empresa:</strong> {evaluationForm.centroTrabajo}</p>
                    <p><strong>Nota Final:</strong> {evaluationForm.notaFinal || "No asignada"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmDialog(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button onClick={confirmSubmit} className="flex-1">
                      Confirmar Envío
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Main>
  );
}
