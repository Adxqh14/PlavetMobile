import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import type { CreatePlazaData, Plaza, Genero } from "../types";

interface Centro {
  id: string | number;
  nombre: string;
}

interface Taller {
  id: string | number;
  nombre: string;
}

interface UseImportExportPlazasProps {
  bulkImportPlazas: (data: CreatePlazaData[]) => Promise<{ success: number; errors: number; firstError?: string }>;
  filteredPlazas: Plaza[];
  centros: Centro[];
  talleres: Taller[];
}

export function useImportExportPlazas({
  bulkImportPlazas,
  filteredPlazas,
  centros,
  talleres,
}: UseImportExportPlazasProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        interface ExcelRow {
          Nombre?: string;
          nombre?: string;
          Centro?: string;
          centro?: string;
          Taller?: string;
          taller?: string;
          Genero?: string;
          genero?: string;
          Cupo?: number;
          cupo?: number;
          Descripcion?: string;
          descripcion?: string;
          id_centro?: number;
          id_taller?: string;
        }
        const data = XLSX.utils.sheet_to_json(ws) as ExcelRow[];

        const mappedData: CreatePlazaData[] = data.map(row => {
          const centroNombre = row.Centro || row.centro || '';
          const tallerNombre = row.Taller || row.taller || '';
          const centroId = centros.find(c => c.nombre.toLowerCase() === centroNombre.toLowerCase())?.id || row.id_centro;
          const tallerId = talleres.find(t => t.nombre.toLowerCase() === tallerNombre.toLowerCase())?.id || row.id_taller;

          return {
            nombre: row.Nombre || row.nombre || `Plaza ${tallerNombre || 'S/N'}`,
            titulo: row.Nombre || row.nombre || `Plaza ${tallerNombre || 'S/N'}`,
            centro: centroNombre,
            empresaId: String(centroId),
            taller: tallerNombre,
            idTaller: String(tallerId),
            genero: (row.Genero || row.genero || 'Indistinto') as Genero,
            estado: 'Activa' as const,
            cupoTotal: Number(row.Cupo || row.cupo || 1),
            descripcion: row.Descripcion || row.descripcion || '',
          };
        }).filter(p => p.empresaId && p.idTaller);

        if (mappedData.length === 0) {
          toast.error("No se encontraron datos válidos (se requiere Centro y Taller).");
          setIsImporting(false);
          return;
        }

        const result = await bulkImportPlazas(mappedData);
        toast.success(`Importación finalizada: ${result.success} exitosos, ${result.errors} errores.`);
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        toast.error("Error al procesar el archivo Excel/CSV.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Centro", "Taller", "Género", "Estado", "Fecha Creación", "Cupo"],
      ...filteredPlazas.map((p) => [
        p.id,
        p.centro,
        p.taller,
        p.genero,
        p.estado,
        p.fechaCreacion,
        p.cupoTotal ?? "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `plazas_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    fileInputRef,
    isImporting,
    handleImportClick,
    handleFileChange,
    handleExport,
  };
}
