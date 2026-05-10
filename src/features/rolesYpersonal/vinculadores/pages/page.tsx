"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";
import Main from '../../../main/pages/page';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { useVinculadores } from "../hooks/useVinculadores";
import { VinculadorTable } from "../components/VinculadorTable";
import { RegisterVinculadorDialog } from "../components/RegisterVinculadorDialog";
import { EditVinculadorDialog } from "../components/EditVinculadorDialog";
import { ViewVinculadorDialog } from "../components/ViewVinculadorDialog";
import { StatsCards } from "../components/StatsCards";
import type { Vinculador } from "../types";
import { VinculadoresHero } from "../components/VinculadoresHero";
import { VinculadoresActionBar } from "../components/VinculadoresActionBar";
import { VinculadoresFilters } from "../components/VinculadoresFilters";
import { VinculadoresPagination } from "../components/VinculadoresPagination";
import { DeleteVinculadorDialog } from "../components/DeleteVinculadorDialog";

export default function VinculadoresPage() {
  const {
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
    isLoading,
    stats,
    addVinculador,
    updateVinculador,
    deleteVinculador,
    restoreVinculador,
    permanentlyDeleteVinculador,
    refetch,
  } = useVinculadores();
  
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

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
    const vinculador = paginatedVinculadores.find(v => v.id === id);
    if (vinculador) {
      setSelectedVinculador(vinculador);
      setIsPermanentDelete(!!vinculador.deleted_at);
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

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <VinculadoresHero />

        <div className="w-full pb-12 px-6 md:px-12">
          <VinculadoresActionBar 
            onRefresh={refetch}
            isLoading={isLoading}
            onOpenCreate={() => setIsDialogOpen(true)}
            isReadOnly={isReadOnly}
          />

          <StatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <VinculadoresFilters 
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
                Mostrando {paginatedVinculadores.length} de {filteredVinculadores.length} vinculadores
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Users className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando vinculadores...</p>
                </div>
              ) : filteredVinculadores.length > 0 ? (
                <>
                  <VinculadorTable
                    vinculadores={paginatedVinculadores}
                    onView={handleView}
                    onEdit={isReadOnly ? undefined : handleEdit}
                    onDelete={isReadOnly ? undefined : handleDelete}
                    onRestore={isReadOnly ? undefined : restoreVinculador}
                  />

                  <VinculadoresPagination 
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
                    No hay vinculadores que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                    Intenta ajustar los filtros o registra un nuevo vinculador para comenzar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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

        <DeleteVinculadorDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          vinculador={selectedVinculador}
          isPermanentDelete={isPermanentDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </Main>
  );
}
