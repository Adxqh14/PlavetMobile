// ==========================================
// Tipos para el Módulo de Evaluaciones
// ==========================================

export interface Estudiante {
  id: string;
  cedula: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  direccion: string;
  carrera: string;
  promedioGeneral: number;
  estado: 'Activo' | 'Inactivo' | 'Graduado';
  fechaIngreso: string;
  identidadTitulo: string;
  codigoTitulo: string;
  horario: string;
}

export interface Empresa {
  id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  tipoEmpresa: string;
  sector: string;
  tamano: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido';
  telefono: string;
  email: string;
  website?: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  contactos: Contacto[];
  descripcion?: string;
  servicios?: string;
  productos?: string;
  anosOperacion?: number;
  representanteLegal?: string;
  cedulaRepresentante?: string;
  cantidadPracticas: number;
  cantidadPracticasActivas: number;
  ultimaPractica?: string;
  observaciones?: string;
}

export interface Contacto {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
  extension?: string;
  esPrincipal: boolean;
}

export interface EvaluacionForm {
  // Datos Personales
  identidadTitulo: string;
  codigoTitulo: string;
  nombreApellidos: string;
  horario: string;
  direccion: string;
  telefonos: string;
  fechaInicioPasantia: string;
  fechaTerminoPasantia: string;
  
  // Datos de la empresa
  centroTrabajo: string;
  direccionEmpresa: string;
  telefonosEmpresa: string;
  personaContacto: string;
  nombreTutor: string;
  telefonosCorreoTutor: string;
  
  // Evaluación por semanas (Capacidades)
  conocimientosTeoricos: string[];
  asimilacionInstruccionesVerbales: string[];
  asimilacionInstruccionesEscritas: string[];
  asimilacionInstruccionesSimbolicas: string[];
  subtotalCapacidad: string[];
  
  // Evaluación por semanas (Habilidades)
  organizacionPlanificacion: string[];
  metodo: string[];
  ritmoTrabajo: string[];
  trabajoRealizado: string[];
  subtotalHabilidad: string[];
  
  // Evaluación por semanas (Actitudes)
  iniciativa: string[];
  trabajoEquipo: string[];
  puntualidadAsistencia: string[];
  responsabilidad: string[];
  subtotalActitud: string[];
  total: string[];
  
  // Promedios y nota final
  promedioCapacidades: string;
  promedioHabilidades: string;
  promedioActitudes: string;
  notaFinal: string;
  
  // Observaciones
  observaciones: string;
  
  // Firmas
  firmaTutorCentro: string;
  firmaTutorEducativo: string;
  fechaFirma: string;
}

export interface EvaluacionSimple {
  id: string;
  nombreApellidos: string;
  centroTrabajo: string;
  notaFinal: string;
  fechaEvaluacion: string;
  estado: 'Borrador' | 'Enviada' | 'Aprobada' | 'Rechazada';
}
