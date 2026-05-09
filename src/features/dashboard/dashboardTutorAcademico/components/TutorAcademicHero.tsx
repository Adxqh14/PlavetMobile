import { ShieldCheck } from "lucide-react"
import { useAuth } from "../../../auth/hooks/useAuth"

export function TutorAcademicHero() {
  const { user } = useAuth()
  
  const displayName = user?.perfil
    ? `${user.perfil.nombre} ${user.perfil.apellido}`
    : (user?.username ?? 'Tutor')

  return (
    <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl w-full">
      <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
        <ShieldCheck className="w-80 h-80 text-primary -rotate-12" />
      </div>
      
      <div className="w-full relative px-10 z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
            Consola de <span className="text-primary">Gestión Académica</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Hola, <span className="text-foreground font-bold">{displayName}</span>. Supervisa el progreso de tu taller y coordina las visitas a empresas.
          </p>
        </div>
      </div>
    </div>
  )
}
