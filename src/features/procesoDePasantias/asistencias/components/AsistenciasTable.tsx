import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { Asistencia } from "../types";
import type { TableColumn } from "@/shared/config/rbac";

interface Props {
  data: Asistencia[];
  columns: TableColumn[];
  onView: (asistencia: Asistencia) => void;
  onEdit?: (asistencia: Asistencia) => void;
  onDelete?: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  Presente: "bg-emerald-100 text-emerald-700",
  Tardanza: "bg-amber-100 text-amber-700",
  Ausente: "bg-red-100 text-red-700",
  Justificado: "bg-gray-100 text-gray-700",
};

export const AsistenciasTable = ({ data, columns, onView, onEdit, onDelete }: Props) => {
  const renderCell = (asistencia: Asistencia, key: string) => {
    switch (key) {
      case "estudiante":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{asistencia.estudiante}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{asistencia.pasantia}</span>
          </div>
        );
      case "estado":
        return (
          <Badge
            className={`${statusStyles[asistencia.estado] || ""} border-none shadow-none`}
          >
            {asistencia.estado}
          </Badge>
        );
      case "acciones":
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(asistencia)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(asistencia)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(asistencia.id)} 
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return (asistencia as unknown as Record<string, string>)[key];
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.key === 'acciones' ? "text-right" : ""}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col.key}`}>
                    {renderCell(row, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                No se encontraron registros de asistencia.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
