"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { AuthContext } from "../context/AuthContextInstance";

export const useLogin = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sanitizedCedula = cedula.replace(/\D/g, "");
      const response = await authService.login({
        cedula: sanitizedCedula,
        password,
      });

      if (authContext) {
        authContext.setUser(response.user);
      }

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("tenant", response.user.tenant);
      sessionStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");
    } catch (err) {
      const error = err as { message?: string };
      setError(
        error.message || "Error al iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    cedula,
    setCedula,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
};
