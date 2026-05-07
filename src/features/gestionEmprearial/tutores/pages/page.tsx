"use client";

import { useState, useRef } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Upload,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "../../../../shared/components/ui/button";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select";

import { useTutores } from "../hooks/useTutores";
import { TutorTable } from "../components/TutorTable";
import { StatsCards } from "../components/StatsCards";
import { RegisterTutorDialog } from "../components/register-tutor-dialog";
import { EditTutorDialog } from "../components/edit-tutor-dialog";
import { ViewTutorDialog } from "../components/view-tutor-dialog";
import { DeleteConfirmDialog } from "../../centroDeTrabajo/components/DeleteConfirmDialog";
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

  const handleRefresh = async () => {
    await refetch();
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
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

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
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
                Tutores <span className="text-primary">Empresariales</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Gestiona y supervisa a los responsables del seguimiento de los estudiantes en los centros de trabajo.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Tutores</h2>
              <p className="text-muted-foreground font-medium text-sm">Administración de perfiles y accesos</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" /> Exportar CSV
              </Button>

              {!isReadOnly && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImportClick}
                    disabled={isImporting}
                    className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                  >
                    {isImporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Importar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Nuevo Tutor
                  </Button>
                </>
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
                    placeholder="Buscar por nombre, apellido o cargo..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={handleFilterChange}>
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

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground font-medium">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" /> Anterior
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          Siguiente <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
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

        {/* Dialogs */}
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
