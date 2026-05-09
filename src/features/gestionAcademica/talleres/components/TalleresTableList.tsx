import { Loader2, Wrench, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";
import { TallerTableRow } from "./TallerTableRow";
import type { Taller } from "../types";

interface TalleresTableListProps {
  isLoading: boolean;
  filteredTalleres: Taller[];
  paginatedTalleres: Taller[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  filterEstado: string;
  onView: (taller: Taller) => void;
  onEdit: (taller: Taller) => void;
  onDeleteRequest: (taller: Taller) => void;
}

export function TalleresTableList({
  isLoading,
  filteredTalleres,
  paginatedTalleres,
  currentPage,
  totalPages,
  setCurrentPage,
  searchTerm,
  filterEstado,
  onView,
  onEdit,
  onDeleteRequest,
}: TalleresTableListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <Wrench className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">Sincronizando talleres...</p>
      </div>
    );
  }

  if (filteredTalleres.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed py-20 text-center bg-muted/5">
        <div className="p-5 rounded-full bg-muted mb-4 inline-block">
          <Search className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No se encontraron talleres
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {searchTerm || filterEstado !== "todos"
            ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
            : "Comienza registrando el primer taller del área técnica."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div id="tour-talleres-table" className="rounded-xl border overflow-x-auto bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Nombre del Taller</TableHead>
              <TableHead className="font-semibold text-center">Código Taller</TableHead>
              <TableHead className="font-semibold">Familia</TableHead>
              <TableHead className="font-semibold">Código Título</TableHead>
              <TableHead className="font-semibold">Horas</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTalleres.map((taller) => (
              <TallerTableRow
                key={taller.id}
                taller={taller}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDeleteRequest}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1 rounded-lg font-bold"
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
                    className={`w-9 h-9 p-0 rounded-lg font-bold ${currentPage === pageNum ? "shadow-md shadow-primary/20" : ""}`}
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
              className="gap-1 rounded-lg font-bold"
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
