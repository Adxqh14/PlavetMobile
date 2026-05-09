'use client';

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { CentroTrabajo, CentroStats, CreateCentroData } from "../types";
import { centroTrabajoService } from "../services/centroTrabajoService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useCentroTrabajo = () => {
  const [centros, setCentros] = useState<CentroTrabajo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState<CentroStats>({
    total: 0,
    activos: 0,
    validados: 0,
    pendientes: 0,
    archivados: 0,
  });
  const itemsPerPage = 10;

  const { user, userRole } = useAuth();

  const fetchCentros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: statusFilter !== "todos" ? statusFilter : undefined,
      };

      if (userRole === "TUTOR ACADEMICO" && user?.taller) {
        params.id_taller = String(user.taller.id);
      }

      const response = await centroTrabajoService.getAll(params);
      if (response.success) {
        setCentros(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al cargar centros de trabajo";
      console.error("Error fetching centros:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, userRole, user?.taller]);

  // Fetch stats trayendo todos los centros y contando en memoria.
  // El backend no soporta filtro por validacion, así que no podemos usar
  // llamadas separadas para validados/pendientes.
  const fetchStats = useCallback(async () => {
    try {
      const params: Record<string, string | number | boolean | undefined> = { pageSize: 1000 };
      if (userRole === "TUTOR ACADEMICO" && user?.taller) {
        params.id_taller = String(user.taller.id);
      }
      const response = await centroTrabajoService.getAll(params);
      if (!response.success) return;

      const all = response.data;
      const total = response.pagination?.total || all.length;
      const activos = all.filter((c) => c.status === "activo").length;
      const validados = all.filter((c) => c.validated === true).length;
      const pendientes = all.filter((c) => c.validated === false && c.status !== "inactivo").length;
      const archivados = all.filter((c) => c.status === "inactivo").length;

      setStats({ total, activos, validados, pendientes, archivados });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [userRole, user?.taller]);

  useEffect(() => {
    fetchCentros();
  }, [fetchCentros]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const addCentro = async (
    newCentro: CreateCentroData
  ) => {
    try {
      await centroTrabajoService.create(newCentro);
      await fetchCentros();
      await fetchStats();
      toast.success("Centro de trabajo registrado exitosamente.");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear el centro de trabajo";
      toast.error(msg);
      return false;
    }
  };

  // updateCentro: calls PATCH then refreshes
  const updateCentro = async (updatedCentro: CentroTrabajo) => {
    try {
      await centroTrabajoService.update(updatedCentro.id, updatedCentro);
      await fetchCentros();
      await fetchStats();
      toast.success("Centro de trabajo actualizado.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar el centro de trabajo";
      toast.error(msg);
    }
  };

  // deleteCentro: backend DELETE (soft-delete on server)
  const deleteCentro = async (id: string) => {
    try {
      await centroTrabajoService.delete(id);
      await fetchCentros();
      await fetchStats();
      toast.success("Centro de trabajo eliminado.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar el centro de trabajo";
      toast.error(msg);
    }
  };

  const restoreCentro = async (id: string) => {
    console.debug("restoreCentro called for id:", id);
    await fetchCentros();
    await fetchStats();
  };

  // permanentlyDeleteCentro: hard delete
  const permanentlyDeleteCentro = async (id: string) => {
    try {
      await centroTrabajoService.delete(id);
      await fetchCentros();
      await fetchStats();
      toast.success("Centro eliminado permanentemente.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar permanentemente el centro";
      toast.error(msg);
    }
  };

  // bulkImportCentros: create multiple centers in chunks
  const bulkImportCentros = async (rows: CreateCentroData[]): Promise<{ success: number; errors: number; firstError?: string }> => {
    let successCount = 0;
    let errorCount = 0;
    let firstErrorMsg: string | undefined = undefined;

    const chunkSize = 5;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(row => centroTrabajoService.create(row))
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

    await Promise.all([fetchCentros(), fetchStats()]);
    return { success: successCount, errors: errorCount, firstError: firstErrorMsg };
  };

  return {
    centros,
    filteredCentros: centros,
    paginatedCentros: centros,
    currentPage,
    totalPages,
    totalCount,
    setCurrentPage,
    resetPage,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addCentro,
    updateCentro,
    deleteCentro,
    restoreCentro,
    permanentlyDeleteCentro,
    bulkImportCentros,
    refetch: fetchCentros,
  };
};
