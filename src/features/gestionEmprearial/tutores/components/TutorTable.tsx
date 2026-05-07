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
  Activo: "bg-emerald-100 text-emerald-700",
  Inactivo: "bg-gray-100 text-gray-700",
};

export const TutorTable = ({ tutores, onView, onEdit, onDelete, onRestore }: Props) => {
  const { userRole } = useAuth();
  const isReadOnly = isReadOnlyRole(userRole);

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Tutor</TableHead>
            <TableHead className="font-semibold">Contacto</TableHead>
            <TableHead className="font-semibold">Centro de Trabajo</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutores.map((tutor) => (
            <TableRow key={tutor.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{`${tutor.nombre} ${tutor.apellido}`}</p>
                  <p className="text-xs text-muted-foreground">{tutor.departamento || "Tutor"}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <p>{tutor.email || "—"}</p>
                  <p className="text-xs text-muted-foreground">{tutor.telefono || "—"}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  {tutor.nombreCentroTrabajo || "—"}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  className={`${statusStyles[tutor.estado] || "bg-muted text-muted-foreground"} border-none shadow-none`}
                >
                  {tutor.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {tutor.fechaCreacion}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(tutor)}>
                      <Eye className="h-4 w-4 mr-2" /> Ver detalles
                    </DropdownMenuItem>
                    {onEdit && !isReadOnly && (
                      <DropdownMenuItem onClick={() => onEdit(tutor)}>
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </DropdownMenuItem>
                    )}
                    
                    {tutor.estado === 'Inactivo' && !isReadOnly ? (
                      <>
                        {onRestore && (
                          <DropdownMenuItem onClick={() => onRestore(tutor)} className="text-emerald-600">
                            <RotateCcw className="h-4 w-4 mr-2" /> Restaurar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(tutor.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Eliminar Definitivamente
                          </DropdownMenuItem>
                        )}
                      </>
                    ) : (
                      !isReadOnly && onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(tutor.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </>
                      )
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
