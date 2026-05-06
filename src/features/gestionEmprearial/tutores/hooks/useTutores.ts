'use client';

import { useState, useCallback, useEffect } from "react";
import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";
import { tutorService } from "../services/tutorService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useTutores = () => {
  const [paginatedTutores, setPaginatedTutores] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const { user, userRole } = useAuth();
  const tallerId = user?.taller?.id ?? null;

  const fetchTutores = useCallback(async () => {
    try {
      const filters: Record<string, string | number | boolean | undefined> = {
        search: searchTerm || undefined,
        estado: statusFilter,
      };

      if (userRole === "TUTOR ACADEMICO" && tallerId) {
        filters.id_taller = String(tallerId);
      }

      const response = await tutorService.getTutoresPaginated(
        currentPage,
        itemsPerPage,
        filters
      );
      if (response.success) {
        setPaginatedTutores(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching tutores:", error);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, userRole, tallerId]);

  const fetchAllForExport = useCallback(async () => {
    try {
      const filters: Record<string, string | number | boolean | undefined> = {
        estado: statusFilter,
      };

      if (userRole === "TUTOR ACADEMICO" && tallerId) {
        filters.id_taller = String(tallerId);
      }

      return await tutorService.exportTutoresToCSV(filters);
    } catch (error) {
      console.error("Error fetching export:", error);
      return null;
    }
  }, [statusFilter, userRole, tallerId]);

  useEffect(() => {
    const loadData = async () => {
      await fetchTutores();
    };
    loadData();
  }, [fetchTutores]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addTutor = async (newTutor: CreateTutorData) => {
    try {
      await tutorService.createTutor(newTutor);
      await fetchTutores();
      return true;
    } catch (error) {
      console.error("Error creating tutor:", error);
      return false;
    }
  };

  const updateTutor = async (id: string, data: UpdateTutorData) => {
    try {
      await tutorService.updateTutor(id, data);
      await fetchTutores();
      return true;
    } catch (error) {
      console.error("Error updating tutor:", error);
      return false;
    }
  };

  const deleteTutor = async (id: string) => {
    try {
      await tutorService.deleteTutor(id);
      fetchTutores();
    } catch (error) {
      console.error("Error deleting tutor:", error);
    }
  };

  const restoreTutor = async (id: string) => {
    try {
      await tutorService.restoreTutor(id);
      fetchTutores();
    } catch (error) {
      console.error("Error restoring tutor:", error);
    }
  };

  const permanentlyDeleteTutor = async (id: string) => {
    try {
      await tutorService.permanentlyDeleteTutor(id);
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
