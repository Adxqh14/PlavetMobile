// ==========================================
// Página principal de gestión de Talleres
// ==========================================

"use client";

import { useState } from "react";
import {
  Wrench,
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

import { useTalleres } from "../hooks/useTalleres";
import { StatsCards } from "../components/StatsCards";
import { TallerTableRow } from "../../talleres/components/TallerTableRow";
import {
  CreateTallerDialog,
  EditTallerDialog,
  ViewTallerDialog,
  DeleteTallerDialog,
} from "../../talleres/components/TallerDialogs";
import type { Taller } from "../../talleres/types";
import Main from "@/features/main/pages/page";

// ==========================================
// Datos dummy para desarrollo
// ==========================================
const initialData: Taller[] = [
  {
    id: 1,
    nombre: "Mecanizado Básico",
    abreviatura: "MEC",
    id_familia: "A",
    codigo_titulo: "MEC-001",
    horas_pasantia: 160,
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Electrónica Digital",
    abreviatura: "ELE",
    id_familia: "B",
    codigo_titulo: "ELE-002",
    horas_pasantia: 120,
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Automotriz Avanzado",
    abreviatura: "AUTO",
    id_familia: "C",
    codigo_titulo: "AUT-003",
    horas_pasantia: 200,
    estado: "Inactivo",
  },
  {
    id: 4,
    nombre: "Informática Aplicada",
    abreviatura: "INF",
    id_familia: "D",
    codigo_titulo: "INF-004",
    horas_pasantia: 180,
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Gastronomía Turística",
    abreviatura: "GAT",
    id_familia: "E",
    codigo_titulo: "GAT-005",
    horas_pasantia: 150,
    estado: "En Mantenimiento",
  },
];

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
  } = useTalleres(initialData);

  // Estados locales para control de UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);

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

  const handleDeleteConfirm = () => {
    if (selectedTaller) {
      deleteTaller(selectedTaller.id);
      setIsDeleteDialogOpen(false);
      setSelectedTaller(null);
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
        taller.estado
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'talleres.csv');
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

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedTalleres.length} de {filteredTalleres.length} talleres (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {filteredTalleres.length > 0 ? (
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
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No se encontraron talleres</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diálogos */}
          <CreateTallerDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={addTaller}
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
            onSubmit={updateTaller}
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
