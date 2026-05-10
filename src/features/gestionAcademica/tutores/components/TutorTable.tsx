import { useAuth } from "@/features/auth/hooks/useAuth";
import { isReadOnlyRole } from "@/shared/config/rbac";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../../shared/components/ui/table";
import { Badge } from "../../../../shared/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Tutor } from "../types";

interface Props {
  tutores: Tutor[];
  onView: (tutor: Tutor) => void;
  onEdit?: (tutor: Tutor) => void;
  onDelete?: (id: string) => void;
  onRestore?: (tutor: Tutor) => void;
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

export const TutorTable = ({ tutores, onView, onEdit, onDelete, onRestore }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  return (
    <div className="rounded-xl border overflow-x-auto bg-background max-w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre Completo</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableHead className="font-semibold">Área Asignada</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutores.map((tutor) => (
            <TableRow key={tutor.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>
                <div>
                  <div className="font-medium text-foreground">{`${tutor.nombre} ${tutor.apellido}`}</div>
                </div>
              </TableCell>
              <TableCell className="truncate max-w-[180px]" title={tutor.email}>{tutor.email}</TableCell>
              <TableCell className="truncate max-w-[150px]" title={tutor.telefono}>{tutor.telefono}</TableCell>
              <TableCell className="truncate max-w-[200px]" title={tutor.areaAsignada}>{tutor.areaAsignada || "—"}</TableCell>
              <TableCell>
                <Badge className={`${statusStyles[tutor.status] || ""} border-none shadow-none`}>
                  {statusLabels[tutor.status] || tutor.status}
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
                    <DropdownMenuItem onClick={() => onView(tutor)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    {!isReadOnly && (
                      <>
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(tutor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {tutor.status === "active" ? (
                          onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(tutor.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          )
                        ) : (
                          onRestore && (
                            <DropdownMenuItem
                              onClick={() => onRestore(tutor)}
                              className="text-green-600"
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Restaurar
                            </DropdownMenuItem>
                          )
                        )}
                      </>
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
};
