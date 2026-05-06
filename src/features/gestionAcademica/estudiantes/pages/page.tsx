"use client";

import { useState, useRef } from "react";
import {
  Users,
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

import { useEstudiantes } from "../../estudiantes/hooks/useEstudiantes";
import { StatsCards } from "../components/StatsCards";
import { EstudianteTableRow } from "../components/EstudianteTableRow";
import {
  CreateEstudianteDialog,
  EditEstudianteDialog,
  ViewEstudianteDialog,
  DeleteEstudianteDialog,
} from "../components/EstudianteDialogs.tsx";
import type { Estudiante } from "../types";
import Main from "../../../../features/main/pages/page";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: implementar importación CSV
    console.log("Archivo seleccionado:", file.name);
  };

  const handleExport = async () => {
    const allEstudiantes = await fetchAllForExport();
    const csvContent = [
      ['Nombre', 'Apellido', 'Cédula/Pasaporte', 'Email', 'Teléfono', 'Carrera', 'Estado', 'Fecha Ingreso', 'Ubicación'],
      ...allEstudiantes.map(estudiante => [
        estudiante.nombre,
        estudiante.apellido,
        estudiante.esExtranjero ? estudiante.pasaporte : estudiante.cedula,
        estudiante.email,
        estudiante.telefono,
        estudiante.carrera,
        estudiante.estado,
        estudiante.fechaIngreso,
        `${estudiante.calle}, ${estudiante.provincia}`,
      ])
    ].map(row => row.map(cell => `"${cell ?? ""}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `estudiantes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Gestión de Estudiantes
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona y administra todos los estudiantes del sistema académico
            </p>
          </div>

          {/* Stats Cards */}
          <div id="tour-estudiantes-stats">
            <StatsCards stats={stats} />
          </div>

          {/* Main Content */}
          <Card className="border">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImportClick}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Upload className="h-4 w-4" /> Importar CSV
                  </Button>
                  <Button
                    id="tour-estudiantes-export"
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                  <Button
                    id="tour-estudiantes-add"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Nuevo Estudiante
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Search and Filters */}
              <div id="tour-estudiantes-filters" className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, apellido, cédula o carrera..."
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
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedEstudiantes.length} de {filteredEstudiantes.length} estudiantes (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {filteredEstudiantes.length > 0 ? (
                <>
                  <div id="tour-estudiantes-table" className="rounded-lg border overflow-hidden">
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
