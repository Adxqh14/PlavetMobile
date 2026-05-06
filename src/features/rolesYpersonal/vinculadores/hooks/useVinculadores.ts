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

  useEffect(() => {
    fetchVinculadores();
  }, [fetchVinculadores]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addVinculador = async (newVinculador: VinculadorFormData) => {
    try {
      await vinculadoresService.create(newVinculador);
      fetchVinculadores();
    } catch (error) {
      console.error("Error creating vinculador:", error);
      alert(`Error al registrar vinculador: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
      fetchVinculadores();
    } catch (error) {
      console.error("Error updating vinculador:", error);
      alert(`Error al actualizar vinculador: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  const deleteVinculador = async (id: string) => {
    try {
      await vinculadoresService.delete(id);
      fetchVinculadores();
    } catch (error) {
      console.error("Error deleting vinculador:", error);
    }
  };

  const restoreVinculador = async (id: string) => {
    try {
      await vinculadoresService.restore(id);
      fetchVinculadores();
    } catch (error) {
      console.error("Error restoring vinculador:", error);
    }
  };

  const permanentlyDeleteVinculador = async (id: string) => {
    try {
      await vinculadoresService.permanentDelete(id);
      fetchVinculadores();
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
    addVinculador,
    updateVinculador,
    deleteVinculador,
    restoreVinculador,
    permanentlyDeleteVinculador,
    fetchAllForExport,
  };
};
