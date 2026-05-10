export const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src="/images/Logo_Plavet_final-removebg-preview (1).png"
        alt="Plavet Logo"
        className="h-12 mb-4 object-contain"
      />
      <h1 className="text-2xl font-bold">
        Bienvenido a Pla<span className="text-primary">vet</span>
      </h1>
      <p className="text-balance text-muted-foreground">
        Sistema de Gestión de Pasantías y Empleabilidad
      </p>
    </div>
  );
};
