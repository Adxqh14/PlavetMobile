import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
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
  updateTaller: (id: string, data: Partial<CreateTallerData>) => Promise<boolean | void>;
  deleteTaller: (id: string) => Promise<void>;
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

  const [stats, setStats] = useState<TallerStats>({
    total: 0,
    activos: 0,
    inactivos: 0,
    enMantenimiento: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      // Obtenemos todos los talleres (o una cantidad grande) para calcular estadísticas globales
      // Lo ideal sería un endpoint de stats en el backend
      const response = await talleresService.getAll({ pageSize: 1000, estado: "todos" });
      if (response.success) {
        const allTalleres = response.data;
        setStats({
          total: response.pagination.total,
          activos: allTalleres.filter(t => t.estado.toLowerCase() === "activo").length,
          inactivos: allTalleres.filter(t => t.estado.toLowerCase() === "inactivo").length,
          enMantenimiento: allTalleres.filter(t => t.estado.toLowerCase() === "en mantenimiento").length,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

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
        
        // También actualizamos las estadísticas globales
        fetchStats();
      } else {
        setError("Error al cargar los talleres");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de conexión con el servidor";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchTalleres(currentPage, searchTerm, filterEstado);
  }, [fetchTalleres, currentPage, searchTerm, filterEstado]);

  // filteredTalleres y paginatedTalleres apuntan a los datos ya paginados del backend
  const filteredTalleres = talleres;
  const paginatedTalleres = talleres;

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
        toast.success("Taller creado exitosamente.");
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear el taller";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaller = async (id: string, data: Partial<CreateTallerData>) => {
    setIsLoading(true);
    try {
      const response = await talleresService.update(id, data);
      if (response.success) {
        setFilterEstado("todos");
        setCurrentPage(1);
        await fetchTalleres(1, searchTerm, "todos");
        toast.success("Taller actualizado exitosamente.");
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar el taller";
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTaller = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await talleresService.delete(id);
      if (response.success) {
        const newPage = talleres.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        setCurrentPage(newPage);
        await fetchTalleres(newPage, searchTerm, filterEstado);
        toast.success("Taller inactivado exitosamente.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar el taller";
      toast.error(msg);
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