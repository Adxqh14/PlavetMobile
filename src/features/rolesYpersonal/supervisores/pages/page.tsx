"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Search, Users, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Main from '../../../main/pages/page';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { useSupervisores } from "../hooks/useSupervisores";
import { SupervisorTable } from "../components/SupervisorTable";
import { RegisterSupervisorDialog } from "../components/RegisterSupervisorDialog";
import { EditSupervisorDialog } from "../components/EditSupervisorDialog";
import { ViewSupervisorDialog } from "../components/ViewSupervisorDialog";
import type { Supervisor } from "../types";

export default function SupervisoresPage() {
  const {
    supervisores,
    filteredSupervisores,
    paginatedSupervisores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
    restoreSupervisor,
    permanentlyDeleteSupervisor,
  } = useSupervisores();
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const handleView = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const supervisor = supervisores.find(s => s.id === id);
    if (supervisor) {
      setSelectedSupervisor(supervisor);
      setIsPermanentDelete(!!supervisor.deleted_at);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedSupervisor) {
      if (isPermanentDelete) {
        permanentlyDeleteSupervisor(selectedSupervisor.id);
      } else {
        deleteSupervisor(selectedSupervisor.id);
      }
      setIsDeleteDialogOpen(false);
      setSelectedSupervisor(null);
    }
  };

  const handleRestore = (supervisor: Supervisor) => {
    restoreSupervisor(supervisor.id);
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
              Gestión de Supervisores
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Gestiona y administra todos los supervisores del sistema
          </p>
        </div>

        {/* Main Content */}
        <Card className="border mt-8">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {!isReadOnly && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" /> Nuevo Supervisor
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, cédula o email..."
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
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Mostrando {paginatedSupervisores.length} de {filteredSupervisores.length} supervisores
              (Página {currentPage} de {totalPages})
            </p>

            {/* Table */}
            {filteredSupervisores.length > 0 ? (
              <>
                <SupervisorTable
                  supervisores={paginatedSupervisores}
                  onView={handleView}
                  onEdit={isReadOnly ? undefined : handleEdit}
                  onDelete={isReadOnly ? undefined : handleDelete}
                  onRestore={isReadOnly ? undefined : handleRestore}
                />

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
                  No hay supervisores que coincidan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intenta ajustar los filtros o registra un nuevo supervisor
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <RegisterSupervisorDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddSupervisor={addSupervisor}
        />

        <EditSupervisorDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          supervisor={selectedSupervisor}
          onUpdateSupervisor={updateSupervisor}
        />

        <ViewSupervisorDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          supervisor={selectedSupervisor}
        />

        {/* Delete Confirmation */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar Supervisor"}
              </DialogTitle>
              <DialogDescription>
                {isPermanentDelete
                  ? `¿Estás seguro de eliminar permanentemente a ${selectedSupervisor?.nombre} ${selectedSupervisor?.apellido}? Esta acción no se puede deshacer.`
                  : `¿Estás seguro de eliminar a ${selectedSupervisor?.nombre} ${selectedSupervisor?.apellido}? Podrás restaurarlo más tarde.`}
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
