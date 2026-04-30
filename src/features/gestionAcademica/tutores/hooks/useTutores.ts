'use client';

import { useState, useCallback, useEffect } from "react";
import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";
import { tutoresAcademicoService } from "../services/tutoresAcademicoService";

export const useTutores = () => {
  const [paginatedTutores, setPaginatedTutores] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchTutores = useCallback(async () => {
    try {
      const response = await tutoresAcademicoService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: statusFilter,
      });
      if (response.success) {
        // Map from TutorAcademico to Tutor if necessary, or just cast
        setPaginatedTutores(response.data as unknown as Tutor[]);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching tutores:", error);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchAllForExport = useCallback(async () => {
    // tutorAcademicoService doesn't have an export method right now, returning null
    console.warn("Export to CSV not implemented for tutores academicos");
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
      await tutoresAcademicoService.create(newTutor as any);
      fetchTutores();
    } catch (error) {
      console.error("Error creating tutor:", error);
    }
  };

  const updateTutor = async (id: number, data: UpdateTutorData) => {
    try {
      await tutoresAcademicoService.update(id, data as any);
      fetchTutores();
    } catch (error) {
      console.error("Error updating tutor:", error);
    }
  };

  const deleteTutor = async (id: number) => {
    try {
      await tutoresAcademicoService.delete(id);
      fetchTutores();
    } catch (error) {
      console.error("Error deleting tutor:", error);
    }
  };

  const restoreTutor = async (id: number) => {
    console.warn("Restore not implemented for tutores academicos");
  };

  const permanentlyDeleteTutor = async (id: number) => {
    try {
      await tutoresAcademicoService.delete(id); // Use standard delete
      fetchTutores();
    } catch (error) {
      console.error("Error permanently deleting tutor:", error);
    }
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
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
    fetchAllForExport,
  };
};
