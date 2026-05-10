import { Zap, Shield, BarChart3, Clock, TrendingUp, Users } from "lucide-react";

export const BenefitsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 ">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Beneficios de Pla<span className="text-primary">vet</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Descubre los beneficios de utilizar Plavet para gestionar tus pasantías.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Automatización Inteligente</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Reduce tareas manuales con flujos de trabajo automatizados que ahorran tiempo y minimizan errores en
                el proceso.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Seguridad Garantizada</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Protección de datos con encriptación avanzada y cumplimiento de normativas de privacidad
                institucionales.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Análisis en Tiempo Real</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Visualiza estadísticas y métricas clave con dashboards interactivos para tomar decisiones informadas.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Acceso 24/7</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Plataforma disponible en cualquier momento desde cualquier dispositivo con conexión a internet.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Escalabilidad</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Crece con tu institución, soportando desde decenas hasta miles de estudiantes simultáneamente.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Colaboración Efectiva</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Facilita la comunicación entre estudiantes, tutores, empresas e instituciones en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
