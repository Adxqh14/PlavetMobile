"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card"

import { useCentroTrabajo } from "../hooks/useCentroTrabajo"
import { useImportExportCentros } from "../hooks/useImportExportCentros"
import { StatsCards } from "../components/stats-cards"
import { HistorialDialog } from "../components/HistorialDialog"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import { RegisterCenterDialog } from "../components/register-center-dialog"
import { ViewCenterDialog } from "../components/view-center-dialog"
import { EditCenterDialog } from "../components/edit-center-dialog"
import type { CentroTrabajo } from "../types"
import Main from "@/features/main/pages/page"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isReadOnlyRole } from "@/shared/config/rbac"

import { CentrosHeader } from "../components/CentrosHeader"
import { CentrosActionBar } from "../components/CentrosActionBar"
import { CentrosFilters } from "../components/CentrosFilters"
import { CentrosTableList } from "../components/CentrosTableList"

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
    bulkImportCentros,
    loading: isLoading,
    refetch,
  } = useCentroTrabajo();
  
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "TUTOR ACADEMICO";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<CentroTrabajo | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const { fileInputRef, isImporting, handleImportClick, handleFileChange, handleExport } = useImportExportCentros({
    bulkImportCentros,
    filteredCentros,
  });

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
    setIsPermanentDelete(centro.status === 'inactivo');
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
    setStatusFilter("todos");
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  const deletedCentros = centros.filter(c => c.status === 'inactivo');

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">

        <CentrosHeader />

        <div className="w-full pb-12 px-6 md:px-12">
          <CentrosActionBar
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            isImporting={isImporting}
            refetch={refetch}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleImportClick={handleImportClick}
            handleExport={handleExport}
            onNewCentro={() => setIsDialogOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />

          {/* Stats Cards */}
          <div>
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow mt-10">
            <CardHeader className="border-b bg-muted/10 p-6">
              <CentrosFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                statusFilter={statusFilter}
                onFilterChange={handleFilterChange}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedCentros.length} de {filteredCentros.length} centros
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              <CentrosTableList
                isLoading={isLoading}
                isReadOnly={isReadOnly}
                filteredCentros={filteredCentros}
                paginatedCentros={paginatedCentros}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onView={handleView}
                onEdit={handleEdit}
                onDeleteRequest={handleDeleteRequest}
                onRestore={handleRestore}
              />
            </CardContent>
          </Card>
        </div>

        {/* --- Diálogos --- */}
        <ViewCenterDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          centro={selectedCentro}
        />

        <EditCenterDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          centro={selectedCentro}
          onUpdateCentro={updateCentro}
        />

        <RegisterCenterDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddCentro={addCentro}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          centroNombre={selectedCentro?.name || ''}
          isPermanent={isPermanentDelete}
        />

        <HistorialDialog
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          deletedCentros={deletedCentros}
          onRestore={handleRestore}
          onPermanentDelete={permanentlyDeleteCentro}
        />
      </div>
    </Main>
  )
}
