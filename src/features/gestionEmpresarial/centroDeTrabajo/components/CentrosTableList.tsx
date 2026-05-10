import { Loader2, Briefcase, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import { CentroTable } from "./CentroTable";
import type { CentroTrabajo } from "../types";

interface CentrosTableListProps {
  isLoading: boolean;
  isReadOnly: boolean;
  filteredCentros: CentroTrabajo[];
  paginatedCentros: CentroTrabajo[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchTerm: string;
  statusFilter: string;
  onView: (centro: CentroTrabajo) => void;
  onEdit: (centro: CentroTrabajo) => void;
  onDeleteRequest: (centro: CentroTrabajo) => void;
  onRestore: (centro: CentroTrabajo) => void;
}

export function CentrosTableList({
  isLoading,
  isReadOnly,
  filteredCentros,
  paginatedCentros,
  currentPage,
  totalPages,
  setCurrentPage,
  searchTerm,
  statusFilter,
  onView,
  onEdit,
  onDeleteRequest,
  onRestore,
}: CentrosTableListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <Briefcase className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">Sincronizando centros de trabajo...</p>
      </div>
    );
  }

  if (filteredCentros.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed py-20 text-center bg-muted/5">
        <div className="p-5 rounded-full bg-muted mb-4 inline-block">
          <Search className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          No se encontraron centros de trabajo
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {searchTerm || statusFilter !== "todos"
            ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
            : "Comienza registrando el primer centro de trabajo en el sistema."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border overflow-x-auto bg-background max-w-full">
        <CentroTable
          centros={paginatedCentros}
          onView={onView}
          onEdit={isReadOnly ? undefined : onEdit}
          onDelete={isReadOnly ? undefined : (id) => {
            const centro = filteredCentros.find(c => c.id === id) || paginatedCentros.find(c => c.id === id);
            if (centro) onDeleteRequest(centro);
          }}
          onRestore={isReadOnly ? undefined : onRestore}
        />
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
