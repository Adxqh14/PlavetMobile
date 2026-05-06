"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FileText, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useEvaluacion } from "../hooks/useEvaluacion";
import { StepIndicator } from "../components/StepIndicator";
import { EvaluacionTable } from "../components/EvaluacionTable";
import { SearchSelect } from "../components";
import type { Estudiante, Empresa } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function EvaluacionesPage() {
  const { user, userRole } = useAuth();
  const {
    currentStep,
    showConfirmDialog,
    estudianteSeleccionado,
    empresaSeleccionada,
    evaluationForm,
    nextStep,
    prevStep,
    confirmSubmit,
    handleEstudianteSelect,
    handleEmpresaSelect,
    setShowConfirmDialog,
    setEvaluationForm,
  } = useEvaluacion();

  // Wrapper para handleEstudianteSelect que coincida con la interfaz de SearchSelect
  const handleEstudianteSelectWrapper = (item: Estudiante | Empresa | null) => {
    if (item && 'nombreCompleto' in item) {
      handleEstudianteSelect(item);
      // Llenar automáticamente todos los campos del estudiante
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

  // Wrapper para handleEmpresaSelect que coincida con la interfaz de SearchSelect  
  const handleEmpresaSelectWrapper = (item: Estudiante | Empresa | null) => {
    if (item && 'razonSocial' in item) {
      handleEmpresaSelect(item);
      // Llenar automáticamente todos los campos de la empresa
      setEvaluationForm({
        ...evaluationForm,
        centroTrabajo: item.razonSocial,
        direccionEmpresa: item.direccion,
        telefonosEmpresa: item.telefono
      });
    }
  };

  // Renderizar contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* SearchSelect de estudiante arriba del formulario */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selección de Estudiante</CardTitle>
                <CardDescription>Busca y selecciona al estudiante que será evaluado</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchSelect
                  type="estudiante"
                  onSelect={handleEstudianteSelectWrapper}
                  selectedItem={estudianteSeleccionado}
                  placeholder="Buscar estudiante por nombre, cédula o email..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Datos Personales y Académicos</CardTitle>
                <CardDescription>Información básica del estudiante y datos académicos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="identidad-titulo">Título de Formación</Label>
                    <Input
                      id="identidad-titulo"
                      value={evaluationForm.identidadTitulo}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, identidadTitulo: e.target.value })}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo-titulo">Código del Título</Label>
                    <Input
                      id="codigo-titulo"
                      value={evaluationForm.codigoTitulo}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, codigoTitulo: e.target.value })}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre-apellidos">Nombre y Apellidos</Label>
                  <Input
                    id="nombre-apellidos"
                    placeholder="Nombre completo del estudiante"
                    value={evaluationForm.nombreApellidos}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, nombreApellidos: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horario</Label>
                    <Input
                      id="horario"
                      placeholder="Ej: Matutino, Vespertino, Mixto"
                      value={evaluationForm.horario}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, horario: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefonos">Teléfonos</Label>
                    <Input
                      id="telefonos"
                      placeholder="Teléfono de contacto"
                      value={evaluationForm.telefonos}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, telefonos: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    placeholder="Dirección completa"
                    value={evaluationForm.direccion}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, direccion: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha-inicio">Fecha de Inicio de Pasantía</Label>
                    <Input
                      id="fecha-inicio"
                      type="date"
                      value={evaluationForm.fechaInicioPasantia}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, fechaInicioPasantia: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha-termino">Fecha de Término de Pasantía</Label>
                    <Input
                      id="fecha-termino"
                      type="date"
                      value={evaluationForm.fechaTerminoPasantia}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, fechaTerminoPasantia: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* SearchSelect de empresa arriba del formulario */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selección de Empresa</CardTitle>
                <CardDescription>Busca y selecciona la empresa donde realiza la pasantía</CardDescription>
              </CardHeader>
              <CardContent>
                <SearchSelect
                  type="empresa"
                  onSelect={handleEmpresaSelectWrapper}
                  selectedItem={empresaSeleccionada}
                  placeholder="Buscar empresa por nombre, RUC o dirección..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Datos de la Empresa</CardTitle>
                <CardDescription>Información del centro de trabajo y tutor asignado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="centro-trabajo">Centro de Trabajo</Label>
                  <Input
                    id="centro-trabajo"
                    placeholder="Nombre de la empresa"
                    value={evaluationForm.centroTrabajo}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, centroTrabajo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion-empresa">Dirección de la Empresa</Label>
                  <Input
                    id="direccion-empresa"
                    placeholder="Dirección completa de la empresa"
                    value={evaluationForm.direccionEmpresa}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, direccionEmpresa: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefonos-empresa">Teléfonos de la Empresa</Label>
                  <Input
                    id="telefonos-empresa"
                    placeholder="Teléfono(s) de la empresa"
                    value={evaluationForm.telefonosEmpresa}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, telefonosEmpresa: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="persona-contacto">Persona de Contacto</Label>
                  <Input
                    id="persona-contacto"
                    placeholder="Nombre de la persona de contacto en la empresa"
                    value={evaluationForm.personaContacto}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, personaContacto: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre-tutor">Nombre del Tutor</Label>
                  <Input
                    id="nombre-tutor"
                    placeholder="Nombre completo del tutor asignado"
                    value={evaluationForm.nombreTutor}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, nombreTutor: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefonos-correo-tutor">Teléfonos/Correo del Tutor</Label>
                  <Input
                    id="telefonos-correo-tutor"
                    placeholder="Teléfono y/o correo electrónico del tutor"
                    value={evaluationForm.telefonosCorreoTutor}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, telefonosCorreoTutor: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <EvaluacionTable 
              evaluationForm={evaluationForm} 
              setEvaluationForm={setEvaluationForm} 
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">4. Observaciones y Firmas</CardTitle>
                <CardDescription>Observaciones finales y firmas del proceso de evaluación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones generales</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Ingrese observaciones generales sobre el desempeño del estudiante..."
                    value={evaluationForm.observaciones}
                    onChange={(e) => setEvaluationForm({ ...evaluationForm, observaciones: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firma-tutor-centro">Firma del tutor del centro de trabajo</Label>
                    <Input
                      id="firma-tutor-centro"
                      placeholder="Nombre completo del tutor"
                      value={evaluationForm.firmaTutorCentro}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, firmaTutorCentro: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firma-tutor-educativo">Firma del tutor educativo</Label>
                    <Input
                      id="firma-tutor-educativo"
                      placeholder="Nombre completo del tutor educativo"
                      value={evaluationForm.firmaTutorEducativo}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, firmaTutorEducativo: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fecha-firma">Fecha de firma</Label>
                    <Input
                      id="fecha-firma"
                      type="date"
                      value={evaluationForm.fechaFirma}
                      onChange={(e) => setEvaluationForm({ ...evaluationForm, fechaFirma: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Evaluación de Pasantías</h1>
            <p className="text-muted-foreground">Formulario de seguimiento y evaluación del programa formativo</p>
            {userRole === "TUTOR ACADEMICO" && user?.taller && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span>Taller: {user.taller.nombre}</span>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="bg-card rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Paso {currentStep} de 4
                </span>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <StepIndicator step={1} title="Datos Personales" completed={currentStep > 1} current={currentStep === 1} />
                  <div className="w-8 h-0.5 bg-border"></div>
                  <StepIndicator step={2} title="Datos Empresa" completed={currentStep > 2} current={currentStep === 2} />
                  <div className="w-8 h-0.5 bg-border"></div>
                  <StepIndicator step={3} title="Evaluación" completed={currentStep > 3} current={currentStep === 3} />
                  <div className="w-8 h-0.5 bg-border"></div>
                  <StepIndicator step={4} title="Observaciones y Firmas" completed={false} current={currentStep === 4} />
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className={currentStep === 3 ? "" : "bg-card rounded-lg shadow-sm p-6 mb-6 border"}>
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="bg-card rounded-lg shadow-sm p-4 border">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <Button
                onClick={nextStep}
                className="gap-2"
              >
                {currentStep === 4 ? "Enviar Evaluación" : "Siguiente"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Confirmar Envío
                  </CardTitle>
                  <CardDescription>
                    ¿Está seguro de enviar esta evaluación? Una vez enviada no podrá modificarla.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Estudiante:</strong> {evaluationForm.nombreApellidos}
                    </p>
                    <p className="text-sm">
                      <strong>Empresa:</strong> {evaluationForm.centroTrabajo}
                    </p>
                    <p className="text-sm">
                      <strong>Nota Final:</strong> {evaluationForm.notaFinal || "No asignada"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmDialog(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={confirmSubmit}
                      className="flex-1"
                    >
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
