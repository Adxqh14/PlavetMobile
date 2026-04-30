"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Search, Users, Plus, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Main from '../../../main/pages/page';
import { useVinculadores } from "../hooks/useVinculadores";
import { VinculadorTable } from "../components/VinculadorTable";
import { RegisterVinculadorDialog } from "../components/RegisterVinculadorDialog";
import { EditVinculadorDialog } from "../components/EditVinculadorDialog";
import { ViewVinculadorDialog } from "../components/ViewVinculadorDialog";
import type { Vinculador } from "../types";

export default function VinculadoresPage() {
  const {
    vinculadores,
    filteredVinculadores,
    paginatedVinculadores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addVinculador,
    updateVinculador,
    deleteVinculador,
    restoreVinculador,
    permanentlyDeleteVinculador,
    fetchAllForExport,
  } = useVinculadores();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVinculador, setSelectedVinculador] = useState<Vinculador | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleView = (vinculador: Vinculador) => {
    setSelectedVinculador(vinculador);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (vinculador: Vinculador) => {
    setSelectedVinculador(vinculador);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const vinculador = vinculadores.find(v => v.id === id);
    if (vinculador) {
      setSelectedVinculador(vinculador);
      setIsPermanentDelete(vinculador.status === 'deleted');
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedVinculador) {
      if (isPermanentDelete) {
        permanentlyDeleteVinculador(selectedVinculador.id);
      } else {
        deleteVinculador(selectedVinculador.id);
      }
      setIsDeleteDialogOpen(false);
      setSelectedVinculador(null);
    }
  };

  const handleRestore = (vinculador: Vinculador) => {
    restoreVinculador(vinculador.id);
  };

  const handleExport = async () => {
    const csvBlob = await fetchAllForExport();
    if (!csvBlob) return;
    
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vinculadores_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  const handleFilter = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  return (
    <Main>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Gestión de Vinculadores
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Gestiona y administra todos los vinculadores del sistema
          </p>
        </div>

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
                    <Plus className="h-4 w-4" /> Nuevo Vinculador
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
                    placeholder="Buscar por nombre, cédula, email o área..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={handleFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="deleted">Inhabilitados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedVinculadores.length} de {filteredVinculadores.length} vinculadores (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {filteredVinculadores.length > 0 ? (
                <>
                  <VinculadorTable
                    vinculadores={paginatedVinculadores}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
                </>
              ) : (
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay vinculadores que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o crea un nuevo vinculador
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialogs */}
          <RegisterVinculadorDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onAddVinculador={addVinculador}
          />

          <EditVinculadorDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            vinculador={selectedVinculador}
            onUpdateVinculador={updateVinculador}
          />

          <ViewVinculadorDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            vinculador={selectedVinculador}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar Vinculador"}
                </DialogTitle>
                <DialogDescription>
                  {isPermanentDelete
                    ? `¿Estás seguro de eliminar permanentemente a ${selectedVinculador?.nombre} ${selectedVinculador?.apellido}? Esta acción no se puede deshacer.`
                    : `¿Estás seguro de eliminar a ${selectedVinculador?.nombre} ${selectedVinculador?.apellido}? Podrás restaurarlo más tarde.`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>
    </Main>
  );
}
