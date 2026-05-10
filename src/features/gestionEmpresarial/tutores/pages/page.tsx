"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Loader2, Users, Search } from "lucide-react";

import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { useTutores } from "../hooks/useTutores";
import { TutorTable } from "../components/TutorTable";
import { StatsCards } from "../components/StatsCards";
import { RegisterTutorDialog } from "../components/register-tutor-dialog";
import { EditTutorDialog } from "../components/edit-tutor-dialog";
import { ViewTutorDialog } from "../components/view-tutor-dialog";
import { DeleteConfirmDialog } from "../../centroDeTrabajo/components/DeleteConfirmDialog";
import { TutorHero } from "../components/TutorHero";
import { TutorActionBar } from "../components/TutorActionBar";
import { TutorFilters } from "../components/TutorFilters";
import { TutorPagination } from "../components/TutorPagination";

import type { Tutor, CreateTutorData } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

export default function TutoresEmpresarialPage() {
  const {
    paginatedTutores,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    stats,
    isLoading,
    addTutor,
    updateTutor,
    deleteTutor,
    restoreTutor,
    permanentlyDeleteTutor,
    fetchAllForExport,
    bulkImportTutores,
    refetch,
  } = useTutores();

  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "TUTOR ACADEMICO";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleView = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRequest = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setIsPermanentDelete(tutor.estado === 'Inactivo');
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTutor) {
      if (isPermanentDelete) {
        permanentlyDeleteTutor(selectedTutor.id);
      } else {
        deleteTutor(selectedTutor.id);
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleRestore = (tutor: Tutor) => {
    restoreTutor(tutor.id);
    setStatusFilter("todos");
  };

  const handleExport = async () => {
    const csvBlob = await fetchAllForExport();
    if (!csvBlob) return;

    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tutores_empresariales_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        interface ExcelRow {
          Nombre?: string;
          nombre?: string;
          Apellido?: string;
          apellido?: string;
          Email?: string;
          email?: string;
          Telefono?: string;
          telefono?: string;
          Cedula?: string;
          cedula?: string;
          Departamento?: string;
          departamento?: string;
          Cargo?: string;
          cargo?: string;
          Centro?: string;
          centro?: string;
          NombreCentro?: string;
          nombre_centro?: string;
        }
        
        const data = XLSX.utils.sheet_to_json(ws) as ExcelRow[];

        const mappedData: CreateTutorData[] = data.map(row => ({
          nombre: row.Nombre || row.nombre || '',
          apellido: row.Apellido || row.apellido || '',
          email: row.Email || row.email || '',
          telefono: String(row.Telefono || row.telefono || ''),
          cedula: row.Cedula || row.cedula || '',
          departamento: row.Departamento || row.departamento || row.Cargo || row.cargo || 'Tutor',
          centro_trabajo_nombre: row.Centro || row.centro || row.NombreCentro || row.nombre_centro || '',
        })).filter(t => t.nombre && t.apellido && t.email && t.centro_trabajo_nombre);

        if (mappedData.length === 0) {
          toast.error("No se encontraron datos válidos (Nombre, Apellido y Email requeridos).");
          setIsImporting(false);
          return;
        }

        const result = await bulkImportTutores(mappedData);
        toast.success(`Importación finalizada: ${result.success} exitosos, ${result.errors} errores.`);
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        toast.error("Error al procesar el archivo Excel/CSV.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <TutorHero />

        <div className="w-full pb-12 px-6 md:px-12">
          <TutorActionBar 
            isLoading={isLoading}
            onRefresh={refetch}
            onExport={handleExport}
            onImportClick={() => fileInputRef.current?.click()}
            isImporting={isImporting}
            onNewTutor={() => setIsDialogOpen(true)}
            isReadOnly={isReadOnly}
          />

          {!isReadOnly && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
          )}

          <StatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <TutorFilters 
                searchTerm={searchTerm}
                onSearchChange={(val) => { setSearchTerm(val); resetPage(); }}
                statusFilter={statusFilter}
                onFilterChange={(val) => { setStatusFilter(val); resetPage(); }}
              />
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedTutores.length} de {paginatedTutores.length} tutores
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Users className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando tutores...</p>
                </div>
              ) : paginatedTutores.length > 0 ? (
                <>
                  <div className="rounded-xl border overflow-x-auto bg-background max-w-full">
                    <TutorTable
                      tutores={paginatedTutores}
                      onView={handleView}
                      onEdit={isReadOnly ? undefined : handleEdit}
                      onDelete={isReadOnly ? undefined : (id) => {
                        const tutor = paginatedTutores.find(t => t.id === id);
                        if (tutor) handleDeleteRequest(tutor);
                      }}
                      onRestore={isReadOnly ? undefined : handleRestore}
                    />
                  </div>

                  <TutorPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-20 text-center bg-muted/5">
                  <div className="p-5 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    No se encontraron tutores
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {searchTerm || statusFilter !== "todos"
                      ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
                      : "Comienza registrando al primer tutor empresarial."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <RegisterTutorDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddTutor={addTutor}
        />

        <EditTutorDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          tutor={selectedTutor}
          onUpdateTutor={(id, data) => updateTutor(id, data)}
        />

        <ViewTutorDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          tutor={selectedTutor}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          centroNombre={`${selectedTutor?.nombre} ${selectedTutor?.apellido}`}
          isPermanent={isPermanentDelete}
        />
      </div>
    </Main>
  );
}
