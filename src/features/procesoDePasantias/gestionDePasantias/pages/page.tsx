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

import { usePasantias } from "../hooks/usePasantias";
import { StatsCards } from "../components/StatsCards";
import { PasantiaTableRow } from "../components/PasantiaTableRow";
import {
  CreatePasantiaDialog,
  ViewPasantiaDialog,
  DeletePasantiaDialog,
} from "../components/PasantiaDialogs";
import { EditPasantiaDialog } from "../components/EditPasantiaDialog";
import type { Pasantia, CreatePasantiaData } from "../types";
import Main from "@/features/main/pages/page";

// ==========================================
// Datos dummy para desarrollo
// ==========================================
const initialData: Pasantia[] = [
  {
    id: "PAS-001",
    estudiante: "Juan Perez",
    matricula: "12345678",
    plazaAsignada: "Desarrollador Frontend",
    centroTrabajo: "TechCorp Solutions",
    tutor: "Ing. Maria Garcia",
    fechaInicio: "2025-01-15",
    fechaFin: "2025-06-15",
    horasCompletadas: 120,
    estado: "activa",
    observaciones: "Buen desempeño en el área de desarrollo"
  },
  {
    id: "PAS-002",
    estudiante: "Ana Martinez",
    matricula: "12345679",
    plazaAsignada: "Analista de Datos",
    centroTrabajo: "Consultores RD",
    tutor: "Lic. Carlos Mendez",
    fechaInicio: "2025-01-10",
    fechaFin: "2025-06-10",
    horasCompletadas: 480,
    estado: "completada",
    observaciones: "Pasantía finalizada exitosamente"
  },
  {
    id: "PAS-003",
    estudiante: "Carlos Rodriguez",
    matricula: "12345680",
    plazaAsignada: "Auxiliar Administrativo",
    centroTrabajo: "AutoService Center",
    tutor: "Tec. Roberto Diaz",
    fechaInicio: "2025-02-01",
    horasCompletadas: 0,
    estado: "pendiente",
    observaciones: "Pendiente de iniciar"
  },
];

export default function GestionPasantiasPage() {
  const {
    filteredPasantias,
    paginatedPasantias,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPasantia,
    updatePasantia,
    deletePasantia,
    updateEstado,
  } = usePasantias(initialData);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);

  // Handlers
  const handleCreatePasantia = (data: CreatePasantiaData) => {
    addPasantia(data);
  };

  const handleViewPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsViewDialogOpen(true);
  };

  const handleEditPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsEditDialogOpen(true);
  };

  const handleDeletePasantia = (id: string) => {
    deletePasantia(id);
    setIsDeleteDialogOpen(false);
    setSelectedPasantia(null);
  };

  const handleUpdateEstado = (id: string, estado: Pasantia["estado"]) => {
    updateEstado(id, estado);
  };


  const handleUpdatePasantia = (data: Partial<Pasantia>) => {
    updatePasantia(data as Pasantia);
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Estudiante", "Matricula", "Plaza", "Centro de Trabajo", "Tutor", "Fecha Inicio", "Fecha Fin", "Horas Completadas", "Estado"],
      ...filteredPasantias.map(p => [
        p.id, p.estudiante, p.matricula, p.plazaAsignada, p.centroTrabajo, p.tutor, p.fechaInicio, p.fechaFin || "N/A", p.horasCompletadas, p.estado
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pasantias_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
              <h1 className="text-3xl font-bold text-foreground">Gestión de Pasantías</h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Administra y supervisa todas las pasantías del sistema
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
                    className="gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    Nueva Pasantía
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
                    placeholder="Buscar por estudiante, matrícula, plaza o centro..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      resetPage();
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={filterEstado} onValueChange={(value) => {
                  setFilterEstado(value);
                  resetPage();
                }}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="suspendida">Suspendida</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedPasantias.length} de {filteredPasantias.length} pasantías
              </p>

              {/* Table */}
              {paginatedPasantias.length > 0 ? (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">ID</TableHead>
                          <TableHead className="font-semibold">Estudiante</TableHead>
                          <TableHead className="font-semibold">Plaza</TableHead>
                          <TableHead className="font-semibold">Centro de Trabajo</TableHead>
                          <TableHead className="font-semibold">Tutor</TableHead>
                          <TableHead className="font-semibold">Horas</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedPasantias.map((pasantia) => (
                          <PasantiaTableRow
                            key={pasantia.id}
                            pasantia={pasantia}
                            onView={handleViewPasantia}
                            onEdit={handleEditPasantia}
                            onDelete={handleDeletePasantia}
                            onUpdateEstado={handleUpdateEstado}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Briefcase className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay pasantías</h3>
                  <p className="text-muted-foreground mb-4">No se encontraron pasantías que coincidan con la búsqueda</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Crear nueva pasantía
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialogs */}
          <CreatePasantiaDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreatePasantia}
          />

          <ViewPasantiaDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            pasantia={selectedPasantia}
          />

          <DeletePasantiaDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeletePasantia}
            pasantia={selectedPasantia}
          />


          <EditPasantiaDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            pasantia={selectedPasantia}
            onUpdate={handleUpdatePasantia}
          />
        </div>
      </div>
    </Main>
  );
}
