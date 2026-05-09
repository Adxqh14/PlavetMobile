import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Users,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import ModuleGuide from "./ModuleGuide";

export function SupportView() {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Guías de Usuario",
      description: "Documentación completa para aprender a usar todas las funcionalidades del sistema.",
      items: [
        "Guía de inicio rápido",
        "Gestión de estudiantes",
        "Administración de centros",
        "Control de pasantías",
        "Generación de reportes"
      ]
    },
    {
      icon: FileText,
      title: "Documentos y Formatos",
      description: "Plantillas y formatos oficiales para descargar y usar en el sistema.",
      items: [
        "Formato de solicitud",
        "Plantilla de informe",
        "Guía de evaluación",
        "Manual de procedimientos",
        "Políticas del sistema"
      ]
    },
    {
      icon: MessageCircle,
      title: "Soporte Directo",
      description: "Comunicación directa con nuestro equipo de soporte técnico.",
      items: [
        "Chat en vivo",
        "Sistema de tickets",
        "Foro de usuarios",
        "FAQ actualizada",
        "Contacto directo"
      ]
    }
  ];

  const supportInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      content: "+1 (555) 123-4567",
      description: "Lunes a Viernes, 8:00 AM - 6:00 PM"
    },
    {
      icon: Mail,
      title: "Email",
      content: "soporte@plavet.edu",
      description: "Respuesta en 24 horas"
    },
    {
      icon: MessageCircle,
      title: "Chat en Vivo",
      content: "Disponible 24/7",
      description: "Soporte instantáneo"
    }
  ];

  return (
    <>
      {/* Module Guides */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <ModuleGuide />
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Categorías de Ayuda
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Explora nuestros recursos organizados por categorías para encontrar exactamente lo que necesitas
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {helpCategories.map((category, index) => (
              <Card key={index} className="group transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <category.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-sm text-muted-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Information */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Contacto Directo
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Nuestro equipo de soporte está disponible para ayudarte cuando lo necesites
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {supportInfo.map((info, index) => (
              <Card key={index} className="text-center transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <info.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-foreground">{info.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Características del Soporte
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Conoce las ventajas de nuestro sistema de soporte integral
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-bold">Disponibilidad 24/7</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  Soporte disponible en cualquier momento para resolver tus dudas urgentes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-bold">Equipo Experto</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  Personal calificado con conocimiento profundo del sistema y sus funcionalidades.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="mb-2 font-bold">Soporte Seguro</h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                  Canales seguros para proteger tu información y privacidad durante el soporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>soporte@plavet.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Centro de Ayuda</span>
              </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground">&copy; {new Date().getFullYear()} Plavet. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
