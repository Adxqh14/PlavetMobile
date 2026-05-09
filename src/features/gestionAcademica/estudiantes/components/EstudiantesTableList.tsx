import { Loader2, GraduationCap, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";
import { EstudianteTableRow } from "./EstudianteTableRow";
import type { Estudiante } from "../types";

interface EstudiantesTableListProps {
  isLoading: boolean;
  filteredEstudiantes: Estudiante[];
  paginatedEstudiantes: Estudiante[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  filterEstado: string;
  onView: (estudiante: Estudiante) => void;
  onEdit: (estudiante: Estudiante) => void;
  onDeleteRequest: (estudiante: Estudiante) => void;
  onRestore: (estudiante: Estudiante) => void;
}

export function EstudiantesTableList({
  isLoading,
  filteredEstudiantes,
  paginatedEstudiantes,
  currentPage,
  totalPages,
  setCurrentPage,
  searchTerm,
  filterEstado,
  onView,
  onEdit,
  onDeleteRequest,
  onRestore,
}: EstudiantesTableListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <GraduationCap className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">Sincronizando estudiantes...</p>
      </div>
    );
  }

  if (filteredEstudiantes.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed py-20 text-center bg-muted/5">
        <div className="p-5 rounded-full bg-muted mb-4 inline-block">
          <Search className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No se encontraron estudiantes
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {searchTerm || filterEstado !== "todos"
            ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
            : "Comienza registrando el primer estudiante en el sistema."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div id="tour-estudiantes-table" className="rounded-xl border overflow-x-auto bg-background max-w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Teléfono</TableHead>
              <TableHead className="font-semibold">Carrera</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Fecha Ingreso</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEstudiantes.map((estudiante) => (
              <EstudianteTableRow
                key={estudiante.id}
                estudiante={estudiante}
                onView={onView}
                onEdit={onEdit}
                onDelete={() => onDeleteRequest(estudiante)}
                onRestore={onRestore}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
