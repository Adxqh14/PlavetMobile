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
import { MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { Visita } from "../types";

interface Props {
  data: Visita[];
  onView: (visita: Visita) => void;
}

const estadoStyles: Record<string, string> = {
  programada: "bg-amber-100 text-amber-700",
  realizada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-red-100 text-red-700",
  reprogramada: "bg-blue-100 text-blue-700",
};

const estadoLabel: Record<string, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
  reprogramada: "Reprogramada",
};

const formatTime = (t: string | null | undefined) =>
  t ? String(t).slice(0, 5) : "—";

const formatDate = (d: string | null | undefined) =>
  d ? String(d).slice(0, 10) : "—";

export const VisitasTable = ({ data, onView }: Props) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Tutor</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Estudiantes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <span className="font-medium">{v.centro_trabajo?.nombre ?? "—"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {v.tutor ? `${v.tutor.nombre} ${v.tutor.apellido}` : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm max-w-[180px] truncate block">{v.motivo}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm tabular-nums">{formatDate(v.fecha)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm tabular-nums">{formatTime(v.hora)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {v.estudiantes?.length ?? 0} estudiante{(v.estudiantes?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={`${estadoStyles[v.estado] ?? "bg-muted text-muted-foreground"} border-none shadow-none capitalize`}>
                    {estadoLabel[v.estado] ?? v.estado}
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
                      <DropdownMenuItem onClick={() => onView(v)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                No se encontraron visitas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
