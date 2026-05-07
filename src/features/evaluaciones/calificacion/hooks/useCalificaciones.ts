import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { CalificacionService } from '../services/calificacionService';
import type { EvaluacionGuardada, CalificacionStats, FilterNota } from '../types';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useCalificaciones() {
  const { user, userRole } = useAuth();
  const tallerFilter = userRole === "TUTOR ACADEMICO" && user?.taller
    ? String(user.taller.id)
    : undefined;

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
        
        flushSync(() => {
          setEvaluaciones(evaluacionesGuardadas);
          setFilteredEvaluaciones(evaluacionesGuardadas);
        });
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
      // Restringir al taller del tutor académico
      if (tallerFilter) {
        filtradas = filtradas.filter(e => e.id_taller === tallerFilter);
      }
      return filtradas;
    };

    const filtradas = filtrarEvaluaciones();
    
    // Usar flushSync para actualización síncrona cuando es necesario
    flushSync(() => {
      setFilteredEvaluaciones(filtradas);
      setCurrentPage(1);
    });
  }, [evaluaciones, searchTerm, filterNota, filterTaller, tallerFilter]);

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

  // Recargar evaluaciones manualmente
  const recargarEvaluaciones = useCallback(() => {
    try {
      const evaluacionesGuardadas = CalificacionService.getEvaluaciones();
      setEvaluaciones(evaluacionesGuardadas);
      setFilteredEvaluaciones(evaluacionesGuardadas);
    } catch (error) {
      console.error('Error al recargar evaluaciones:', error);
    }
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
    agregarEvaluacion,
    recargarEvaluaciones
  };
}
