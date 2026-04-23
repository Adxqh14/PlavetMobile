'use client';

import { useState, useEffect, useCallback } from "react";
import type { Estudiante, EstudianteStats, CreateEstudianteData } from "../types";
import { estudiantesService } from "../services/estudiantesService";
import { apiClient } from "../../../../lib/api";

export const useEstudiantes = () => {
  const [paginatedEstudiantes, setPaginatedEstudiantes] = useState<Estudiante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<EstudianteStats>({ total: 0, activos: 0, inactivos: 0, suspendidos: 0 });
  const itemsPerPage = 15;

  const fetchEstudiantes = useCallback(async () => {
    try {
      const response = await estudiantesService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
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

  const fetchStats = useCallback(async () => {
    try {
      // Optimizamos obteniendo el total directamente y luego los conteos por estado
      const [totalRes, activosRes, inactivosRes, suspendidosRes] = await Promise.all([
        apiClient.get<any>("/api/estudiantes/stats"),
        estudiantesService.getAll({ pageSize: 1, estado: "Activo" }),
        estudiantesService.getAll({ pageSize: 1, estado: "Inactivo" }),
        estudiantesService.getAll({ pageSize: 1, estado: "Suspendido" }),
      ]);

      setStats({
        total: totalRes.data?.total || 0,
        activos: activosRes.pagination?.total || 0,
        inactivos: inactivosRes.pagination?.total || 0,
        suspendidos: suspendidosRes.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchAllForExport = useCallback(async () => {
    try {
      const response = await estudiantesService.getAll({
        search: searchTerm || undefined,
        estado: filterEstado !== "todos" ? filterEstado : undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all estudiantes:", error);
      return [];
    }
  }, [searchTerm, filterEstado]);

  useEffect(() => {
    fetchEstudiantes();
    fetchStats();
  }, [fetchEstudiantes, fetchStats]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addEstudiante = async (newEstudiante: CreateEstudianteData) => {
    await estudiantesService.create(newEstudiante);
    fetchEstudiantes();
    fetchStats();
  };

  const updateEstudiante = async (updatedEstudiante: Estudiante) => {
    try {
      await estudiantesService.update(updatedEstudiante.id, updatedEstudiante);
      fetchEstudiantes();
    } catch (error) {
      console.error("Error updating estudiante:", error);
      alert("Error al actualizar estudiante");
    }
  };

  const deleteEstudiante = async (id: string | number) => {
    try {
      await estudiantesService.delete(id);
      fetchEstudiantes();
      fetchStats();
    } catch (error) {
      console.error("Error deleting estudiante:", error);
      alert("Error al eliminar estudiante");
    }
  };

  return {
    estudiantes: paginatedEstudiantes, // For compatibility with existing length checks if needed
    filteredEstudiantes: paginatedEstudiantes, // For compatibility
    paginatedEstudiantes,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addEstudiante,
    updateEstudiante,
    deleteEstudiante,
    fetchAllForExport, // New helper for export
  };
};
