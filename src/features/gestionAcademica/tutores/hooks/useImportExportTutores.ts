import { useRef } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import type { CreateTutorData, Tutor } from "../types";

interface UseImportExportTutoresProps {
  bulkImportTutores: (data: CreateTutorData[]) => Promise<{ success: number; errors: number; firstError?: string }>;
  filteredTutores: Tutor[];
}

export function useImportExportTutores({
  bulkImportTutores,
  filteredTutores,
}: UseImportExportTutoresProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const loadingToast = toast.loading("Procesando archivo e importando tutores...");
    
    const processData = async (rawData: Record<string, unknown>[]) => {
      if (rawData.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("El archivo está vacío.");
        return;
      }

      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const get = (row: Record<string, unknown>, ...keys: string[]): string => {
        const rowNormKeys = Object.keys(row).reduce<Record<string, unknown>>((acc, k) => {
          acc[norm(k)] = row[k];
          return acc;
        }, {});
        for (const key of keys) {
          const val = rowNormKeys[norm(key)];
          if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
        }
        return "";
      };

      const validRows: CreateTutorData[] = [];
      for (const row of rawData) {
        const nombre = get(row, "Nombre", "nombre", "first_name");
        const apellido = get(row, "Apellido", "apellido", "last_name");
        const email = get(row, "Email", "email", "correo", "contacto");
        const cedula = get(row, "Cedula", "cedula", "dni", "id");
        const telefono = get(row, "Telefono", "telefono", "phone");
        const area = get(row, "Area", "area", "taller", "taller_nombre");

        if (!nombre || !apellido || !cedula) continue;

        validRows.push({
          nombre,
          apellido,
          email,
          cedula,
          telefono,
          taller_nombre: area || "General", // Campo requerido por la interfaz
        });
      }

      toast.dismiss(loadingToast);
      if (validRows.length === 0) {
        toast.error("No se encontraron datos válidos.");
        return;
      }

      const importingToast = toast.loading(`Importando ${validRows.length} tutores...`);
      const { success, errors, firstError } = await bulkImportTutores(validRows);
      toast.dismiss(importingToast);

      if (success > 0) {
        toast.success(`Importación finalizada: ${success} agregados.`);
        if (errors > 0) toast.warning(`${errors} errores. Primer error: ${firstError}`);
      } else {
        toast.error(`Error: ${firstError || "Error desconocido"}`);
      }
      e.target.value = "";
    };

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });
          const jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as Record<string, unknown>[];
          await processData(jsonData);
        } catch {
          toast.dismiss(loadingToast);
          toast.error("Error al procesar Excel.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileExt === 'csv') {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const text = evt.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
          const data = rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.replace(/"/g, '').trim());
            const obj: Record<string, unknown> = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
          }).filter(row => row[headers[0]]);
          await processData(data as Record<string, unknown>[]);
        } catch {
          toast.dismiss(loadingToast);
          toast.error("Error al procesar CSV.");
        }
      };
      reader.readAsText(file);
    } else {
      toast.dismiss(loadingToast);
      toast.error("Formato no soportado.");
    }
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    const csvContent = [
      ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Cédula', 'Área Asignada', 'Estado'],
      ...filteredTutores.map(tutor => [
        tutor.id,
        tutor.nombre,
        tutor.apellido,
        tutor.email,
        tutor.telefono,
        tutor.cedula,
        tutor.areaAsignada,
        tutor.status,
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    if (format === 'csv') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `tutores_academicos_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Logic for XLSX, if any, can be implemented here later
      toast.info("Exportación a Excel estará disponible pronto.");
    }
  };

  return {
    fileInputRef,
    handleImportClick,
    handleFileChange,
    handleExport,
  };
}
