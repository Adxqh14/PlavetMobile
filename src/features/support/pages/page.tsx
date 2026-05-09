import { Badge } from "@/shared/components/ui/badge"
import Main from "../../main/pages/page"
import { SupportView } from "../components/SupportView"

export default function SupportPage() {
  return (
    <Main>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="border-b relative overflow-hidden bg-primary-foreground">
          <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 text-sm font-medium">
                Centro de Ayuda y Soporte
              </Badge>
              
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                ¿Cómo podemos <span className="text-primary">ayudarte</span>?
              </h1>
              
              <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed md:text-xl">
                Encuentra respuestas, tutoriales y soporte técnico para aprovechar al máximo todas las 
                funcionalidades de Plavet.
              </p>
            </div>
          </div>
        </section>

        <SupportView />
      </div>
    </Main>
  )
}
