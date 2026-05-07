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
  const [stats, setStats] = useState({ total: 0, activos: 0, pendientes: 0, inhabilitados: 0 });
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
    } catch (err) {
      console.error("Error fetching tutores académicos:", err);
      setError(err instanceof Error ? err.message : "Error al cargar tutores");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const [activosRes, pendientesRes, inhabilitadosRes] = await Promise.all([
        tutoresAcademicoService.getAll({ estado: "active", pageSize: 1 }),
        tutoresAcademicoService.getAll({ estado: "pending", pageSize: 1 }),
        tutoresAcademicoService.getAll({ estado: "deleted", pageSize: 1 }),
      ]);
      
      const activos = activosRes.pagination?.total ?? 0;
      const pendientes = pendientesRes.pagination?.total ?? 0;
      const inhabilitados = inhabilitadosRes.pagination?.total ?? 0;
      
      setStats({
        total: activos + pendientes + inhabilitados,
        activos,
        pendientes,
        inhabilitados,
      });
    } catch (err) {
      console.error("Error fetching tutor stats:", err);
    }
  }, []);

  const fetchAllForExport = useCallback(async () => {
    console.warn("Export to CSV no implementado para tutores académicos");
    return null;
  }, []);

  useEffect(() => {
    fetchTutores();
    fetchStats();
  }, [fetchTutores, fetchStats]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addTutor = async (newTutor: CreateTutorData) => {
    try {
      await tutoresAcademicoService.create(newTutor);
      await fetchTutores();
      await fetchStats();
      toast.success("Tutor académico registrado exitosamente.");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear el tutor académico";
      toast.error(msg);
      setError(msg);
      return false;
    }
  };

  const updateTutor = async (id: string, data: UpdateTutorData) => {
    try {
      await tutoresAcademicoService.update(id, data);
      setStatusFilter("todos");
      setCurrentPage(1);
      toast.success("Tutor académico actualizado exitosamente.");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al actualizar el tutor académico";
      toast.error(msg);
      setError(msg);
      return false;
    }
  };

  const deleteTutor = async (id: string) => {
    try {
      await tutoresAcademicoService.delete(id);
      await fetchTutores();
      await fetchStats();
      toast.success("Tutor académico eliminado exitosamente.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar el tutor académico";
      toast.error(msg);
      setError(msg);
      throw err;
    }
  };

  const restoreTutor = async (id: string) => {
    try {
      // Assuming there's a restore method or we just update status to active
      await tutoresAcademicoService.update(id, { estado: 'activo' });
      await fetchTutores();
      await fetchStats();
      toast.success("Tutor académico restaurado exitosamente.");
    } catch {
      toast.error("Error al restaurar tutor.");
    }
  };

  const permanentlyDeleteTutor = async (id: string) => {
    await deleteTutor(id);
  };

  /** Bulk import: create multiple tutors, refresh at the end */
  const bulkImportTutores = async (rows: CreateTutorData[]): Promise<{ success: number; errors: number; firstError?: string }> => {
    let successCount = 0;
    let errorCount = 0;
    let firstErrorMsg: string | undefined = undefined;

    const chunkSize = 5;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(row => tutoresAcademicoService.create(row))
      );
      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value.success !== false) {
          successCount++;
        } else {
          errorCount++;
          const reason = r.status === 'rejected' 
            ? (r.reason instanceof Error ? r.reason.message : String(r.reason))
            : (r.value.message || "Error desconocido");
          if (!firstErrorMsg) firstErrorMsg = reason;
        }
      });
    }

    await fetchTutores();
    await fetchStats();
    return { success: successCount, errors: errorCount, firstError: firstErrorMsg };
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
    isLoading: loading,
    error,
    stats,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
    fetchAllForExport,
    bulkImportTutores,
    refetch: () => { fetchTutores(); fetchStats(); },
  };
};
