"use client"

import { useState, useRef } from "react"
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Upload,
} from "lucide-react"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { Button } from "../../../../shared/components/ui/button"
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card"
import { Input } from "../../../../shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select"

import { useCentroTrabajo } from "../hooks/useCentroTrabajo"
import { StatsCards } from "../components/stats-cards"
import { CentroTable } from "../components/CentroTable"
import { HistorialDialog } from "../components/HistorialDialog"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import { RegisterCenterDialog } from "../components/register-center-dialog"
import { ViewCenterDialog } from "../components/view-center-dialog"
import { EditCenterDialog } from "../components/edit-center-dialog"
import type { CentroTrabajo, CreateCentroData } from "../types"
import Main from "@/features/main/pages/page"
import { useTour } from "../../../../shared/hooks/useTour"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isReadOnlyRole } from "@/shared/config/rbac"

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useTour('tutorial_centros_trabajo', [
    { element: '#tour-centros-stats', popover: { title: 'Métricas de Centros', description: 'Visión general de las empresas y organizaciones.', side: "bottom" } },
    { element: '#tour-centros-add', popover: { title: 'Nuevo Centro', description: 'Registra un nuevo centro de trabajo colaborador.', side: "left" } },
    { element: '#tour-centros-history', popover: { title: 'Historial', description: 'Revisa los centros inactivos o eliminados.', side: "bottom" } },
    { element: '#tour-centros-export', popover: { title: 'Exportar Datos', description: 'Descarga la lista actual en formato CSV.', side: "bottom" } },
    { element: '#tour-centros-table', popover: { title: 'Lista de Centros', description: 'Visualiza y gestiona las empresas afiliadas.', side: "top" } }
  ], 500);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<CentroTrabajo | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Ubicación', 'Empleados', 'Estado', 'Validado', 'Fecha Creación'],
      ...filteredCentros.map(centro => [
        centro.id,
        centro.name,
        centro.location,
        centro.employees,
        centro.status,
        centro.validated ? 'Validado' : 'No Validado',
        centro.createdAt
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `centros_trabajo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          name?: string;
          centro?: string;
          Email?: string;
          email?: string;
          Telefono?: string;
          telefono?: string;
          RestriccionEdad?: string;
          restriccion?: boolean;
        }
        const data = XLSX.utils.sheet_to_json(ws) as ExcelRow[];

        const mappedData: CreateCentroData[] = data.map(row => ({
          name: row.Nombre || row.name || row.centro || '',
          email: row.Email || row.email || '',
          telefono: String(row.Telefono || row.telefono || ''),
          restriccion_edad: row.RestriccionEdad === 'Sí' || row.restriccion === true,
          status: 'activo' as const,
        })).filter(c => c.name);

        if (mappedData.length === 0) {
          toast.error("No se encontraron datos válidos para importar.");
          setIsImporting(false);
          return;
        }

        const result = await bulkImportCentros(mappedData);
        toast.success(`Importación finalizada: ${result.success} exitosos, ${result.errors} errores.`);
        if (result.firstError) {
          console.error("Primer error de importación:", result.firstError);
        }
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

  const deletedCentros = centros.filter(c => c.status === 'inactivo');

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">

        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Briefcase className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión <span className="text-primary">Empresarial</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra y supervisa todos los centros de trabajo colaboradores del programa.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Centros de Trabajo</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y seguimiento de empresas colaboradoras</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={isLoading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>

              <Button
                id="tour-centros-history"
                variant="outline"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                Historial
              </Button>

              <Button
                id="tour-centros-export"
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
                    id="tour-centros-add"
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                    className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Nuevo Centro
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div id="tour-centros-stats">
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div id="tour-centros-filters" className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o ubicación..."
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
                      <SelectItem value="activo" className="text-xs font-bold">Activo</SelectItem>
                      <SelectItem value="inactivo" className="text-xs font-bold">Inactivo</SelectItem>
                      <SelectItem value="pending" className="text-xs font-bold">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedCentros.length} de {filteredCentros.length} centros
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Briefcase className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Sincronizando centros de trabajo...</p>
                </div>
              ) : filteredCentros.length > 0 ? (
                <>
                  <div id="tour-centros-table" className="rounded-xl border overflow-x-auto bg-background max-w-full">
                    <CentroTable
                      centros={paginatedCentros}
                      onView={handleView}
                      onEdit={isReadOnly ? undefined : handleEdit}
                      onDelete={isReadOnly ? undefined : (id) => {
                        const centro = centros.find(c => c.id === id);
                        if (centro) handleDeleteRequest(centro);
                      }}
                      onRestore={isReadOnly ? undefined : handleRestore}
                    />
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
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
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
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
                          Siguiente
                          <ChevronRight className="h-4 w-4" />
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
                    No se encontraron centros de trabajo
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {searchTerm || statusFilter !== "todos"
                      ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
                      : "Comienza registrando el primer centro de trabajo en el sistema."}
                  </p>
                </div>
              )}
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
