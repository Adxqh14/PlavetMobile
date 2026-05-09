// ==========================================
// Página principal de gestión de Talleres
// Conectada al backend via useTalleres
// ==========================================

import { useState } from "react";
import { AlertCircle, RefreshCw, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";

import { useTalleres } from "../hooks/useTalleres";
import { useImportExportTalleres } from "../hooks/useImportExportTalleres";
import { StatsCards } from "../components/StatsCards";
import {
  CreateTallerDialog,
  EditTallerDialog,
  ViewTallerDialog,
  DeleteTallerDialog,
} from "../components/TallerDialogs";
import type { Taller, CreateTallerData } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

import { TalleresHeader } from "../components/TalleresHeader";
import { TalleresActionBar } from "../components/TalleresActionBar";
import { TalleresFilters } from "../components/TalleresFilters";
import { TalleresTableList } from "../components/TalleresTableList";

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
    isLoading,
    error,
    refetch,
    bulkImportTalleres,
  } = useTalleres();
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { fileInputRef, handleImportClick, handleFileChange, handleExport } = useImportExportTalleres({
    bulkImportTalleres,
    filteredTalleres,
  });

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

  const handleCreate = async (data: CreateTallerData) => {
    setActionError(null);
    try {
      await addTaller(data);
      setIsDialogOpen(false);
    } catch {
      setActionError("Error al crear el taller. Inténtalo de nuevo.");
    }
  };

  const handleUpdate = async (id: string, data: Partial<CreateTallerData>) => {
    setActionError(null);
    try {
      await updateTaller(id, data);
      setIsEditDialogOpen(false);
      setSelectedTaller(null);
    } catch {
      setActionError("Error al actualizar el taller. Inténtalo de nuevo.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedTaller) {
      setActionError(null);
      try {
        await deleteTaller(String(selectedTaller.id));
        setIsDeleteDialogOpen(false);
        setSelectedTaller(null);
      } catch {
        setActionError("Error al eliminar el taller. Inténtalo de nuevo.");
      }
    }
  };

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
      <div className="min-h-screen bg-background overflow-x-hidden">
        <TalleresHeader />

        <div className="w-full pb-12 px-6 md:px-12">
          <TalleresActionBar
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            userRole={userRole}
            hasFilteredTalleres={filteredTalleres.length > 0}
            refetch={refetch}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleImportClick={handleImportClick}
            handleExport={handleExport}
            onNewTaller={() => setIsDialogOpen(true)}
          />

          {/* Errores */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-sm">Error de conexión</p>
                <p className="text-xs opacity-90">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="h-8 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 font-bold text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Reintentar
              </Button>
            </div>
          )}

          {actionError && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold flex-1">{actionError}</p>
              <button onClick={() => setActionError(null)} className="opacity-50 hover:opacity-100 transition-opacity">
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div id="tour-talleres-stats" className="mb-10">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <TalleresFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterEstado={filterEstado}
                onFilterChange={handleFilterChange}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedTalleres.length} de {filteredTalleres.length} talleres 
                <span className="mx-2 opacity-30">|</span> 
                Página {currentPage} de {totalPages}
              </p>

              <TalleresTableList
                isLoading={isLoading}
                filteredTalleres={filteredTalleres}
                paginatedTalleres={paginatedTalleres}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                filterEstado={filterEstado}
                onView={handleView}
                onEdit={handleEdit}
                onDeleteRequest={handleDeleteRequest}
              />
            </CardContent>
          </Card>
        </div>

        {/* Diálogos */}
        <CreateTallerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreate}
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
          onSubmit={handleUpdate}
          taller={selectedTaller}
        />

        <DeleteTallerDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          taller={selectedTaller}
        />
      </div>
    </Main>
  );
}
