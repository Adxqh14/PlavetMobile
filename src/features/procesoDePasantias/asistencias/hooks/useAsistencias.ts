import { useState, useMemo } from 'react';
import type { Asistencia, AsistenciaFormData, AsistenciaFilters } from '../types';

// Mock Data
const MOCK_ASISTENCIAS: Asistencia[] = [
  {
    id: "1",
    estudiante: "Juan Pérez",
    pasantia: "Desarrollo Web - Tech Solutions",
    tutor: "María González",
    fecha: "2024-03-25",
    horaEntrada: "08:00",
    horaSalida: "16:00",
    estado: "Presente",
    registradoPor: "María González",
    observaciones: "Llegó puntual y cumplió sus tareas."
  },
  {
    id: "2",
    estudiante: "Ana Martínez",
    pasantia: "Soporte Técnico - Global IT",
    tutor: "Carlos Ruiz",
    fecha: "2024-03-25",
    horaEntrada: "08:15",
    horaSalida: "16:00",
    estado: "Tardanza",
    registradoPor: "Carlos Ruiz",
    observaciones: "Tráfico pesado en la zona."
  },
  {
    id: "3",
    estudiante: "Pedro López",
    pasantia: "Redes - Connect Corp",
    tutor: "Laura Sánchez",
    fecha: "2024-03-25",
    horaEntrada: "-",
    horaSalida: "-",
    estado: "Ausente",
    registradoPor: "Laura Sánchez",
    observaciones: "No se reportó ni envió excusa."
  }
];

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>(MOCK_ASISTENCIAS);
  const [filters, setFilters] = useState<AsistenciaFilters>({
    searchTerm: "",
    filterEstado: "all",
  });

  const filteredAsistencias = useMemo(() => {
    return asistencias.filter((asistencia) => {
      const matchesSearch = 
        asistencia.estudiante.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        asistencia.pasantia.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesEstado = 
        filters.filterEstado === "all" || asistencia.estado === filters.filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [asistencias, filters]);

  const addAsistencia = (data: AsistenciaFormData) => {
    const newAsistencia: Asistencia = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      registradoPor: "Usuario Actual", // Esto debería venir del contexto de auth
    };
    setAsistencias([newAsistencia, ...asistencias]);
  };

  const updateAsistencia = (id: string, data: Partial<Asistencia>) => {
    setAsistencias(asistencias.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAsistencia = (id: string) => {
    setAsistencias(asistencias.filter(a => a.id !== id));
  };

  return {
    asistencias: filteredAsistencias,
    filters,
    setFilters,
    addAsistencia,
    updateAsistencia,
    deleteAsistencia,
  };
};
