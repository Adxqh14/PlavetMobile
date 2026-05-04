'use client';

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";
import { tutoresAcademicoService } from "../services/tutoresAcademicoService";

export const useTutores = () => {
  const [paginatedTutores, setPaginatedTutores] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 15;

  const fetchTutores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tutoresAcademicoService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: statusFilter !== "todos" ? statusFilter : undefined,
      });
      if (response.success) {
        setPaginatedTutores(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (err: any) {
      console.error("Error fetching tutores académicos:", err);
      setError(err?.message || "Error al cargar tutores");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchAllForExport = useCallback(async () => {
    console.warn("Export to CSV no implementado para tutores académicos");
    return null;
  }, []);

  useEffect(() => {
    fetchTutores();
  }, [fetchTutores]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addTutor = async (newTutor: CreateTutorData) => {
    try {
      await tutoresAcademicoService.create(newTutor);
      await fetchTutores();
      toast.success("Tutor académico registrado exitosamente.");
      return true;
    } catch (err: any) {
      const msg = err?.message || "Error al crear el tutor académico";
      toast.error(msg);
      setError(msg);
      return false;
    }
  };

  // id es string (cédula del tutor)
  const updateTutor = async (id: string, data: UpdateTutorData) => {
    try {
      await tutoresAcademicoService.update(id, data);
      setStatusFilter("todos");
      setCurrentPage(1);
      toast.success("Tutor académico actualizado exitosamente.");
      return true;
    } catch (err: any) {
      const msg = err?.message || "Error al actualizar el tutor académico";
      toast.error(msg);
      setError(msg);
      return false;
    }
  };

  // id es string (cédula del tutor)
  const deleteTutor = async (id: string) => {
    try {
      await tutoresAcademicoService.delete(id);
      await fetchTutores();
      toast.success("Tutor académico eliminado exitosamente.");
    } catch (err: any) {
      const msg = err?.message || "Error al eliminar el tutor académico";
      toast.error(msg);
      setError(msg);
      throw err;
    }
  };

  const restoreTutor = async (_id: string) => {
    console.warn("Restore no implementado para tutores académicos");
  };

  const permanentlyDeleteTutor = async (id: string) => {
    await deleteTutor(id);
  };

  return {
    tutores: paginatedTutores,
    filteredTutores: paginatedTutores,
    paginatedTutores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loading,
    error,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
    fetchAllForExport,
    refetch: fetchTutores,
  };
};
