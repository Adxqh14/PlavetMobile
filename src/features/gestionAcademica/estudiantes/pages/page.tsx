"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";

import { useEstudiantes } from "../../estudiantes/hooks/useEstudiantes";
import { StatsCards } from "../components/StatsCards";
import { EstudianteTableRow } from "../components/EstudianteTableRow";
import {
  CreateEstudianteDialog,
  EditEstudianteDialog,
  ViewEstudianteDialog,
  DeleteEstudianteDialog,
} from "../components/EstudianteDialogs.tsx";
import type { Estudiante, CreateEstudianteData } from "../types";
import Main from "../../../../features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "../../../../shared/config/rbac";

export default function EstudiantesPage() {
  const {
    filteredEstudiantes,
    paginatedEstudiantes,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addEstudiante,
    updateEstudiante,
    deleteEstudiante,
    restoreEstudiante,
    fetchAllForExport,
  } = useEstudiantes();
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Activo: "bg-emerald-100 text-emerald-700",
      Inactivo: "bg-gray-100 text-gray-700",
      Suspendido: "bg-amber-100 text-amber-700",
    };
    return (
      <Badge className={`${styles[estado] || ""} border-none shadow-none`}>
        {estado}
      </Badge>
    );
  };

  const handleView = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEstudiante) return;
    await deleteEstudiante(selectedEstudiante.id);
    setIsDeleteDialogOpen(false);
    setSelectedEstudiante(null);
  };

  const handleRestore = async (estudiante: Estudiante) => {
    await restoreEstudiante(estudiante.id);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const loadingToast = toast.loading("Procesando archivo e importando estudiantes...");
    
    const processData = async (data: Record<string, unknown>[]) => {
      let successCount = 0;
      let errorCount = 0;

      for (const row of data) {
        // Mapping logic: handle different column naming possibilities
        const nombre = String(row.Nombre || row.nombre || row.firstname || "");
        const apellido = String(row.Apellido || row.apellido || row.lastname || "");
        const email = String(row.Email || row.email || row.correo || "");
        const telefono = String(row.Teléfono || row.telefono || row.phone || "");
        const identificacion = String(row.Identificación || row.identificacion || row.cedula || row.pasaporte || "");
        const generoRaw = String(row.Género || row.genero || row.sexo || "Masculino");
        const genero = generoRaw.toLowerCase().startsWith('f') ? "Femenino" : "Masculino";
        
        const isExtranjero = identificacion.length < 11; // Basic heuristic: Dominican cedula is 11 digits

        const newEstudiante: CreateEstudianteData = {
          nombre,
          apellido,
          email,
          telefono,
          genero: genero as "Masculino" | "Femenino",
          estado: "Activo",
          fechaNacimiento: String(row['Fecha Nacimiento'] || row.fecha_nacimiento || "2000-01-01"),
          esExtranjero: isExtranjero,
          cedula: !isExtranjero ? identificacion : undefined,
          pasaporte: isExtranjero ? identificacion : undefined,
          calle: String(row.Calle || row.calle || row.direccion || ""),
          provincia: String(row.Provincia || row.provincia || ""),
          pais: String(row.País || row.pais || "República Dominicana"),
          numero_residencia: String(row.Numero || row.numero || row.numero_residencia || ""),
        };

        if (nombre && apellido && identificacion) {
          const success = await addEstudiante(newEstudiante, true);
          if (success) successCount++;
          else errorCount++;
        }
      }

      toast.dismiss(loadingToast);
      const summaryMsg = `Importación finalizada:\n- ${successCount} estudiantes agregados con éxito.\n- ${errorCount} errores.`;
      
      if (successCount > 0) {
        toast.success(summaryMsg);
        alert(summaryMsg); // Fallback as requested
      } else {
        toast.error("No se pudo importar ningún estudiante.");
        alert("Error: No se pudo importar ningún estudiante. Verifique el formato del archivo.");
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
          }).filter(row => row[headers[0]]); // Filter empty rows
          
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

    // Reset input to allow re-selecting the same file
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

  // Reset page when filters change
  const handleFilterChange = (value: string) => {
    setFilterEstado(value);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Eliminamos el div container interno que se repite y ajustamos el flujo */}
        {/* Hero Section - Estilo Reportes Compacto */}
        <div className="relative overflow-hidden py-10 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="w-full relative px-0">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión <span className="text-primary">Académica</span> Estudiantil
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra expedientes, asignaciones y el progreso técnico de los estudiantes.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full py-12 px-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Estudiantes</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y seguimiento de la matrícula técnica</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {!isReadOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportClick}
                  className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                >
                  <Upload className="h-4 w-4 mr-2" /> Importar Excel/CSV
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="tour-estudiantes-export"
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                  >
                    <Download className="h-4 w-4 mr-2" /> Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-2">
                  <DropdownMenuItem onClick={() => handleExport('xlsx')} className="text-xs font-bold cursor-pointer">
                    Exportar a Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs font-bold cursor-pointer">
                    Exportar a CSV (.csv)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!isReadOnly && (
                <Button
                  id="tour-estudiantes-add"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nuevo Estudiante
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div id="tour-estudiantes-stats">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div id="tour-estudiantes-filters" className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, apellido, cédula o carrera..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={filterEstado} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="todos" className="text-xs font-bold">Todos los estados</SelectItem>
                      <SelectItem value="Activo" className="text-xs font-bold">Activo</SelectItem>
                      <SelectItem value="Inactivo" className="text-xs font-bold">Inactivo</SelectItem>
                      <SelectItem value="Suspendido" className="text-xs font-bold">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedEstudiantes.length} de {filteredEstudiantes.length} estudiantes 
                <span className="mx-2 opacity-30">|</span> 
                Página {currentPage} de {totalPages}
              </p>

              {/* Table */}
              {filteredEstudiantes.length > 0 ? (
                <>
                  <div id="tour-estudiantes-table" className="rounded-xl border overflow-x-auto bg-background max-w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Nombre</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Teléfono</TableHead>
                          <TableHead className="font-semibold">Carrera</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold">Fecha Ingreso</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEstudiantes.map((estudiante) => (
                          <EstudianteTableRow
                            key={estudiante.id}
                            estudiante={estudiante}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={() => handleDeleteRequest(estudiante)}
                            onRestore={handleRestore}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay estudiantes que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o crea un nuevo estudiante
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Dialogos y Modales --- */}

        {/* Nuevo Diálogo de Confirmación para Eliminar */}
        <DeleteEstudianteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          estudianteNombre={`${selectedEstudiante?.nombre} ${selectedEstudiante?.apellido}`}
          isInactivo={selectedEstudiante?.estado === 'Inactivo' || selectedEstudiante?.estado === 'Suspendido'}
        />

        <CreateEstudianteDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={addEstudiante}
        />

        <EditEstudianteDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          estudiante={selectedEstudiante}
          onSubmit={updateEstudiante}
        />

        <ViewEstudianteDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          estudiante={selectedEstudiante}
          getEstadoBadge={getEstadoBadge}
        />
      </div>
    </Main>
  );
}
