import { toast } from "sonner";
import { useState } from "react";
import type { EvaluacionForm, Estudiante, Empresa } from "../types";

export type { EvaluacionForm, Estudiante, Empresa };

export const useEvaluacion = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);
  
  const [evaluationForm, setEvaluationForm] = useState<EvaluacionForm>({
    identidadTitulo: "Desarrollo y administración de aplicaciones informáticas",
    codigoTitulo: "IFC006_3",
    nombreApellidos: "",
    horario: "",
    direccion: "",
    telefonos: "",
    fechaInicioPasantia: "",
    fechaTerminoPasantia: "",
    
    // Datos de la empresa
    centroTrabajo: "",
    direccionEmpresa: "",
    telefonosEmpresa: "",
    personaContacto: "",
    nombreTutor: "",
    telefonosCorreoTutor: "",
    
    // Evaluación por semanas (Capacidades)
    conocimientosTeoricos: Array(12).fill(""),
    asimilacionInstruccionesVerbales: Array(12).fill(""),
    asimilacionInstruccionesEscritas: Array(12).fill(""),
    asimilacionInstruccionesSimbolicas: Array(12).fill(""),
    subtotalCapacidad: Array(12).fill(""),
    
    // Evaluación por semanas (Habilidades)
    organizacionPlanificacion: Array(12).fill(""),
    metodo: Array(12).fill(""),
    ritmoTrabajo: Array(12).fill(""),
    trabajoRealizado: Array(12).fill(""),
    subtotalHabilidad: Array(12).fill(""),
    
    // Evaluación por semanas (Actitudes)
    iniciativa: Array(12).fill(""),
    trabajoEquipo: Array(12).fill(""),
    puntualidadAsistencia: Array(12).fill(""),
    responsabilidad: Array(12).fill(""),
    subtotalActitud: Array(12).fill(""),
    total: Array(12).fill(""),
    
    // Promedios y nota final
    promedioCapacidades: "",
    promedioHabilidades: "",
    promedioActitudes: "",
    notaFinal: "",
    
    // Observaciones
    observaciones: "",
    
    // Firmas
    firmaTutorCentro: "",
    firmaTutorEducativo: "",
    fechaFirma: "",
    
    // Criterios y Contenido (Plantilla editable predeterminada)
    raContenido: "RA9.2: Participar a su nivel en la creación de bases de datos y en el mantenimiento, tomando en consideración las políticas establecidas por la empresa.",
    criterio1: "Crear bases de datos, utilizando herramientas de tablas, índices, funciones, procedimientos, siguiendo las especificaciones de diseño recibidas, y documentar las actuaciones realizadas y los resultados obtenidos.",
    criterio2: "Aplicar mantenimiento a la base de datos según los resultados de la consulta (update, insert, delete, select).",
    criterio3: "Verificar el funcionamiento de la base de datos, tomando en consideración las reglas de la empresa.",
    criterio4: "Interpretar la documentación técnica de la base de datos, identificando sus características funcionales y la compatibilidad, siguiendo políticas de la empresa.",
    criterio5: "Documentar el análisis de los resultados obtenidos de las pruebas realizadas. Siguiendo las normas establecidas por la empresa.",
    criterio6: "Administrar las actividades de los datos para garantizar que los usuarios trabajen en forma cooperativa y complementaria al procesar datos en la base de datos."
  });

  // Validación de pasos
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: { // Datos Personales
        toast.dismiss();
        
        if (!evaluationForm.nombreApellidos) {
          toast.error("El nombre del estudiante es obligatorio.");
          return false;
        }
        if (!evaluationForm.horario) {
          toast.error("El horario es obligatorio.");
          return false;
        }
        if (!evaluationForm.direccion) {
          toast.error("La dirección es obligatoria.");
          return false;
        }
        if (!evaluationForm.telefonos) {
          toast.error("El teléfono es obligatorio.");
          return false;
        }
        if (!evaluationForm.fechaInicioPasantia) {
          toast.error("La fecha de inicio es obligatoria.");
          return false;
        }
        if (!evaluationForm.fechaTerminoPasantia) {
          toast.error("La fecha de término es obligatoria.");
          return false;
        }
        
        return true;
      }
      
      case 2: // Datos Empresa
        toast.dismiss();
        if (!evaluationForm.centroTrabajo) {
          toast.error("El centro de trabajo es obligatorio.");
          return false;
        }
        if (!evaluationForm.direccionEmpresa) {
          toast.error("La dirección de la empresa es obligatoria.");
          return false;
        }
        if (!evaluationForm.telefonosEmpresa) {
          toast.error("El teléfono de la empresa es obligatorio.");
          return false;
        }
        if (!evaluationForm.personaContacto) {
          toast.error("La persona de contacto es obligatoria.");
          return false;
        }
        if (!evaluationForm.nombreTutor) {
          toast.error("El nombre del tutor es obligatorio.");
          return false;
        }
        if (!evaluationForm.telefonosCorreoTutor) {
          toast.error("El contacto del tutor es obligatorio.");
          return false;
        }
        return true;
      
      case 3: // Evaluación completa
        return true;
      
      case 4: // Observaciones y Firmas
        toast.dismiss();
        if (!evaluationForm.observaciones) {
          toast.error("Las observaciones son obligatorias.");
          return false;
        }
        if (!evaluationForm.firmaTutorCentro) {
          toast.error("La firma del tutor del centro de trabajo es obligatoria.");
          return false;
        }
        if (!evaluationForm.firmaTutorEducativo) {
          toast.error("La firma del tutor educativo es obligatoria.");
          return false;
        }
        if (!evaluationForm.fechaFirma) {
          toast.error("La fecha de firma es obligatoria.");
          return false;
        }
        return true;
      
      default:
        return false;
    }
  };

  // Navegación entre pasos
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      } else {
        setShowConfirmDialog(true);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Confirmar envío
  const confirmSubmit = () => {
    console.log("[v0] Evaluación completa enviada:", evaluationForm);
    
    // Guardar datos de la evaluación para calificaciones
    const evaluacionData = {
      estudiante: evaluationForm.nombreApellidos,
      empresa: evaluationForm.centroTrabajo,
      promedioCapacidades: evaluationForm.promedioCapacidades,
      promedioHabilidades: evaluationForm.promedioHabilidades,
      promedioActitudes: evaluationForm.promedioActitudes,
      notaFinal: evaluationForm.notaFinal,
      fechaEvaluacion: new Date().toISOString().split('T')[0],
      evaluacionCompleta: evaluationForm
    };
    
    // Guardar en localStorage para que el módulo de calificaciones pueda acceder
    localStorage.setItem('ultimaEvaluacion', JSON.stringify(evaluacionData));
    
    setShowConfirmDialog(false);
    
    // Redirigir directamente a calificación
    window.location.href = '/calificaciones';
  };

  // Resetear formulario
  const resetForm = () => {
    setEvaluationForm({
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
      conocimientosTeoricos: Array(12).fill(""),
      asimilacionInstruccionesVerbales: Array(12).fill(""),
      asimilacionInstruccionesEscritas: Array(12).fill(""),
      asimilacionInstruccionesSimbolicas: Array(12).fill(""),
      subtotalCapacidad: Array(12).fill(""),
      organizacionPlanificacion: Array(12).fill(""),
      metodo: Array(12).fill(""),
      ritmoTrabajo: Array(12).fill(""),
      trabajoRealizado: Array(12).fill(""),
      subtotalHabilidad: Array(12).fill(""),
      iniciativa: Array(12).fill(""),
      trabajoEquipo: Array(12).fill(""),
      puntualidadAsistencia: Array(12).fill(""),
      responsabilidad: Array(12).fill(""),
      subtotalActitud: Array(12).fill(""),
      total: Array(12).fill(""),
      promedioCapacidades: "",
      promedioHabilidades: "",
      promedioActitudes: "",
      notaFinal: "",
      observaciones: "",
      firmaTutorCentro: "",
      firmaTutorEducativo: "",
      fechaFirma: "",
      raContenido: "RA9.2: Participar a su nivel en la creación de bases de datos y en el mantenimiento, tomando en consideración las políticas establecidas por la empresa.",
      criterio1: "Crear bases de datos, utilizando herramientas de tablas, índices, funciones, procedimientos, siguiendo las especificaciones de diseño recibidas, y documentar las actuaciones realizadas y los resultados obtenidos.",
      criterio2: "Aplicar mantenimiento a la base de datos según los resultados de la consulta (update, insert, delete, select).",
      criterio3: "Verificar el funcionamiento de la base de datos, tomando en consideración las reglas de la empresa.",
      criterio4: "Interpretar la documentación técnica de la base de datos, identificando sus características funcionales y la compatibilidad, siguiendo políticas de la empresa.",
      criterio5: "Documentar el análisis de los resultados obtenidos de las pruebas realizadas. Siguiendo las normas establecidas por la empresa.",
      criterio6: "Administrar las actividades de los datos para garantizar que los usuarios trabajen en forma cooperativa y complementaria al procesar datos en la base de datos."
    });
    setCurrentStep(1);
    setEstudianteSeleccionado(null);
    setEmpresaSeleccionada(null);
  };

  // Manejar selección de estudiante
  const handleEstudianteSelect = (estudiante: Estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setEvaluationForm({
      ...evaluationForm,
      nombreApellidos: estudiante.nombreCompleto
    });
  };

  // Manejar selección de empresa
  const handleEmpresaSelect = (empresa: Empresa) => {
    setEmpresaSeleccionada(empresa);
    setEvaluationForm({
      ...evaluationForm,
      centroTrabajo: empresa.razonSocial,
      direccionEmpresa: empresa.direccion
    });
  };

  return {
    // Estado
    currentStep,
    showConfirmDialog,
    estudianteSeleccionado,
    empresaSeleccionada,
    evaluationForm,
    
    // Acciones
    nextStep,
    prevStep,
    confirmSubmit,
    resetForm,
    handleEstudianteSelect,
    handleEmpresaSelect,
    setShowConfirmDialog,
    setEvaluationForm,
    
    // Utilidades
    validateStep
  };
};
