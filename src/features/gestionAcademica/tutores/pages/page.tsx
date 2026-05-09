import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";

import Main from '../../../main/pages/page';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { useTutores } from "../hooks/useTutores";
import { useImportExportTutores } from "../hooks/useImportExportTutores";

import { RegisterTutorDialog } from "../components/register-tutor-dialog";
import { EditTutorDialog } from "../components/edit-tutor-dialog";
import { ViewTutorDialog } from "../components/view-tutor-dialog";
import { StatsCards } from "@/features/gestionAcademica/tutores/components/StatsCards";
import type { Tutor } from "../types";

import { TutoresHeader } from "../components/TutoresHeader";
import { TutoresActionBar } from "../components/TutoresActionBar";
import { TutoresFilters } from "../components/TutoresFilters";
import { TutoresTableList } from "../components/TutoresTableList";

export default function TutoresAcademicosPage() {
  const {
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
    isLoading,
    stats,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
    bulkImportTutores,
    refetch,
  } = useTutores();
  
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const { fileInputRef, handleImportClick, handleFileChange, handleExport } = useImportExportTutores({
    bulkImportTutores,
    filteredTutores,
  });

  const handleView = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const tutor = paginatedTutores.find(t => t.id === id);
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
        <TutoresHeader />

        <div className="w-full pb-12 px-6 md:px-12">
          <TutoresActionBar
            isLoading={isLoading}
            isReadOnly={isReadOnly}
            refetch={refetch}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleImportClick={handleImportClick}
            handleExport={handleExport}
            onNewTutor={() => setIsDialogOpen(true)}
          />

          {/* Stats Cards */}
          <div>
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow mt-10">
            <CardHeader className="border-b bg-muted/10 p-6">
              <TutoresFilters
                searchTerm={searchTerm}
                onSearchChange={handleSearch}
                statusFilter={statusFilter}
                onFilterChange={handleFilter}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedTutores.length} de {filteredTutores.length} tutores 
                <span className="mx-2 opacity-30">|</span> 
                Página {currentPage} de {totalPages}
              </p>

              <TutoresTableList
                isLoading={isLoading}
                isReadOnly={isReadOnly}
                filteredTutores={filteredTutores}
                paginatedTutores={paginatedTutores}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onView={handleView}
                onEdit={handleEdit}
                onDeleteRequest={handleDelete}
                onRestore={handleRestore}
              />
            </CardContent>
          </Card>
        </div>

        {/* Diálogos */}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isPermanentDelete ? "Eliminar Permanentemente" : "Inhabilitar Tutor"}
              </DialogTitle>
              <DialogDescription>
                {isPermanentDelete
                  ? `¿Estás seguro de eliminar permanentemente a ${selectedTutor?.nombre} ${selectedTutor?.apellido}? Esta acción no se puede deshacer.`
                  : `¿Estás seguro de inhabilitar a ${selectedTutor?.nombre} ${selectedTutor?.apellido}? Podrás reactivarlo más tarde.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                {isPermanentDelete ? "Eliminar Permanentemente" : "Inhabilitar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  );
}
