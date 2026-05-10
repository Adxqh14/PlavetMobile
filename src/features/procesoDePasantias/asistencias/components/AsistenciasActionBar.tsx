import { Download, Plus } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";

interface AsistenciasActionBarProps {
  onExport: () => void;
  canCreate: boolean;
  onOpenForm: () => void;
}

export const AsistenciasActionBar = ({
  onExport,
  canCreate,
  onOpenForm
}: AsistenciasActionBarProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
      <div className="border-l-4 border-primary pl-6">
        <h2 className="text-3xl font-black tracking-tight">Registro de Jornadas</h2>
        <p className="text-muted-foreground font-medium text-sm">Monitoreo de horas y presencialidad laboral</p>
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

        {canCreate && (
          <Button
            size="sm"
            onClick={onOpenForm}
            className="rounded-xl font-bold h-10 text-xs shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" /> Registrar Asistencia
          </Button>
        )}
      </div>
    </div>
  );
};
