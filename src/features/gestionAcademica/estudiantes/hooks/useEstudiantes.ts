'use client';

import { useState, useEffect, useCallback } from "react";
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
      const response = await estudiantesService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        // When "todos" send no estado filter so backend returns all statuses
        estado: filterEstado !== "todos" ? filterEstado : undefined,
      });
      if (response.success) {
        setPaginatedEstudiantes(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching estudiantes:", error);
    }
  }, [currentPage, searchTerm, filterEstado]);

  // ─── Fetch stats via dedicated endpoint ────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const response = await estudiantesService.getStats();
      // Backend returns { success: true, data: { total, activos, inactivos, suspendidos } }
      if (response.success && response.data) {
        setStats({
          total:      response.data.total      ?? 0,
          activos:    response.data.activos    ?? 0,
          inactivos:  response.data.inactivos  ?? 0,
          suspendidos: response.data.suspendidos ?? 0,
        });
      }
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
      return true;
    } catch (error) {
      console.error("Error creating estudiante:", error);
      return false;
    }
  };

  /** PUT /api/v1/estudiantes/:id */
  const updateEstudiante = async (updatedEstudiante: Estudiante) => {
    try {
      await estudiantesService.update(updatedEstudiante.id, updatedEstudiante);
      await fetchEstudiantes();
      return true;
    } catch (error) {
      console.error("Error updating estudiante:", error);
      return false;
    }
  };

  /**
   * DELETE /api/v1/estudiantes/:id  →  soft delete (inactiva el registro)
   * The backend's DELETE is a soft-delete, so it marks the student as Inactive.
   */
  const deleteEstudiante = async (id: string | number) => {
    try {
      await estudiantesService.delete(id);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting estudiante:", error);
      alert("Error al eliminar estudiante.");
    }
  };

  /**
   * PATCH /api/v1/estudiantes/:id/estado  →  restaurar a "Activo"
   */
  const restoreEstudiante = async (id: string | number) => {
    try {
      await estudiantesService.updateEstado(id, "Activo");
      await Promise.all([fetchEstudiantes(), fetchStats()]);
    } catch (error) {
      console.error("Error restoring estudiante:", error);
      alert("Error al restaurar estudiante.");
    }
  };

  /**
   * PATCH /api/v1/estudiantes/:id/estado  →  cambiar estado arbitrario
   */
  const changeEstado = async (id: string | number, estado: string) => {
    try {
      await estudiantesService.updateEstado(id, estado);
      await Promise.all([fetchEstudiantes(), fetchStats()]);
    } catch (error) {
      console.error("Error changing estado:", error);
      alert("Error al cambiar estado del estudiante.");
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
