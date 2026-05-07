'use client';

import { useState, useCallback, useEffect } from "react";
import type { Vinculador, VinculadorFormData } from "../types";
import { vinculadoresService } from "../services/vinculadoresService";

export const useVinculadores = () => {
  const [paginatedVinculadores, setPaginatedVinculadores] = useState<Vinculador[]>([]);
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
      const response = await vinculadoresService.getAll({ page: 1, pageSize: 1000 });
      if (response.success) {
        const all = response.data;
        setStats({
          total: all.length,
          activos: all.filter(v => v.estado.toLowerCase() === "activo").length,
          inactivos: all.filter(v => v.estado.toLowerCase() === "inactivo").length
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchVinculadores = useCallback(async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

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
      await Promise.all([fetchVinculadores(), fetchStats()]);
    } catch (error) {
      console.error("Error creating vinculador:", error);
    }
  };

  const updateVinculador = async (updatedVinculador: Vinculador) => {
    try {
      await vinculadoresService.update(updatedVinculador.id, {
        nombre: updatedVinculador.nombre,
        apellido: updatedVinculador.apellido,
        email: updatedVinculador.email,
        telefono: updatedVinculador.telefono,
        estado: updatedVinculador.estado,
      });
      await Promise.all([fetchVinculadores(), fetchStats()]);
    } catch (error) {
      console.error("Error updating vinculador:", error);
    }
  };

  const deleteVinculador = async (id: string) => {
    try {
      await vinculadoresService.delete(id);
      await Promise.all([fetchVinculadores(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting vinculador:", error);
    }
  };

  const restoreVinculador = async (id: string) => {
    try {
      await vinculadoresService.restore(id);
      await Promise.all([fetchVinculadores(), fetchStats()]);
    } catch (error) {
      console.error("Error restoring vinculador:", error);
    }
  };

  const permanentlyDeleteVinculador = async (id: string) => {
    try {
      await vinculadoresService.permanentDelete(id);
      await Promise.all([fetchVinculadores(), fetchStats()]);
    } catch (error) {
      console.error("Error permanently deleting vinculador:", error);
    }
  };

  // Stub — backend no expone endpoint de exportación
  const fetchAllForExport = useCallback(async (): Promise<Blob | null> => {
    return null;
  }, []);

  return {
    vinculadores: paginatedVinculadores,
    filteredVinculadores: paginatedVinculadores,
    paginatedVinculadores,
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
    addVinculador,
    updateVinculador,
    deleteVinculador,
    restoreVinculador,
    permanentlyDeleteVinculador,
    fetchAllForExport,
    refetch: fetchVinculadores,
  };
};
