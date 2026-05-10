import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface PasantiasPaginationProps {
  totalItems: number;
  currentItemsCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PasantiasPagination = ({
  totalItems,
  currentItemsCount,
  currentPage,
  totalPages,
  onPageChange
}: PasantiasPaginationProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
      <p className="text-sm text-muted-foreground font-medium">
        Mostrando <span className="text-foreground">{currentItemsCount}</span> de <span className="text-foreground">{totalItems}</span> registros
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl font-bold h-9 text-xs"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl font-bold h-9 text-xs"
        >
          Siguiente <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
