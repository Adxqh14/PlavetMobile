"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
import { TableRow, TableCell } from "../../../../shared/components/ui/table";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Shield, ToggleLeft, Trash2 } from "lucide-react";
import type { Usuario } from "../types";
import { getNombreCompleto } from "../types";

interface UsuarioTableRowProps {
  usuario: Usuario;
  onView: (usuario: Usuario) => void;
  onChangeRol?: (usuario: Usuario) => void;
  onChangeEstado?: (usuario: Usuario) => void;
  onDelete?: (usuario: Usuario) => void;
}

const ROL_COLORS: Record<string, string> = {
  ADMINISTRADOR: "bg-purple-100 text-purple-700 border-purple-200",
  SUPERVISOR: "bg-blue-100 text-blue-700 border-blue-200",
  VINCULADOR: "bg-teal-100 text-teal-700 border-teal-200",
  ESTUDIANTE: "bg-amber-100 text-amber-700 border-amber-200",
  TUTOR: "bg-green-100 text-green-700 border-green-200",
  DOCENTE: "bg-rose-100 text-rose-700 border-rose-200",
};

const ESTADO_STYLES: Record<string, string> = {
  Activo: "bg-emerald-100 text-emerald-700",
  activo: "bg-emerald-100 text-emerald-700",
  Inactivo: "bg-gray-100 text-gray-700",
  inactivo: "bg-gray-100 text-gray-700",
};

export const UsuarioTableRow = ({
  usuario,
  onView,
  onChangeRol,
  onChangeEstado,
  onDelete,
}: UsuarioTableRowProps) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "VINCULADOR";
  const esEstudiante = usuario.rol.toUpperCase() === "ESTUDIANTE";
  // VINCULADOR solo puede eliminar estudiantes; ADMINISTRADOR puede eliminar cualquiera
  const canDelete =
    onDelete &&
    (userRole === "ADMINISTRADOR" || (userRole === "VINCULADOR" && esEstudiante));
  const rolColor =
    ROL_COLORS[usuario.rol.toUpperCase()] ??
    "bg-slate-100 text-slate-700 border-slate-200";

  const esActivo = usuario.estado.toLowerCase() === "activo";

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="py-4">
        <div className="font-medium text-foreground">{getNombreCompleto(usuario)}</div>
      </TableCell>
      <TableCell className="py-4 font-mono text-xs text-muted-foreground">
        {usuario.username}
      </TableCell>
      <TableCell className="py-4 text-sm text-muted-foreground">
        {usuario.email}
      </TableCell>
      <TableCell className="py-4">
        <Badge
          className={`border-none shadow-none font-medium ${rolColor}`}
        >
          {usuario.rol}
        </Badge>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          className={`${
            ESTADO_STYLES[usuario.estado] || ""
          } border-none shadow-none font-medium`}
        >
          {esActivo ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onView(usuario)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {!isReadOnly && (
              <>
                <DropdownMenuSeparator />
                {onChangeRol && (
                  <DropdownMenuItem
                    onClick={() => onChangeRol(usuario)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Cambiar rol
                  </DropdownMenuItem>
                )}
                {onChangeEstado && (
                  <DropdownMenuItem
                    onClick={() => onChangeEstado(usuario)}
                  >
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    {usuario.estado === "Activo" ? "Desactivar" : "Activar"}
                  </DropdownMenuItem>
                )}
              </>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete!(usuario)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
