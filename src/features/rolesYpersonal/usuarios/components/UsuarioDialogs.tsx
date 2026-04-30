"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../shared/components/ui/dialog"
import { Button } from "../../../../shared/components/ui/button"
import { Input } from "../../../../shared/components/ui/input"
import { Label } from "../../../../shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../shared/components/ui/select"
import { 
  User, 
  Mail, 
  Shield, 
  Contact, 
  Hash, 
  Info, 
  Plus
} from "lucide-react"
import type { Usuario, RolId, EstadoUsuario } from "../types"
import { ROLES, ROL_IDS } from "../types"

// ─────────────────────────────────────────────
// View Dialog (Premium)
// ─────────────────────────────────────────────
interface ViewUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario | null
}

const getStatusStyles = (status: string) => {
  return status === "Activo" 
    ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
    : "bg-gray-100 text-gray-700 border-gray-200";
};

export function ViewUsuarioDialog({ open, onOpenChange, usuario }: ViewUsuarioDialogProps) {
  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        {/* Header Visual */}
        <div className="relative h-28 bg-linear-to-r from-primary/90 to-primary/70 shrink-0">
          <div className="absolute -bottom-8 left-6">
            <div className="h-20 w-20 rounded-2xl bg-background p-1.5 shadow-xl">
              <div className="h-full w-full rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getStatusStyles(usuario.estado)}`}>
              {usuario.estado}
            </span>
          </div>
        </div>

        <div className="pt-12 pb-6 px-6 overflow-y-auto flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {usuario.nombre}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" /> {usuario.rol} <span className="mx-2">•</span> <Hash className="h-3.5 w-3.5" /> ID: {usuario.id}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <section className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Contact className="h-3.5 w-3.5 text-primary" /> Información de Identidad
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Nombre Completo</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold truncate">{usuario.nombre}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Correo Institucional</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <p className="text-sm font-semibold truncate">{usuario.email}</p>
                  </div>
                </div>
              </div>
            </section>

            {usuario.perfil_extendido && (
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-primary" /> Datos del Perfil
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(usuario.perfil_extendido).map(([key, val]) => 
                    val && (
                      <div key={key} className="p-3 rounded-xl bg-muted/30 border border-muted/50 transition-colors hover:bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1 capitalize">{key.replace('_', ' ')}</p>
                        <p className="text-sm font-semibold truncate">{String(val)}</p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 bg-muted/20 border-t shrink-0">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto px-8 font-semibold shadow-md active:scale-95 transition-all">
            Cerrar Detalles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Register Usuario Dialog (Premium)
// ─────────────────────────────────────────────
interface RegisterUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUsuario: (data: Omit<Usuario, "id" | "rol">) => void
}

export function RegisterUsuarioDialog({ open, onOpenChange, onAddUsuario }: RegisterUsuarioDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    id_rol: 4 as RolId,
    estado: "Activo" as EstadoUsuario
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUsuario(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nuevo Usuario</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Registra un nuevo usuario y asígnale un rol institucional.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="register-user-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Contact className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identidad y Acceso</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="reg-nombre" className="text-sm font-semibold">Nombre Completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-nombre" 
                      required 
                      className="pl-10 h-11" 
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-semibold">Correo Electrónico (Identificador) *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-email" 
                      type="email" 
                      required 
                      className="pl-10 h-11" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reg-rol" className="text-sm font-semibold">Rol Asignado *</Label>
                    <Select value={String(formData.id_rol)} onValueChange={v => setFormData({...formData, id_rol: Number(v) as RolId})}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROL_IDS.map(id => (
                          <SelectItem key={id} value={String(id)}>{ROLES[id]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-estado" className="text-sm font-semibold">Estado Inicial *</Label>
                    <Select value={formData.estado} onValueChange={(v: EstadoUsuario) => setFormData({...formData, estado: v})}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="submit" form="register-user-form" className="px-8 font-bold">Crear Usuario</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Change Rol Dialog (Premium)
// ─────────────────────────────────────────────
interface ChangeRolDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario | null
  onConfirm: (id: number, id_rol: RolId) => void
}

export const ChangeRolDialog = ({ open, onOpenChange, usuario, onConfirm }: ChangeRolDialogProps) => {
  const [selectedRol, setSelectedRol] = useState<RolId | null>(null);

  useState(() => { if (usuario) setSelectedRol(usuario.id_rol); });

  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-linear-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Cambiar Rol</DialogTitle>
          </div>
          <DialogDescription className="mt-2">
            Asigna un nuevo nivel de acceso a <strong>{usuario.nombre}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Seleccionar Nuevo Rol</Label>
            <Select value={String(selectedRol)} onValueChange={v => setSelectedRol(Number(v) as RolId)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROL_IDS.map(id => (
                  <SelectItem key={id} value={String(id)}>{ROLES[id]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => { if(selectedRol) onConfirm(usuario.id, selectedRol); onOpenChange(false); }} className="font-bold">Actualizar Rol</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─────────────────────────────────────────────
// Change Estado Dialog (Simple as requested for tables/etc)
// ─────────────────────────────────────────────
interface ChangeEstadoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: Usuario | null
  onConfirm: (id: number, estado: EstadoUsuario) => void
}

export const ChangeEstadoDialog = ({ open, onOpenChange, usuario, onConfirm }: ChangeEstadoDialogProps) => {
  if (!usuario) return null;
  const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Cambiar Estado</DialogTitle>
          <DialogDescription>
            {nuevoEstado === "Inactivo"
              ? `¿Deseas desactivar a ${usuario.nombre}? No podrá acceder al sistema.`
              : `¿Deseas activar a ${usuario.nombre}? Recuperará el acceso al sistema.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            variant={nuevoEstado === "Inactivo" ? "destructive" : "default"}
            onClick={() => { onConfirm(usuario.id, nuevoEstado); onOpenChange(false); }}
          >
            {nuevoEstado === "Inactivo" ? "Desactivar" : "Activar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
