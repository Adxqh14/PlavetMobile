import type { EvaluacionForm, Estudiante, Empresa } from "../hooks/useEvaluacion";

export class EvaluacionService {
  // Simulación de guardado de evaluación
  static async guardarEvaluacion(evaluacion: EvaluacionForm): Promise<{ success: boolean; message: string }> {
    try {
      // Simular llamada a API
      console.log("Guardando evaluación:", evaluacion);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular respuesta exitosa
      return {
        success: true,
        message: "Evaluación guardada exitosamente"
      };
    } catch (error) {
      console.error("Error al guardar evaluación:", error);
      return {
        success: false,
        message: "Error al guardar la evaluación"
      };
    }
  }

  // Obtener estudiantes disponibles
  static async obtenerEstudiantes(): Promise<Estudiante[]> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos de ejemplo
      return [
        { id: "1", cedula: "001-1234567-1", nombreCompleto: "Juan Pérez González", email: "juan@email.com", telefono: "809-555-0101", direccion: "Calle Principal 123", carrera: "Informática", promedioGeneral: 85, estado: "Activo", fechaIngreso: "2023-01-15", identidadTitulo: "Desarrollo y administración de aplicaciones informáticas", codigoTitulo: "IFC006_3", horario: "Matutino" },
        { id: "2", cedula: "002-2345678-2", nombreCompleto: "María Rodríguez López", email: "maria@email.com", telefono: "809-555-0102", direccion: "Avenida Central 456", carrera: "Informática", promedioGeneral: 90, estado: "Activo", fechaIngreso: "2023-01-15", identidadTitulo: "Desarrollo y administración de aplicaciones informáticas", codigoTitulo: "IFC006_3", horario: "Matutino" },
        { id: "3", cedula: "003-3456789-3", nombreCompleto: "Carlos Martínez Sánchez", email: "carlos@email.com", telefono: "809-555-0103", direccion: "Plaza Mayor 789", carrera: "Informática", promedioGeneral: 88, estado: "Activo", fechaIngreso: "2023-01-15", identidadTitulo: "Desarrollo y administración de aplicaciones informáticas", codigoTitulo: "IFC006_3", horario: "Matutino" },
        { id: "4", cedula: "004-4567890-4", nombreCompleto: "Ana García Fernández", email: "ana@email.com", telefono: "809-555-0104", direccion: "Calle Tecnología 321", carrera: "Informática", promedioGeneral: 92, estado: "Activo", fechaIngreso: "2023-01-15", identidadTitulo: "Desarrollo y administración de aplicaciones informáticas", codigoTitulo: "IFC006_3", horario: "Matutino" },
        { id: "5", cedula: "005-5678901-5", nombreCompleto: "Luis Hernández Díaz", email: "luis@email.com", telefono: "809-555-0105", direccion: "Ronda Innovación 654", carrera: "Informática", promedioGeneral: 87, estado: "Activo", fechaIngreso: "2023-01-15", identidadTitulo: "Desarrollo y administración de aplicaciones informáticas", codigoTitulo: "IFC006_3", horario: "Matutino" }
      ];
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
      return [];
    }
  }

  // Obtener empresas disponibles
  static async obtenerEmpresas(): Promise<Empresa[]> {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos de ejemplo
      return [
        { id: "1", ruc: "123-456789-1", razonSocial: "Tecnología Solutions S.A.", nombreComercial: "TechSolutions", tipoEmpresa: "Tecnología", sector: "Informática", tamano: "Mediana", estado: "Activo", telefono: "809-555-1001", email: "info@techsolutions.com", website: "www.techsolutions.com", direccion: "Calle Principal 123, Madrid", ciudad: "Madrid", provincia: "Madrid", contactos: [], descripcion: "Empresa de desarrollo de software", servicios: "Desarrollo web, móvil", productos: "SaaS", anosOperacion: 10, representanteLegal: "Carlos Rodríguez", cedulaRepresentante: "001-1234567-1", cantidadPracticas: 5, cantidadPracticasActivas: 2, ultimaPractica: "2024-01-15", observaciones: "Buen ambiente de trabajo" },
        { id: "2", ruc: "234-567890-2", razonSocial: "Digital Innovations Ltd.", nombreComercial: "DigitalInnov", tipoEmpresa: "Tecnología", sector: "Informática", tamano: "Pequeña", estado: "Activo", telefono: "809-555-1002", email: "info@digitalinnov.com", website: "www.digitalinnov.com", direccion: "Avenida Central 456, Barcelona", ciudad: "Barcelona", provincia: "Barcelona", contactos: [], descripcion: "Consultoría digital", servicios: "Consultoría TI", productos: "Consultoría", anosOperacion: 7, representanteLegal: "Ana Martínez", cedulaRepresentante: "002-2345678-2", cantidadPracticas: 3, cantidadPracticasActivas: 1, ultimaPractica: "2024-02-01", observaciones: "Enfoque en innovación" },
        { id: "3", ruc: "345-678901-3", razonSocial: "Software Factory S.L.", nombreComercial: "SoftFactory", tipoEmpresa: "Tecnología", sector: "Informática", tamano: "Grande", estado: "Activo", telefono: "809-555-1003", email: "info@softfactory.com", website: "www.softfactory.com", direccion: "Plaza Mayor 789, Valencia", ciudad: "Valencia", provincia: "Valencia", contactos: [], descripcion: "Fábrica de software", servicios: "Desarrollo a medida", productos: "Software empresarial", anosOperacion: 15, representanteLegal: "Luis García", cedulaRepresentante: "003-3456789-3", cantidadPracticas: 8, cantidadPracticasActivas: 3, ultimaPractica: "2024-01-20", observaciones: "Metodologías ágiles" },
        { id: "4", ruc: "456-789012-4", razonSocial: "IT Consulting Group", nombreComercial: "ITConsulting", tipoEmpresa: "Consultoría", sector: "Informática", tamano: "Mediana", estado: "Activo", telefono: "809-555-1004", email: "info@itconsulting.com", website: "www.itconsulting.com", direccion: "Calle Tecnología 321, Sevilla", ciudad: "Sevilla", provincia: "Sevilla", contactos: [], descripcion: "Consultoría IT", servicios: "Consultoría, soporte", productos: "Servicios TI", anosOperacion: 12, representanteLegal: "María López", cedulaRepresentante: "004-4567890-4", cantidadPracticas: 4, cantidadPracticasActivas: 2, ultimaPractica: "2024-01-25", observaciones: "Expertos en transformación digital" },
        { id: "5", ruc: "567-890123-5", razonSocial: "DevOps Solutions", nombreComercial: "DevOpsSol", tipoEmpresa: "Tecnología", sector: "Informática", tamano: "Pequeña", estado: "Activo", telefono: "809-555-1005", email: "info@devopssol.com", website: "www.devopssol.com", direccion: "Ronda Innovación 654, Bilbao", ciudad: "Bilbao", provincia: "Bilbao", contactos: [], descripcion: "Especialistas en DevOps", servicios: "DevOps, Cloud", productos: "Soluciones cloud", anosOperacion: 5, representanteLegal: "Pedro Hernández", cedulaRepresentante: "005-5678901-5", cantidadPracticas: 2, cantidadPracticasActivas: 1, ultimaPractica: "2024-02-05", observaciones: "Tecnologías modernas" }
      ];
    } catch (error) {
      console.error("Error al obtener empresas:", error);
      return [];
    }
  }

  // Validar formulario de evaluación
  static validarFormulario(evaluacion: EvaluacionForm): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar datos personales
    if (!evaluacion.nombreApellidos.trim()) {
      errores.push("El nombre y apellidos son obligatorios");
    }
    if (!evaluacion.horario.trim()) {
      errores.push("El horario es obligatorio");
    }
    if (!evaluacion.direccion.trim()) {
      errores.push("La dirección es obligatoria");
    }
    if (!evaluacion.telefonos.trim()) {
      errores.push("Los teléfonos son obligatorios");
    }
    if (!evaluacion.fechaInicioPasantia) {
      errores.push("La fecha de inicio de pasantía es obligatoria");
    }
    if (!evaluacion.fechaTerminoPasantia) {
      errores.push("La fecha de término de pasantía es obligatoria");
    }

    // Validar datos de empresa
    if (!evaluacion.centroTrabajo.trim()) {
      errores.push("El centro de trabajo es obligatorio");
    }
    if (!evaluacion.direccionEmpresa.trim()) {
      errores.push("La dirección de la empresa es obligatoria");
    }
    if (!evaluacion.telefonosEmpresa.trim()) {
      errores.push("Los teléfonos de la empresa son obligatorios");
    }
    if (!evaluacion.personaContacto.trim()) {
      errores.push("La persona de contacto es obligatoria");
    }
    if (!evaluacion.nombreTutor.trim()) {
      errores.push("El nombre del tutor es obligatorio");
    }
    if (!evaluacion.telefonosCorreoTutor.trim()) {
      errores.push("Los teléfonos/correo del tutor son obligatorios");
    }

    // Validar observaciones
    if (!evaluacion.observaciones.trim()) {
      errores.push("Las observaciones son obligatorias");
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  // Generar reporte de evaluación
  static generarReporte(evaluacion: EvaluacionForm): string {
    return `
EVALUACIÓN DE PASANTÍAS
========================

DATOS DEL ESTUDIANTE:
--------------------
Nombre: ${evaluacion.nombreApellidos}
Título: ${evaluacion.identidadTitulo}
Código: ${evaluacion.codigoTitulo}
Horario: ${evaluacion.horario}
Dirección: ${evaluacion.direccion}
Teléfonos: ${evaluacion.telefonos}
Período: ${evaluacion.fechaInicioPasantia} - ${evaluacion.fechaTerminoPasantia}

DATOS DE LA EMPRESA:
--------------------
Centro de Trabajo: ${evaluacion.centroTrabajo}
Dirección: ${evaluacion.direccionEmpresa}
Teléfonos: ${evaluacion.telefonosEmpresa}
Persona de Contacto: ${evaluacion.personaContacto}
Tutor: ${evaluacion.nombreTutor}
Contacto Tutor: ${evaluacion.telefonosCorreoTutor}

CALIFICACIONES:
--------------
Promedio Capacidades: ${evaluacion.promedioCapacidades}
Promedio Habilidades: ${evaluacion.promedioHabilidades}
Promedio Actitudes: ${evaluacion.promedioActitudes}
NOTA FINAL: ${evaluacion.notaFinal}

OBSERVACIONES:
-------------
${evaluacion.observaciones}
    `.trim();
  }
}
