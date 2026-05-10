import { Download, RotateCcw } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface CierreActionBarProps {
  onExport: () => void;
  isExporting: boolean;
  onReset: () => void;
  showReset: boolean;
}

export const CierreActionBar = ({
  onExport,
  isExporting,
  onReset,
  showReset
}: CierreActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-rose-600 pl-6">
        <h2 className="text-3xl font-black tracking-tight text-foreground">Proceso de Finalización</h2>
        <p className="text-muted-foreground font-medium text-sm">Resumen operativo y ejecución de cierre masivo</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
          className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
          disabled={isExporting}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exportando..." : "Exportar Datos"}
        </Button>
        {showReset && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReset}
            className="rounded-xl font-bold border h-10 text-xs bg-background hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar Vista
          </Button>
        )}
      </div>
    </div>
  );
};
