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
import { Eye, Shield, ToggleLeft, MoreHorizontal } from "lucide-react";
import type { Usuario } from "../types";

interface UsuarioTableRowProps {
  usuario: Usuario;
  onView: (usuario: Usuario) => void;
  onChangeRol?: (usuario: Usuario) => void;
  onChangeEstado?: (usuario: Usuario) => void;
}

const ROL_COLORS: Record<number, string> = {
  1: "bg-purple-100 text-purple-700 border-purple-200",
  2: "bg-blue-100 text-blue-700 border-blue-200",
  3: "bg-teal-100 text-teal-700 border-teal-200",
  4: "bg-amber-100 text-amber-700 border-amber-200",
  5: "bg-green-100 text-green-700 border-green-200",
  6: "bg-rose-100 text-rose-700 border-rose-200",
};

export const UsuarioTableRow = ({
  usuario,
  onView,
  onChangeRol,
  onChangeEstado,
}: UsuarioTableRowProps) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole) || userRole === "VINCULADOR";
  const rolColor =
    ROL_COLORS[usuario.id_rol] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      <TableCell className="font-mono text-xs text-muted-foreground">
        #{usuario.id}
      </TableCell>
      <TableCell>
        <p className="font-medium text-foreground">{usuario.nombre}</p>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {usuario.email}
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${rolColor}`}
        >
          {usuario.rol}
        </span>
      </TableCell>
      <TableCell>
        <Badge 
          className={`${
            usuario.estado === "Activo" 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-gray-100 text-gray-700"
          } border-none shadow-none`}
        >
          {usuario.estado}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onView(usuario)}
              className="gap-2 cursor-pointer"
            >
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {!isReadOnly && (
              <>
                <DropdownMenuSeparator />
                {onChangeRol && (
                  <DropdownMenuItem
                    onClick={() => onChangeRol(usuario)}
                    className="gap-2 cursor-pointer"
                  >
                    <Shield className="h-4 w-4" />
                    Cambiar rol
                  </DropdownMenuItem>
                )}
                {onChangeEstado && (
                  <DropdownMenuItem
                    onClick={() => onChangeEstado(usuario)}
                    className="gap-2 cursor-pointer"
                  >
                    <ToggleLeft className="h-4 w-4" />
                    {usuario.estado === "Activo" ? "Desactivar" : "Activar"}
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
