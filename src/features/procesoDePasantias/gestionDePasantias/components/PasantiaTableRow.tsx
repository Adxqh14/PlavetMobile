"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole, canViewSensitiveData } from "@/shared/config/rbac";
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
  User,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Pasantia } from "../types";

interface Props {
  pasantia: Pasantia;
  onView: (pasantia: Pasantia) => void;
  onEdit?: (pasantia: Pasantia) => void;
  onDelete?: (pasantia: Pasantia) => void;
  onUpdateEstado?: (id: string, estado: Pasantia["estado"]) => void;
}

const ESTADO_STYLES = {
  activa: "bg-emerald-100 text-emerald-700",
  completada: "bg-emerald-100 text-emerald-700",
  suspendida: "bg-amber-100 text-amber-700",
  pendiente: "bg-gray-100 text-gray-700",
  cancelada: "bg-rose-100 text-rose-700",
} as const;

const getEstadoBadge = (estado: string) => {
  const normalized = (estado || "").toLowerCase() as keyof typeof ESTADO_STYLES;
  const style = ESTADO_STYLES[normalized] || "bg-gray-100 text-gray-700";
  const label = estado.charAt(0).toUpperCase() + estado.slice(1);

  return (
    <Badge className={`${style} border-none shadow-none font-medium`}>
      {label}
    </Badge>
  );
};

export const PasantiaTableRow = ({ pasantia, onView, onEdit, onDelete, onUpdateEstado }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);
  const showSensitiveData = canViewSensitiveData(userRole);
  
  const estudianteNombre = [pasantia.estudiante?.nombre, pasantia.estudiante?.apellido]
    .filter(Boolean).join(" ") || "—";
  const tutorNombre = [pasantia.tutor_empresarial?.nombre, pasantia.tutor_empresarial?.apellido]
    .filter(Boolean).join(" ") || "—";

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="py-4 pl-6">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{estudianteNombre}</span>
          {pasantia.estudiante?.cedula && showSensitiveData && (
            <span className="text-xs text-muted-foreground">{pasantia.estudiante.cedula}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-medium text-sm text-foreground">
            <Layout className="h-3.5 w-3.5 text-muted-foreground" />
            {pasantia.plaza?.nombre_plaza ?? <span className="text-muted-foreground italic font-normal">Sin plaza</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <Building2 className="h-3 w-3" />
            {pasantia.centro_trabajo?.nombre ?? "—"}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{tutorNombre}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-foreground">{pasantia.horas_acumuladas} Horas</span>
          <div className="w-16 h-1 rounded-full bg-primary/20 overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${Math.min((pasantia.horas_acumuladas / 360) * 100, 100)}%` }} 
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">{getEstadoBadge(pasantia.estado)}</TableCell>
      <TableCell className="text-right pr-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(pasantia)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            
            {onEdit && !isReadOnly && (
              <DropdownMenuItem onClick={() => onEdit(pasantia)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}

            {!isReadOnly && onUpdateEstado && pasantia.estado !== "completada" && (
              <>
                <DropdownMenuSeparator />
                {pasantia.estado === "activa" && (
                  <>
                    <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "completada")} className="text-emerald-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "suspendida")} className="text-amber-600">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Suspender
                    </DropdownMenuItem>
                  </>
                )}
                {pasantia.estado === "pendiente" && (
                  <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "activa")} className="text-emerald-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activar
                  </DropdownMenuItem>
                )}
                {pasantia.estado === "suspendida" && (
                  <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "activa")} className="text-emerald-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Reanudar
                  </DropdownMenuItem>
                )}
              </>
            )}

            {!isReadOnly && onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(pasantia)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
