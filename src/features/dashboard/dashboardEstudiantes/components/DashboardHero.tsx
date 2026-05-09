import { GraduationCap } from "lucide-react"
import { useAuth } from "../../../auth/hooks/useAuth"

interface DashboardHeroProps {
  estadoPasantia?: string
}

export function DashboardHero({ estadoPasantia }: DashboardHeroProps) {
  const { user } = useAuth()
  
  const displayName = user?.perfil 
    ? `${user.perfil.nombre} ${user.perfil.apellido}` 
    : (user?.username ?? 'Estudiante')

  return (
    <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
      <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
        <GraduationCap className="w-80 h-80 text-primary -rotate-12" />
      </div>

      <div className="w-full relative px-8 md:px-16 z-10">
        <div className="max-w-3xl flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {estadoPasantia ? `Pasantía ${estadoPasantia}` : "Pasantía Activa"}
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
            Dashboard <span className="text-primary">Estudiantil</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Hola, <span className="text-foreground font-bold">{displayName}</span>. Monitorea tu progreso académico, gestiona tus documentos y supervisa tu asistencia.
          </p>
        </div>
      </div>
    </div>
  )
}
