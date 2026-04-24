'use client';

import { useState, useMemo, useEffect, startTransition } from "react";
import { toast } from "sonner";
import type { Excuse, ExcuseFormData, ExcuseFilters } from "../types";

const MOCK_EXCUSES: Excuse[] = [
  {
    id: "EXC001",
    pasantia: "Pasantía Desarrollo Web",
    estudiante: "Juan Pérez",
    tutor: "María González",
    justificacion: "Cita médica programada",
    certificado: "certificado_medico.pdf",
    fecha: "2024-01-15",
    estado: "Aprobada",
  },
  {
    id: "EXC002",
    pasantia: "Pasantía Marketing Digital",
    estudiante: "Ana Martínez",
    tutor: "Carlos Ruiz",
    justificacion: "Emergencia familiar",
    certificado: "justificacion.pdf",
    fecha: "2024-01-14",
    estado: "Pendiente",
  },
  {
    id: "EXC003",
    pasantia: "Pasantía Gestión",
    estudiante: "Pedro López",
    tutor: "Laura Sánchez",
    justificacion: "Problemas de transporte",
    certificado: "carta_excusa.pdf",
    fecha: "2024-01-13",
    estado: "Rechazada",
  },
];

export const useExcusas = () => {
  const [excuses, setExcuses] = useState<Excuse[]>(MOCK_EXCUSES);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<ExcuseFilters>({
    searchTerm: "",
    filterEstado: "all",
  });
  const [formData, setFormData] = useState<ExcuseFormData>({
    pasantia: "",
    estudiante: "",
    tutor: "",
    justificacion: "",
  });
  const [pdfPreview, setPdfPreview] = useState<{ open: boolean; url: string; title: string } | null>(null);

  useEffect(() => {
    return () => {
      if (pdfPreview?.url) {
        URL.revokeObjectURL(pdfPreview.url);
      }
    };
  }, [pdfPreview?.url]);


  const filteredExcuses = useMemo(() => {
    const filtered = excuses.filter((excuse) => {
      const matchesSearch =
        excuse.pasantia.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        excuse.estudiante.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        excuse.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesEstado = filters.filterEstado === "all" || excuse.estado === filters.filterEstado;
      return matchesSearch && matchesEstado;
    });
    console.log("[DEBUG] Filtros:", filters);
    console.log("[DEBUG] Excusas filtradas:", filtered);
    return filtered;
  }, [excuses, filters]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      console.log("[v0] Archivo seleccionado:", file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pasantia || !formData.estudiante || !formData.tutor || !formData.justificacion) {
      console.log("[v0] Por favor complete todos los campos obligatorios");
      return;
    }

    // Generate new ID
    const newId = `EXC${String(excuses.length + 1).padStart(3, '0')}`;
    
    // Create new excuse
    const newExcuse: Excuse = {
      id: newId,
      pasantia: formData.pasantia,
      estudiante: formData.estudiante,
      tutor: formData.tutor,
      justificacion: formData.justificacion,
      certificado: selectedFile ? selectedFile.name : "certificado.pdf",
      fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      estado: "Pendiente", // New excuses start as pending
    };

    // Add to excuses list
    setExcuses(prev => [newExcuse, ...prev]);

    // Reset form
    setFormData({
      pasantia: "",
      estudiante: "",
      tutor: "",
      justificacion: "",
    });
    setSelectedFile(null);

    console.log("[v0] Nueva excusa enviada:", newExcuse);
    console.log(`[v0] Excusa ${newId} enviada correctamente`);
  };

  const updateFormData = (data: Partial<ExcuseFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateFilters = (data: Partial<ExcuseFilters>) => {
    setFilters(prev => ({ ...prev, ...data }));
  };

  const handleEditExcuse = (id: string, data: Partial<Excuse>) => {
    setExcuses(prev => prev.map(excuse => 
      excuse.id === id ? { ...excuse, ...data } : excuse
    ));
    toast.success("Excusa actualizada correctamente");
  };

  const handleDeleteExcuse = (id: string) => {
    setExcuses(prev => prev.filter(excuse => excuse.id !== id));
    toast.success("Excusa eliminada correctamente");
  };

  const handleApproveExcuse = (id: string) => {
    setExcuses(prev => prev.map(excuse => 
      excuse.id === id ? { ...excuse, estado: "Aprobada" } : excuse
    ));
    toast.success("Excusa aprobada correctamente");
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      "Aprobada": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Completada": "bg-blue-50 text-blue-700 border-blue-200",
      "Rechazada": "bg-red-50 text-red-700 border-red-200",
      "Pendiente": "bg-amber-50 text-amber-700 border-amber-200",
    };
    return {
      className: styles[estado as keyof typeof styles] || "bg-gray-50 text-gray-700 border-gray-200",
      text: estado
    };
  };

  const openPdfPreview = (certificado: string, title: string) => {
    if (pdfPreview?.url) {
      URL.revokeObjectURL(pdfPreview.url);
    }
    // Si es URL real, úsala directamente
    if (certificado.startsWith('http')) {
      startTransition(() => {
        setPdfPreview({ open: true, url: certificado, title });
      });
      return;
    }
    // Genera PDF de demo — diferido para no bloquear el main thread
    startTransition(() => {
      const escapePdfText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      const text = escapePdfText(`Certificado: ${title}`);
      const pdf = `%PDF-1.4\n` +
        `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
        `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
        `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
        `4 0 obj\n<< /Length 68 >>\nstream\nBT\n/F1 18 Tf\n72 720 Td\n(${text}) Tj\nET\nendstream\nendobj\n` +
        `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
        `xref\n0 6\n0000000000 65535 f \n` +
        `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n0\n%%EOF`;
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfPreview({ open: true, url, title });
    });
  };

  const closePdfPreview = () => {
    if (pdfPreview?.url) {
      URL.revokeObjectURL(pdfPreview.url);
    }
    setPdfPreview(null);
  };

  return {
    // Data
    excuses,
    filteredExcuses,
    selectedFile,
    formData,
    filters,
    
    // Actions
    handleFileChange,
    handleSubmit,
    updateFormData,
    updateFilters,
    handleEditExcuse,
    handleDeleteExcuse,
    handleApproveExcuse,
    getEstadoBadge,
    pdfPreview,
    openPdfPreview,
    closePdfPreview,
  };
};
