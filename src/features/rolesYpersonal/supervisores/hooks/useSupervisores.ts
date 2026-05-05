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

  useEffect(() => {
    fetchSupervisores();
  }, [fetchSupervisores]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addSupervisor = async (newSupervisor: SupervisorFormData) => {
    try {
      await supervisoresService.create(newSupervisor);
      fetchSupervisores();
    } catch (error) {
      console.error("Error creating supervisor:", error);
      alert(`Error al registrar supervisor: ${error instanceof Error ? error.message : "Error desconocido"}`);
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
      fetchSupervisores();
    } catch (error) {
      console.error("Error updating supervisor:", error);
      alert(`Error al actualizar supervisor: ${error instanceof Error ? error.message : "Error desconocido"}`);
    }
  };

  const deleteSupervisor = async (id: string) => {
    try {
      await supervisoresService.delete(id);
      fetchSupervisores();
    } catch (error) {
      console.error("Error deleting supervisor:", error);
    }
  };

  const restoreSupervisor = async (id: string) => {
    try {
      await supervisoresService.restore(id);
      fetchSupervisores();
    } catch (error) {
      console.error("Error restoring supervisor:", error);
    }
  };

  const permanentlyDeleteSupervisor = async (id: string) => {
    try {
      await supervisoresService.permanentDelete(id);
      fetchSupervisores();
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
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
    restoreSupervisor,
    permanentlyDeleteSupervisor,
    fetchAllForExport,
  };
};
