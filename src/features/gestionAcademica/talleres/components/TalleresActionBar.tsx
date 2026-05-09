import { RefreshCw, Upload, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";

interface TalleresActionBarProps {
  isLoading: boolean;
  isReadOnly: boolean;
  userRole: string | null;
  hasFilteredTalleres: boolean;
  refetch: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportClick: () => void;
  handleExport: (format: 'csv' | 'xlsx') => void;
  onNewTaller: () => void;
}

export function TalleresActionBar({
  isLoading,
  isReadOnly,
  userRole,
  hasFilteredTalleres,
  refetch,
  fileInputRef,
  handleFileChange,
  handleImportClick,
  handleExport,
  onNewTaller,
}: TalleresActionBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Listado de Talleres</h2>
        <p className="text-muted-foreground font-medium text-sm">Control y seguimiento del catálogo técnico</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={isLoading}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
        
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        
        {!isReadOnly && userRole !== "TUTOR ACADEMICO" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportClick}
            className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
          >
            <Upload className="h-4 w-4 mr-2" /> Importar Excel/CSV
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="tour-talleres-export"
              variant="outline"
              size="sm"
              disabled={isLoading || !hasFilteredTalleres}
              className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
            >
              <Download className="h-4 w-4 mr-2" /> Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-2">
            <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs font-bold cursor-pointer">
              Exportar a CSV (.csv)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Funcionalidad próximamente")} className="text-xs font-bold cursor-pointer opacity-50">
              Exportar a Excel (.xlsx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isReadOnly && userRole !== "TUTOR ACADEMICO" && (
          <Button
            id="tour-talleres-add"
            size="sm"
            onClick={onNewTaller}
            disabled={isLoading}
            className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Taller
          </Button>
        )}
      </div>
    </div>
  );
}
