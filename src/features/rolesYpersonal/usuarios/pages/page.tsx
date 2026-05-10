"use client";

import { useState } from "react";
import {
  Users,
  Loader2
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../../../../shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";

import { useUsuarios } from "../hooks/useUsuarios";
import { UsuarioStatsCards } from "../components/UsuarioStatsCards";
import { UsuarioTableRow } from "../components/UsuarioTableRow";
import { ViewUsuarioDialog } from "../components/UsuarioDialogs";
import type { Usuario } from "../types";
import Main from "@/features/main/pages/page";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { deleteUsuarioFisico } from "../services/usuarioService";
import { toast } from "sonner";
import { UsuariosHero } from "../components/UsuariosHero";
import { UsuariosActionBar } from "../components/UsuariosActionBar";
import { UsuariosFilters } from "../components/UsuariosFilters";
import { UsuariosPagination } from "../components/UsuariosPagination";
import { DeleteUsuarioDialog } from "../components/DeleteUsuarioDialog";

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
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `usuarios_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <UsuariosHero />

        <div className="w-full pb-12 px-6 md:px-12">
          <UsuariosActionBar 
            onRefresh={refetch}
            isLoading={isLoading}
            onExport={handleExport}
          />

          <UsuarioStatsCards stats={stats} />

          <Card className="border overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-muted/10 p-6">
              <UsuariosFilters 
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
              <p className="text-sm text-muted-foreground mb-4 font-medium">
                Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length} usuarios
                <span className="mx-2 opacity-30">|</span>
                Página {currentPage} de {totalPages}
              </p>

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

                  <UsuariosPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed py-16 text-center bg-muted/5">
                  <div className="p-4 rounded-full bg-primary/5 mb-4 inline-block">
                    <Users className="h-10 w-10 text-primary/40" />
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

        <ViewUsuarioDialog
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          usuario={selectedUsuario}
        />

        <DeleteUsuarioDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          usuario={selectedUsuario}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </Main>
  );
}
