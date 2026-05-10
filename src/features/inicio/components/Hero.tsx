import { LogIn, Briefcase } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Badge } from "../../../shared/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="border-b relative overflow-hidden min-h-screen flex flex-col justify-center bg-background">
      {/* Static Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/bg.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-50 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-background/30 dark:bg-background/70" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 lg:py-24 relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <Badge
            variant="outline"
            className="mb-8 uppercase tracking-widest sm:tracking-[0.25em] text-[9px] sm:text-[10px] md:text-xs font-black border-primary/30 bg-primary/5 text-primary py-2 px-3 sm:px-6 rounded-full shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000"
          >
            Sistema de Gestión de Pasantías y Empleabilidad
          </Badge>

          <h1 className="mb-8 text-balance text-5xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            <span className="text-foreground">Bienvenido a</span> Pla
            <span className="text-primary drop-shadow-[0_0_25px_rgba(var(--primary),0.4)]">
              vet
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-pretty text-lg md:text-2xl font-semibold text-foreground/80 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both drop-shadow-sm">
            La plataforma integral que revoluciona el proceso de pasantías.
            Conectamos talento estudiantil, instituciones educativas y centros
            de trabajo en un ecosistema digital único.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 rounded-full px-10 font-bold text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 relative overflow-hidden group/btn"
              onClick={() => navigate("/login")}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-in-out" />
              <LogIn className="relative mr-2.5 h-5 w-5 z-10" />
              <span className="relative z-10">Iniciar Sesión</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-14 rounded-full px-10 font-bold text-base border-2 hover:bg-muted transition-all group/outline"
              onClick={() => {
                document
                  .getElementById("tour-inicio-features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explorar Plataforma
              <Briefcase className="ml-2.5 h-5 w-5 transition-transform group-hover/outline:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
