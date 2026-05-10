import { Briefcase, User } from "lucide-react";

interface PasantiasHeroProps {
  userRole?: string | null;
  userTaller?: { nombre: string };
}

export const PasantiasHero = ({ userRole, userTaller }: PasantiasHeroProps) => {
  return (
    <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
      <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
        <Briefcase className="w-80 h-80 text-primary -rotate-12" />
      </div>
      <div className="w-full relative px-6 md:px-12 z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
            Gestión de <span className="text-primary">Pasantías</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Administra, supervisa y realiza el seguimiento de los programas de pasantías estudiantiles.
          </p>
          {userRole === "TUTOR ACADEMICO" && userTaller && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary border border-primary/20">
              <User className="h-4 w-4" />
              <span>Taller: {userTaller.nombre}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
