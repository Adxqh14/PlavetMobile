import { AlertTriangle } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../../shared/components/ui/dialog";
import type { Usuario } from "../types";

interface DeleteUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteUsuarioDialog = ({
  open,
  onOpenChange,
  usuario,
  onConfirm,
  isDeleting
}: DeleteUsuarioDialogProps) => {
  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-2">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-black">Eliminar usuario</DialogTitle>
          </div>
          <DialogDescription className="font-medium">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <span className="font-bold text-foreground">
              {usuario.perfil
                ? `${usuario.perfil.nombre} ${usuario.perfil.apellido}`
                : usuario.username}
            </span>
            ?{" "}
            {usuario.rol.toUpperCase() === "ESTUDIANTE" && (
              <>También se eliminará el registro de estudiante asociado. </>
            )}
            Esta acción es permanente y no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="rounded-xl font-bold"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl font-bold shadow-md shadow-destructive/20"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
