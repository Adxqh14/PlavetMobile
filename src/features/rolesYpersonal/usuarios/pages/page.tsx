"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
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
import { isReadOnlyRole } from "@/shared/config/rbac";
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
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "VINCULADOR";
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
      // DELETE /api/v1/users/:id elimina físicamente el usuario, su perfil
      // y en cascada todos sus registros de rol (estudiante, etc.)
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground text-balance">
                Gestión de Usuarios
              </h1>
            </div>
            <p className="text-muted-foreground ml-12">
              Administra los usuarios del sistema, sus roles y estados de acceso
            </p>
          </div>

          {/* Stats Cards */}
          <UsuarioStatsCards stats={stats} />

          {/* Main Content */}
          <Card className="border mt-8">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="gap-2 bg-transparent text-foreground"
                  >
                    <Download className="h-4 w-4" /> Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o rol..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterEstado} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length} usuarios
                (Página {currentPage} de {totalPages})
              </p>

              {/* Table */}
              {isLoading ? (
                <div className="rounded-lg border py-16 text-center">
                  <p className="text-muted-foreground text-sm">Cargando usuarios...</p>
                </div>
              ) : filteredUsuarios.length > 0 ? (
                <>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Nombre Completo</TableHead>
                          <TableHead className="font-semibold">Username</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Rol</TableHead>
                          <TableHead className="font-semibold">Estado</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
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
                          <ChevronLeft className="h-4 w-4" /> Anterior
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
                          Siguiente <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border py-16 text-center">
                  <div className="p-4 rounded-full bg-muted mb-4 inline-block">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay usuarios que coincidan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intenta ajustar los filtros de búsqueda
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
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <DialogTitle>Eliminar usuario</DialogTitle>
              </div>
              <DialogDescription>
                {selectedUsuario && (
                  <>
                    ¿Estás seguro de que deseas eliminar al usuario{" "}
                    <span className="font-semibold text-foreground">
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
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
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
