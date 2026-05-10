import { RefreshCw, Download } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface UsuariosActionBarProps {
  onRefresh: () => void;
  isLoading: boolean;
  onExport: () => void;
}

export const UsuariosActionBar = ({ onRefresh, isLoading, onExport }: UsuariosActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Listado de Usuarios</h2>
        <p className="text-muted-foreground font-medium text-sm">Control global de identidades y permisos</p>
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
      </div>
    </div>
  );
};
