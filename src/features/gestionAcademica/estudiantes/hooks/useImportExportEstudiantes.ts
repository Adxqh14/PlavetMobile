import { useRef } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import type { CreateEstudianteData, Estudiante } from "../types";

interface UseImportExportEstudiantesProps {
  bulkImportEstudiantes: (data: CreateEstudianteData[]) => Promise<{ success: number; errors: number; firstError?: string }>;
  fetchAllForExport: () => Promise<Estudiante[]>;
}

export function useImportExportEstudiantes({
  bulkImportEstudiantes,
  fetchAllForExport,
}: UseImportExportEstudiantesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const loadingToast = toast.loading("Procesando archivo e importando estudiantes...");
    
    const processData = async (rawData: Record<string, unknown>[]) => {
      if (rawData.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("El archivo está vacío o no tiene datos.");
        return;
      }

      // Normalize a string: lowercase + remove accents
      const norm = (s: string) =>
        s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

      // Get value from a row using normalized key matching
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

      const validRows: CreateEstudianteData[] = [];

      for (const row of rawData) {
        const nombre = get(row, "Nombre", "nombre", "firstname", "name");
        const apellido = get(row, "Apellido", "apellido", "lastname", "surname");
        const email = get(row, "Email", "email", "correo", "Email Institucional");
        const telefono = get(row, "Teléfono", "telefono", "telefono", "phone", "tel");
        const identificacion = get(row, "Identificación", "identificacion", "cedula", "pasaporte", "id", "documento");
        const generoRaw = get(row, "Género", "genero", "sexo", "gender") || "Masculino";
        const genero = norm(generoRaw).startsWith("f") ? "Femenino" : "Masculino";
        const isExtranjero = identificacion.replace(/-/g, "").length < 11;

        if (!nombre || !apellido || !identificacion) continue;

        validRows.push({
          nombre,
          apellido,
          email,
          telefono,
          genero: genero as "Masculino" | "Femenino",
          estado: "Activo",
          fechaNacimiento: get(row, "Fecha Nacimiento", "fecha_nacimiento", "fecha nacimiento", "FechaNacimiento", "birthdate") || "2000-01-01",
          esExtranjero: isExtranjero,
          cedula: !isExtranjero ? identificacion.replace(/-/g, "") : undefined,
          pasaporte: isExtranjero ? identificacion : undefined,
          calle: get(row, "Calle", "calle", "direccion", "street", "Dirección"),
          provincia: get(row, "Provincia", "provincia", "province"),
          pais: get(row, "País", "pais", "country") || "República Dominicana",
          numero_residencia: get(row, "Numero", "numero", "numero_residencia", "Número", "Número Residencia"),
        });
      }

      toast.dismiss(loadingToast);

      if (validRows.length === 0) {
        toast.error(`El archivo tiene ${rawData.length} filas pero ninguna tiene Nombre, Apellido e Identificación válidos. Columnas detectadas: ${Object.keys(rawData[0]).join(", ")}`);
        return;
      }

      const importingToast = toast.loading(`Importando ${validRows.length} estudiantes...`);
      const { success, errors, firstError } = await bulkImportEstudiantes(validRows);
      toast.dismiss(importingToast);

      const msg = `Importación finalizada: ${success} agregados, ${errors} errores.`;
      if (success > 0) {
        if (errors > 0) toast.warning(`${msg} Primer error: ${firstError}`);
        else toast.success(msg);
      } else {
        toast.error(`No se pudo importar: ${firstError || "Error desconocido"}`);
      }
    };

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onerror = () => {
        toast.dismiss(loadingToast);
        alert("Error al leer el archivo Excel.");
      };
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const jsonData = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];
          await processData(jsonData);
        } catch {
          toast.dismiss(loadingToast);
          alert("Error al procesar los datos de Excel.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileExt === 'csv') {
      const reader = new FileReader();
      reader.onerror = () => {
        toast.dismiss(loadingToast);
        alert("Error al leer el archivo CSV.");
      };
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
          alert("Error al procesar los datos del CSV.");
        }
      };
      reader.readAsText(file);
    } else {
      toast.dismiss(loadingToast);
      alert("Formato de archivo no soportado. Use .xlsx, .xls o .csv");
    }

    e.target.value = "";
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    const allEstudiantes = await fetchAllForExport();
    
    const dataToExport = allEstudiantes.map(estudiante => ({
      'Nombre': estudiante.nombre,
      'Apellido': estudiante.apellido,
      'Identificación': estudiante.esExtranjero ? estudiante.pasaporte : estudiante.cedula,
      'Email': estudiante.email,
      'Teléfono': estudiante.telefono,
      'Carrera': estudiante.carrera,
      'Estado': estudiante.estado,
      'Fecha Ingreso': estudiante.fechaIngreso,
      'Ubicación': `${estudiante.calle}, ${estudiante.provincia}`
    }));

    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
      XLSX.writeFile(wb, `estudiantes_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      const csvContent = [
        Object.keys(dataToExport[0]),
        ...dataToExport.map(row => Object.values(row))
      ].map(row => row.map(cell => `"${cell ?? ""}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', `estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    fileInputRef,
    handleImportClick,
    handleFileChange,
    handleExport,
  };
}
