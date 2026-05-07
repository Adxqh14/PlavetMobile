"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../shared/components/ui/dialog";

import { useUsuarios } from "../hooks/useUsuarios";
import { UsuarioStatsCards } from "../components/UsuarioStatsCards";
import { UsuarioTableRow } from "../components/UsuarioTableRow";
import { ViewUsuarioDialog } from "../components/UsuarioDialogs";
import type { Usuario } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { deleteUsuarioFisico } from "../services/usuarioService";
import { toast } from "sonner";

export default function UsuariosPage() {
  const {
    filteredUsuarios,
    paginatedUsuarios,
    currentPage,
    totalPages,
    setCurrentPage,
    resetPage,
    stats,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    isLoading,
    deleteUsuario,
    refetch,
  } = useUsuarios();
  
  const { userRole } = useAuth();
  const canDelete = userRole === "ADMINISTRADOR" || userRole === "VINCULADOR";

  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsViewOpen(true);
  };

  const handleDelete = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUsuario) return;
    setIsDeleting(true);
    try {
      await deleteUsuarioFisico(selectedUsuario.id);
      deleteUsuario(selectedUsuario.id);
      refetch();
      toast.success("Usuario eliminado");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("No se pudo eliminar el usuario");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedUsuario(null);
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

  const handleExport = () => {
    const csvContent = [
      ["ID", "Nombre Completo", "Username", "Rol", "Estado"],
      ...filteredUsuarios.map((u) => [
        u.id,
        u.perfil ? `${u.perfil.nombre} ${u.perfil.apellido}` : u.username,
        u.username,
        u.rol,
        u.estado,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `usuarios_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                Gestión de <span className="text-primary">Usuarios</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Administra los accesos, roles y perfiles de todos los integrantes de la plataforma.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pb-12 px-6 md:px-12">
          {/* Section heading + actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-3xl font-black tracking-tight">Listado de Usuarios</h2>
              <p className="text-muted-foreground font-medium text-sm">Control global de identidades y permisos</p>
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
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
              >
                <Download className="h-4 w-4 mr-2" /> Exportar CSV
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <UsuarioStatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o rol..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-11 bg-background border-2 rounded-xl font-medium focus-visible:ring-primary/20"
                  />
                </div>

                <div className="flex gap-3">
                  <Select value={filterEstado} onValueChange={handleFilterChange}>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length} usuarios
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

              {/* Table */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Users className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-muted-foreground font-medium animate-pulse">Cargando usuarios...</p>
                </div>
              ) : filteredUsuarios.length > 0 ? (
                <>
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold py-4">Nombre Completo</TableHead>
                          <TableHead className="font-semibold py-4">Username</TableHead>
                          <TableHead className="font-semibold py-4">Email</TableHead>
                          <TableHead className="font-semibold py-4">Rol</TableHead>
                          <TableHead className="font-semibold py-4">Estado</TableHead>
                          <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsuarios.map((usuario) => (
                          <UsuarioTableRow
                            key={usuario.id}
                            usuario={usuario}
                            onView={handleView}
                            onDelete={canDelete ? handleDelete : undefined}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                      <p className="text-sm text-muted-foreground font-medium">
                        Página <span className="text-foreground">{currentPage}</span> de {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="rounded-xl font-bold h-9 text-xs"
                        >
                          Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .map((p, i, arr) => (
                              <div key={p} className="flex items-center gap-1">
                                {i > 0 && arr[i-1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                                <Button
                                  variant={currentPage === p ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(p)}
                                  className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === p ? 'shadow-md shadow-primary/20' : ''}`}
                                >
                                  {p}
                                </Button>
                              </div>
                            ))
                          }
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="rounded-xl font-bold h-9 text-xs"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
                  <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                    <Search className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    No hay usuarios que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                    Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dialogs */}
        <ViewUsuarioDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          usuario={selectedUsuario}
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="rounded-2xl border-2">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <DialogTitle className="text-xl font-black">Eliminar usuario</DialogTitle>
              </div>
              <DialogDescription className="font-medium">
                {selectedUsuario && (
                  <>
                    ¿Estás seguro de que deseas eliminar al usuario{" "}
                    <span className="font-bold text-foreground">
                      {selectedUsuario.perfil
                        ? `${selectedUsuario.perfil.nombre} ${selectedUsuario.perfil.apellido}`
                        : selectedUsuario.username}
                    </span>
                    ?{" "}
                    {selectedUsuario.rol.toUpperCase() === "ESTUDIANTE" && (
                      <>También se eliminará el registro de estudiante asociado. </>
                    )}
                    Esta acción es permanente y no se puede deshacer.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="rounded-xl font-bold"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl font-bold shadow-md shadow-destructive/20"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  );
}
