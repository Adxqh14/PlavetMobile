"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";
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
  DropdownMenuLabel,
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
  activa: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completada: "bg-blue-50 text-blue-700 border-blue-200",
  suspendida: "bg-rose-50 text-rose-700 border-rose-200",
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  cancelada: "bg-gray-50 text-gray-700 border-gray-200",
} as const;

const getEstadoBadge = (estado: string) => {
  const normalized = (estado || "").toLowerCase() as keyof typeof ESTADO_STYLES;
  const style = ESTADO_STYLES[normalized] || "bg-gray-50 text-gray-700 border-gray-200";
  const label = estado.charAt(0).toUpperCase() + estado.slice(1);

  return (
    <Badge variant="outline" className={`${style} font-bold px-2 py-0.5 rounded-lg border shadow-sm`}>
      {label}
    </Badge>
  );
};

export const PasantiaTableRow = ({ pasantia, onView, onEdit, onDelete, onUpdateEstado }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);
  
  const estudianteNombre = [pasantia.estudiante?.nombre, pasantia.estudiante?.apellido]
    .filter(Boolean).join(" ") || "—";
  const tutorNombre = [pasantia.tutor_empresarial?.nombre, pasantia.tutor_empresarial?.apellido]
    .filter(Boolean).join(" ") || "—";

  return (
    <TableRow className="hover:bg-muted/50 transition-colors border-b last:border-0">
      <TableCell className="py-4 pl-6">
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{estudianteNombre}</span>
          {pasantia.estudiante?.cedula && (
            <span className="text-[10px] text-muted-foreground font-bold">{pasantia.estudiante.cedula}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
            <Layout className="h-3.5 w-3.5 text-primary" />
            {pasantia.plaza?.nombre_plaza ?? <span className="text-muted-foreground italic font-medium">Sin plaza</span>}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-0.5">
            <Building2 className="h-3 w-3" />
            {pasantia.centro_trabajo?.nombre ?? "—"}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">{tutorNombre}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-foreground">{pasantia.horas_acumuladas} Horas</span>
          <div className="w-16 h-1 rounded-full bg-primary/20 overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${Math.min((pasantia.horas_acumuladas / 360) * 100, 100)}%` }} 
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">{getEstadoBadge(pasantia.estado)}</TableCell>
      <TableCell className="py-4 text-right pr-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted transition-colors">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-bold px-4 py-2">ACCIONES</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onView(pasantia)} className="font-bold text-xs py-3">
              <Eye className="h-4 w-4 mr-2 text-primary" />
              Ver detalles completos
            </DropdownMenuItem>
            
            {onEdit && !isReadOnly && (
              <DropdownMenuItem onClick={() => onEdit(pasantia)} className="font-bold text-xs py-3">
                <Edit className="h-4 w-4 mr-2 text-amber-500" />
                Editar información
              </DropdownMenuItem>
            )}

            {!isReadOnly && onUpdateEstado && pasantia.estado !== "completada" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] text-muted-foreground font-black px-4 py-2">CAMBIAR ESTADO</DropdownMenuLabel>
                {pasantia.estado === "activa" && (
                  <>
                    <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "completada")} className="font-bold text-xs py-3 text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como COMPLETADA
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "suspendida")} className="font-bold text-xs py-3 text-rose-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      SUSPENDER temporalmente
                    </DropdownMenuItem>
                  </>
                )}
                {pasantia.estado === "pendiente" && (
                  <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "activa")} className="font-bold text-xs py-3 text-emerald-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    ACTIVAR pasantía
                  </DropdownMenuItem>
                )}
                {pasantia.estado === "suspendida" && (
                  <DropdownMenuItem onClick={() => onUpdateEstado(pasantia.id, "activa")} className="font-bold text-xs py-3 text-emerald-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    REANUDAR pasantía
                  </DropdownMenuItem>
                )}
              </>
            )}

            {!isReadOnly && onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(pasantia)}
                  className="text-rose-600 font-bold text-xs py-3"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar registro
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
