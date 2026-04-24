"use client"

import { useState } from "react"
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "../../../../shared/components/ui/button"
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card"
import { Input } from "../../../../shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select"

import { useCentroTrabajo } from "../hooks/useCentroTrabajo"
import { StatsCards } from "../components/stats-cards"
import { CentroTable } from "../components/CentroTable"
import { HistorialDialog } from "../components/HistorialDialog"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import { RegisterCenterDialog } from "../components/register-center-dialog"
import { ViewCenterDialog } from "../components/view-center-dialog"
import { EditCenterDialog } from "../components/edit-center-dialog"
import type { CentroTrabajo } from "../types"
import Main from "@/features/main/pages/page"
import { useTour } from "../../../../shared/hooks/useTour"

export default function CentroDeTrabajoPage() {
  const {
    centros,
    filteredCentros,
    paginatedCentros,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addCentro,
    updateCentro,
    deleteCentro,
    restoreCentro,
    permanentlyDeleteCentro,
  } = useCentroTrabajo();

  useTour('tutorial_centros_trabajo', [
    { element: '#tour-centros-stats', popover: { title: 'Métricas de Centros', description: 'Visión general de las empresas y organizaciones.', side: "bottom" } },
    { element: '#tour-centros-add', popover: { title: 'Nuevo Centro', description: 'Registra un nuevo centro de trabajo colaborador.', side: "left" } },
    { element: '#tour-centros-history', popover: { title: 'Historial', description: 'Revisa los centros inactivos o eliminados.', side: "bottom" } },
    { element: '#tour-centros-export', popover: { title: 'Exportar Datos', description: 'Descarga la lista actual en formato CSV.', side: "bottom" } },
    { element: '#tour-centros-table', popover: { title: 'Lista de Centros', description: 'Visualiza y gestiona las empresas afiliadas.', side: "top" } }
  ], 500);

  // Estados locales para control de UI
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<CentroTrabajo | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  // Estados locales para control de UI
  const handleView = (centro: CentroTrabajo) => {
    setSelectedCentro(centro);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (centro: CentroTrabajo) => {
    setSelectedCentro(centro);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (centro: CentroTrabajo) => {
    setSelectedCentro(centro);
    setIsPermanentDelete(centro.status === 'deleted');
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCentro) {
      if (isPermanentDelete) {
        permanentlyDeleteCentro(selectedCentro.id);
      } else {
        deleteCentro(selectedCentro.id);
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRestore = (centro: CentroTrabajo) => {
    restoreCentro(centro.id);
    // Cambiar el filtro a "todos" para que se muestre en la tabla
    setStatusFilter("todos");
  };

  // Export functionality
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

  // Reset page when filters change
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  // Get deleted centers for history
  const deletedCentros = centros.filter(c => c.status === 'deleted');

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
                Centros de Trabajo
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Gestiona y administra todos los centros de trabajo de la empresa
            </p>
          </div>

          {/* Stats Cards */}
          <div id="tour-centros-stats">
            <StatsCards stats={stats} />
          </div>

          {/* Main Content */}
          <Card className="border mt-8 overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    id="tour-centros-export"
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                  <Button
                    id="tour-centros-history"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsHistoryOpen(true)}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    Historial
                  </Button>
                  <Button
                    id="tour-centros-add"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Nuevo Centro
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
                    placeholder="Buscar por nombre o ubicación..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedCentros.length} de {filteredCentros.length} centros (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {filteredCentros.length > 0 ? (
                <div id="tour-centros-table">
                  <CentroTable
                    centros={paginatedCentros}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                      const centro = centros.find(c => c.id === id);
                      if (centro) handleDeleteRequest(centro);
                    }}
                    onRestore={handleRestore}
                  />
                  
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
                            let pageNum;
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
                </div>
              ) : (
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay centros que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o crea un nuevo centro
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Dialogos y Modales --- */}
        
        {/* Diálogo de Vista */}
        <ViewCenterDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          centro={selectedCentro}
        />

        {/* Diálogo de Edición */}
        <EditCenterDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          centro={selectedCentro}
          onUpdateCentro={updateCentro}
        />

        {/* Diálogo de Registro */}
        <RegisterCenterDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddCentro={addCentro}
        />

        {/* Diálogo de Confirmación para Eliminar */}
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          centroNombre={selectedCentro?.name || ''}
          isPermanent={isPermanentDelete}
        />

        {/* Diálogo de Historial */}
        <HistorialDialog
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          deletedCentros={deletedCentros}
          onRestore={handleRestore}
          onPermanentDelete={permanentlyDeleteCentro}
        />

        {/* TODO: Implementar otros diálogos cuando sea necesario */}
      </div>
    </Main>
  )
}
