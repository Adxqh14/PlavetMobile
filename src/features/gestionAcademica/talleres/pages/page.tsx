// ==========================================
// Página principal de gestión de Talleres
// Conectada al backend via useTalleres
// ==========================================

import { useState, useRef } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";


import {
  Wrench,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Loader2,
  Upload,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";


import { useTalleres } from "../hooks/useTalleres";
import { StatsCards } from "../components/StatsCards";
import { TallerTableRow } from "../components/TallerTableRow";
import {
  CreateTallerDialog,
  EditTallerDialog,
  ViewTallerDialog,
  DeleteTallerDialog,
} from "../components/TallerDialogs";
import type { Taller, CreateTallerData } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

export default function TalleresPage() {
  const {
    filteredTalleres,
    paginatedTalleres,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addTaller,
    updateTaller,
    deleteTaller,
    isLoading,
    error,
    refetch,
    bulkImportTalleres,
  } = useTalleres();
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers de acciones
  const handleView = (taller: Taller) => {
    setSelectedTaller(taller);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (taller: Taller) => {
    setSelectedTaller(taller);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (taller: Taller) => {
    setSelectedTaller(taller);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = async (data: CreateTallerData) => {
    setActionError(null);
    try {
      await addTaller(data);
      setIsDialogOpen(false);
    } catch {
      setActionError("Error al crear el taller. Inténtalo de nuevo.");
    }
  };

  const handleUpdate = async (id: string, data: Partial<CreateTallerData>) => {
    setActionError(null);
    try {
      await updateTaller(id, data);
      setIsEditDialogOpen(false);
      setSelectedTaller(null);
    } catch {
      setActionError("Error al actualizar el taller. Inténtalo de nuevo.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedTaller) {
      setActionError(null);
      try {
        await deleteTaller(String(selectedTaller.id));
        setIsDeleteDialogOpen(false);
        setSelectedTaller(null);
      } catch {
        setActionError("Error al eliminar el taller. Inténtalo de nuevo.");
      }
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
      // Si se requiere XLSX en el futuro se puede implementar aquí
      toast.info("Exportación a Excel estará disponible pronto.");
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterEstado(value);
    resetPage();
  };

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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Hero Section - Estilo Estudiantes */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          {/* Icono Decorativo */}
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Wrench className="w-80 h-80 text-primary -rotate-12" />
          </div>
          
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Talleres</span> Académicos
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra el catálogo de áreas técnicas, familias profesionales y programas del centro.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Talleres</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y seguimiento del catálogo técnico</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={isLoading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {!isReadOnly && userRole !== "TUTOR ACADEMICO" && (
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
                    id="tour-talleres-export"
                    variant="outline"
                    size="sm"
                    disabled={isLoading || filteredTalleres.length === 0}
                    className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                  >
                    <Download className="h-4 w-4 mr-2" /> Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-2">
                  <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs font-bold cursor-pointer">
                    Exportar a CSV (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Funcionalidad próximamente")} className="text-xs font-bold cursor-pointer opacity-50">
                    Exportar a Excel (.xlsx)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!isReadOnly && userRole !== "TUTOR ACADEMICO" && (
                <Button
                  id="tour-talleres-add"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={isLoading}
                  className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nuevo Taller
                </Button>
              )}
            </div>
          </div>

          {/* Errores */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm">Error de conexión</p>
                <p className="text-xs opacity-90">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="h-8 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 font-bold text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reintentar
              </Button>
            </div>
          )}

          {actionError && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold flex-1">{actionError}</p>
              <button onClick={() => setActionError(null)} className="opacity-50 hover:opacity-100 transition-opacity">
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div id="tour-talleres-stats" className="mb-10">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div id="tour-talleres-filters" className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, código o familia..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={filterEstado} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        <Filter className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate text-left">
                          <SelectValue placeholder="Estado" />
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="todos" className="text-xs font-bold">Todos los estados</SelectItem>
                      <SelectItem value="Activo" className="text-xs font-bold">Activo</SelectItem>
                      <SelectItem value="Inactivo" className="text-xs font-bold">Inactivo</SelectItem>
                      <SelectItem value="En Mantenimiento" className="text-xs font-bold">En Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedTalleres.length} de {filteredTalleres.length} talleres 
                <span className="mx-2 opacity-30">|</span> 
                Página {currentPage} de {totalPages}
              </p>

              {/* Loading state */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Wrench className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Sincronizando talleres...</p>
                </div>
              ) : paginatedTalleres.length > 0 ? (
                <>
                  <div id="tour-talleres-table" className="rounded-xl border overflow-x-auto bg-background">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Nombre del Taller</TableHead>
                          <TableHead className="font-semibold text-center">Código Taller</TableHead>
                          <TableHead className="font-semibold">Familia</TableHead>
                          <TableHead className="font-semibold">Código Título</TableHead>
                          <TableHead className="font-semibold">Horas</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTalleres.map((taller) => (
                          <TallerTableRow
                            key={taller.id}
                            taller={taller}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDeleteRequest}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground font-medium">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="gap-1 rounded-lg font-bold"
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
                                className={`w-9 h-9 p-0 rounded-lg font-bold ${currentPage === pageNum ? "shadow-md shadow-primary/20" : ""}`}
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
                          className="gap-1 rounded-lg font-bold"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-20 text-center bg-muted/5">
                  <div className="p-5 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    No se encontraron talleres
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {searchTerm || filterEstado !== "todos"
                      ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
                      : "Comienza registrando el primer taller del área técnica."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Diálogos */}
        <CreateTallerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreate}
        />

        <ViewTallerDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          taller={selectedTaller}
        />

        <EditTallerDialog
          key={selectedTaller?.id || 'new'}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdate}
          taller={selectedTaller}
        />

        <DeleteTallerDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          taller={selectedTaller}
        />
      </div>
    </Main>
  );
}
