'use client';

import { useState, useMemo } from "react";
import type { CentroTrabajo, CentroStats } from "../types";
import { initialData } from "../types/mockData";

export const useCentroTrabajo = () => {
  const [centros, setCentros] = useState<CentroTrabajo[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredCentros = useMemo(() => {
    return centros.filter((centro) => {
      const matchesSearch =
        centro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centro.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        statusFilter === "todos" || centro.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [centros, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedCentros = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCentros.slice(startIndex, endIndex);
  }, [filteredCentros, currentPage]);

  const totalPages = Math.ceil(filteredCentros.length / itemsPerPage);

  const resetPage = () => {
    setCurrentPage(1);
  };

  // Stats calculation
  const stats: CentroStats = useMemo(() => {
    return {
      total: centros.length,
      activos: centros.filter(c => c.status === "active").length,
      validados: centros.filter(c => c.validated).length,
      pendientes: centros.filter(c => c.status === "pending").length,
      archivados: centros.filter(c => c.status === "deleted").length,
    };
  }, [centros]);

  // CRUD operations
  const addCentro = (newCentro: Omit<CentroTrabajo, "id" | "createdAt">) => {
    const centro: CentroTrabajo = {
      ...newCentro,
      id: `CT-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('es-ES'),
    };
    setCentros([...centros, centro]);
  };

  const updateCentro = (updatedCentro: CentroTrabajo) => {
    setCentros(centros.map((c) => (c.id === updatedCentro.id ? updatedCentro : c)));
  };

  const deleteCentro = (id: string) => {
    setCentros(
      centros.map((c) =>
        c.id === id ? { ...c, status: "deleted", deletedAt: new Date().toLocaleDateString('es-ES') } : c
      )
    );
  };

  const restoreCentro = (id: string) => {
    setCentros(
      centros.map((c) =>
        c.id === id ? { ...c, status: "active", deletedAt: undefined } : c
      )
    );
  };

  const permanentlyDeleteCentro = (id: string) => {
    setCentros(centros.filter((c) => c.id !== id));
  };

  return {
    centros,
    filteredCentros,
    paginatedCentros,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addCentro,
    updateCentro,
    deleteCentro,
    restoreCentro,
    permanentlyDeleteCentro,
  };
};
