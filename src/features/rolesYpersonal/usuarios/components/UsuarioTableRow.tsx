"use client";

import { TableRow, TableCell } from "../../../../shared/components/ui/table";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";
import type { Usuario } from "../types";
import { getNombreCompleto } from "../types";

interface UsuarioTableRowProps {
  usuario: Usuario;
  onView: (usuario: Usuario) => void;
}

const ROL_COLORS: Record<string, string> = {
  ADMINISTRADOR: "bg-purple-100 text-purple-700 border-purple-200",
  SUPERVISOR: "bg-blue-100 text-blue-700 border-blue-200",
  VINCULADOR: "bg-teal-100 text-teal-700 border-teal-200",
  ESTUDIANTE: "bg-amber-100 text-amber-700 border-amber-200",
  TUTOR: "bg-green-100 text-green-700 border-green-200",
  DOCENTE: "bg-rose-100 text-rose-700 border-rose-200",
};

export const UsuarioTableRow = ({
  usuario,
  onView,
}: UsuarioTableRowProps) => {
  const rolColor =
    ROL_COLORS[usuario.rol.toUpperCase()] ??
    "bg-slate-100 text-slate-700 border-slate-200";

  const esActivo = usuario.estado.toLowerCase() === "activo";

  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      <TableCell>
        <p className="font-medium text-foreground">{getNombreCompleto(usuario)}</p>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {usuario.username}
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
            esActivo
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-700"
          } border-none shadow-none`}
        >
          {esActivo ? "Activo" : "Inactivo"}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
