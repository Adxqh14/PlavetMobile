"use client";

import { useState } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Download,
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

import { usePlazas } from "../hooks/usePlazas";
import { StatsCards } from "../components/StatsCards";
import { PlazaTableRow } from "../components/PlazaTableRow";
import {
  CreatePlazaDialog,
  EditPlazaDialog,
  ViewPlazaDialog,
  DeletePlazaDialog,
} from "../components/PlazaDialogs";
import type { Plaza } from "../types";
import Main from "@/features/main/pages/page";


export default function PlazasPage() {
  const {
    filteredPlazas,
    paginatedPlazas,
    centros,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPlaza,
    updatePlaza,
    deletePlaza,
  } = usePlazas();

  // ── Dialog state ───────────────────────────────────────────────────────
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);

  // ── Badge helpers ──────────────────────────────────────────────────────
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return <Badge variant="success">Activa</Badge>;
      case "Ocupada":
        return <Badge variant="slate-subtle">Ocupada</Badge>;
      case "Inhabilitada":
        return <Badge variant="grey">Inhabilitada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
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
      // El backend usa el método DELETE para inhabilitar (cambiar estado a Cancelada)
      // No se puede hacer vía updatePlaza porque el DTO no acepta 'estado'
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
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Plazas de Centros de Trabajo
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona las plazas disponibles en los centros de trabajo y talleres
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border mt-8">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Nueva Plaza
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
                    placeholder="Buscar por nombre, centro o taller..."
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
                    <SelectItem value="Activa">Activa</SelectItem>
                    <SelectItem value="Ocupada">Ocupada</SelectItem>
                    <SelectItem value="Inhabilitada">Inhabilitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedPlazas.length} de {filteredPlazas.length} plazas
                (Página {currentPage} de {totalPages})
              </p>

              {/* Error banner */}
              {error && (
                <div className="rounded-md bg-destructive/10 text-destructive px-4 py-3 mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Table */}
              {loading ? (
                <div className="py-16 text-center text-muted-foreground">
                  Cargando plazas...
                </div>
              ) : filteredPlazas.length > 0 ? (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Nombre de Plaza</TableHead>
                          <TableHead className="font-semibold">Centro de Trabajo</TableHead>
                          <TableHead className="font-semibold">Género</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold">Cupo</TableHead>
                          <TableHead className="font-semibold">Fecha</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPlazas.map((plaza) => (
                          <PlazaTableRow
                            key={plaza.id}
                            plaza={plaza}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={() => handleDeleteRequest(plaza)}
                            onRestore={handleRestore}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
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
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay plazas que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o crea una nueva plaza
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
        />

        <EditPlazaDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plaza={selectedPlaza}
          onSubmit={updatePlaza}
          centros={centros}
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