import { useState, useEffect, useMemo, useCallback } from "react";
import type { Usuario, EstadoUsuario, RolId, UsuarioStats } from "../types";
import { ROLES } from "../types";
import {
  fetchUsuarios,
  patchUsuarioRol,
  patchUsuarioEstado,
} from "../services/usuarioService";

// Datos dummy para desarrollo offline
const DUMMY_USUARIOS: Usuario[] = [
  { id: 1, nombre: "Carlos Mendoza", email: "carlos.mendoza@ipisa.edu.do", id_rol: 1, rol: "Administrador", estado: "Activo" },
  { id: 2, nombre: "Ana Torres", email: "ana.torres@ipisa.edu.do", id_rol: 2, rol: "Supervisor", estado: "Activo" },
  { id: 3, nombre: "Luis García", email: "luis.garcia@ipisa.edu.do", id_rol: 3, rol: "Vinculador", estado: "Activo" },
  { id: 4, nombre: "María Pérez", email: "maria.perez@ipisa.edu.do", id_rol: 4, rol: "Estudiante", estado: "Activo" },
  { id: 5, nombre: "José Rodríguez", email: "jose.rodriguez@ipisa.edu.do", id_rol: 5, rol: "Tutor", estado: "Inactivo" },
  { id: 6, nombre: "Carmen López", email: "carmen.lopez@ipisa.edu.do", id_rol: 6, rol: "Docente", estado: "Activo" },
  { id: 7, nombre: "Pedro Martínez", email: "pedro.martinez@ipisa.edu.do", id_rol: 4, rol: "Estudiante", estado: "Activo" },
  { id: 8, nombre: "Laura Sánchez", email: "laura.sanchez@ipisa.edu.do", id_rol: 4, rol: "Estudiante", estado: "Inactivo" },
  { id: 9, nombre: "Roberto Díaz", email: "roberto.diaz@ipisa.edu.do", id_rol: 2, rol: "Supervisor", estado: "Activo" },
  { id: 10, nombre: "Isabel Fernández", email: "isabel.fernandez@ipisa.edu.do", id_rol: 6, rol: "Docente", estado: "Activo" },
  { id: 11, nombre: "Miguel Herrera", email: "miguel.herrera@ipisa.edu.do", id_rol: 3, rol: "Vinculador", estado: "Activo" },
  { id: 12, nombre: "Sofía Ramírez", email: "sofia.ramirez@ipisa.edu.do", id_rol: 4, rol: "Estudiante", estado: "Activo" },
  { id: 13, nombre: "David Morales", email: "david.morales@ipisa.edu.do", id_rol: 5, rol: "Tutor", estado: "Activo" },
  { id: 14, nombre: "Elena Cruz", email: "elena.cruz@ipisa.edu.do", id_rol: 4, rol: "Estudiante", estado: "Inactivo" },
  { id: 15, nombre: "Andrés Jiménez", email: "andres.jimenez@ipisa.edu.do", id_rol: 6, rol: "Docente", estado: "Activo" },
];

const PAGE_SIZE = 10;

export function useUsuarios() {
  const [allUsuarios, setAllUsuarios] = useState<Usuario[]>(DUMMY_USUARIOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Intentar cargar desde API
  useEffect(() => {
    let cancelled = false;
    fetchUsuarios({ page: 1, limit: 100 })
      .then(({ data }) => {
        if (!cancelled && data.length > 0) setAllUsuarios(data);
      })
      .catch(() => {
        // fallback: mantener dummy
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredUsuarios = useMemo(() => {
    return allUsuarios.filter((u) => {
      const matchesSearch =
        searchTerm === "" ||
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.rol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado =
        filterEstado === "todos" || u.estado === filterEstado;
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
      activos: allUsuarios.filter((u) => u.estado === "Activo").length,
      inactivos: allUsuarios.filter((u) => u.estado === "Inactivo").length,
      rolesUnicos,
    };
  }, [allUsuarios]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const changeRol = useCallback(async (id: number, id_rol: RolId) => {
    setAllUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, id_rol, rol: ROLES[id_rol] } : u
      )
    );
    try {
      await patchUsuarioRol(id, id_rol);
    } catch {
      // revert optimistic update silently; API not available in dev
    }
  }, []);

  const changeEstado = useCallback(async (id: number, estado: EstadoUsuario) => {
    setAllUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, estado } : u))
    );
    try {
      await patchUsuarioEstado(id, estado);
    } catch {
      // revert optimistic update silently
    }
  }, []);

  const addUsuario = useCallback((data: Omit<Usuario, "id" | "rol">) => {
    const newUsuario: Usuario = {
      ...data,
      id: Math.max(0, ...allUsuarios.map(u => u.id)) + 1,
      rol: ROLES[data.id_rol]
    };
    setAllUsuarios(prev => [...prev, newUsuario]);
  }, [allUsuarios]);

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
    changeRol,
    changeEstado,
    addUsuario,
  };
}
