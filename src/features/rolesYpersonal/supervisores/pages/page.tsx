"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { Search, Users, Plus, Filter, RefreshCw, Loader2 } from "lucide-react";
import Main from '../../../main/pages/page';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { useSupervisores } from "../hooks/useSupervisores";
import { SupervisorTable } from "../components/SupervisorTable";
import { RegisterSupervisorDialog } from "../components/RegisterSupervisorDialog";
import { EditSupervisorDialog } from "../components/EditSupervisorDialog";
import { ViewSupervisorDialog } from "../components/ViewSupervisorDialog";
import { StatsCards } from "../components/StatsCards";
import type { Supervisor } from "../types";

export default function SupervisoresPage() {
  const {
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
    isLoading,
    stats,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
    restoreSupervisor,
    permanentlyDeleteSupervisor,
    refetch,
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
    const supervisor = paginatedSupervisores.find(s => s.id === id);
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
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Users className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Supervisores</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra y supervisa al personal encargado del seguimiento institucional de las pasantías.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Supervisores</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y administración del equipo de supervisión</p>
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

              {!isReadOnly && (
                <Button
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nuevo Supervisor
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, cédula o email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={handleFilter}>
                    <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-primary" />
                        <SelectValue placeholder="Estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="todos" className="text-xs font-bold">Todos los estados</SelectItem>
                      <SelectItem value="Activo" className="text-xs font-bold">Activo</SelectItem>
                      <SelectItem value="Inactivo" className="text-xs font-bold">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedSupervisores.length} de {filteredSupervisores.length} supervisores
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {/* Table */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Users className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando supervisores...</p>
                </div>
              ) : filteredSupervisores.length > 0 ? (
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
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                      <p className="text-sm text-muted-foreground font-medium">
                        Página <span className="text-foreground">{currentPage}</span> de {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="rounded-xl font-bold h-9 text-xs"
                        >
                          Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .map((p, i, arr) => (
                              <div key={p} className="flex items-center gap-1">
                                {i > 0 && arr[i-1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                                <Button
                                  variant={currentPage === p ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(p)}
                                  className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === p ? 'shadow-md shadow-primary/20' : ''}`}
                                >
                                  {p}
                                </Button>
                              </div>
                            ))
                          }
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="rounded-xl font-bold h-9 text-xs"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
                  <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                    <Search className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    No hay supervisores que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                    Intenta ajustar los filtros o registra un nuevo supervisor para comenzar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
          <DialogContent className="rounded-2xl border-2">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">
                {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar Supervisor"}
              </DialogTitle>
              <DialogDescription className="font-medium">
                {isPermanentDelete
                  ? `¿Estás seguro de eliminar permanentemente a ${selectedSupervisor?.nombre} ${selectedSupervisor?.apellido}? Esta acción no se puede deshacer.`
                  : `¿Estás seguro de eliminar a ${selectedSupervisor?.nombre} ${selectedSupervisor?.apellido}? Podrás restaurarlo más tarde.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl font-bold">
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} className="rounded-xl font-bold shadow-md shadow-destructive/20">
                {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  );
}
