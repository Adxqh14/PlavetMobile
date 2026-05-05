import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../shared/components/ui/table";
import { Button } from "../../../../shared/components/ui/button";
import { Badge } from "../../../../shared/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Supervisor } from "../types";

interface SupervisorTableProps {
  supervisores: Supervisor[];
  onView: (supervisor: Supervisor) => void;
  onEdit: (supervisor: Supervisor) => void;
  onDelete: (id: string) => void;
  onRestore: (supervisor: Supervisor) => void;
}

const estadoStyles: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  inactivo: "bg-gray-100 text-gray-700",
};

const estadoLabels: Record<string, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
};

export function SupervisorTable({
  supervisores,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: SupervisorTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisores.map((supervisor) => {
            const isDeleted = !!supervisor.deleted_at;
            return (
              <TableRow key={supervisor.id}>
                <TableCell className="font-medium">
                  {supervisor.nombre} {supervisor.apellido}
                </TableCell>
                <TableCell>{supervisor.cedula}</TableCell>
                <TableCell>{supervisor.email}</TableCell>
                <TableCell>{supervisor.telefono}</TableCell>
                <TableCell>
                  <Badge
                    className={`${estadoStyles[supervisor.estado] || ""} border-none shadow-none`}
                  >
                    {isDeleted ? "Eliminado" : (estadoLabels[supervisor.estado] || supervisor.estado)}
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
                      <DropdownMenuItem onClick={() => onView(supervisor)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                      {!isDeleted && (
                        <DropdownMenuItem onClick={() => onEdit(supervisor)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {isDeleted ? (
                        <DropdownMenuItem
                          onClick={() => onRestore(supervisor)}
                          className="text-green-600"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restaurar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => onDelete(supervisor.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
