"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui/dialog";
import { Button } from "../../../../shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  centroNombre: string;
  isPermanent: boolean;
}

export const DeleteConfirmDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  centroNombre,
  isPermanent 
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>
              {isPermanent ? "Eliminar Permanentemente" : "Eliminar Centro"}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <DialogDescription className="space-y-2">
          {isPermanent ? (
            <>
              <p>
                Estás a punto de eliminar permanentemente el centro:
              </p>
              <p className="font-semibold text-foreground">
                "{centroNombre}"
              </p>
              <p className="text-destructive font-medium">
                ⚠️ Esta acción no se puede deshacer. El centro será eliminado permanentemente del sistema.
              </p>
            </>
          ) : (
            <>
              <p>
                Estás a punto de eliminar el centro:
              </p>
              <p className="font-semibold text-foreground">
                "{centroNombre}"
              </p>
              <p>
                El centro será movido al historial y podrás restaurarlo más tarde si es necesario.
              </p>
            </>
          )}
        </DialogDescription>

        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant={isPermanent ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {isPermanent ? "Eliminar Permanentemente" : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
