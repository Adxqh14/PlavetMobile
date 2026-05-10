import { Loader2, Briefcase, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "../../../../shared/components/ui/table";
import { PlazaTableRow } from "./PlazaTableRow";
import type { Plaza } from "../types";

interface PlazasTableListProps {
  isLoading: boolean;
  isReadOnly: boolean;
  filteredPlazas: Plaza[];
  paginatedPlazas: Plaza[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  filterEstado: string;
  onView: (plaza: Plaza) => void;
  onEdit: (plaza: Plaza) => void;
  onDeleteRequest: (plaza: Plaza) => void;
  onRestore: (plaza: Plaza) => void;
}

export function PlazasTableList({
  isLoading,
  isReadOnly,
  filteredPlazas,
  paginatedPlazas,
  currentPage,
  totalPages,
  setCurrentPage,
  searchTerm,
  filterEstado,
  onView,
  onEdit,
  onDeleteRequest,
  onRestore,
}: PlazasTableListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <Briefcase className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">Sincronizando plazas...</p>
      </div>
    );
  }

  if (filteredPlazas.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed py-20 text-center bg-muted/5">
        <div className="p-5 rounded-full bg-muted mb-4 inline-block">
          <Search className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No se encontraron plazas
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {searchTerm || filterEstado !== "todos"
            ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
            : "Comienza registrando la primera plaza disponible."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border overflow-x-auto bg-background max-w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold py-4">Nombre de Plaza</TableHead>
              <TableHead className="font-semibold py-4">Centro de Trabajo</TableHead>
              <TableHead className="font-semibold py-4">Género</TableHead>
              <TableHead className="font-semibold py-4">Estado</TableHead>
              <TableHead className="font-semibold py-4">Cupo</TableHead>
              <TableHead className="font-semibold py-4">Fecha</TableHead>
              <TableHead className="font-semibold py-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlazas.map((plaza) => (
              <PlazaTableRow
                key={plaza.id}
                plaza={plaza}
                onView={onView}
                onEdit={isReadOnly ? undefined : onEdit}
                onDelete={isReadOnly ? undefined : () => onDeleteRequest(plaza)}
                onRestore={isReadOnly ? undefined : onRestore}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground font-medium">
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
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
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
              Siguiente <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
