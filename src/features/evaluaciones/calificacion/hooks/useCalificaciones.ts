import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { CalificacionService } from '../services/calificacionService';
import type { EvaluacionGuardada, CalificacionStats, FilterNota } from '../types';

export function useCalificaciones() {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionGuardada[]>([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState<EvaluacionGuardada[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNota, setFilterNota] = useState<FilterNota>('todos');
  const [filterTaller, setFilterTaller] = useState<string>('todos');
  
  const itemsPerPage = 10;

  // Cargar evaluaciones guardadas - optimizado para evitar setState síncrono
  useEffect(() => {
    const cargarEvaluacionesDesdeStorage = () => {
      try {
        const evaluacionesGuardadas = CalificacionService.getEvaluaciones();
        
        if (evaluacionesGuardadas.length === 0) {
          // Si no hay evaluaciones guardadas, agregar datos de ejemplo
          const ejemploAprobado: Omit<EvaluacionGuardada, 'id'> = {
            estudiante: "María García López",
            empresa: "Tech Solutions S.A.",
            promedioCapacidades: "92.5",
            promedioHabilidades: "88.4",
            promedioActitudes: "95.0",
            notaFinal: "91.9",
            fechaEvaluacion: "2024-03-15",
            evaluacionCompleta: {
              identidadTitulo: "Desarrollo y administración de aplicaciones informáticas",
              codigoTitulo: "IFC006_3",
              nombreApellidos: "María García López",
              horario: "08:00 - 14:00",
              direccion: "Calle Duarte #12, Santo Domingo",
              telefonos: "809-555-0123",
              fechaInicioPasantia: "2024-01-08",
              fechaTerminoPasantia: "2024-03-29",
              centroTrabajo: "Tech Solutions S.A.",
              direccionEmpresa: "Av. Abraham Lincoln, Torre Empresarial",
              telefonosEmpresa: "809-222-4444",
              personaContacto: "Ing. Roberto Méndez",
              nombreTutor: "Roberto Méndez",
              telefonosCorreoTutor: "rmendez@techsolutions.com",
              
              // Evaluación por semanas (Capacidades)
              conocimientosTeoricos: ["90", "92", "95", "88", "90", "94", "92", "95", "90", "94", "96", "95"],
              asimilacionInstruccionesVerbales: ["95", "90", "92", "94", "95", "90", "92", "94", "95", "90", "92", "94"],
              asimilacionInstruccionesEscritas: ["88", "90", "92", "95", "88", "90", "92", "95", "88", "90", "92", "95"],
              asimilacionInstruccionesSimbolicas: ["92", "94", "95", "90", "92", "94", "95", "90", "92", "94", "95", "90"],
              subtotalCapacidad: ["91.2", "91.5", "93.5", "91.8", "91.2", "92.0", "92.0", "93.5", "91.2", "92.0", "93.8", "93.5"],
              
              // Evaluación por semanas (Habilidades)
              organizacionPlanificacion: ["85", "88", "90", "85", "88", "90", "85", "88", "90", "85", "88", "90"],
              metodo: ["90", "92", "88", "90", "92", "88", "90", "92", "88", "90", "92", "88"],
              ritmoTrabajo: ["88", "85", "90", "88", "85", "90", "88", "85", "90", "88", "85", "90"],
              trabajoRealizado: ["92", "90", "88", "92", "90", "88", "92", "90", "88", "92", "90", "88"],
              subtotalHabilidad: ["88.8", "88.8", "89.0", "88.8", "88.8", "89.0", "88.8", "88.8", "89.0", "88.8", "88.8", "89.0"],
              
              // Evaluación por semanas (Actitudes)
              iniciativa: ["95", "98", "95", "95", "98", "95", "95", "98", "95", "95", "98", "95"],
              trabajoEquipo: ["98", "95", "95", "98", "95", "95", "98", "95", "95", "98", "95", "95"],
              puntualidadAsistencia: ["100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100", "100"],
              responsabilidad: ["95", "95", "98", "95", "95", "98", "95", "95", "98", "95", "95", "98"],
              subtotalActitud: ["97.0", "97.0", "98.2", "97.0", "97.0", "98.2", "97.0", "97.0", "98.2", "97.0", "97.0", "98.2"],
              total: ["92.3", "92.4", "93.6", "92.5", "92.3", "93.1", "92.6", "93.1", "92.8", "92.6", "93.2", "93.6"],
              
              // Promedios y nota final
              promedioCapacidades: "92.5",
              promedioHabilidades: "88.4",
              promedioActitudes: "95.0",
              notaFinal: "91.9",
              
              // Observaciones
              observaciones: "María demostró un compromiso excepcional durante sus pasantías. Su capacidad para resolver problemas técnicos en el área de desarrollo de bases de datos superó nuestras expectativas. Es puntual, proactiva y trabaja muy bien en equipo.",
              
              // Firmas (Mock base64 o placeholders)
              firmaTutorCentro: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
              firmaTutorEducativo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
              fechaFirma: "2024-03-29",
              
              // Criterios y Contenido
              raContenido: "RA9.2: Participar a su nivel en la creación de bases de datos y en el mantenimiento, tomando en consideración las políticas establecidas por la empresa.",
              criterio1: "Crear bases de datos, utilizando herramientas de tablas, índices, funciones, procedimientos, siguiendo las especificaciones de diseño recibidas.",
              criterio2: "Aplicar mantenimiento a la base de datos según los resultados de la consulta (update, insert, delete, select).",
              criterio3: "Verificar el funcionamiento de la base de datos, tomando en consideración las reglas de la empresa.",
              criterio4: "Interpretar la documentación técnica de la base de datos, identificando sus características funcionales.",
              criterio5: "Documentar el análisis de los resultados obtenidos de las pruebas realizadas.",
              criterio6: "Administrar las actividades de los datos para garantizar que los usuarios trabajen en forma cooperativa."
            }
          };
          
          const nuevaEvaluacion = CalificacionService.addEvaluacion(ejemploAprobado);
          const evaluacionesArray = [nuevaEvaluacion];
          flushSync(() => {
            setEvaluaciones(evaluacionesArray);
            setFilteredEvaluaciones(evaluacionesArray);
          });
        } else {
          flushSync(() => {
            setEvaluaciones(evaluacionesGuardadas);
            setFilteredEvaluaciones(evaluacionesGuardadas);
          });
        }
      } catch (error) {
        console.error('Error al cargar evaluaciones:', error);
      }
    };

    cargarEvaluacionesDesdeStorage();
  }, []);

  // Agregar nueva evaluación - optimizado
  const agregarEvaluacion = useCallback((evaluacion: Omit<EvaluacionGuardada, 'id'>) => {
    const nuevaEvaluacion = CalificacionService.addEvaluacion(evaluacion);
    
    setEvaluaciones(prev => {
      const evaluacionesActualizadas = [...prev, nuevaEvaluacion];
      
      // Actualizar filteredEvaluaciones en el mismo ciclo de render
      flushSync(() => {
        setFilteredEvaluaciones(evaluacionesActualizadas);
      });
      
      return evaluacionesActualizadas;
    });
  }, []);

  // Filtrar y buscar evaluaciones - optimizado
  useEffect(() => {
    const filtrarEvaluaciones = () => {
      let filtradas = CalificacionService.filterBySearch(evaluaciones, searchTerm);
      filtradas = CalificacionService.filterByNota(filtradas, filterNota);
      if (filterTaller !== 'todos') {
        filtradas = filtradas.filter(e => e.empresa === filterTaller);
      }
      return filtradas;
    };

    const filtradas = filtrarEvaluaciones();
    
    // Usar flushSync para actualización síncrona cuando es necesario
    flushSync(() => {
      setFilteredEvaluaciones(filtradas);
      setCurrentPage(1);
    });
  }, [evaluaciones, searchTerm, filterNota, filterTaller]);

  // Paginación
  const totalPages = Math.ceil(filteredEvaluaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvaluaciones = filteredEvaluaciones.slice(startIndex, startIndex + itemsPerPage);

  // Estadísticas
  const stats: CalificacionStats = CalificacionService.calculateStats(evaluaciones);

  // Verificar si hay nueva evaluación al cargar - optimizado
  useEffect(() => {
    const interval = setInterval(() => {
      if (CalificacionService.hasPendingEvaluation()) {
        try {
          CalificacionService.processPendingEvaluation();
          // Recargar evaluaciones
          const evaluacionesActualizadas = CalificacionService.getEvaluaciones();
          setEvaluaciones(evaluacionesActualizadas);
          setFilteredEvaluaciones(evaluacionesActualizadas);
        } catch (error) {
          console.error('Error al procesar última evaluación:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    evaluaciones,
    filteredEvaluaciones,
    paginatedEvaluaciones,
    currentPage,
    totalPages,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filterNota,
    setFilterNota,
    filterTaller,
    setFilterTaller,
    stats,
    agregarEvaluacion
  };
}
