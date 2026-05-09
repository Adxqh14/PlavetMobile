import { RefreshCw, Upload, Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../shared/components/ui/dropdown-menu";

interface EstudiantesActionBarProps {
  isLoading: boolean;
  isReadOnly: boolean;
  refetch: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportClick: () => void;
  handleExport: (format: 'csv' | 'xlsx') => void;
  onNewEstudiante: () => void;
}

export function EstudiantesActionBar({
  isLoading,
  isReadOnly,
  refetch,
  fileInputRef,
  handleFileChange,
  handleImportClick,
  handleExport,
  onNewEstudiante,
}: EstudiantesActionBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Listado de Estudiantes</h2>
        <p className="text-muted-foreground font-medium text-sm">Control y seguimiento de la matrícula técnica</p>
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
        {!isReadOnly && (
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
              id="tour-estudiantes-export"
              variant="outline"
              size="sm"
              className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
            >
              <Download className="h-4 w-4 mr-2" /> Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl border-2">
            <DropdownMenuItem onClick={() => handleExport('xlsx')} className="text-xs font-bold cursor-pointer">
              Exportar a Excel (.xlsx)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs font-bold cursor-pointer">
              Exportar a CSV (.csv)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!isReadOnly && (
          <Button
            id="tour-estudiantes-add"
            size="sm"
            onClick={onNewEstudiante}
            className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Estudiante
          </Button>
        )}
      </div>
    </div>
  );
}
