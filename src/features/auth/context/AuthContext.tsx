"use client"

import { useState, type ReactNode } from 'react';
import type { UserRole } from '../types';
import { AuthContext } from './AuthContextInstance';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializamos con un rol por defecto. 
  // Podríamos persistirlo en localStorage para que no se pierda al recargar.
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('plavet_role') as UserRole) || 'ESTUDIANTE';
    }
    return 'ESTUDIANTE';
  });

  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('plavet_role', role);
  };

  const value = {
    userRole,
    setUserRole: handleSetUserRole,
    user: {
      name: "Usuario Plavet",
      email: "usuario@plavet.com",
      avatar: "/avatars/user.jpg",
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
