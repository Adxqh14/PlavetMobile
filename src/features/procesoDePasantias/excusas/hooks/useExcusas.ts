'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { Excuse, ExcuseFormData, ExcuseFilters } from "../types";
import { excusaService } from "../services/excusaService";

const emptyForm = (): ExcuseFormData => ({
  id_pasantia: "",
  pasantia: "",
  estudiante: "",
  tutor: "",
  centroDeTrabajo: "",
  justificacion: "",
  tipoExcusa: "Ausencia",
});

export const useExcusas = () => {
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<ExcuseFilters>({
    searchTerm: "",
    filterEstado: "all",
  });
  const [formData, setFormData] = useState<ExcuseFormData>(emptyForm());

  const fetchExcuses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await excusaService.getAll({ page, pageSize: 10 });
      setExcuses(res.data);
      setPagination(res.pagination);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cargar excusas";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExcuses(1);
  }, [fetchExcuses]);

  const filteredExcuses = useMemo(() => {
    return excuses.filter((excuse) => {
      const term = filters.searchTerm.toLowerCase();
      const matchesSearch =
        excuse.estudiante.toLowerCase().includes(term) ||
        excuse.id.toLowerCase().includes(term) ||
        excuse.justificacion.toLowerCase().includes(term);
      const matchesEstado =
        filters.filterEstado === "all" || excuse.estado === filters.filterEstado;
      return matchesSearch && matchesEstado;
    });
  }, [excuses, filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_pasantia) {
      toast.error("Por favor seleccione una pasantía");
      return;
    }
    if (!formData.justificacion.trim()) {
      toast.error("Por favor ingrese la justificación");
      return;
    }

    setSubmitting(true);
    try {
      await excusaService.create({
        id_pasantia: formData.id_pasantia,
        justificacion: formData.justificacion,
        tipo_excusa: formData.tipoExcusa,
      });
      toast.success("Excusa registrada exitosamente");
      setFormData(emptyForm());
      fetchExcuses(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrar la excusa";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateFormData = (data: Partial<ExcuseFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateFilters = (data: Partial<ExcuseFilters>) => {
    setFilters(prev => ({ ...prev, ...data }));
  };

  const handleEditExcuse = (_id: string, _data: Partial<Excuse>) => {
    toast.info("La edición de excusas no está disponible en este momento");
  };

  const handleDeleteExcuse = (_id: string) => {
    toast.info("La eliminación de excusas no está disponible en este momento");
  };

  const handleApproveExcuse = (_id: string) => {
    toast.info("La aprobación de excusas no está disponible en este momento");
  };

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Aprobada: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Completada: "bg-blue-50 text-blue-700 border-blue-200",
      Rechazada: "bg-red-50 text-red-700 border-red-200",
      Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return {
      className: styles[estado] ?? "bg-gray-50 text-gray-700 border-gray-200",
      text: estado,
    };
  };

  return {
    // Data
    excuses,
    filteredExcuses,
    formData,
    filters,
    loading,
    submitting,
    pagination,

    // Actions
    handleSubmit,
    updateFormData,
    updateFilters,
    handleEditExcuse,
    handleDeleteExcuse,
    handleApproveExcuse,
    getEstadoBadge,
    fetchExcuses,
  };
};
