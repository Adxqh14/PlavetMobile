"use client";

import { TableCell, TableRow } from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  Building2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layout,
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
import type { Pasantia } from "../types";

interface Props {
  pasantia: Pasantia;
  onView: (pasantia: Pasantia) => void;
  onEdit: (pasantia: Pasantia) => void;
  onDelete: (id: string) => void;
  onUpdateEstado: (id: string, estado: Pasantia["estado"]) => void;
}

const getEstadoBadge = (estado: Pasantia["estado"]) => {
  const styles = {
    activa: "bg-emerald-100 text-emerald-700",
    completada: "bg-blue-100 text-blue-700",
    suspendida: "bg-rose-100 text-rose-700",
    pendiente: "bg-amber-100 text-amber-700",
  };
  const labels = {
    activa: "Activa",
    completada: "Completada",
    suspendida: "Suspendida",
    pendiente: "Pendiente",
  };
  return (
    <Badge className={`${styles[estado] || ""} border-none shadow-none`}>
      {labels[estado]}
    </Badge>
  );
};

export const PasantiaTableRow = ({ pasantia, onView, onEdit, onDelete, onUpdateEstado }: Props) => (
  <TableRow className="hover:bg-muted/30">
    <TableCell className="font-medium text-primary">{pasantia.id}</TableCell>
    <TableCell>
      <div>
        <p className="font-medium">{pasantia.estudiante}</p>
        <p className="text-xs text-muted-foreground">{pasantia.matricula}</p>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Layout className="h-4 w-4 text-muted-foreground" />
        {pasantia.plazaAsignada}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        {pasantia.centroTrabajo}
      </div>
    </TableCell>
    <TableCell>{pasantia.tutor}</TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        <span className="font-medium">{pasantia.horasCompletadas}h</span>
      </div>
    </TableCell>
    <TableCell>{getEstadoBadge(pasantia.estado)}</TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onView(pasantia)}>
            <Eye className="h-4 w-4 mr-2" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(pasantia)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          {pasantia.estado === "activa" && (
            <>
              <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "completada")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar completada
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "suspendida")}>
                <AlertCircle className="h-4 w-4 mr-2" />
                Suspender
              </DropdownMenuItem>
            </>
          )}
          {pasantia.estado === "pendiente" && (
            <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "activa")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Activar
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => onDelete(pasantia.id)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);
