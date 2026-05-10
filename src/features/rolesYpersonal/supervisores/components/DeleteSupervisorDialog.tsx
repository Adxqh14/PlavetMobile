import { Button } from "../../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../../shared/components/ui/dialog";
import type { Supervisor } from "../types";

interface DeleteSupervisorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supervisor: Supervisor | null;
  isPermanentDelete: boolean;
  onConfirm: () => void;
}

export const DeleteSupervisorDialog = ({
  open,
  onOpenChange,
  supervisor,
  isPermanentDelete,
  onConfirm
}: DeleteSupervisorDialogProps) => {
  if (!supervisor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar Supervisor"}
          </DialogTitle>
          <DialogDescription className="font-medium">
            {isPermanentDelete
              ? `¿Estás seguro de eliminar permanentemente a ${supervisor.nombre} ${supervisor.apellido}? Esta acción no se puede deshacer.`
              : `¿Estás seguro de eliminar a ${supervisor.nombre} ${supervisor.apellido}? Podrás restaurarlo más tarde.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="rounded-xl font-bold shadow-md shadow-destructive/20">
            {isPermanentDelete ? "Eliminar Permanentemente" : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
