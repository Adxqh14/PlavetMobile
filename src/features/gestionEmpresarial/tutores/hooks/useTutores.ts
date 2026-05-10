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
  const [isLoading, setIsLoading] = useState(false);

  const { user, userRole } = useAuth();
  const tallerId = user?.taller?.id ?? null;

  const fetchTutores = useCallback(async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await tutorService.getTutoresPaginated(1, 1000, { id_taller: tallerId ? String(tallerId) : undefined });
      if (response.success) {
        const all = response.data;
        setStats({
          total: all.length,
          activos: all.filter(t => t.estado === "Activo").length,
          inactivos: all.filter(t => t.estado === "Inactivo").length
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [tallerId]);

  useEffect(() => {
    fetchTutores();
    fetchStats();
  }, [fetchTutores, fetchStats]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addTutor = async (newTutor: CreateTutorData) => {
    try {
      await tutorService.createTutor(newTutor);
      await Promise.all([fetchTutores(), fetchStats()]);
      return true;
    } catch (error) {
      console.error("Error creating tutor:", error);
      return false;
    }
  };

  const updateTutor = async (id: string, data: UpdateTutorData) => {
    try {
      await tutorService.updateTutor(id, data);
      await Promise.all([fetchTutores(), fetchStats()]);
      return true;
    } catch (error) {
      console.error("Error updating tutor:", error);
      return false;
    }
  };

  const deleteTutor = async (id: string) => {
    try {
      await tutorService.deleteTutor(id);
      await Promise.all([fetchTutores(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting tutor:", error);
    }
  };

  const restoreTutor = async (id: string) => {
    try {
      await tutorService.restoreTutor(id);
      await Promise.all([fetchTutores(), fetchStats()]);
    } catch (error) {
      console.error("Error restoring tutor:", error);
    }
  };

  const permanentlyDeleteTutor = async (id: string) => {
    try {
      await tutorService.permanentlyDeleteTutor(id);
      await Promise.all([fetchTutores(), fetchStats()]);
    } catch (error) {
      console.error("Error permanently deleting tutor:", error);
    }
  };

  const bulkImportTutores = async (rows: CreateTutorData[]): Promise<{ success: number; errors: number; firstError?: string }> => {
    let successCount = 0;
    let errorCount = 0;
    let firstErrorMsg: string | undefined = undefined;

    const chunkSize = 5;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(row => tutorService.createTutor(row))
      );
      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          successCount++;
        } else {
          errorCount++;
          const reason = r.reason instanceof Error ? r.reason.message : String(r.reason);
          if (!firstErrorMsg) firstErrorMsg = reason;
        }
      });
    }

    await Promise.all([fetchTutores(), fetchStats()]);
    return { success: successCount, errors: errorCount, firstError: firstErrorMsg };
  };

  return {
    paginatedTutores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stats,
    isLoading,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
    fetchAllForExport,
    bulkImportTutores,
    refetch: fetchTutores,
  };
};
