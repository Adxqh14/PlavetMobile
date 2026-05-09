"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { Badge } from "../../../../shared/components/ui/badge";

import { useEstudiantes } from "../../estudiantes/hooks/useEstudiantes";
import { StatsCards } from "../components/StatsCards";
import {
  CreateEstudianteDialog,
  EditEstudianteDialog,
  ViewEstudianteDialog,
  DeleteEstudianteDialog,
} from "../components/EstudianteDialogs.tsx";
import type { Estudiante } from "../types";
import Main from "../../../../features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "../../../../shared/config/rbac";
import { useImportExportEstudiantes } from "../hooks/useImportExportEstudiantes";

import { EstudiantesHeader } from "../components/EstudiantesHeader";
import { EstudiantesActionBar } from "../components/EstudiantesActionBar";
import { EstudiantesFilters } from "../components/EstudiantesFilters";
import { EstudiantesTableList } from "../components/EstudiantesTableList";

export default function EstudiantesPage() {
  const {
    filteredEstudiantes,
    paginatedEstudiantes,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addEstudiante,
    updateEstudiante,
    deleteEstudiante,
    restoreEstudiante,
    fetchAllForExport,
    bulkImportEstudiantes,
    isLoading,
    refetch,
  } = useEstudiantes();

  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null);

  const { fileInputRef, handleImportClick, handleFileChange, handleExport } = useImportExportEstudiantes({
    bulkImportEstudiantes,
    fetchAllForExport,
  });

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Activo: "bg-emerald-100 text-emerald-700",
      Inactivo: "bg-gray-100 text-gray-700",
      Suspendido: "bg-amber-100 text-amber-700",
    };
    return (
      <Badge className={`${styles[estado] || ""} border-none shadow-none`}>
        {estado}
      </Badge>
    );
  };

  const handleView = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEstudiante) return;
    await deleteEstudiante(selectedEstudiante.id);
    setIsDeleteDialogOpen(false);
    setSelectedEstudiante(null);
  };

  const handleRestore = async (estudiante: Estudiante) => {
    await restoreEstudiante(estudiante.id);
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
        <EstudiantesHeader />

        <div className="w-full pb-12 px-6 md:px-12">
          <EstudiantesActionBar
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            refetch={refetch}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleImportClick={handleImportClick}
            handleExport={handleExport}
            onNewEstudiante={() => setIsDialogOpen(true)}
          />

          <div id="tour-estudiantes-stats">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <EstudiantesFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filterEstado={filterEstado}
                onFilterChange={handleFilterChange}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedEstudiantes.length} de {filteredEstudiantes.length} estudiantes 
                <span className="mx-2 opacity-30">|</span> 
                Página {currentPage} de {totalPages}
              </p>

              <EstudiantesTableList
                isLoading={isLoading}
                filteredEstudiantes={filteredEstudiantes}
                paginatedEstudiantes={paginatedEstudiantes}
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

        {/* --- Dialogos y Modales --- */}
        <DeleteEstudianteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          estudianteNombre={`${selectedEstudiante?.nombre} ${selectedEstudiante?.apellido}`}
          isInactivo={selectedEstudiante?.estado === 'Inactivo' || selectedEstudiante?.estado === 'Suspendido'}
        />

        <CreateEstudianteDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={addEstudiante}
        />

        <EditEstudianteDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          estudiante={selectedEstudiante}
          onSubmit={updateEstudiante}
        />

        <ViewEstudianteDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          estudiante={selectedEstudiante}
          getEstadoBadge={getEstadoBadge}
        />
      </div>
    </Main>
  );
}
