"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { Badge } from "../../../../shared/components/ui/badge";

import { usePlazas } from "../hooks/usePlazas";
import { useImportExportPlazas } from "../hooks/useImportExportPlazas";
import { StatsCards } from "../components/StatsCards";
import {
  CreatePlazaDialog,
  EditPlazaDialog,
  ViewPlazaDialog,
  DeletePlazaDialog,
} from "../components/PlazaDialogs";
import type { Plaza } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

import { PlazasHeader } from "../components/PlazasHeader";
import { PlazasActionBar } from "../components/PlazasActionBar";
import { PlazasFilters } from "../components/PlazasFilters";
import { PlazasTableList } from "../components/PlazasTableList";

export default function PlazasPage() {
  const {
    filteredPlazas,
    paginatedPlazas,
    centros,
    talleres,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    loading: isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPlaza,
    updatePlaza,
    deletePlaza,
    bulkImportPlazas,
    refetch,
  } = usePlazas();
  
  const { userRole, user } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "TUTOR ACADEMICO";
  const initialCentro = userRole === "TUTOR EMPRESARIAL"
    ? user?.datos_rol?.centro_trabajo?.nombre
    : undefined;

  // ── Dialog state ───────────────────────────────────────────────────────
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);

  const { fileInputRef, isImporting, handleImportClick, handleFileChange, handleExport } = useImportExportPlazas({
    bulkImportPlazas,
    filteredPlazas,
    centros,
    talleres,
  });

  // ── Badge helpers ──────────────────────────────────────────────────────
  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Activa: "bg-emerald-100 text-emerald-700",
      Ocupada: "bg-blue-100 text-blue-700",
      Inhabilitada: "bg-gray-100 text-gray-700",
    };
    return (
      <Badge className={`${styles[estado] || ""} border-none shadow-none font-bold text-[10px] uppercase tracking-wider`}>
        {estado}
      </Badge>
    );
  };

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleView = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlaza) {
      deletePlaza(selectedPlaza.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRestore = (plaza: Plaza) => {
    updatePlaza({ ...plaza, estado: "Activa" });
    setFilterEstado("todos");
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
        
        <PlazasHeader />

        <div className="w-full pb-12 px-6 md:px-12">
          <PlazasActionBar
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            isImporting={isImporting}
            refetch={refetch}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleImportClick={handleImportClick}
            handleExport={handleExport}
            onNewPlaza={() => setIsDialogOpen(true)}
          />

          {/* Stats Cards */}
          <div id="tour-plazas-stats">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <PlazasFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterEstado={filterEstado}
                onFilterChange={handleFilterChange}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedPlazas.length} de {filteredPlazas.length} plazas
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {/* Error banner */}
              {error && (
                <div className="rounded-xl bg-destructive/10 text-destructive px-4 py-3 mb-6 text-sm font-bold border border-destructive/20">
                  {error}
                </div>
              )}

              <PlazasTableList
                isLoading={isLoading}
                isReadOnly={isReadOnly}
                filteredPlazas={filteredPlazas}
                paginatedPlazas={paginatedPlazas}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                filterEstado={filterEstado}
                onView={handleView}
                onEdit={handleEdit}
                onDeleteRequest={handleDeleteRequest}
                onRestore={handleRestore}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Dialogs ─────────────────────────────────────────────────────── */}
        <DeletePlazaDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          plazaNombre={selectedPlaza?.nombre}
          isInhabilitada={selectedPlaza?.estado === "Inhabilitada"}
        />

        <CreatePlazaDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={addPlaza}
          centros={centros}
          talleres={talleres}
          initialCentro={initialCentro}
        />

        <EditPlazaDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          plaza={selectedPlaza}
          onSubmit={updatePlaza}
          centros={centros}
          talleres={talleres}
        />

        <ViewPlazaDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          plaza={selectedPlaza}
          getEstadoBadge={getEstadoBadge}
        />
      </div>
    </Main>
  );
}