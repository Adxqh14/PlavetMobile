import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import type { CreateCentroData, CentroTrabajo } from "../types";

interface UseImportExportCentrosProps {
  bulkImportCentros: (data: CreateCentroData[]) => Promise<{ success: number; errors: number; firstError?: string }>;
  filteredCentros: CentroTrabajo[];
}

export function useImportExportCentros({
  bulkImportCentros,
  filteredCentros,
}: UseImportExportCentrosProps) {
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
          name?: string;
          centro?: string;
          Email?: string;
          email?: string;
          Telefono?: string;
          telefono?: string;
          RestriccionEdad?: string;
          restriccion?: boolean;
        }
        const data = XLSX.utils.sheet_to_json(ws) as ExcelRow[];

        const mappedData: CreateCentroData[] = data.map(row => ({
          name: row.Nombre || row.name || row.centro || '',
          email: row.Email || row.email || '',
          telefono: String(row.Telefono || row.telefono || ''),
          restriccion_edad: row.RestriccionEdad === 'Sí' || row.restriccion === true,
          status: 'activo' as const,
        })).filter(c => c.name);

        if (mappedData.length === 0) {
          toast.error("No se encontraron datos válidos para importar.");
          setIsImporting(false);
          return;
        }

        const result = await bulkImportCentros(mappedData);
        toast.success(`Importación finalizada: ${result.success} exitosos, ${result.errors} errores.`);
        if (result.firstError) {
          console.error("Primer error de importación:", result.firstError);
        }
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
      ['ID', 'Nombre', 'Ubicación', 'Empleados', 'Estado', 'Validado', 'Fecha Creación'],
      ...filteredCentros.map(centro => [
        centro.id,
        centro.name,
        centro.location,
        centro.employees,
        centro.status,
        centro.validated ? 'Validado' : 'No Validado',
        centro.createdAt
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `centros_trabajo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
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
