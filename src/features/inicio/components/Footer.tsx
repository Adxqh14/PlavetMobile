import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../../../shared/components/ui/button";
import { Separator } from "../../../shared/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-2xl font-bold">
              Pla<span className="text-primary">vet</span>
            </h3>
            <p className="mb-6 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Sistema Integral de Gestión de Pasantías. Optimizando el proceso de pasantías y fortaleciendo el vínculo
              entre educación y trabajo desde 2025.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ipisasdb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline">Instagram</Button>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@ipisa.edu.do</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1(809)-724-5700</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Santiago de los Caballeros, República Dominicana</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/images/logo_pisa.png" alt="IPISA Logo" className="h-6 object-contain bg-white rounded-sm p-0.5" />
            <p className="text-sm">&copy; 2025 Plavet. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
