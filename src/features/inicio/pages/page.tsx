import {
  Header,
  Hero,
  StatsSection,
  FeaturesSection,
  BenefitsSection,
  AboutSection,
  Footer,
} from "../components";

export default function InicioPage() {
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