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
  const centroTrabajoFilter = userRole === "TUTOR EMPRESARIAL"
    ? user?.datos_rol?.centro_trabajo?.id
    : undefined;

  // Cargar IDs de estudiantes del taller para filtrado client-side (TUTOR ACADEMICO)
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
      // Filtro por taller (TUTOR ACADEMICO): cross-reference con IDs del taller
      if (tallerStudentIds !== null) {
        if (!tallerStudentIds.has(String(a.id_estudiante))) return false;
      } else if (tallerFilter && a.estudiante?.id_taller) {
        if (a.estudiante.id_taller !== tallerFilter) return false;
      }

      // Filtro por centro de trabajo (TUTOR EMPRESARIAL)
      if (centroTrabajoFilter) {
        if (!a.centro_trabajo?.id || a.centro_trabajo.id !== centroTrabajoFilter) return false;
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
  }, [asistencias, filters, tallerFilter, tallerStudentIds, centroTrabajoFilter]);

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
