'use client';

import { useState, useMemo } from "react";
import type { Tutor, TutorStats, CreateTutorData } from "../types";
import { initialTutorData } from "../types/mockData";

export const useTutores = () => {
  const [tutores, setTutores] = useState<Tutor[]>(initialTutorData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter logic
  const filteredTutores = useMemo(() => {
    return tutores.filter((tutor) => {
      const matchesSearch =
        tutor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.especialidadTecnica.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.areaAsignada.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" || tutor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tutores, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedTutores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTutores.slice(startIndex, endIndex);
  }, [filteredTutores, currentPage]);

  const totalPages = Math.ceil(filteredTutores.length / itemsPerPage);

  const resetPage = () => {
    setCurrentPage(1);
  };

  // Stats calculation
  const stats: TutorStats = useMemo(() => {
    return {
      total: tutores.length,
      activos: tutores.filter(t => t.status === "active").length,
      pendientes: tutores.filter(t => t.status === "pending").length,
      inhabilitados: tutores.filter(t => t.status === "deleted").length,
    };
  }, [tutores]);

  // CRUD operations
  const addTutor = (newTutor: CreateTutorData) => {
    const tutor: Tutor = {
      ...newTutor,
      id: `T-${Date.now()}`,
      status: "pending",
    };
    setTutores([...tutores, tutor]);
  };

  const updateTutor = (updatedTutor: Tutor) => {
    setTutores(tutores.map((t) => (t.id === updatedTutor.id ? updatedTutor : t)));
  };

  const formatDate = (date?: Date) => date?.toLocaleDateString('es-ES');

  const deleteTutor = (id: string) => {
    setTutores(
      tutores.map((t) =>
        t.id === id ? { ...t, status: "deleted", deletedAt: formatDate(new Date()) } : t
      )
    );
  };

  const restoreTutor = (id: string) => {
    setTutores(
      tutores.map((t) =>
        t.id === id ? { ...t, status: "active", deletedAt: undefined } : t
      )
    );
  };

  const permanentlyDeleteTutor = (id: string) => {
    setTutores(tutores.filter((t) => t.id !== id));
  };

  return {
    tutores,
    filteredTutores,
    paginatedTutores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
  };
};
