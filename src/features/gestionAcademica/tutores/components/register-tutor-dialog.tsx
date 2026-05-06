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
import type { CreateTutorData } from "../types"
import { talleresService } from "../../talleres/services/talleresService"
import { User, Mail, Phone, CreditCard, BookOpen, GraduationCap } from "lucide-react"

interface RegisterTutorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTutor: (tutor: CreateTutorData) => Promise<boolean | void>
}

interface TallerOption {
  id: string
  nombre: string
}

const emptyForm: CreateTutorData = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  cedula: "",
  id_taller: "",
  taller_nombre: "",
}

export function RegisterTutorDialog({ open, onOpenChange, onAddTutor }: RegisterTutorDialogProps) {
  const [formData, setFormData] = useState<CreateTutorData>(emptyForm)
  const [talleres, setTalleres] = useState<TallerOption[]>([])
  const [loadingTalleres, setLoadingTalleres] = useState(false)

  // Cargar talleres al montar / abrir el diálogo
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
    if (!formData.taller_nombre) return;
    const success = await onAddTutor({ ...formData })
    if (success !== false) {
      setFormData(emptyForm)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[95dvh] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-8 pt-8 pb-6 bg-linear-to-r from-primary/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Nuevo Tutor Académico</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Registra un nuevo docente para la supervisión de pasantías.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form id="register-tutor-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Sección: Identidad Personal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-muted">
                <User className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Identidad Personal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm font-semibold">Nombre(s) *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nombre"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="Ej: Juan"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido" className="text-sm font-semibold">Apellido(s) *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="apellido"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="Ej: Pérez"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cedula" className="text-sm font-semibold">Cédula de Identidad *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cedula"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="000-0000000-0"
                      value={formData.cedula}
                      onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    />
                  </div>
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
                  <Label htmlFor="email" className="text-sm font-semibold">Correo Institucional *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="usuario@ipisa.edu.do"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-semibold">Teléfono / WhatsApp *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefono"
                      required
                      className="pl-10 h-11 shadow-xs focus-visible:ring-primary/30"
                      placeholder="809-000-0000"
                      value={formData.telefono}
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
                <Label htmlFor="id_taller" className="text-sm font-semibold">Taller Asignado *</Label>
                <Select
                  value={formData.id_taller}
                  onValueChange={handleTallerChange}
                  disabled={loadingTalleres || talleres.length === 0}
                >
                  <SelectTrigger id="id_taller" className="h-11 shadow-xs">
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
            form="register-tutor-form"
            disabled={!formData.id_taller}
            className="px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            Registrar Tutor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
