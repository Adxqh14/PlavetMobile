'use client';

import { useState, useCallback, useEffect } from "react";
import type { CentroTrabajo, CentroStats, CreateCentroData } from "../types";
import { centroTrabajoService } from "../services/centroTrabajoService";

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

  const fetchCentros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await centroTrabajoService.getAll({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: statusFilter !== "todos" ? statusFilter : undefined,
      });
      if (response.success) {
        setCentros(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      }
    } catch (err: any) {
      console.error("Error fetching centros:", err);
      setError(err?.message || "Error al cargar centros de trabajo");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  // Fetch stats by calling API for each estado
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, activosRes, pendientesRes, archivadosRes] =
        await Promise.allSettled([
          centroTrabajoService.getAll({ pageSize: 1 }),
          centroTrabajoService.getAll({ pageSize: 1, estado: "activo" }),
          centroTrabajoService.getAll({ pageSize: 1, estado: "pending" }),
          centroTrabajoService.getAll({ pageSize: 1, estado: "inactivo" }),
        ]);

      const total =
        allRes.status === "fulfilled" ? allRes.value.pagination?.total || 0 : 0;
      const activos =
        activosRes.status === "fulfilled"
          ? activosRes.value.pagination?.total || 0
          : 0;
      const pendientes =
        pendientesRes.status === "fulfilled"
          ? pendientesRes.value.pagination?.total || 0
          : 0;
      const archivados =
        archivadosRes.status === "fulfilled"
          ? archivadosRes.value.pagination?.total || 0
          : 0;

      setStats({
        total,
        activos,
        validados: activos, // proxy: activos ≈ validados
        pendientes,
        archivados,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

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
    newCentro: any
  ) => {
    try {
      await centroTrabajoService.create(newCentro);
      await fetchCentros();
      await fetchStats();
      return true;
    } catch (err: any) {
      console.error("Error creating centro:", err);
      setError(err?.message || "Error al crear el centro de trabajo");
      return false;
    }
  };

  // updateCentro: calls PATCH then refreshes
  const updateCentro = async (updatedCentro: CentroTrabajo) => {
    try {
      await centroTrabajoService.update(updatedCentro.id, updatedCentro);
      await fetchCentros();
      await fetchStats();
    } catch (err: any) {
      console.error("Error updating centro:", err);
      setError(err?.message || "Error al actualizar el centro de trabajo");
    }
  };

  // deleteCentro: backend DELETE (soft-delete on server)
  const deleteCentro = async (id: string) => {
    try {
      await centroTrabajoService.delete(id);
      await fetchCentros();
      await fetchStats();
    } catch (err: any) {
      console.error("Error deleting centro:", err);
      setError(err?.message || "Error al eliminar el centro de trabajo");
    }
  };

  // restoreCentro: refresh after restore attempt
  const restoreCentro = async (_id: string) => {
    await fetchCentros();
    await fetchStats();
  };

  // permanentlyDeleteCentro: hard delete
  const permanentlyDeleteCentro = async (id: string) => {
    try {
      await centroTrabajoService.delete(id);
      await fetchCentros();
      await fetchStats();
    } catch (err: any) {
      console.error("Error permanently deleting centro:", err);
      setError(err?.message || "Error al eliminar permanentemente el centro");
    }
  };

  return {
    centros,
    filteredCentros: centros,   // server-side filtering
    paginatedCentros: centros,  // server-side pagination
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
    refetch: fetchCentros,
  };
};
