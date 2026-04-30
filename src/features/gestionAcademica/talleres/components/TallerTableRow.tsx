// ==========================================
// Componente de fila de tabla para Talleres
// ==========================================

"use client";

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
  Hash,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

export const TallerTableRow = ({ taller, onView, onEdit, onDelete }: Props) => (
  <TableRow className="hover:bg-muted/30">
    <TableCell className="font-medium text-primary">{taller.id}</TableCell>
    <TableCell>
      <p className="font-medium">{taller.nombre}</p>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-muted-foreground" /> {taller.abreviatura}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" /> {taller.id_familia}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5 text-sm">
        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
        {" "}
        {taller.codigo_titulo}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5 text-sm">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        {" "}
        {taller.horas_pasantia}
      </div>
    </TableCell>
    <TableCell>
      <Badge
        className={`${statusStyles[taller.estado] || ""} border-none shadow-none`}
      >
        {taller.estado}
      </Badge>
    </TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onView(taller)}>
            <Eye className="h-4 w-4 mr-2" /> Ver Detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(taller)}>
            <Edit className="h-4 w-4 mr-2" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(taller)} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);
