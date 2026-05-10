import { AlertTriangle } from "lucide-react";

export const CierreStatusHeader = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-rose-600/10">
        <AlertTriangle className="h-5 w-5 text-rose-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold">Estado del Proceso</h3>
        <p className="text-xs text-muted-foreground font-medium">Control de pasos secuenciales para el cierre definitivo</p>
      </div>
    </div>
  );
};
