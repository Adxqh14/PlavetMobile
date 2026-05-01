'use client';

import { useState, useCallback, useEffect } from "react";
import type { Plaza, PlazaStats, CreatePlazaData } from "../types";
import {
  fetchPlazasPaginated,
  createPlaza,
  updatePlazaApi,
  deletePlazaApi,
} from "../services/plazaService";
import { centroTrabajoService } from "../../centroDeTrabajo/services/centroTrabajoService";

export interface CentroOption {
  id: number;
  nombre: string;
}

export const usePlazas = () => {
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [centros, setCentros] = useState<CentroOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  const [stats, setStats] = useState<PlazaStats>({
    total: 0,
    activas: 0,
    ocupadas: 0,
    inhabilitada: 0,
  });

  // ── Fetch plazas from API ───────────────────────────────────────────────
  const fetchPlazas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPlazasPaginated({
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: filterEstado !== "todos" ? filterEstado : undefined,
      });
      if (response.success) {
        setPlazas(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (err: any) {
      console.error("Error fetching plazas:", err);
      setError(err?.message || "Error al cargar plazas");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterEstado]);

  // ── Fetch global stats ────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      // Como el backend no devuelve metadata de paginación real (total global),
      // pedimos una cantidad grande para poder contar todos los registros en el cliente
      const response = await fetchPlazasPaginated({ pageSize: 1000 });
      
      if (response.success) {
        const allItems = response.data;
        setStats({
          total: allItems.length,
          activas: allItems.filter(p => p.estado === "Activa").length,
          ocupadas: allItems.filter(p => p.estado === "Ocupada").length,
          inhabilitada: allItems.filter(p => p.estado === "Inhabilitada").length,
        });
      }
    } catch (err) {
      console.error("Error fetching plaza stats:", err);
    }
  }, []);

  // ── Fetch centros de trabajo for the form selects ──────────────────────
  const fetchCentros = useCallback(async () => {
    try {
      const response = await centroTrabajoService.getAll({ pageSize: 200 });
      setCentros(
        response.data.map((c) => ({ id: Number(c.id), nombre: c.name }))
      );
    } catch (err) {
      console.error("Error fetching centros para select:", err);
    }
  }, []);

  useEffect(() => {
    fetchPlazas();
    fetchStats();
  }, [fetchPlazas, fetchStats]);

  useEffect(() => {
    fetchCentros();
  }, [fetchCentros]);

  const resetPage = () => setCurrentPage(1);

  // ── CRUD ──────────────────────────────────────────────────────────────
  const addPlaza = async (newPlaza: CreatePlazaData) => {
    try {
      await createPlaza(newPlaza);
      await Promise.all([fetchPlazas(), fetchStats()]);
      return true;
    } catch (err: any) {
      console.error("Error creating plaza:", err);
      setError(err?.message || "Error al crear plaza");
      return false;
    }
  };

  const updatePlaza = async (updatedPlaza: Plaza) => {
    try {
      await updatePlazaApi(updatedPlaza);
      await Promise.all([fetchPlazas(), fetchStats()]);
      return true;
    } catch (err: any) {
      console.error("Error updating plaza:", err);
      setError(err?.message || "Error al actualizar plaza");
      return false;
    }
  };

  const deletePlaza = async (id: number) => {
    try {
      await deletePlazaApi(id);
      await fetchPlazas();
      await fetchStats();
    } catch (err: any) {
      console.error("Error deleting plaza:", err);
      setError(err?.message || "Error al eliminar plaza");
    }
  };

  return {
    plazas,
    filteredPlazas: plazas,   // server-side filtering
    paginatedPlazas: plazas,  // server-side pagination
    centros,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPlaza,
    updatePlaza,
    deletePlaza,
    refetch: fetchPlazas,
  };
};
