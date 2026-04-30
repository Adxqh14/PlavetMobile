'use client';

import { useState, useCallback, useEffect } from "react";
import type { Vinculador, VinculadorStats, VinculadorFormData } from "../types";
import { vinculadoresService } from "../services/vinculadoresService";

export const useVinculadores = () => {
  const [paginatedVinculadores, setPaginatedVinculadores] = useState<Vinculador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchVinculadores = useCallback(async () => {
    try {
      const response = await vinculadoresService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: statusFilter,
      });
      if (response.success) {
        setPaginatedVinculadores(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching vinculadores:", error);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      // Stats endpoint not available for vinculadores
    } catch (error) {
      console.error("Error fetching vinculadores stats:", error);
    }
  }, []);

  const fetchAllForExport = useCallback(async () => {
    try {
      return await vinculadoresService.exportCsv({
        search: searchTerm || undefined,
        estado: statusFilter,
      });
    } catch (error) {
      console.error("Error fetching export:", error);
      return null;
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchVinculadores();
    fetchStats();
  }, [fetchVinculadores, fetchStats]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addVinculador = async (newVinculador: VinculadorFormData) => {
    try {
      await vinculadoresService.create(newVinculador);
      fetchVinculadores();
      fetchStats();
    } catch (error) {
      console.error("Error creating vinculador:", error);
    }
  };

  const updateVinculador = async (updatedVinculador: Vinculador) => {
    try {
      await vinculadoresService.update(updatedVinculador.id, updatedVinculador);
      fetchVinculadores();
    } catch (error) {
      console.error("Error updating vinculador:", error);
    }
  };

  const deleteVinculador = async (id: number) => {
    try {
      await vinculadoresService.delete(id);
      fetchVinculadores();
      fetchStats();
    } catch (error) {
      console.error("Error deleting vinculador:", error);
    }
  };

  const restoreVinculador = async (id: number) => {
    try {
      await vinculadoresService.restore(id);
      fetchVinculadores();
      fetchStats();
    } catch (error) {
      console.error("Error restoring vinculador:", error);
    }
  };

  const permanentlyDeleteVinculador = async (id: number) => {
    try {
      await vinculadoresService.permanentDelete(id);
      fetchVinculadores();
      fetchStats();
    } catch (error) {
      console.error("Error permanently deleting vinculador:", error);
    }
  };

  // Stats derived from loaded data
  const stats: VinculadorStats = {
    total: paginatedVinculadores.length,
    activos: paginatedVinculadores.filter((v) => v.estado === 'activo').length,
    inactivos: paginatedVinculadores.filter((v) => v.estado === 'inactivo').length,
  };

  return {
    vinculadores: paginatedVinculadores,
    filteredVinculadores: paginatedVinculadores,
    paginatedVinculadores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addVinculador,
    updateVinculador,
    deleteVinculador,
    restoreVinculador,
    permanentlyDeleteVinculador,
    fetchAllForExport,
  };
};
