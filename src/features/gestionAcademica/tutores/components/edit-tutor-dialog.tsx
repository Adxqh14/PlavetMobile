"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/components/ui/select"
import { User, Mail, Phone, CreditCard, BookOpen, GraduationCap, ShieldCheck } from "lucide-react"
import type { Tutor, UpdateTutorData } from "../types"
import { talleresService } from "../../talleres/services/talleresService"

interface EditTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tutor: Tutor | null
  onUpdateTutor?: (id: string, data: UpdateTutorData) => Promise<boolean | void>
}

interface TallerOption {
  id: string
  nombre: string
}

export function EditTutorDialog({ open, onOpenChange, tutor, onUpdateTutor }: EditTutorDialogProps) {
  const [formData, setFormData] = useState<UpdateTutorData & { cedula: string }>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    id_taller: "",
    taller_nombre: "",
    cedula: "",
    estado: "Activo",
  })
  const [talleres, setTalleres] = useState<TallerOption[]>([])
  const [loadingTalleres, setLoadingTalleres] = useState(false)

  // Sincronizar formulario cuando cambia el tutor
  useEffect(() => {
    if (tutor) {
      const estadoActual = tutor.status === "active" ? "Activo" : tutor.status === "deleted" ? "Inactivo" : "Activo";
      setFormData({
        nombre: tutor.nombre,
        apellido: tutor.apellido,
        email: tutor.email,
        telefono: tutor.telefono,
        id_taller: tutor.id_taller || "",
        taller_nombre: tutor.areaAsignada || "",
        cedula: tutor.cedula,
        estado: estadoActual,
      })
    }
  }, [tutor])

  // Cargar talleres al abrir el diálogo
  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoadingTalleres(true)
    talleresService
      .getAll({ pageSize: 200 })
      .then((res) => {
        if (!cancelled) setTalleres(res.data.map((t: any) => ({ id: String(t.id), nombre: t.nombre })))
      })
      .catch((err) => console.error("Error cargando talleres:", err))
      .finally(() => { if (!cancelled) setLoadingTalleres(false) })
    return () => { cancelled = true }
  }, [open])

  const handleTallerChange = (value: string) => {
    const selectedTaller = talleres.find(t => t.id === value);
    setFormData({ 
      ...formData, 
      id_taller: value,
      taller_nombre: selectedTaller?.nombre || ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tutor) return

    const estadoActual = tutor.status === "active" ? "Activo" : tutor.status === "deleted" ? "Inactivo" : "Activo";
    const updateData: UpdateTutorData = {}
    if (formData.nombre !== tutor.nombre) updateData.nombre = formData.nombre
    if (formData.apellido !== tutor.apellido) updateData.apellido = formData.apellido
    if (formData.email !== tutor.email) updateData.email = formData.email
    if (formData.telefono !== tutor.telefono) updateData.telefono = formData.telefono
    if (formData.id_taller && formData.id_taller !== tutor.id_taller) {
      updateData.id_taller = formData.id_taller
    }
    if (formData.estado && formData.estado !== estadoActual) {
      updateData.estado = formData.estado
    }

    if (onUpdateTutor) {
      const success = await onUpdateTutor(tutor.id, updateData)
      if (success !== false) {
        onOpenChange(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  if (!tutor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={tutor.id} className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Editar Tutor Académico</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Actualiza el perfil y las asignaciones del docente.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="edit-tutor-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Identidad Personal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identidad Personal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre" className="text-sm font-semibold">Nombre(s) *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-nombre"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.nombre || ""}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-apellido" className="text-sm font-semibold">Apellido(s) *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-apellido"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.apellido || ""}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-semibold">Cédula de Identidad</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      disabled
                      className="pl-10 h-11 shadow-xs bg-muted/50"
                      value={formData.cedula}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">La cédula no puede modificarse.</p>
                </div>
              </div>
            </div>

            {/* Sección: Información de Contacto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <Phone className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Canales de Contacto</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-semibold">Correo Institucional *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-email"
                      type="email"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-telefono" className="text-sm font-semibold">Teléfono / WhatsApp *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="edit-telefono"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      value={formData.telefono || ""}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección: Taller Asignado */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Asignación Académica</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-taller" className="text-sm font-semibold">Taller Asignado</Label>
                <Select
                  value={formData.id_taller || ""}
                  onValueChange={handleTallerChange}
                >
                  <SelectTrigger id="edit-taller" className="h-11 shadow-xs">
                    <SelectValue placeholder={loadingTalleres ? "Cargando talleres…" : "Seleccionar taller"} />
                  </SelectTrigger>
                  <SelectContent>
                    {talleres.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sección: Estado */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Estado</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-estado" className="text-sm font-semibold">Estado del Tutor</Label>
                <Select
                  value={formData.estado || "Activo"}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger id="edit-estado" className="h-11 shadow-xs">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-muted/20 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-tutor-form"
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
