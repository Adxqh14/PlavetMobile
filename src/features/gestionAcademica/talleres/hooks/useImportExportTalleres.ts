import { useRef } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import type { CreateTallerData, Taller } from "../types";

interface UseImportExportTalleresProps {
  bulkImportTalleres: (data: CreateTallerData[]) => Promise<{ success: number; errors: number; firstError?: string }>;
  filteredTalleres: Taller[];
}

export function useImportExportTalleres({
  bulkImportTalleres,
  filteredTalleres,
}: UseImportExportTalleresProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const loadingToast = toast.loading("Procesando archivo e importando talleres...");
    
    const processData = async (rawData: Record<string, unknown>[]) => {
      if (rawData.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("El archivo está vacío o no tiene datos.");
        return;
      }

      const norm = (s: string) =>
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

      const get = (row: Record<string, unknown>, ...keys: string[]): string => {
        const rowNormKeys = Object.keys(row).reduce<Record<string, unknown>>((acc, k) => {
          acc[norm(k)] = row[k];
          return acc;
        }, {});
        for (const key of keys) {
          const val = rowNormKeys[norm(key)];
          if (val !== undefined && val !== null && String(val).trim() !== "") {
            return String(val).trim();
          }
        }
        return "";
      };

      const validRows: CreateTallerData[] = [];

      for (const row of rawData) {
        const nombre = get(row, "Nombre", "nombre", "taller", "name");
        const codigo_taller = get(row, "Código Taller", "codigo_taller", "codigo taller", "code", "id_taller");
        const codigo_titulo = get(row, "Código Título", "codigo_titulo", "codigo titulo", "titulo");
        const familia = get(row, "Familia", "familia", "familia_profesional", "familia profesional");
        const horas = parseInt(get(row, "Horas", "horas_pasantia", "horas", "pasantia") || "0");

        if (!nombre || !codigo_taller) continue;

        validRows.push({
          nombre,
          codigo_taller,
          codigo_titulo,
          familia_nombre: familia,
          horas_pasantia: horas,
          estado: "Activo"
        });
      }

      toast.dismiss(loadingToast);

      if (validRows.length === 0) {
        toast.error("No se encontraron datos válidos en el archivo.");
        return;
      }

      const importingToast = toast.loading(`Importando ${validRows.length} talleres...`);
      const { success, errors, firstError } = await bulkImportTalleres(validRows);
      toast.dismiss(importingToast);

      if (success > 0) {
        toast.success(`Importación finalizada: ${success} agregados.`);
        if (errors > 0) toast.warning(`${errors} errores. Primer error: ${firstError}`);
      } else {
        toast.error(`No se pudo importar: ${firstError || "Error desconocido"}`);
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
    if (format === 'csv') {
      const csvContent = [
        ['Nombre', 'Código Taller', 'Familia', 'Código Título', 'Horas Pasantía', 'Estado'],
        ...filteredTalleres.map(taller => [
          taller.nombre,
          taller.codigo_taller,
          taller.familia_nombre || taller.id_familia,
          taller.codigo_titulo,
          taller.horas_pasantia,
          taller.estado,
        ]),
      ]
        .map((row) => row.map(cell => `"${cell ?? ""}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `talleres_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
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
