import { RefreshCw, Download, Upload, Plus, Loader2 } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface CentrosActionBarProps {
  isLoading: boolean;
  isReadOnly: boolean;
  isImporting: boolean;
  refetch: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportClick: () => void;
  handleExport: () => void;
  onNewCentro: () => void;
  onOpenHistory: () => void;
}

export function CentrosActionBar({
  isLoading,
  isReadOnly,
  isImporting,
  refetch,
  fileInputRef,
  handleFileChange,
  handleImportClick,
  handleExport,
  onNewCentro,
  onOpenHistory,
}: CentrosActionBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Listado de Centros de Trabajo</h2>
        <p className="text-muted-foreground font-medium text-sm">Control y seguimiento de empresas colaboradoras</p>
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

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenHistory}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          Historial
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>

        {!isReadOnly && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              disabled={isImporting}
              className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Importar
            </Button>
            <Button
              size="sm"
              onClick={onNewCentro}
              className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Nuevo Centro
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
