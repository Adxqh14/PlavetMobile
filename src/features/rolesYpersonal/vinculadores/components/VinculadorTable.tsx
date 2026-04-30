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
  onDelete: (id: string) => void;
  onRestore: (vinculador: Vinculador) => void;
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  deleted: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  pending: "Pendiente",
  deleted: "Inhabilitado",
};

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
            <TableHead>Cédula</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Área Asignada</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vinculadores.map((vinculador) => (
            <TableRow key={vinculador.id}>
              <TableCell className="font-medium">
                {vinculador.nombre} {vinculador.apellido}
              </TableCell>
              <TableCell>{vinculador.cedula}</TableCell>
              <TableCell>{vinculador.email}</TableCell>
              <TableCell>{vinculador.telefono}</TableCell>
              <TableCell>{vinculador.areaAsignada}</TableCell>
              <TableCell>
                <Badge
                  className={`${statusStyles[vinculador.status] || ""} border-none shadow-none`}
                >
                  {statusLabels[vinculador.status] || vinculador.status}
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
                    <DropdownMenuItem onClick={() => onView(vinculador)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    {vinculador.status !== 'deleted' && (
                      <DropdownMenuItem onClick={() => onEdit(vinculador)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {vinculador.status === 'deleted' ? (
                      <DropdownMenuItem
                        onClick={() => onRestore(vinculador)}
                        className="text-green-600"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restaurar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onDelete(vinculador.id)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
