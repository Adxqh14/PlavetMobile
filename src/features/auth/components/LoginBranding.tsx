import { memo } from "react";

export const LoginBranding = memo(function LoginBranding() {
  return (
    <div className="mt-auto hidden md:block">
      <img
        src="/images/Salesianos%20logo.png"
        alt="Plavet - Sistema de Gestión de Pasantías"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        className="max-h-[60%] w-full object-cover"
      />
    </div>
  );
});
