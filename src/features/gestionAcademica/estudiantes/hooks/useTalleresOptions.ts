/**
 * Hook para cargar los talleres disponibles desde el backend.
 * Usado en los formularios de estudiantes para seleccionar el taller por UUID.
 */
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

export interface TallerOption {
  id: string;   // UUID
  nombre: string;
}

export const useTalleresOptions = () => {
  const [talleres, setTalleres] = useState<TallerOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<any>("/api/v1/talleres", { pageSize: 100 });
        // Backend responde: { success, data: [...], pagination }
        const items: any[] = res.data ?? [];
        setTalleres(
          items.map((t: any) => ({ id: String(t.id), nombre: t.nombre || t.name || "" }))
        );
      } catch (err) {
        console.error("Error cargando talleres:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return { talleres, isLoading };
};
