import { useState, useMemo, useCallback, useEffect } from "react";
import type { Visita, VisitaFormData, VisitaFilters } from "../types";
import { visitaService } from "../services/visitaService";

export const useVisitas = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VisitaFilters>({
    searchTerm: "",
    filterEstado: "all",
  });

  const fetchVisitas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await visitaService.getAll({ pageSize: 100 });
      setVisitas(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar visitas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitas();
  }, [fetchVisitas]);

  const filteredVisitas = useMemo(() => {
    return visitas.filter((v) => {
      const empresa = v.centro_trabajo?.nombre?.toLowerCase() ?? "";
      const tutor = v.tutor ? `${v.tutor.nombre} ${v.tutor.apellido}`.toLowerCase() : "";
      const motivo = v.motivo?.toLowerCase() ?? "";

      const matchesSearch =
        empresa.includes(filters.searchTerm.toLowerCase()) ||
        tutor.includes(filters.searchTerm.toLowerCase()) ||
        motivo.includes(filters.searchTerm.toLowerCase());

      const matchesEstado =
        filters.filterEstado === "all" || v.estado === filters.filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [visitas, filters]);

  const addVisita = useCallback(
    async (data: VisitaFormData) => {
      await visitaService.create(data);
      await fetchVisitas();
    },
    [fetchVisitas]
  );

  return {
    visitas: filteredVisitas,
    isLoading,
    error,
    filters,
    setFilters,
    addVisita,
    refresh: fetchVisitas,
  };
};
