"use client"

import { useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from '../types';
import type { AuthUser } from '../services/authService';
import { AuthContext } from './AuthContextInstance';
import { authService } from '../services/authService';
import { apiClient } from '@/lib/api';

function getRoleFromUser(user: AuthUser): UserRole {
  const rol = user.rol?.toUpperCase();
  if (rol?.includes('ADMIN')) return 'ADMINISTRADOR';
  if (rol?.includes('ESTUDIANTE')) return 'ESTUDIANTE';
  if (rol?.includes('TUTOR ACAD') || rol?.includes('ACADEMICO')) return 'TUTOR ACADEMICO';
  if (rol?.includes('TUTOR EMP') || rol?.includes('EMPRESARIAL')) return 'TUTOR EMPRESARIAL';
  if (rol?.includes('SUPERVISOR')) return 'SUPERVISOR';
  if (rol?.includes('VINCULADOR')) return 'VINCULADOR';
  return 'ADMINISTRADOR';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (user) return getRoleFromUser(user);
    return 'ADMINISTRADOR';
  });

  const isAuthenticated = user !== null && sessionStorage.getItem('isLoggedIn') === 'true';

  // Si el usuario es TUTOR ACADEMICO pero no tiene taller en el objeto,
  // lo buscamos desde el backend y actualizamos el contexto.
  useEffect(() => {
    if (!user || user.taller) return;
    const role = getRoleFromUser(user);
    if (role !== 'TUTOR ACADEMICO') return;

    const fetchTaller = async () => {
      try {
        const response = await apiClient.get<any>(`/api/v1/tutores-academicos/${user.id}`);
        const data = response.data || response;
        if (data?.id_taller && data?.taller) {
          const updatedUser: AuthUser = {
            ...user,
            taller: { id: Number(data.id_taller), nombre: data.taller?.nombre || data.taller_nombre || '' },
          };
          setUserState(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else if (data?.id_taller) {
          // Taller sin nombre — intentar obtenerlo
          const updatedUser: AuthUser = {
            ...user,
            taller: { id: Number(data.id_taller), nombre: data.taller_nombre || `Taller ${data.id_taller}` },
          };
          setUserState(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch {
        // Si falla, no bloqueamos al usuario
      }
    };

    fetchTaller();
  }, [user]);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      setUserRole(getRoleFromUser(newUser));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch { /* ignore */ }
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    localStorage.removeItem('plavet_token');
    sessionStorage.removeItem('isLoggedIn');
    setUserState(null);
    setUserRole('ADMINISTRADOR');
  };

  const value = {
    userRole,
    setUserRole,
    isAuthenticated,
    user,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
