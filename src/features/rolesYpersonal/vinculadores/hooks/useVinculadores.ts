'use client';

import { useState, useMemo } from "react";
import type { Vinculador, VinculadorStats, CreateVinculadorData } from "../types";
import { initialVinculadorData } from "../types/mockData";

export const useVinculadores = () => {
  const [vinculadores, setVinculadores] = useState<Vinculador[]>(initialVinculadorData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter logic
  const filteredVinculadores = useMemo(() => {
    return vinculadores.filter((vinculador) => {
      const matchesSearch =
        vinculador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vinculador.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vinculador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vinculador.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vinculador.areaAsignada.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" || vinculador.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [vinculadores, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedVinculadores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVinculadores.slice(startIndex, endIndex);
  }, [filteredVinculadores, currentPage]);

  const totalPages = Math.ceil(filteredVinculadores.length / itemsPerPage);

  const resetPage = () => {
    setCurrentPage(1);
  };

  // Stats calculation
  const stats: VinculadorStats = useMemo(() => {
    return {
      total: vinculadores.length,
      activos: vinculadores.filter(v => v.status === "active").length,
      pendientes: vinculadores.filter(v => v.status === "pending").length,
      inhabilitados: vinculadores.filter(v => v.status === "deleted").length,
    };
  }, [vinculadores]);

  // CRUD operations
  const addVinculador = (newVinculador: CreateVinculadorData) => {
    const vinculador: Vinculador = {
      ...newVinculador,
      id: `V-${Date.now()}`,
      status: "pending",
      fecha_creacion: new Date().toISOString().split('T')[0],
    };
    setVinculadores([...vinculadores, vinculador]);
  };

  const updateVinculador = (updatedVinculador: Vinculador) => {
    setVinculadores(vinculadores.map((v) => (v.id === updatedVinculador.id ? updatedVinculador : v)));
  };

  const formatDate = (date?: Date) => date?.toLocaleDateString('es-ES');

  const deleteVinculador = (id: string) => {
    setVinculadores(
      vinculadores.map((v) =>
        v.id === id ? { ...v, status: "deleted", deletedAt: formatDate(new Date()) } : v
      )
    );
  };

  const restoreVinculador = (id: string) => {
    setVinculadores(
      vinculadores.map((v) =>
        v.id === id ? { ...v, status: "active", deletedAt: undefined } : v
      )
    );
  };

  const permanentlyDeleteVinculador = (id: string) => {
    setVinculadores(vinculadores.filter((v) => v.id !== id));
  };

  return {
    vinculadores,
    filteredVinculadores,
    paginatedVinculadores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addVinculador,
    updateVinculador,
    deleteVinculador,
    restoreVinculador,
    permanentlyDeleteVinculador,
  };
};
