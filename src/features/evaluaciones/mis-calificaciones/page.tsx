"use client"

import Main from "@/features/main/pages/page"
import { GraduationCap } from "lucide-react"
import { MisCalificacionesView } from "./components/MisCalificacionesView"

export default function MisCalificacionesPage() {
  return (
    <Main>
      <div className="min-h-screen bg-background overflow-x-hidden">

        {/* Hero Section (Design from Main) */}
        <div className="relative overflow-hidden py-12 border-b bg-primary/5 rounded-2xl mb-8 w-full">
          <div className="absolute -top-12 -right-8 opacity-[0.04] pointer-events-none hidden md:block">
            <GraduationCap className="w-80 h-80 text-primary -rotate-12" />
          </div>
          <div className="w-full relative px-6 md:px-12 z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black mb-3 tracking-tight text-foreground leading-tight">
                Mis <span className="text-primary">Calificaciones</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                Registro oficial de evaluación y rendimiento académico durante el programa de pasantías.
              </p>
            </div>
          </div>
        </div>

        <MisCalificacionesView />
      </div>
    </Main>
  )
}
