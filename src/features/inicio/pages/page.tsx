"use client";

import { useEffect } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { StatsSection } from "../components/StatsSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { BenefitsSection } from "../components/BenefitsSection";
import { AboutSection } from "../components/AboutSection";
import { Footer } from "../components/Footer";

export default function InicioPage() {
  // Limpiar cualquier sesión existente al cargar la página
  useEffect(() => {
    sessionStorage.removeItem('isLoggedIn');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <BenefitsSection />
      <AboutSection />
      <Footer />
    </div>
  );
}