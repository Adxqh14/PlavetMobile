import { cn } from "@/lib/utils";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { LoginHeader } from "./LoginHeader";
import { LoginFormFields } from "./LoginFormFields";
import { LoginBranding } from "./LoginBranding";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    cedula,
    setCedula,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 md:top-6 md:left-6 h-8 w-8 text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1 hover:bg-muted/50 rounded-full"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <LoginHeader />
              
              {error && (
                <div className="text-sm font-medium text-destructive text-center">
                  {error}
                </div>
              )}

              <LoginFormFields 
                cedula={cedula}
                setCedula={setCedula}
                password={password}
                setPassword={setPassword}
                loading={loading}
              />
            </div>
          </form>

          <LoginBranding />
        </CardContent>
      </Card>
      
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-foreground mt-2">
        Al hacer clic en continuar, aceptas nuestros <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}
