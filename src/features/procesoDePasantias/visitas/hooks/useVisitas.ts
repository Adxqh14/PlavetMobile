import { useState, useMemo, useCallback, useEffect } from "react";
import type { Visita, VisitaFormData, VisitaFilters } from "../types";
import { visitaService } from "../services/visitaService";
import { estudiantesService } from "@/features/gestionAcademica/estudiantes/services/estudiantesService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useVisitas = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [tallerStudentIds, setTallerStudentIds] = useState<Set<string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VisitaFilters>({
    searchTerm: "",
    filterEstado: "all",
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
  }, [tallerFilter]);

  useEffect(() => {
    fetchVisitas();
  }, [fetchVisitas]);

  const filteredVisitas = useMemo(() => {
    return visitas.filter((v) => {
      // Filtro por taller: la visita debe incluir al menos un estudiante del taller
      if (tallerStudentIds !== null) {
        const hasStudentFromTaller = v.estudiantes?.some(ve =>
          tallerStudentIds.has(String(ve.estudiante?.id))
        );
        // Si no hay estudiantes listados en la visita, filtrar por id_tutor del usuario
        if (v.estudiantes && v.estudiantes.length > 0) {
          if (!hasStudentFromTaller) return false;
        } else if (user?.id && v.id_tutor !== user.id) {
          return false;
        }
      } else if (tallerFilter) {
        // Fallback: filtrar por id_taller en el sub-objeto del tutor (si el backend lo devuelve)
        if (v.tutor?.id_taller && v.tutor.id_taller !== tallerFilter) return false;
      }

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
  }, [visitas, filters, tallerFilter, tallerStudentIds, user?.id]);

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
