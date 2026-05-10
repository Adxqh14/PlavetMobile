import { Button } from "../../../../shared/components/ui/button";

interface UsuariosPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const UsuariosPagination = ({
  currentPage,
  totalPages,
  onPageChange
}: UsuariosPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
      <p className="text-sm text-muted-foreground font-medium">
        Página <span className="text-foreground">{currentPage}</span> de {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl font-bold h-9 text-xs"
        >
          Anterior
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, i, arr) => (
              <div key={p} className="flex items-center gap-1">
                {i > 0 && arr[i-1] !== p - 1 && <span className="px-1 text-muted-foreground">...</span>}
                <Button
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(p)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs ${currentPage === p ? 'shadow-md shadow-primary/20' : ''}`}
                >
                  {p}
                </Button>
              </div>
            ))
          }
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl font-bold h-9 text-xs"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
