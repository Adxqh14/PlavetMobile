import { Download, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface ExcusasActionBarProps {
  title: string;
  onExport: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ExcusasActionBar = ({
  title,
  onExport,
  onRefresh,
  isLoading
}: ExcusasActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        <p className="text-muted-foreground font-medium text-sm">Control operativo y administrativo de justificaciones</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Actualizar
        </Button>
      </div>
    </div>
  );
};
