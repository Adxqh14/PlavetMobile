import { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "../../../../shared/components/ui/card";
import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../shared/components/ui/dialog";
import { 
  Search, 
  Users, 
  Plus, 
  Download, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Loader2, 
  GraduationCap, 
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import Main from '../../../main/pages/page';
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { useTutores } from "../hooks/useTutores";
import { TutorTable } from "../components/TutorTable";
import { RegisterTutorDialog } from "../components/register-tutor-dialog";
import { EditTutorDialog } from "../components/edit-tutor-dialog";
import { ViewTutorDialog } from "../components/view-tutor-dialog";
import { StatsCards } from "@/features/gestionAcademica/tutores/components/StatsCards";
import type { Tutor, CreateTutorData } from "../types";
import { toast } from "sonner";
import * as XLSX from "xlsx";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

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

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Cédula', 'Área Asignada', 'Estado'],
      ...filteredTutores.map(tutor => [
        tutor.id,
        tutor.nombre,
        tutor.apellido,
        tutor.email,
        tutor.telefono,
        tutor.cedula,
        tutor.areaAsignada,
        tutor.status,
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tutores_academicos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  const handleFilter = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const loadingToast = toast.loading("Procesando archivo e importando tutores...");
    
    const processData = async (rawData: Record<string, unknown>[]) => {
      if (rawData.length === 0) {
        toast.dismiss(loadingToast);
        toast.error("El archivo está vacío.");
        return;
      }

      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const get = (row: Record<string, unknown>, ...keys: string[]): string => {
        const rowNormKeys = Object.keys(row).reduce<Record<string, unknown>>((acc, k) => {
          acc[norm(k)] = row[k];
          return acc;
        }, {});
        for (const key of keys) {
          const val = rowNormKeys[norm(key)];
          if (val !== undefined && val !== null && String(val).trim() !== "") return String(val).trim();
        }
        return "";
      };

      const validRows: CreateTutorData[] = [];
      for (const row of rawData) {
        const nombre = get(row, "Nombre", "nombre", "first_name");
        const apellido = get(row, "Apellido", "apellido", "last_name");
        const email = get(row, "Email", "email", "correo", "contacto");
        const cedula = get(row, "Cedula", "cedula", "dni", "id");
        const telefono = get(row, "Telefono", "telefono", "phone");
        const area = get(row, "Area", "area", "taller", "taller_nombre");

        if (!nombre || !apellido || !cedula) continue;

        validRows.push({
          nombre,
          apellido,
          email,
          cedula,
          telefono,
          taller_nombre: area || "General", // Campo requerido por la interfaz
        });
      }

      toast.dismiss(loadingToast);
      if (validRows.length === 0) {
        toast.error("No se encontraron datos válidos.");
        return;
      }

      const importingToast = toast.loading(`Importando ${validRows.length} tutores...`);
      const { success, errors, firstError } = await bulkImportTutores(validRows);
      toast.dismiss(importingToast);

      if (success > 0) {
        toast.success(`Importación finalizada: ${success} agregados.`);
        if (errors > 0) toast.warning(`${errors} errores. Primer error: ${firstError}`);
      } else {
        toast.error(`Error: ${firstError || "Error desconocido"}`);
      }
      e.target.value = "";
    };

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: 'array' });
          const jsonData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as Record<string, unknown>[];
          await processData(jsonData);
        } catch {
          toast.dismiss(loadingToast);
          toast.error("Error al procesar Excel.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (fileExt === 'csv') {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const text = evt.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
          const data = rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.replace(/"/g, '').trim());
            const obj: Record<string, unknown> = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
          }).filter(row => row[headers[0]]);
          await processData(data as Record<string, unknown>[]);
        } catch {
          toast.dismiss(loadingToast);
          toast.error("Error al procesar CSV.");
        }
      };
      reader.readAsText(file);
    } else {
      toast.dismiss(loadingToast);
      toast.error("Formato no soportado.");
    }
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Hero Section - Estilo Académico Coherente */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Users className="w-80 h-80 text-primary -rotate-12" />
          </div>
          
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión <span className="text-primary">Académica</span> de Tutores
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra el equipo docente responsable del seguimiento y evaluación de las pasantías.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Tutores</h2>
              <p className="text-muted-foreground font-medium text-sm">Control y seguimiento del personal académico</p>
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
              
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {!isReadOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportClick}
                  className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                >
                  <Upload className="h-4 w-4 mr-2" /> Importar Excel/CSV
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
                  >
                    <Download className="h-4 w-4 mr-2" /> Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-2">
                  <DropdownMenuItem onClick={() => handleExport()} className="text-xs font-bold cursor-pointer">
                    Exportar a Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport()} className="text-xs font-bold cursor-pointer">
                    Exportar a CSV (.csv)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!isReadOnly && (
                <Button
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={isLoading}
                  className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nuevo Tutor
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div>
            <StatsCards stats={stats} />
          </div>

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email, cédula o área..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={handleFilter}>
                    <SelectTrigger className="w-full md:w-48 h-11 rounded-xl bg-background border-2 font-bold text-xs overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        <Filter className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate text-left">
                          <SelectValue placeholder="Estado" />
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-2">
                      <SelectItem value="todos" className="text-xs font-bold">Todos los estados</SelectItem>
                      <SelectItem value="active" className="text-xs font-bold">Activos</SelectItem>
                      <SelectItem value="pending" className="text-xs font-bold">Pendientes</SelectItem>
                      <SelectItem value="deleted" className="text-xs font-bold">Inhabilitados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedTutores.length} de {filteredTutores.length} tutores 
                <span className="mx-2 opacity-30">|</span> 
                Página {currentPage} de {totalPages}
              </p>

              {/* Loading state */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <GraduationCap className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Sincronizando tutores...</p>
                </div>
              ) : filteredTutores.length > 0 ? (
                <>
                  <TutorTable
                    tutores={paginatedTutores}
                    onView={handleView}
                    onEdit={isReadOnly ? undefined : handleEdit}
                    onDelete={isReadOnly ? undefined : handleDelete}
                    onRestore={isReadOnly ? undefined : handleRestore}
                  />
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-muted-foreground font-medium">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="gap-1 rounded-lg font-bold"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Anterior
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
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
                                className={`w-9 h-9 p-0 rounded-lg font-bold ${currentPage === pageNum ? "shadow-md shadow-primary/20" : ""}`}
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
                          className="gap-1 rounded-lg font-bold"
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
                    No se encontraron tutores
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    {searchTerm || statusFilter !== "todos"
                      ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
                      : "Comienza registrando el primer tutor académico."}
                  </p>
                </div>
              )}
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
