'use client';

import { useState, useMemo } from "react";
import type { Plaza, PlazaStats } from "../types";

const centrosDisponibles = ["Centro Norte", "Taller Central", "Planta 1"];
const titulosDisponibles = ["Desarrollador", "Analista", "Operario", "Supervisor"];

export const usePlazas = (initialData: Plaza[]) => {
  const [plazas, setPlazas] = useState<Plaza[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab] = useState<string>("todas");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterTaller] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredPlazas = useMemo(() => {
    return plazas.filter((plaza) => {
      const matchesSearch =
        plaza.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plaza.centro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plaza.taller &&
          plaza.taller.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTab =
        activeTab === "todas" ||
        plaza.estado.toLowerCase() === activeTab.toLowerCase();

      const matchesFilter =
        filterEstado === "todos" || plaza.estado === filterEstado;

      const matchesTaller =
        filterTaller === "todos" || plaza.taller === filterTaller;

      return matchesSearch && matchesTab && matchesFilter && matchesTaller;
    });
  }, [plazas, searchTerm, activeTab, filterEstado, filterTaller]);

  // Pagination logic
  const paginatedPlazas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPlazas.slice(startIndex, endIndex);
  }, [filteredPlazas, currentPage]);

  const totalPages = Math.ceil(filteredPlazas.length / itemsPerPage);

  const resetPage = () => {
    setCurrentPage(1);
  };

  const stats = useMemo(
    (): PlazaStats => ({
      total: plazas.length,
      activas: plazas.filter((p) => p.estado === "Activa").length,
      ocupadas: plazas.filter((p) => p.estado === "Ocupada").length,
      inhabilitada: plazas.filter((p) => p.estado === "Inhabilitada").length,
    }),
    [plazas]
  );

  const addPlaza = (newPlaza: Omit<Plaza, "id" | "fechaCreacion">) => {
    const plaza: Plaza = {
      ...newPlaza,
      id: Date.now(),
      fechaCreacion: new Date().toISOString().split("T")[0],
    };
    setPlazas([...plazas, plaza]);
  };

  const updatePlaza = (updatedPlaza: Plaza) => {
    setPlazas(plazas.map((p) => (p.id === updatedPlaza.id ? updatedPlaza : p)));
  };

  const deletePlaza = (id: number) => {
    setPlazas(plazas.filter((p) => p.id !== id));
  };

  return {
    plazas,
    filteredPlazas,
    paginatedPlazas,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPlaza,
    updatePlaza,
    deletePlaza,
    centrosDisponibles,
    titulosDisponibles,
  };
};
