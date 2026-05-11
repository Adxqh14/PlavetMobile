import { memo } from "react";
import { Building2, GraduationCap, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { Separator } from "../../../shared/components/ui/separator";

export const AboutSection = memo(function AboutSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Sobre Nosotros</h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Conoce nuestra misión, visión y valores que impulsan el éxito educativo.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="border-2 h-full">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <Building2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                Facilitar el proceso de gestión de pasantías mediante un sistema integral que conecta estudiantes,
                instituciones educativas y centros de trabajo, garantizando una experiencia transparente, eficiente y
                enriquecedora para todos los involucrados.
              </p>
              <Separator />
              <p className="leading-relaxed text-muted-foreground">
                Nos comprometemos a ofrecer herramientas tecnológicas de vanguardia que simplifiquen la administración
                académica y fortalezcan el vínculo entre la educación y el mundo laboral.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 h-full">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                Ser la plataforma líder en gestión de pasantías a nivel nacional e internacional, reconocida por su
                innovación tecnológica, compromiso con la excelencia educativa y capacidad de transformar la
                experiencia formativa de miles de estudiantes.
              </p>
              <Separator />
              <p className="leading-relaxed text-muted-foreground">
                Aspiramos a facilitar el desarrollo profesional de los estudiantes y fortalecer las relaciones
                estratégicas entre instituciones educativas y el sector empresarial.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 h-full">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl">Nuestros Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="font-semibold">Innovación</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                    Implementamos tecnología de punta para ofrecer soluciones eficientes y actualizadas.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Transparencia</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                    Garantizamos procesos claros y accesibles para todos los usuarios del sistema.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Compromiso</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-1">
                    Dedicados al éxito académico y profesional de cada estudiante.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});
