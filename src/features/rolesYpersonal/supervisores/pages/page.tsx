"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";
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
import { SupervisoresHero } from "../components/SupervisoresHero";
import { SupervisoresActionBar } from "../components/SupervisoresActionBar";
import { SupervisoresFilters } from "../components/SupervisoresFilters";
import { SupervisoresPagination } from "../components/SupervisoresPagination";
import { DeleteSupervisorDialog } from "../components/DeleteSupervisorDialog";

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

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <SupervisoresHero />

        <div className="w-full pb-12 px-6 md:px-12">
          <SupervisoresActionBar 
            onRefresh={refetch}
            isLoading={isLoading}
            onOpenCreate={() => setIsDialogOpen(true)}
            isReadOnly={isReadOnly}
          />

          <StatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <SupervisoresFilters 
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  resetPage();
                }}
                statusFilter={statusFilter}
                onFilterChange={(val) => {
                  setStatusFilter(val);
                  resetPage();
                }}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedSupervisores.length} de {filteredSupervisores.length} supervisores
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

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
                    onRestore={isReadOnly ? undefined : (s) => restoreSupervisor(s.id)}
                  />

                  <SupervisoresPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
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

        <DeleteSupervisorDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          supervisor={selectedSupervisor}
          isPermanentDelete={isPermanentDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </Main>
  );
}
