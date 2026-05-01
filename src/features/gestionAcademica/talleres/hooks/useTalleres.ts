import { useState, useEffect, useMemo, useCallback } from "react";
import type { Taller, TallerStats, CreateTallerData } from "../types";
import { talleresService } from "../services/talleresService";

interface UseTalleresReturn {
  talleres: Taller[];
  filteredTalleres: Taller[];
  paginatedTalleres: Taller[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
  resetPage: () => void;
  stats: TallerStats;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterEstado: string;
  setFilterEstado: (estado: string) => void;
  addTaller: (data: CreateTallerData) => Promise<boolean | void>;
  updateTaller: (id: number, data: Partial<CreateTallerData>) => Promise<boolean | void>;
  deleteTaller: (id: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTalleres = (): UseTalleresReturn => {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTalleres = useCallback(async (page: number = 1, search: string = "", estado: string = "todos") => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = { page, pageSize: 15 };
      if (search.trim()) params.search = search;
      if (estado !== "todos") params.estado = estado;

      const response = await talleresService.getAll(params);
      if (response.success) {
        setTalleres(response.data);
        setTotalItems(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } else {
        setError("Error al cargar los talleres");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de conexión con el servidor";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTalleres(currentPage, searchTerm, filterEstado);
  }, [fetchTalleres, currentPage, searchTerm, filterEstado]);

  // filteredTalleres y paginatedTalleres apuntan a los datos ya paginados del backend
  const filteredTalleres = talleres;
  const paginatedTalleres = talleres;

  const stats: TallerStats = useMemo(() => ({
    total: totalItems,
    activos: talleres.filter((t) => t.estado === "Activo").length,
    inactivos: talleres.filter((t) => t.estado === "Inactivo").length,
    enMantenimiento: talleres.filter((t) => t.estado === "En Mantenimiento").length,
  }), [talleres, totalItems]);

  const resetPage = () => setCurrentPage(1);

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSetFilterEstado = (estado: string) => {
    setFilterEstado(estado);
    setCurrentPage(1);
  };

  const addTaller = async (data: CreateTallerData) => {
    setIsLoading(true);
    try {
      const response = await talleresService.create(data);
      if (response.success) {
        await fetchTalleres(currentPage, searchTerm, filterEstado);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear el taller";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaller = async (id: number, data: Partial<CreateTallerData>) => {
    setIsLoading(true);
    try {
      const response = await talleresService.update(id, data);
      if (response.success) {
        await fetchTalleres(currentPage, searchTerm, filterEstado);
        return true;
      }
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al actualizar el taller";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaller = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await talleresService.delete(id);
      if (response.success) {
        // Si era el último item de la página, retroceder una página
        const newPage = talleres.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        setCurrentPage(newPage);
        await fetchTalleres(newPage, searchTerm, filterEstado);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al eliminar el taller";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    talleres,
    filteredTalleres,
    paginatedTalleres,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filterEstado,
    setFilterEstado: handleSetFilterEstado,
    addTaller,
    updateTaller,
    deleteTaller,
    isLoading,
    error,
    refetch: () => fetchTalleres(currentPage, searchTerm, filterEstado),
  };
};