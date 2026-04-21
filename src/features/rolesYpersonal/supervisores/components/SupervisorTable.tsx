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
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Centro de Trabajo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Contratación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supervisores.map((supervisor) => (
            <TableRow key={supervisor.id}>
              <TableCell className="font-medium">
                {supervisor.nombre} {supervisor.apellido}
              </TableCell>
              <TableCell>{supervisor.email}</TableCell>
              <TableCell>{supervisor.telefono}</TableCell>
              <TableCell>{supervisor.nombre_centro}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    supervisor.estado === "activo"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  } border-none shadow-none`}
                >
                  {supervisor.estado === "activo" ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>{supervisor.fecha_contratacion}</TableCell>
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
                    <DropdownMenuItem onClick={() => onEdit(supervisor)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {supervisor.estado === "activo" ? (
                      <DropdownMenuItem
                        onClick={() => onDelete(supervisor.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onRestore(supervisor)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
