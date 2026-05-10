import { RefreshCw, Download, Upload, Plus, Loader2 } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface TutorActionBarProps {
  isLoading: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onImportClick: () => void;
  isImporting: boolean;
  onNewTutor: () => void;
  isReadOnly: boolean;
}

export const TutorActionBar = ({
  isLoading,
  onRefresh,
  onExport,
  onImportClick,
  isImporting,
  onNewTutor,
  isReadOnly
}: TutorActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Listado de Tutores</h2>
        <p className="text-muted-foreground font-medium text-sm">Administración de perfiles y accesos</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>

        {!isReadOnly && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onImportClick}
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
              onClick={onNewTutor}
              className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Nuevo Tutor
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
