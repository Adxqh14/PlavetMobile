import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Asistencia, AsistenciaFormData, AsistenciaFilters } from '../types';
import { asistenciaService } from '../services/asistenciaService';

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AsistenciaFilters>({
    searchTerm: "",
    filterAsistencia: "all",
  });

  const fetchAsistencias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asistenciaService.getAll({ pageSize: 100 });
      setAsistencias(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar asistencias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAsistencias();
  }, [fetchAsistencias]);

  const filteredAsistencias = useMemo(() => {
    return asistencias.filter((a) => {
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
  }, [asistencias, filters]);

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
