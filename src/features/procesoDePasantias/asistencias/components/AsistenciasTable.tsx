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
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
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

const formatTime = (t: string | null | undefined) => {
  if (!t) return "—";
  return t.slice(0, 5);
};

const formatDate = (d: string | null | undefined) => {
  if (!d) return "—";
  return String(d).slice(0, 10);
};

export const AsistenciasTable = ({ data, columns, onView, onDelete }: Props) => {
  const renderCell = (asistencia: Asistencia, key: string) => {
    switch (key) {
      case "estudiante":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {asistencia.estudiante
                ? `${asistencia.estudiante.nombre} ${asistencia.estudiante.apellido}`
                : "—"}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {asistencia.centro_trabajo?.nombre ?? "—"}
            </span>
          </div>
        );
      case "fecha":
        return <span className="text-sm text-muted-foreground tabular-nums">{formatDate(asistencia.fecha)}</span>;
      case "hora_entrada":
        return (
          <span className="text-sm tabular-nums text-foreground">
            {formatTime(asistencia.hora_entrada)}
          </span>
        );
      case "hora_salida":
        return (
          <span className="text-sm tabular-nums text-foreground">
            {formatTime(asistencia.hora_salida)}
          </span>
        );
      case "horas":
        return (
          <span className="text-sm font-medium text-foreground">
            {asistencia.horas != null ? `${asistencia.horas}h` : "—"}
          </span>
        );
      case "asistencia":
        return asistencia.asistencia ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-none shadow-none">
            Presente
          </Badge>
        ) : (
          <Badge className="bg-red-100 text-red-700 border-none shadow-none">
            Ausente
          </Badge>
        );
      case "acciones":
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(asistencia)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
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
        return <span className="text-sm text-muted-foreground">{(asistencia as unknown as Record<string, string>)[key] ?? "—"}</span>;
    }
  };

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) => (
              <TableHead key={col.key} className={`font-semibold py-4 ${col.key === "acciones" ? "text-right" : ""}`}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col.key}`}>
                    {renderCell(row, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground"
              >
                No se encontraron registros de asistencia.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
