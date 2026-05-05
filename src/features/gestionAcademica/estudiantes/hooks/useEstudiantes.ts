'use client';

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Estudiante, EstudianteStats, CreateEstudianteData } from "../types";
import { estudiantesService } from "../services/estudiantesService";

export const useEstudiantes = () => {
  const [paginatedEstudiantes, setPaginatedEstudiantes] = useState<Estudiante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<EstudianteStats>({ total: 0, activos: 0, inactivos: 0, suspendidos: 0 });
  const itemsPerPage = 15;

  // ─── Fetch paginated list ────────────────────────────────────────────────────
  const fetchEstudiantes = useCallback(async () => {
    try {
      const activeFilter = filterEstado !== "todos" ? filterEstado : undefined;
      const response = await estudiantesService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: activeFilter,
      });
      if (response.success) {
        // Backend doesn't return u.estado in SELECT e.* — override it from the active filter
        const data = activeFilter
          ? response.data.map(e => ({ ...e, estado: filterEstado as Estudiante["estado"] }))
          : response.data;
        setPaginatedEstudiantes(data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching estudiantes:", error);
    }
  }, [currentPage, searchTerm, filterEstado]);

  // ─── Fetch stats — backend /stats only returns total, so query per-estado counts ──
  const fetchStats = useCallback(async () => {
    try {
      const [activosRes, inactivosRes, suspendidosRes] = await Promise.all([
        estudiantesService.getAll({ estado: "Activo",     pageSize: 1 }),
        estudiantesService.getAll({ estado: "Inactivo",   pageSize: 1 }),
        estudiantesService.getAll({ estado: "Suspendido", pageSize: 1 }),
      ]);
      const activos     = activosRes.pagination?.total     ?? 0;
      const inactivos   = inactivosRes.pagination?.total   ?? 0;
      const suspendidos = suspendidosRes.pagination?.total ?? 0;
      setStats({
        total: activos + inactivos + suspendidos,
        activos,
        inactivos,
        suspendidos,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // ─── Fetch all records (used for CSV export) ────────────────────────────────
  const fetchAllForExport = useCallback(async (): Promise<Estudiante[]> => {
    try {
      const response = await estudiantesService.getAll({
        search: searchTerm || undefined,
        estado: filterEstado !== "todos" ? filterEstado : undefined,
        pageSize: 9999,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all estudiantes:", error);
      return [];
    }
  }, [searchTerm, filterEstado]);

  // ─── Auto-fetch on filter/page change ───────────────────────────────────────
  useEffect(() => {
    fetchEstudiantes();
  }, [fetchEstudiantes]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const resetPage = () => setCurrentPage(1);

  // ─── CRUD actions ────────────────────────────────────────────────────────────

  /** POST /api/v1/estudiantes */
  const addEstudiante = async (newEstudiante: CreateEstudianteData) => {
    try {
      await estudiantesService.create(newEstudiante);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
      toast.success("Estudiante creado exitosamente.");
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error al crear estudiante.";
      toast.error(msg);
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
  };
};
