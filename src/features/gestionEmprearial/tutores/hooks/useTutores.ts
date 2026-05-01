'use client';

import { useState, useCallback, useEffect } from "react";
import type { Tutor, CreateTutorData, UpdateTutorData } from "../types";
import { tutorService } from "../services/tutorService";

export const useTutores = () => {
  const [paginatedTutores, setPaginatedTutores] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const fetchTutores = useCallback(async () => {
    try {
      const response = await tutorService.getTutoresPaginated(
        currentPage,
        itemsPerPage,
        {
          search: searchTerm || undefined,
          estado: statusFilter,
        }
      );
      if (response.success) {
        setPaginatedTutores(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching tutores:", error);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchAllForExport = useCallback(async () => {
    try {
      return await tutorService.exportTutoresToCSV({
        estado: statusFilter,
      });
    } catch (error) {
      console.error("Error fetching export:", error);
      return null;
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTutores();
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

  const updateTutor = async (id: number, data: UpdateTutorData) => {
    try {
      await tutorService.updateTutor(id, data);
      await fetchTutores();
      return true;
    } catch (error) {
      console.error("Error updating tutor:", error);
      return false;
    }
  };

  const deleteTutor = async (id: number) => {
    try {
      await tutorService.deleteTutor(id);
      fetchTutores();
    } catch (error) {
      console.error("Error deleting tutor:", error);
    }
  };

  const restoreTutor = async (id: number) => {
    try {
      await tutorService.restoreTutor(id);
      fetchTutores();
    } catch (error) {
      console.error("Error restoring tutor:", error);
    }
  };

  const permanentlyDeleteTutor = async (id: number) => {
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
