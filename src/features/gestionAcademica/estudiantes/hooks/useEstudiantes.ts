'use client';

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Estudiante, EstudianteStats, CreateEstudianteData } from "../types";
import { estudiantesService } from "../services/estudiantesService";
import { asistenciaService } from "@/features/procesoDePasantias/asistencias/services/asistenciaService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useEstudiantes = () => {
  const [paginatedEstudiantes, setPaginatedEstudiantes] = useState<Estudiante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<EstudianteStats>({ total: 0, activos: 0, inactivos: 0, suspendidos: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [centroStudentIds, setCentroStudentIds] = useState<Set<string> | null>(null);
  const itemsPerPage = 15;

  const { user, userRole } = useAuth();
  const tallerFilter = userRole === "TUTOR ACADEMICO" && user?.taller
    ? String(user.taller.id)
    : undefined;
  const centroTrabajoFilter = userRole === "TUTOR EMPRESARIAL"
    ? user?.datos_rol?.centro_trabajo?.id
    : undefined;

  // Cargar IDs de estudiantes del centro para filtrado client-side (TUTOR EMPRESARIAL)
  useEffect(() => {
    if (!centroTrabajoFilter) {
      setCentroStudentIds(null);
      return;
    }
    asistenciaService
      .getPasantiasByCentro(centroTrabajoFilter)
      .then(res => {
        const ids = new Set(res.data.map(p => String(p.id_estudiante)));
        setCentroStudentIds(ids);
      })
      .catch(() => setCentroStudentIds(null));
  }, [centroTrabajoFilter]);

  // ─── Fetch paginated list ────────────────────────────────────────────────────
  const fetchEstudiantes = useCallback(async () => {
    setIsLoading(true);
    try {
      const activeFilter = filterEstado !== "todos" ? filterEstado : undefined;
      const response = await estudiantesService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: activeFilter,
        id_taller: tallerFilter,
      });
      if (response.success) {
        let data = activeFilter
          ? response.data.map(e => ({ ...e, estado: filterEstado as Estudiante["estado"] }))
          : response.data;
        if (tallerFilter) {
          data = data.filter(e => String(e.id_taller) === tallerFilter);
        }
        if (centroStudentIds !== null) {
          data = data.filter(e => centroStudentIds.has(String(e.id)));
        }
        setPaginatedEstudiantes(data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching estudiantes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterEstado, tallerFilter, centroStudentIds]);

  // ─── Fetch stats — traer todos y filtrar client-side para consistencia con taller ──
  const fetchStats = useCallback(async () => {
    try {
      const response = await estudiantesService.getAll({ pageSize: 9999, id_taller: tallerFilter });
      let allStudents = response.data;
      if (tallerFilter) {
        allStudents = allStudents.filter(e => String(e.id_taller) === tallerFilter);
      }
      if (centroStudentIds !== null) {
        allStudents = allStudents.filter(e => centroStudentIds.has(String(e.id)));
      }
      setStats({
        total: allStudents.length,
        activos:     allStudents.filter(e => e.estado === "Activo").length,
        inactivos:   allStudents.filter(e => e.estado === "Inactivo").length,
        suspendidos: allStudents.filter(e => e.estado === "Suspendido").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [tallerFilter, centroStudentIds]);

  // ─── Fetch all records (used for CSV export) ────────────────────────────────
  const fetchAllForExport = useCallback(async (): Promise<Estudiante[]> => {
    try {
      const response = await estudiantesService.getAll({
        search: searchTerm || undefined,
        estado: filterEstado !== "todos" ? filterEstado : undefined,
        pageSize: 9999,
        id_taller: tallerFilter,
      });
      let data = response.data;
      if (tallerFilter) {
        data = data.filter(e => String(e.id_taller) === tallerFilter);
      }
      if (centroStudentIds !== null) {
        data = data.filter(e => centroStudentIds.has(String(e.id)));
      }
      return data;
    } catch (error) {
      console.error("Error fetching all estudiantes:", error);
      return [];
    }
  }, [searchTerm, filterEstado, tallerFilter, centroStudentIds]);

  // ─── Auto-fetch on filter/page change ───────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      await fetchEstudiantes();
    };
    init();
  }, [fetchEstudiantes]);

  useEffect(() => {
    const init = async () => {
      await fetchStats();
    };
    init();
  }, [fetchStats]);

  const resetPage = () => setCurrentPage(1);

  // ─── CRUD actions ────────────────────────────────────────────────────────────

  /** POST /api/v1/estudiantes */
  const addEstudiante = async (newEstudiante: CreateEstudianteData, silent: boolean = false) => {
    try {
      await estudiantesService.create(newEstudiante);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
      if (!silent) toast.success("Estudiante creado exitosamente.");
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al crear estudiante.";
      if (!silent) toast.error(msg);
      return false;
    }
  };

  /** PUT /api/v1/estudiantes/:id */
  const updateEstudiante = async (updatedEstudiante: Estudiante) => {
    try {
      await estudiantesService.update(updatedEstudiante.id, updatedEstudiante);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
      toast.success("Estudiante actualizado exitosamente.");
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al actualizar estudiante.";
      toast.error(msg);
      return false;
    }
  };

  /**
   * DELETE /api/v1/estudiantes/:id  →  soft delete (inactiva el registro)
   */
  const deleteEstudiante = async (id: string | number) => {
    try {
      await estudiantesService.delete(id);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
      toast.success("Estudiante marcado como inactivo.");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al eliminar estudiante.";
      toast.error(msg);
    }
  };

  /**
   * PATCH /api/v1/estudiantes/:id/estado  →  restaurar a "Activo"
   */
  const restoreEstudiante = async (id: string | number) => {
    try {
      await estudiantesService.updateEstado(id, "Activo");
      await Promise.all([fetchEstudiantes(), fetchStats()]);
      toast.success("Estudiante restaurado a Activo.");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al restaurar estudiante.";
      toast.error(msg);
    }
  };

  /**
   * PATCH /api/v1/estudiantes/:id/estado  →  cambiar estado arbitrario
   */
  const changeEstado = async (id: string | number, estado: string) => {
    try {
      await estudiantesService.updateEstado(id, estado);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
      toast.success(`Estado cambiado a ${estado}.`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al cambiar estado del estudiante.";
      toast.error(msg);
    }
  };

  /** Bulk import: create multiple students, refresh only once at the end */
  const bulkImportEstudiantes = async (rows: CreateEstudianteData[]): Promise<{ success: number; errors: number; firstError?: string }> => {
    let successCount = 0;
    let errorCount = 0;
    let firstErrorMsg: string | undefined = undefined;

    // Create all in parallel (up to 5 at a time to avoid overwhelming the API)
    const chunkSize = 5;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(row => estudiantesService.create(row))
      );
      results.forEach((r, idx) => {
        if (r.status === 'fulfilled') {
          successCount++;
        } else {
          errorCount++;
          const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
          console.error(`Error importing row ${i + idx}:`, chunk[idx], "Reason:", reason);
          if (!firstErrorMsg) firstErrorMsg = reason;
        }
      });
    }

    // Single refresh after all imports
    await Promise.all([fetchEstudiantes(), fetchStats()]);
    return { success: successCount, errors: errorCount, firstError: firstErrorMsg };
  };

  return {
    // Data
    estudiantes: paginatedEstudiantes,       // alias kept for compatibility
    filteredEstudiantes: paginatedEstudiantes,
    paginatedEstudiantes,
    stats,
    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    // Filters
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    // Actions
    addEstudiante,
    updateEstudiante,
    deleteEstudiante,
    restoreEstudiante,
    changeEstado,
    fetchAllForExport,
    bulkImportEstudiantes,
    isLoading,
    refetch: fetchEstudiantes,
  };
};
