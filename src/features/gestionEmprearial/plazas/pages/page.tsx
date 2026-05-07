"use client";

import { useState, useRef } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Upload,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
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

import { usePlazas } from "../hooks/usePlazas";
import { StatsCards } from "../components/StatsCards";
import { PlazaTableRow } from "../components/PlazaTableRow";
import {
  CreatePlazaDialog,
  EditPlazaDialog,
  ViewPlazaDialog,
  DeletePlazaDialog,
} from "../components/PlazaDialogs";
import type { Plaza, CreatePlazaData, Genero } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";


export default function PlazasPage() {
  const {
    filteredPlazas,
    paginatedPlazas,
    centros,
    talleres,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    loading: isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPlaza,
    updatePlaza,
    deletePlaza,
    bulkImportPlazas,
    refetch,
  } = usePlazas();
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "TUTOR ACADEMICO";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Dialog state ───────────────────────────────────────────────────────
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // ── Badge helpers ──────────────────────────────────────────────────────
  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Activa: "bg-emerald-100 text-emerald-700",
      Ocupada: "bg-blue-100 text-blue-700",
      Inhabilitada: "bg-gray-100 text-gray-700",
    };
    return (
      <Badge className={`${styles[estado] || ""} border-none shadow-none font-bold text-[10px] uppercase tracking-wider`}>
        {estado}
      </Badge>
    );
  };

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleView = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlaza) {
      deletePlaza(selectedPlaza.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRestore = (plaza: Plaza) => {
    updatePlaza({ ...plaza, estado: "Activa" });
    setFilterEstado("todos");
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
            empresaId: Number(centroId),
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
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Briefcase className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Plazas</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra los cupos disponibles y asignaciones técnicas en centros de trabajo.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Plazas</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y disponibilidad de espacios de pasantía</p>
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

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" /> Exportar CSV
              </Button>

              {!isReadOnly && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImportClick}
                    disabled={isImporting}
                    className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                  >
                    {isImporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Importar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Nueva Plaza
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div id="tour-plazas-stats">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div id="tour-plazas-filters" className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, centro o taller..."
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
                      <SelectItem value="activa" className="text-xs font-bold">Activa</SelectItem>
                      <SelectItem value="completa" className="text-xs font-bold">Completa</SelectItem>
                      <SelectItem value="inactiva" className="text-xs font-bold">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedPlazas.length} de {filteredPlazas.length} plazas
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {/* Error banner */}
              {error && (
                <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 mb-6 text-sm font-bold border border-destructive/20">
                  {error}
                </div>
              )}

              {/* Table */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Briefcase className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Sincronizando plazas...</p>
                </div>
              ) : filteredPlazas.length > 0 ? (
                <>
                  <div className="rounded-xl border overflow-x-auto bg-background max-w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold py-4">Nombre de Plaza</TableHead>
                          <TableHead className="font-semibold py-4">Centro de Trabajo</TableHead>
                          <TableHead className="font-semibold py-4">Género</TableHead>
                          <TableHead className="font-semibold py-4">Estado</TableHead>
                          <TableHead className="font-semibold py-4">Cupo</TableHead>
                          <TableHead className="font-semibold py-4">Fecha</TableHead>
                          <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPlazas.map((plaza) => (
                          <PlazaTableRow
                            key={plaza.id}
                            plaza={plaza}
                            onView={handleView}
                            onEdit={isReadOnly ? undefined : handleEdit}
                            onDelete={isReadOnly ? undefined : () => handleDeleteRequest(plaza)}
                            onRestore={isReadOnly ? undefined : handleRestore}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground font-medium">
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
                          <ChevronLeft className="h-4 w-4" /> Anterior
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2)
                              pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
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
                          Siguiente <ChevronRight className="h-4 w-4" />
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
                    No se encontraron plazas
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {searchTerm || filterEstado !== "todos"
                      ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
                      : "Comienza registrando la primera plaza disponible."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Dialogs ─────────────────────────────────────────────────────── */}
        <DeletePlazaDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          plazaNombre={selectedPlaza?.nombre}
          isInhabilitada={selectedPlaza?.estado === "Inhabilitada"}
        />

        <CreatePlazaDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={addPlaza}
          centros={centros}
          talleres={talleres}
        />

        <EditPlazaDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plaza={selectedPlaza}
          onSubmit={updatePlaza}
          centros={centros}
          talleres={talleres}
        />

        <ViewPlazaDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          plaza={selectedPlaza}
          getEstadoBadge={getEstadoBadge}
        />
      </div>
    </Main>
  );
}