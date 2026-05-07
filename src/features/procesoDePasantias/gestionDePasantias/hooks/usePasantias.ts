'use client';

import { useState, useEffect, useRef } from "react";
import { pasantiaService } from "../services/pasantiaService";
import type { Pasantia, PasantiaStats, CreatePasantiaPayload, UpdatePasantiaPayload } from "../types";

export const usePasantias = () => {
  const [pasantias, setPasantias] = useState<Pasantia[]>([]);
  const [stats, setStats] = useState<PasantiaStats>({
    total: 0,
    activas: 0,
    completadas: 0,
    pendientes: 0,
    suspendidas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 15;

  // Use a ref to hold the latest search/filter values so the effect
  // always has fresh data without stale closure issues.
  const searchRef = useRef(searchTerm);
  const filterRef = useRef(filterEstado);
  searchRef.current = searchTerm;
  filterRef.current = filterEstado;

  const fetchStats = async () => {
    try {
      const [all, activas, completadas, pendientes, suspendidas] = await Promise.all([
        pasantiaService.getAll({ pageSize: 1 }),
        pasantiaService.getAll({ pageSize: 1, estado: "activa" }),
        pasantiaService.getAll({ pageSize: 1, estado: "completada" }),
        pasantiaService.getAll({ pageSize: 1, estado: "pendiente" }),
        pasantiaService.getAll({ pageSize: 1, estado: "suspendida" }),
      ]);
      setStats({
        total: all.pagination.total,
        activas: activas.pagination.total,
        completadas: completadas.pagination.total,
        pendientes: pendientes.pagination.total,
        suspendidas: suspendidas.pagination.total,
      });
    } catch {
      // stats are non-critical, ignore errors
    }
  };

  const fetchPasantias = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const search = searchRef.current;
      const estado = filterRef.current;

      const res = await pasantiaService.getAll({
        search: search || undefined,
        estado: estado !== "todos" ? estado : undefined,
        page,
        pageSize: itemsPerPage,
      });

      setPasantias(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar pasantías");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page changes
  useEffect(() => {
    fetchPasantias(currentPage);
  }, [currentPage]); 

  // Re-fetch (resetting to page 1) when search or filter changes
  useEffect(() => {
    // If already on page 1 trigger fetch directly, otherwise resetting page
    // will trigger the page effect above.
    setCurrentPage(prev => {
      if (prev === 1) {
        fetchPasantias(1);
        return 1;
      }
      return 1; // triggers the page effect
    });
  }, [searchTerm, filterEstado]); 

  // Load stats once on mount
  useEffect(() => {
    fetchStats();
  }, []); 

  const resetPage = () => setCurrentPage(1);

  const refreshPasantias = async () => {
    await Promise.all([fetchPasantias(currentPage), fetchStats()]);
  };

  const addPasantia = async (data: CreatePasantiaPayload) => {
    await pasantiaService.create(data);
    await Promise.all([fetchPasantias(1), fetchStats()]);
    setCurrentPage(1);
  };

  const updatePasantia = async (id: string, data: UpdatePasantiaPayload) => {
    await pasantiaService.update(id, data);
    await Promise.all([fetchPasantias(currentPage), fetchStats()]);
  };

  const deletePasantia = async (id: string) => {
    await pasantiaService.delete(id);
    await Promise.all([fetchPasantias(currentPage), fetchStats()]);
  };

  const updateEstado = async (id: string, estado: Pasantia["estado"]) => {
    await pasantiaService.update(id, { estado });
    await Promise.all([fetchPasantias(currentPage), fetchStats()]);
  };

  return {
    pasantias,
    loading,
    error,
    stats,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPasantia,
    updatePasantia,
    deletePasantia,
    updateEstado,
    refreshPasantias,
  };
};
