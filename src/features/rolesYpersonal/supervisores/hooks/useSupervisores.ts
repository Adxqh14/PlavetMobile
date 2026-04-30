'use client';

import { useState, useCallback, useEffect } from "react";
import type { Supervisor, SupervisorStats, SupervisorFormData } from "../types";
import { supervisoresService } from "../services/supervisoresService";

export const useSupervisores = () => {
  const [paginatedSupervisores, setPaginatedSupervisores] = useState<Supervisor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState<SupervisorStats>({ total: 0, activos: 0, inactivos: 0 });
  const itemsPerPage = 15;

  const fetchSupervisores = useCallback(async () => {
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
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      // Stats endpoint not available for supervisores
    } catch (error) {
      console.error("Error fetching supervisores stats:", error);
    }
  }, []);

  const fetchAllForExport = useCallback(async () => {
    try {
      return await supervisoresService.exportCsv({
        search: searchTerm || undefined,
        estado: statusFilter,
      });
    } catch (error) {
      console.error("Error fetching export:", error);
      return null;
    }
  }, [searchTerm, statusFilter]);

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
      fetchSupervisores();
      fetchStats();
    } catch (error) {
      console.error("Error creating supervisor:", error);
    }
  };

  const updateSupervisor = async (updatedSupervisor: Supervisor) => {
    try {
      await supervisoresService.update(updatedSupervisor.id, updatedSupervisor);
      fetchSupervisores();
    } catch (error) {
      console.error("Error updating supervisor:", error);
    }
  };

  const deleteSupervisor = async (id: string) => {
    try {
      await supervisoresService.delete(id);
      fetchSupervisores();
      fetchStats();
    } catch (error) {
      console.error("Error deleting supervisor:", error);
    }
  };

  const restoreSupervisor = async (id: string) => {
    try {
      await supervisoresService.restore(id);
      fetchSupervisores();
      fetchStats();
    } catch (error) {
      console.error("Error restoring supervisor:", error);
    }
  };

  const permanentlyDeleteSupervisor = async (id: string) => {
    try {
      await supervisoresService.permanentDelete(id);
      fetchSupervisores();
      fetchStats();
    } catch (error) {
      console.error("Error permanently deleting supervisor:", error);
    }
  };

  return {
    supervisores: paginatedSupervisores,
    filteredSupervisores: paginatedSupervisores,
    paginatedSupervisores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
    restoreSupervisor,
    permanentlyDeleteSupervisor,
    fetchAllForExport,
  };
};
