"use client";

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
  Mail,
  Phone,
  Calendar,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";
import type { Tutor } from "../types";

interface Props {
  tutores: Tutor[];
  onView: (tutor: Tutor) => void;
  onEdit: (tutor: Tutor) => void;
  onDelete: (id: string) => void;
  onRestore: (tutor: Tutor) => void;
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

export const TutorTable = ({ tutores, onView, onEdit, onDelete, onRestore }: Props) => (
  <div className="rounded-lg border overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="font-semibold w-24">ID</TableHead>
          <TableHead className="font-semibold">Nombre Completo</TableHead>
          <TableHead className="font-semibold">Email</TableHead>
          <TableHead className="font-semibold">Teléfono</TableHead>
          <TableHead className="font-semibold">Especialidad Técnica</TableHead>
          <TableHead className="font-semibold">Estado</TableHead>
          <TableHead className="font-semibold">Fecha Contratación</TableHead>
          <TableHead className="font-semibold text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tutores.map((tutor) => (
          <TableRow key={tutor.id} className="hover:bg-muted/30">
            <TableCell className="font-medium text-primary">{tutor.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <p className="font-medium">{`${tutor.nombre} ${tutor.apellido}`}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tutor.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tutor.telefono}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm">{tutor.especialidadTecnica}</span>
            </TableCell>
            <TableCell>
              <Badge
                className={`${statusStyles[tutor.status] || ""} border-none shadow-none`}
              >
                {statusLabels[tutor.status] || tutor.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {tutor.fechaContratacion}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onView(tutor)}>
                    <Eye className="h-4 w-4 mr-2" /> Ver Detalles
                  </DropdownMenuItem>
                  {tutor.status !== 'deleted' && (
                    <DropdownMenuItem onClick={() => onEdit(tutor)}>
                      <Edit className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                  )}
                  {tutor.status === 'deleted' ? (
                    <>
                      <DropdownMenuItem onClick={() => onRestore(tutor)} className="text-emerald-600">
                        <RotateCcw className="h-4 w-4 mr-2" /> Restaurar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(tutor.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar Definitivamente
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(tutor.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                      </DropdownMenuItem>
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
