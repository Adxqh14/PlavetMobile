'use client';

import { useState, useMemo } from "react";
import type { Pasantia, PasantiaStats } from "../types";

export const usePasantias = (initialData: Pasantia[]) => {
  const [pasantias, setPasantias] = useState<Pasantia[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredPasantias = useMemo(() => {
    return pasantias.filter((pasantia) => {
      const matchesSearch =
        pasantia.estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pasantia.matricula.includes(searchTerm) ||
        pasantia.plazaAsignada.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pasantia.centroTrabajo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterEstado === "todos" || pasantia.estado === filterEstado;

      return matchesSearch && matchesFilter;
    });
  }, [pasantias, searchTerm, filterEstado]);

  // Pagination logic
  const paginatedPasantias = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPasantias.slice(startIndex, endIndex);
  }, [filteredPasantias, currentPage]);

  const totalPages = Math.ceil(filteredPasantias.length / itemsPerPage);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const stats = useMemo(
    (): PasantiaStats => ({
      total: pasantias.length,
      activas: pasantias.filter((p) => p.estado === "activa").length,
      completadas: pasantias.filter((p) => p.estado === "completada").length,
      pendientes: pasantias.filter((p) => p.estado === "pendiente").length,
      suspendidas: pasantias.filter((p) => p.estado === "suspendida").length,
    }),
    [pasantias]
  );

  const addPasantia = (newPasantia: Omit<Pasantia, "id" | "horasCompletadas">) => {
    const pasantia: Pasantia = {
      ...newPasantia,
      id: `PAS-${String(pasantias.length + 1).padStart(3, "0")}`,
      horasCompletadas: 0,
    };
    setPasantias([...pasantias, pasantia]);
  };

  const updatePasantia = (updatedPasantia: Pasantia) => {
    setPasantias(pasantias.map((p) => (p.id === updatedPasantia.id ? updatedPasantia : p)));
  };

  const deletePasantia = (id: string) => {
    setPasantias(pasantias.filter((p) => p.id !== id));
  };

  const updateEstado = (id: string, nuevoEstado: Pasantia["estado"]) => {
    setPasantias(pasantias.map(p => 
      p.id === id ? { ...p, estado: nuevoEstado } : p
    ));
  };

  return {
    pasantias,
    filteredPasantias,
    paginatedPasantias,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPasantia,
    updatePasantia,
    deletePasantia,
    updateEstado,
  };
};
