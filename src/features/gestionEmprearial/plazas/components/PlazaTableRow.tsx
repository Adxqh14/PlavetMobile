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
  RotateCcw,
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
import type { Plaza } from "../types";

interface Props {
  plaza: Plaza;
  onView: (plaza: Plaza) => void;
  onEdit: (plaza: Plaza) => void;
  onDelete: (id: number) => void;
  onRestore: (plaza: Plaza) => void;
}

const statusStyles: Record<string, string> = {
  Activa: "bg-emerald-100 text-emerald-700",
  Ocupada: "bg-blue-100 text-blue-700",
  Inhabilitada: "bg-gray-100 text-gray-700",
};

export const PlazaTableRow = ({ plaza, onView, onEdit, onDelete, onRestore }: Props) => (
  <TableRow className="hover:bg-muted/30">
    <TableCell className="font-medium text-primary">{plaza.id}</TableCell>
    <TableCell>
      <p className="font-medium">{plaza.nombre}</p>
      {plaza.descripcion && (
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
          {plaza.descripcion}
        </p>
      )}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" /> {plaza.centro}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5">
        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />{" "}
        {plaza.genero}
      </div>
    </TableCell>
    <TableCell>
      <Badge
        className={`${statusStyles[plaza.estado] || ""} border-none shadow-none`}
      >
        {plaza.estado}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1.5 text-sm">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />{" "}
        {plaza.fechaCreacion}
      </div>
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
          <DropdownMenuItem onClick={() => onView(plaza)}>
            <Eye className="h-4 w-4 mr-2" /> Ver Detalles
          </DropdownMenuItem>
          {plaza.estado !== 'Inhabilitada' && (
            <DropdownMenuItem onClick={() => onEdit(plaza)}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </DropdownMenuItem>
          )}
          {plaza.estado === 'Inhabilitada' ? (
            <>
              <DropdownMenuItem onClick={() => onRestore(plaza)} className="text-emerald-600">
                <RotateCcw className="h-4 w-4 mr-2" /> Restaurar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(plaza.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Eliminar Definitivamente
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(plaza.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Inhabilitar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);
