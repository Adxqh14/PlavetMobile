import { RefreshCw, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface SupervisoresActionBarProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenCreate: () => void;
  isReadOnly: boolean;
}

export const SupervisoresActionBar = ({
  onRefresh,
  isLoading,
  onOpenCreate,
  isReadOnly
}: SupervisoresActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Listado de Supervisores</h2>
        <p className="text-muted-foreground font-medium text-sm">Control y administración del equipo de supervisión</p>
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

        {!isReadOnly && (
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="rounded-xl font-bold h-10 text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Nuevo Supervisor
          </Button>
        )}
      </div>
    </div>
  );
};
