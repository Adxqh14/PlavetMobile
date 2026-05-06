"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Send, 
  CheckCircle2,
  MapPin,
  CalendarDays
} from "lucide-react"
import Main from "@/features/main/pages/page"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { isReadOnlyRole } from "@/shared/config/rbac"

// Datos mock para demostración (Simulando filtrado por el taller del tutor)
const TALLER_ASIGNADO = {
  id: "T-101",
  nombre: "Desarrollo Web",
  periodo: "2025-2026"
}

const EMPRESAS = [
  { id: "1", nombre: "TechCorp Software" },
  { id: "2", nombre: "Innovatech Solutions" },
  { id: "3", nombre: "DataSoft RD" },
]

const ESTUDIANTES = [
  { id: "1", nombre: "Jean Carlos Bautista", empresaId: "1" },
  { id: "2", nombre: "María Elena González", empresaId: "2" },
  { id: "3", nombre: "Pedro Antonio Reyes", empresaId: "3" },
]

export default function VisitasPage() {
  const { userRole, user } = useAuth()
  const isReadOnly = isReadOnlyRole(userRole)
  const [enviado, setEnviado] = useState(false)

  const tallerAsignado = user?.taller
    ? { id: String(user.taller.id), nombre: user.taller.nombre, periodo: "2025-2026" }
    : TALLER_ASIGNADO

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
    setTimeout(() => setEnviado(false), 5000)
  }

  return (
    <Main>
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            Programación de Visitas
          </h1>
          <p className="text-muted-foreground text-lg">
            Gestionando visitas para el taller de <span className="font-bold text-foreground">{tallerAsignado.nombre}</span>
          </p>
        </div>
        <Badge variant="secondary" className="h-fit py-1.5 px-4 text-sm font-semibold">
          Periodo {tallerAsignado.periodo}
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Formulario de Notificación: Solo si no es modo lectura */}
        {!isReadOnly && (
          <Card className="border-border shadow-md">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-xl">Nueva Notificación de Visita</CardTitle>
              <CardDescription>Completa los detalles para avisar a la empresa y al estudiante.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Centro de Trabajo</Label>
                    <Select required>
                      <SelectTrigger id="empresa">
                        <SelectValue placeholder="Selecciona empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPRESAS.map(e => (
                          <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estudiante">Estudiante a supervisar</Label>
                    <Select required>
                      <SelectTrigger id="estudiante">
                        <SelectValue placeholder="Selecciona estudiante" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTUDIANTES.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de Visita</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="fecha" type="date" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora Aproximada</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="hora" type="time" className="pl-10" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Modalidad</Label>
                  <Select defaultValue="presencial">
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial (En el centro)</SelectItem>
                      <SelectItem value="virtual">Virtual (Videoconferencia)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Notas adicionales para la empresa</Label>
                  <Textarea 
                    id="observaciones" 
                    placeholder="Ej: Requerimiento de espacio físico, revisión de bitácora, etc." 
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full gap-2 text-base h-11" disabled={enviado}>
                  {enviado ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Notificación Enviada
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Enviar Aviso al Centro
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Historial / Próximas Visitas */}
        <div className={`space-y-6 ${isReadOnly ? 'lg:col-span-2' : ''}`}>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Visitas Programadas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {[
                  { id: 1, empresa: "TechCorp Software", estudiante: "Jean Bautista", fecha: "08 Mayo", hora: "10:00 AM", tipo: "Presencial", estado: "Pendiente" },
                  { id: 2, empresa: "CodeFlow Agency", estudiante: "Ana López", fecha: "10 Mayo", hora: "02:30 PM", tipo: "Presencial", estado: "Pendiente" },
                ].map(v => (
                  <div key={v.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{v.empresa}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">{v.tipo}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {v.estudiante}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {v.fecha}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {v.hora}</span>
                      </div>
                    </div>
                    <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">{v.estado}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="p-2 rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">Recordatorio Automático</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Al enviar la notificación, el sistema enviará automáticamente un correo electrónico al tutor empresarial registrado y una notificación al portal del estudiante.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </Main>
  )
}
