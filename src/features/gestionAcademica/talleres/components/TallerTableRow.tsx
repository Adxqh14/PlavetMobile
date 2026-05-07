// ==========================================
// Componente de fila de tabla para Talleres
// ==========================================

"use client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

import { TableCell, TableRow } from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  Building2,
  Calendar,
  User as UserIcon,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Taller } from "../types";

interface Props {
  taller: Taller;
  onView: (taller: Taller) => void;
  onEdit: (taller: Taller) => void;
  onDelete: (taller: Taller) => void;
}

const statusStyles: Record<string, string> = {
  Activo: "bg-emerald-100 text-emerald-700",
  Inactivo: "bg-gray-100 text-gray-700",
  "En Mantenimiento": "bg-amber-100 text-amber-700",
};

export const TallerTableRow = ({ taller, onView, onEdit, onDelete }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);
  
  return (
  <TableRow className="hover:bg-muted/50">
    <TableCell>
      <p className="font-bold text-foreground">{taller.nombre}</p>
    </TableCell>
    <TableCell className="text-center font-mono text-xs">
      <Badge variant="outline" className="font-bold border-2">
        {taller.codigo_taller}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2 font-medium">
        <Building2 className="h-4 w-4 text-primary/60" /> {taller.familia_nombre || taller.id_familia}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
        {taller.codigo_titulo}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        {taller.horas_pasantia} hrs
      </div>
    </TableCell>
    <TableCell>
      <Badge
        className={`${statusStyles[taller.estado] || ""} border-none shadow-none font-bold`}
      >
        {taller.estado}
      </Badge>
    </TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(taller)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          {!isReadOnly && (
            <>
              <DropdownMenuItem onClick={() => onEdit(taller)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {userRole !== "TUTOR ACADEMICO" && (
                <DropdownMenuItem
                  onClick={() => onDelete(taller)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
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
