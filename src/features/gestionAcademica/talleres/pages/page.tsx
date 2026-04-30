// ==========================================
// Página principal de gestión de Talleres
// Conectada al backend via useTalleres
// ==========================================

import { useState } from "react";
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
  } = useTalleres();

  // Estados locales para control de UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const handleUpdate = async (id: number, data: Partial<CreateTallerData>) => {
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
        await deleteTaller(selectedTaller.id);
        setIsDeleteDialogOpen(false);
        setSelectedTaller(null);
      } catch {
        setActionError("Error al eliminar el taller. Inténtalo de nuevo.");
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Código Taller', 'Familia', 'Abreviatura', 'Horas Pasantía', 'Estado'],
      ...filteredTalleres.map(taller => [
        taller.id,
        taller.nombre,
        taller.abreviatura,
        taller.id_familia,
        taller.codigo_titulo,
        taller.horas_pasantia,
        taller.estado,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "talleres.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Gestión de Talleres
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona los talleres disponibles en los centros de trabajo
            </p>
          </div>

          {/* Error de carga */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Error al cargar datos</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          )}

          {/* Error de acción */}
          {actionError && (
            <div className="mb-4 flex items-center gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {actionError}
              <button
                onClick={() => setActionError(null)}
                className="ml-auto text-destructive/60 hover:text-destructive"
              >
                ×
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetch}
                    disabled={isLoading}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={isLoading || filteredTalleres.length === 0}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    disabled={isLoading}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Nuevo Taller
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterEstado} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">Cargando talleres desde el servidor...</p>
                </div>
              ) : paginatedTalleres.length > 0 ? (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold w-20">ID</TableHead>
                          <TableHead className="font-semibold">Nombre del Taller</TableHead>
                          <TableHead className="font-semibold text-center">Abreviatura</TableHead>
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
                <div className="text-center py-16">
                  <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No se encontraron talleres</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    {searchTerm || filterEstado !== "todos"
                      ? "Intenta con otros filtros de búsqueda"
                      : "Crea el primer taller usando el botón 'Nuevo Taller'"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
      </div>
    </Main>
  );
}
