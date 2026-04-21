"use client";

import { TableCell, TableRow } from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import { Button } from "../../../../shared/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Estudiante } from "../types";

interface EstudianteTableRowProps {
  estudiante: Estudiante;
  onView: (estudiante: Estudiante) => void;
  onEdit: (estudiante: Estudiante) => void;
  onDelete: () => void;
  onRestore: (estudiante: Estudiante) => void;
}

export const EstudianteTableRow = ({
  estudiante,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: EstudianteTableRowProps) => {
  const statusStyles: Record<string, string> = {
    Activo: "bg-emerald-100 text-emerald-700",
    Inactivo: "bg-gray-100 text-gray-700",
    Suspendido: "bg-amber-100 text-amber-700",
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{estudiante.id}</TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{estudiante.nombre} {estudiante.apellido}</div>
          <div className="text-sm text-muted-foreground">{estudiante.cedula}</div>
        </div>
      </TableCell>
      <TableCell>{estudiante.email}</TableCell>
      <TableCell>{estudiante.telefono}</TableCell>
      <TableCell>{estudiante.carrera}</TableCell>
      <TableCell className="text-center">{estudiante.semestre}</TableCell>
      <TableCell>
        <Badge className={`${statusStyles[estudiante.estado] || ""} border-none shadow-none`}>
          {estudiante.estado}
        </Badge>
      </TableCell>
      <TableCell>{estudiante.fechaIngreso}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(estudiante)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(estudiante)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {estudiante.estado === "Activo" ? (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onRestore(estudiante)}
                className="text-green-600"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restaurar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
