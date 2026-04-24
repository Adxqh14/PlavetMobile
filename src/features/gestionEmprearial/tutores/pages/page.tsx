"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Search, Users, Plus, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Main from '../../../main/pages/page';
import { useTutores } from "../hooks/useTutores";
import { TutorTable } from "../components/TutorTable";
import { RegisterTutorDialog } from "../components/register-tutor-dialog";
import { EditTutorDialog } from "../components/edit-tutor-dialog";
import { ViewTutorDialog } from "../components/view-tutor-dialog";
import type { Tutor } from "../types";

export default function TutoresPage() {
  const {
    tutores,
    filteredTutores,
    paginatedTutores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
  } = useTutores();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleView = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const tutor = tutores.find(t => t.id === id);
    if (tutor) {
      setSelectedTutor(tutor);
      setIsPermanentDelete(tutor.status === 'deleted');
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedTutor) {
      if (isPermanentDelete) {
        permanentlyDeleteTutor(selectedTutor.id);
      } else {
        deleteTutor(selectedTutor.id);
      }
      setIsDeleteDialogOpen(false);
      setSelectedTutor(null);
    }
  };

  const handleRestore = (tutor: Tutor) => {
    restoreTutor(tutor.id);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Especialidad Técnica', 'Área Asignada', 'Estado', 'Fecha Contratación'],
      ...filteredTutores.map(tutor => [
        tutor.id,
        tutor.nombre,
        tutor.apellido,
        tutor.email,
        tutor.telefono,
        tutor.especialidadTecnica,
        tutor.areaAsignada,
        tutor.status,
        tutor.fechaContratacion
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tutores_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Gestión de Tutores
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Gestiona y administra todos los tutores del sistema
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
                    <Plus className="h-4 w-4" /> Nuevo Tutor
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
                    placeholder="Buscar por nombre, email, especialidad técnica..."
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
                Mostrando {paginatedTutores.length} de {filteredTutores.length} tutores (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {filteredTutores.length > 0 ? (
                <>
                  <TutorTable
                    tutores={paginatedTutores}
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
                    No hay tutores que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros o crea un nuevo tutor
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialogs */}
          <RegisterTutorDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onAddTutor={addTutor}
          />

          <EditTutorDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            tutor={selectedTutor}
            onUpdateTutor={updateTutor}
          />

          <ViewTutorDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            tutor={selectedTutor}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar Tutor"}
                </DialogTitle>
                <DialogDescription>
                  {isPermanentDelete
                    ? `¿Estás seguro de eliminar permanentemente a ${selectedTutor?.nombre} ${selectedTutor?.apellido}? Esta acción no se puede deshacer.`
                    : `¿Estás seguro de eliminar a ${selectedTutor?.nombre} ${selectedTutor?.apellido}? Podrás restaurarlo más tarde.`}
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
