import { useState, useEffect, useMemo, useCallback } from "react";
import type { Usuario, UsuarioStats } from "../types";
import { getNombreCompleto } from "../types";
import { fetchUsuarios } from "../services/usuarioService";

const PAGE_SIZE = 10;

export function useUsuarios() {
  const [allUsuarios, setAllUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchUsuarios()
      .then(({ data }) => {
        if (!cancelled) setAllUsuarios(data);
      })
      .catch(() => {
        // mantener lista vacía si falla
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchKey]);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  const filteredUsuarios = useMemo(() => {
    return allUsuarios.filter((u) => {
      const nombreCompleto = getNombreCompleto(u).toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        nombreCompleto.includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.rol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado =
        filterEstado === "todos" ||
        u.estado.toLowerCase() === filterEstado.toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [allUsuarios, searchTerm, filterEstado]);

  const totalPages = Math.max(1, Math.ceil(filteredUsuarios.length / PAGE_SIZE));

  const paginatedUsuarios = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsuarios.slice(start, start + PAGE_SIZE);
  }, [filteredUsuarios, currentPage]);

  const stats: UsuarioStats = useMemo(() => {
    const rolesUnicos = new Set(allUsuarios.map((u) => u.id_rol)).size;
    return {
      total: allUsuarios.length,
      activos: allUsuarios.filter((u) => u.estado.toLowerCase() === "activo").length,
      inactivos: allUsuarios.filter((u) => u.estado.toLowerCase() === "inactivo").length,
      rolesUnicos,
    };
  }, [allUsuarios]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const deleteUsuario = useCallback((id: string) => {
    setAllUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estado: "Inactivo" } : u))
    );
  }, []);

  return {
    filteredUsuarios,
    paginatedUsuarios,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    isLoading,
    deleteUsuario,
    refetch,
  };
}
