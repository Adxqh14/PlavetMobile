import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import type { Taller, TallerStats, CreateTallerData } from "../types";
import { talleresService } from "../services/talleresService";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
  bulkImportTalleres: (rows: CreateTallerData[]) => Promise<{ success: number; errors: number; firstError?: string }>;
}

export const useTalleres = (): UseTalleresReturn => {
  const { user, userRole } = useAuth();
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
      const params: Record<string, string | number | boolean> = { page, pageSize: 15 };
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

  // Filtrado por rol de Tutor Académico
  const filteredTalleres = useMemo(() => {
    if (userRole === "TUTOR ACADEMICO" && user?.taller) {
      return talleres.filter(t => Number(t.id) === Number(user.taller?.id));
    }
    return talleres;
  }, [talleres, userRole, user?.taller]);

  const paginatedTalleres = filteredTalleres;

  // Ajustar estadísticas si es Tutor
  const filteredStats = useMemo(() => {
    if (userRole === "TUTOR ACADEMICO" && user?.taller) {
      const myTaller = talleres.find(t => Number(t.id) === Number(user.taller?.id));
      if (!myTaller) return stats;
      return {
        total: 1,
        activos: myTaller.estado.toLowerCase() === "activo" ? 1 : 0,
        inactivos: myTaller.estado.toLowerCase() === "inactivo" ? 1 : 0,
        enMantenimiento: myTaller.estado.toLowerCase() === "en mantenimiento" ? 1 : 0,
      };
    }
    return stats;
  }, [stats, talleres, userRole, user?.taller]);

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

  /** Bulk import: create multiple workshops, refresh at the end */
  const bulkImportTalleres = async (rows: CreateTallerData[]): Promise<{ success: number; errors: number; firstError?: string }> => {
    let successCount = 0;
    let errorCount = 0;
    let firstErrorMsg: string | undefined = undefined;

    // Create in chunks of 5
    const chunkSize = 5;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(row => talleresService.create(row))
      );
      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value.success !== false) {
          successCount++;
        } else {
          errorCount++;
          const reason = r.status === 'rejected' 
            ? (r.reason instanceof Error ? r.reason.message : String(r.reason))
            : (r.value.message || "Error desconocido");
          if (!firstErrorMsg) firstErrorMsg = reason;
        }
      });
    }

    await fetchTalleres(currentPage, searchTerm, filterEstado);
    return { success: successCount, errors: errorCount, firstError: firstErrorMsg };
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
    stats: filteredStats,
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
    filterEstado,
    setFilterEstado: handleSetFilterEstado,
    addTaller,
    updateTaller,
    deleteTaller,
    bulkImportTalleres,
    isLoading,
    error,
    refetch: () => fetchTalleres(currentPage, searchTerm, filterEstado),
  };
};