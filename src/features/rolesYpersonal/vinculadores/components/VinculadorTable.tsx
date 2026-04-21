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
import type { Vinculador } from "../types";

interface VinculadorTableProps {
  vinculadores: Vinculador[];
  onView: (vinculador: Vinculador) => void;
  onEdit: (vinculador: Vinculador) => void;
  onDelete: (id: number) => void;
  onRestore: (vinculador: Vinculador) => void;
}

export function VinculadorTable({
  vinculadores,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: VinculadorTableProps) {
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
            <TableHead>Fecha Creación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vinculadores.map((vinculador) => (
            <TableRow key={vinculador.id}>
              <TableCell className="font-medium">
                {vinculador.nombre} {vinculador.apellido}
              </TableCell>
              <TableCell>{vinculador.email}</TableCell>
              <TableCell>{vinculador.telefono}</TableCell>
              <TableCell>{vinculador.nombre_centro}</TableCell>
              <TableCell>
                <Badge
                  className={`${
                    vinculador.estado === "activo"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-700"
                  } border-none shadow-none`}
                >
                  {vinculador.estado === "activo" ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>{vinculador.fecha_creacion}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(vinculador)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(vinculador)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {vinculador.estado === "activo" ? (
                      <DropdownMenuItem
                        onClick={() => onDelete(vinculador.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onRestore(vinculador)}
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
