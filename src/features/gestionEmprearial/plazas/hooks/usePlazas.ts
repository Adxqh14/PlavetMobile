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
import { talleresService } from "../../../gestionAcademica/talleres/services/talleresService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export interface CentroOption {
  id: number;
  nombre: string;
}

export interface TallerOption {
  id: string;
  nombre: string;
}

export const usePlazas = () => {
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [centros, setCentros] = useState<CentroOption[]>([]);
  const [talleres, setTalleres] = useState<TallerOption[]>([]);
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
  const { user, userRole } = useAuth();
  
  const fetchPlazas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page: currentPage,
        pageSize: itemsPerPage,
        search: searchTerm || undefined,
        estado: filterEstado !== "todos" ? filterEstado : undefined,
      };

      // Filtrar por taller si es Tutor Académico
      if (userRole === "TUTOR ACADEMICO" && user?.taller) {
        params.taller = String(user.taller.id);
      }

      const response = await fetchPlazasPaginated(params);
      if (response.success) {
        setPlazas(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al cargar plazas";
      console.error("Error fetching plazas:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterEstado, userRole, user?.taller]);

  // ── Fetch global stats ────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const params: Record<string, string | number | boolean | undefined> = { pageSize: 1000 };
      if (userRole === "TUTOR ACADEMICO" && user?.taller) {
        params.taller = String(user.taller.id);
      }
      
      const response = await fetchPlazasPaginated(params);
      
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
  }, [userRole, user?.taller]);

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

  // ── Fetch talleres for the form selects ────────────────────────────────
  const fetchTalleres = useCallback(async () => {
    try {
      const response = await talleresService.getAll({ pageSize: 200 });
      setTalleres(response.data.map((t) => ({ id: t.id, nombre: t.nombre })));
    } catch (err) {
      console.error("Error fetching talleres para select:", err);
    }
  }, []);

  useEffect(() => {
    fetchPlazas();
    fetchStats();
  }, [fetchPlazas, fetchStats]);

  useEffect(() => {
    fetchCentros();
    fetchTalleres();
  }, [fetchCentros, fetchTalleres]);

  const resetPage = () => setCurrentPage(1);

  // ── CRUD ──────────────────────────────────────────────────────────────
  const addPlaza = async (newPlaza: CreatePlazaData) => {
    try {
      await createPlaza(newPlaza);
      await Promise.all([fetchPlazas(), fetchStats()]);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al crear plaza";
      console.error("Error creating plaza:", err);
      setError(errorMsg);
      return false;
    }
  };

  const updatePlaza = async (updatedPlaza: Plaza) => {
    try {
      await updatePlazaApi(updatedPlaza);
      await Promise.all([fetchPlazas(), fetchStats()]);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar plaza";
      console.error("Error updating plaza:", err);
      setError(errorMsg);
      return false;
    }
  };

  const deletePlaza = async (id: number) => {
    try {
      await deletePlazaApi(id);
      await fetchPlazas();
      await fetchStats();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al eliminar plaza";
      console.error("Error deleting plaza:", err);
      setError(errorMsg);
    }
  };

  return {
    plazas,
    filteredPlazas: plazas,   // server-side filtering
    paginatedPlazas: plazas,  // server-side pagination
    centros,
    talleres,
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
