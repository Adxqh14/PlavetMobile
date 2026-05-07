import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Asistencia, AsistenciaFormData, AsistenciaFilters } from '../types';
import { asistenciaService } from '../services/asistenciaService';
import { estudiantesService } from '@/features/gestionAcademica/estudiantes/services/estudiantesService';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [tallerStudentIds, setTallerStudentIds] = useState<Set<string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AsistenciaFilters>({
    searchTerm: "",
    filterAsistencia: "all",
  });

  const { user, userRole } = useAuth();
  const tallerFilter = userRole === "TUTOR ACADEMICO" && user?.taller
    ? String(user.taller.id)
    : undefined;

  // Cargar IDs de estudiantes del taller para filtrado client-side
  useEffect(() => {
    if (!tallerFilter) {
      setTallerStudentIds(null);
      return;
    }
    estudiantesService
      .getAll({ pageSize: 9999, id_taller: tallerFilter })
      .then(res => {
        const ids = new Set(
          res.data
            .filter(e => String(e.id_taller) === tallerFilter)
            .map(e => String(e.id))
        );
        setTallerStudentIds(ids);
      })
      .catch(() => setTallerStudentIds(null));
  }, [tallerFilter]);

  const fetchAsistencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asistenciaService.getAll({ pageSize: 100, id_taller: tallerFilter });
      setAsistencias(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar asistencias');
    } finally {
      setIsLoading(false);
    }
  }, [tallerFilter]);

  useEffect(() => {
    fetchAsistencias();
  }, [fetchAsistencias]);

  const filteredAsistencias = useMemo(() => {
    return asistencias.filter((a) => {
      // Filtro por taller: prioridad 1 — cross-reference con IDs del taller
      if (tallerStudentIds !== null) {
        if (!tallerStudentIds.has(String(a.id_estudiante))) return false;
      } else if (tallerFilter && a.estudiante?.id_taller) {
        // Prioridad 2 — si el backend devuelve id_taller en el sub-objeto
        if (a.estudiante.id_taller !== tallerFilter) return false;
      }

      const studentName = a.estudiante
        ? `${a.estudiante.nombre} ${a.estudiante.apellido}`.toLowerCase()
        : '';
      const empresa = a.centro_trabajo?.nombre?.toLowerCase() ?? '';

      const matchesSearch =
        studentName.includes(filters.searchTerm.toLowerCase()) ||
        empresa.includes(filters.searchTerm.toLowerCase());

      const matchesFilter =
        filters.filterAsistencia === "all" ||
        (filters.filterAsistencia === "presente" && a.asistencia) ||
        (filters.filterAsistencia === "ausente" && !a.asistencia);

      return matchesSearch && matchesFilter;
    });
  }, [asistencias, filters, tallerFilter, tallerStudentIds]);

  const addAsistencia = useCallback(async (data: AsistenciaFormData) => {
    await asistenciaService.create(data);
    await fetchAsistencias();
  }, [fetchAsistencias]);

  return {
    asistencias: filteredAsistencias,
    isLoading,
    error,
    filters,
    setFilters,
    addAsistencia,
    refresh: fetchAsistencias,
  };
};
