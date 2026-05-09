"use client"

import Main from "../../main/pages/page"
import { Badge } from "@/shared/components/ui/badge"
import { FeedbackView } from "../components/FeedbackView"

export default function FeedbackPage() {
  return (
    <Main>
      <div className="min-h-screen bg-background">
        {/* ======== SECCIÓN HERO (banner de bienvenida) ======== */}
        <section className="border-b relative overflow-hidden bg-primary-foreground">
          <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge decorativo */}
              <Badge variant="secondary" className="mb-6 text-sm font-medium">
                Centro de Feedback y Sugerencias
              </Badge>
              
              {/* Título principal de la página */}
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Comparte tu <span className="text-primary">experiencia</span>
              </h1>
              
              {/* Descripción debajo del título */}
              <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed md:text-xl">
                Tu opinión nos ayuda a mejorar. Comparte tus ideas, reporta problemas o sugiere mejoras 
                para hacer Plavet aún mejor.
              </p>
            </div>
          </div>
        </section>

        <FeedbackView />
      </div>
    </Main>
  )
}
