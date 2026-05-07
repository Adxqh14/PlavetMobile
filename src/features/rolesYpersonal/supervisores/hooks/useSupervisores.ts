'use client';

import { useState, useCallback, useEffect } from "react";
import type { Supervisor, SupervisorFormData } from "../types";
import { supervisoresService } from "../services/supervisoresService";

export const useSupervisores = () => {
  const [paginatedSupervisores, setPaginatedSupervisores] = useState<Supervisor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await supervisoresService.getAll({ page: 1, pageSize: 1000 });
      if (response.success) {
        const all = response.data;
        setStats({
          total: all.length,
          activos: all.filter(s => s.estado.toLowerCase() === "activo").length,
          inactivos: all.filter(s => s.estado.toLowerCase() === "inactivo").length
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchSupervisores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await supervisoresService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: statusFilter,
      });
      if (response.success) {
        setPaginatedSupervisores(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching supervisores:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchSupervisores();
    fetchStats();
  }, [fetchSupervisores, fetchStats]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addSupervisor = async (newSupervisor: SupervisorFormData) => {
    try {
      await supervisoresService.create(newSupervisor);
      await Promise.all([fetchSupervisores(), fetchStats()]);
    } catch (error) {
      console.error("Error creating supervisor:", error);
    }
  };

  const updateSupervisor = async (updatedSupervisor: Supervisor) => {
    try {
      await supervisoresService.update(updatedSupervisor.id, {
        nombre: updatedSupervisor.nombre,
        apellido: updatedSupervisor.apellido,
        email: updatedSupervisor.email,
        telefono: updatedSupervisor.telefono,
        estado: updatedSupervisor.estado,
      });
      await Promise.all([fetchSupervisores(), fetchStats()]);
    } catch (error) {
      console.error("Error updating supervisor:", error);
    }
  };

  const deleteSupervisor = async (id: string) => {
    try {
      await supervisoresService.delete(id);
      await Promise.all([fetchSupervisores(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting supervisor:", error);
    }
  };

  const restoreSupervisor = async (id: string) => {
    try {
      await supervisoresService.restore(id);
      await Promise.all([fetchSupervisores(), fetchStats()]);
    } catch (error) {
      console.error("Error restoring supervisor:", error);
    }
  };

  const permanentlyDeleteSupervisor = async (id: string) => {
    try {
      await supervisoresService.permanentDelete(id);
      await Promise.all([fetchSupervisores(), fetchStats()]);
    } catch (error) {
      console.error("Error permanently deleting supervisor:", error);
    }
  };

  // Stub — backend no expone endpoint de exportación
  const fetchAllForExport = useCallback(async (): Promise<Blob | null> => {
    return null;
  }, []);

  return {
    supervisores: paginatedSupervisores,
    filteredSupervisores: paginatedSupervisores,
    paginatedSupervisores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isLoading,
    stats,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
    restoreSupervisor,
    permanentlyDeleteSupervisor,
    fetchAllForExport,
    refetch: fetchSupervisores,
  };
};
