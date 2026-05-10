"use client";

import { useState } from "react";
import {
  Briefcase,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";

import { usePasantias } from "../hooks/usePasantias";
import { StatsCards } from "../components/StatsCards";
import { PasantiaTableRow } from "../components/PasantiaTableRow";
import {
  CreatePasantiaDialog,
  ViewPasantiaDialog,
  DeletePasantiaDialog,
} from "../components/PasantiaDialogs";
import { EditPasantiaDialog } from "../components/EditPasantiaDialog";
import type { Pasantia } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { PasantiasHero } from "../components/PasantiasHero";
import { PasantiasActionBar } from "../components/PasantiasActionBar";
import { PasantiasFilters } from "../components/PasantiasFilters";
import { PasantiasPagination } from "../components/PasantiasPagination";

export default function GestionPasantiasPage() {
  const {
    pasantias,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    addPasantia,
    updatePasantia,
    deletePasantia,
    updateEstado,
    refreshPasantias
  } = usePasantias();
  const { userRole, user } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);

  const handleViewPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsViewDialogOpen(true);
  };

  const handleEditPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    await deletePasantia(id);
    setIsDeleteDialogOpen(false);
    setSelectedPasantia(null);
  };

  const handleExport = () => {
    const csv = [
      ["Estudiante", "Plaza", "Centro de Trabajo", "Tutor", "Fecha Inicio", "Fecha Fin", "Horas", "Estado"],
      ...pasantias.map(p => [
        `${p.estudiante?.nombre ?? ""} ${p.estudiante?.apellido ?? ""}`.trim(),
        p.plaza?.nombre_plaza ?? "N/A",
        p.centro_trabajo?.nombre ?? "N/A",
        `${p.tutor_empresarial?.nombre ?? ""} ${p.tutor_empresarial?.apellido ?? ""}`.trim(),
        p.fecha_inicio,
        p.fecha_fin || "N/A",
        p.horas_acumuladas,
        p.estado,
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pasantias_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <PasantiasHero userRole={userRole} userTaller={user?.taller} />

        <div className="w-full pb-12 px-6 md:px-12">
          <PasantiasActionBar 
            onRefresh={refreshPasantias}
            isLoading={loading}
            onExport={handleExport}
            isReadOnly={isReadOnly}
            onOpenCreate={() => setIsCreateDialogOpen(true)}
          />

          <StatsCards stats={stats} />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <PasantiasFilters 
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  resetPage();
                }}
                filterEstado={filterEstado}
                onFilterChange={(val) => {
                  setFilterEstado(val);
                  resetPage();
                }}
              />
            </CardHeader>

            <CardContent className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando pasantías...</p>
                </div>
              ) : pasantias.length > 0 ? (
                <>
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 border-b">
                          <TableHead className="font-semibold py-4 pl-6">Estudiante</TableHead>
                          <TableHead className="font-semibold py-4">Plaza / Centro</TableHead>
                          <TableHead className="font-semibold py-4">Tutor Responsable</TableHead>
                          <TableHead className="font-semibold py-4">Progreso</TableHead>
                          <TableHead className="font-semibold py-4">Estado</TableHead>
                          <TableHead className="font-semibold py-4 text-right pr-6">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pasantias.map((pasantia) => (
                          <PasantiaTableRow
                            key={pasantia.id}
                            pasantia={pasantia}
                            onView={handleViewPasantia}
                            onEdit={isReadOnly ? undefined : handleEditPasantia}
                            onDelete={isReadOnly ? undefined : handleOpenDeleteDialog}
                            onUpdateEstado={isReadOnly ? undefined : updateEstado}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <PasantiasPagination 
                    totalItems={totalItems}
                    currentItemsCount={pasantias.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
                  <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                    <Briefcase className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">No hay pasantías</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium mb-6">
                    No se encontraron expedientes que coincidan con los criterios de búsqueda.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="rounded-xl font-bold h-10 text-xs">
                    <Plus className="h-4 w-4 mr-2" /> Crear primera pasantía
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <CreatePasantiaDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={addPasantia}
        />

        <ViewPasantiaDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          pasantia={selectedPasantia}
        />

        <DeletePasantiaDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          pasantia={selectedPasantia}
        />

        <EditPasantiaDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          pasantia={selectedPasantia}
          onUpdate={updatePasantia}
        />
      </div>
    </Main>
  );
}
