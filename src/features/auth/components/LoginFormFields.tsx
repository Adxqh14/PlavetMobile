import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import { Button } from "../../../shared/components/ui/button";

interface LoginFormFieldsProps {
  cedula: string;
  setCedula: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
}

export const LoginFormFields = ({
  cedula,
  setCedula,
  password,
  setPassword,
  loading,
}: LoginFormFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="cedula">Cédula</Label>
        <Input
          id="cedula"
          type="text"
          placeholder="000-0000000-0"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Contraseña</Label>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </Button>
    </>
  );
};
