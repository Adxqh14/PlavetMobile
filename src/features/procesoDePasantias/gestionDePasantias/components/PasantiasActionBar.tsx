import { RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface PasantiasActionBarProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExport: () => void;
  isReadOnly: boolean;
  onOpenCreate: () => void;
}

export const PasantiasActionBar = ({
  onRefresh,
  isLoading,
  onExport,
  isReadOnly,
  onOpenCreate
}: PasantiasActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Expedientes de Pasantías</h2>
        <p className="text-muted-foreground font-medium text-sm">Control operativo y administrativo del programa</p>
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
          <Download className="h-4 w-4 mr-2" /> Exportar
        </Button>

        {!isReadOnly && (
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="rounded-xl font-bold h-10 text-xs shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Nueva Pasantía
          </Button>
        )}
      </div>
    </div>
  );
};
