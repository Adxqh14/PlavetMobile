"use client";

import { useState } from "react";
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  User,
} from "lucide-react";
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
import type { Pasantia, CreatePasantiaPayload, UpdatePasantiaPayload } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

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

  const handleCreatePasantia = async (data: CreatePasantiaPayload) => {
    await addPasantia(data);
  };

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

  const handleUpdateEstado = async (id: string, estado: Pasantia["estado"]) => {
    await updateEstado(id, estado);
  };

  const handleUpdatePasantia = async (id: string, data: UpdatePasantiaPayload) => {
    await updatePasantia(id, data);
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
        
        {/* Hero Section */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <Briefcase className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Gestión de <span className="text-primary">Pasantías</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra, supervisa y realiza el seguimiento de los programas de pasantías estudiantiles.
              </p>
              {userRole === "TUTOR ACADEMICO" && user?.taller && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                  <span>Taller: {user.taller.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Expedientes de Pasantías</h2>
              <p className="text-muted-foreground font-medium text-sm">Control operativo y administrativo del programa</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPasantias}
                disabled={loading}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>

              {!isReadOnly && (
                <Button
                  size="sm"
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="rounded-xl font-bold h-10 text-xs shadow-md shadow-primary/20"
                >
                  <Plus className="h-4 w-4 mr-2" /> Nueva Pasantía
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}

          {/* Main Content */}
          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiante, cédula o centro..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      resetPage();
                    }}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>
                <Select value={filterEstado} onValueChange={(value) => {
                  setFilterEstado(value);
                  resetPage();
                }}>
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
                    <SelectItem value="activa" className="text-xs font-bold">Activa</SelectItem>
                    <SelectItem value="completada" className="text-xs font-bold">Completada</SelectItem>
                    <SelectItem value="pendiente" className="text-xs font-bold">Pendiente</SelectItem>
                    <SelectItem value="suspendida" className="text-xs font-bold">Suspendida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                            onUpdateEstado={isReadOnly ? undefined : handleUpdateEstado}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                      <p className="text-sm text-muted-foreground font-medium">
                        Mostrando <span className="text-foreground">{pasantias.length}</span> de <span className="text-foreground">{totalItems}</span> registros
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="rounded-xl font-bold h-9 text-xs"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="rounded-xl font-bold h-9 text-xs"
                        >
                          Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
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

        {/* Dialogs */}
        <CreatePasantiaDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreatePasantia}
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
          onUpdate={handleUpdatePasantia}
        />
      </div>
    </Main>
  );
}
