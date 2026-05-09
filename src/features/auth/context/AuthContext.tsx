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

interface TutorAcademicoItem {
  id: string | number;
  email?: string;
  perfil?: {
    email_contacto?: string;
    cedula?: string;
  };
  id_taller?: string | number;
  taller?: {
    id: string | number;
    nombre: string;
  };
  taller_nombre?: string;
}

function enrichUserWithTaller(raw: Record<string, unknown>): AuthUser {
  const user = raw as AuthUser & Record<string, unknown>;
  // El backend puede enviar id_taller directamente en el objeto usuario
  // aunque el tipo TypeScript no lo incluya explícitamente
  if (!user.taller) {
    const idTaller = raw.id_taller as string | number | undefined;
    if (idTaller) {
      const tallerObj = raw.taller_obj as Record<string, unknown> | undefined;
      user.taller = {
        id: Number(idTaller),
        nombre: (tallerObj?.nombre as string) || (raw.taller_nombre as string) || `Taller ${idTaller}`,
      };
    } else {
      // El login devuelve el taller dentro de datos_rol.taller (UUID string)
      const datosRol = raw.datos_rol as Record<string, unknown> | undefined;
      const tallerDatosRol = datosRol?.taller as Record<string, unknown> | undefined;
      if (tallerDatosRol?.id) {
        user.taller = {
          id: tallerDatosRol.id as unknown as number,
          nombre: (tallerDatosRol.nombre as string) || `Taller ${tallerDatosRol.id}`,
        };
      }
    }
  }
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      return enrichUserWithTaller(JSON.parse(stored));
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

    const applyTallerFromData = (data: Record<string, unknown>): boolean => {
      const idTaller = data?.id_taller as string | number | undefined;
      if (!idTaller) return false;
      const tallerObj = data?.taller as Record<string, unknown> | undefined;
      const nombre = (tallerObj?.nombre as string) || (data?.taller_nombre as string) || `Taller ${idTaller}`;
      const updatedUser: AuthUser = { ...user, taller: { id: Number(idTaller), nombre } };
      setUserState(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    };

    const decodeJwt = (token: string): Record<string, unknown> | null => {
      try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      } catch { return null; }
    };

    const fetchTaller = async () => {
      // Intento 1: JWT — decodificar el token, puede contener id_taller en los claims
      const token = localStorage.getItem('plavet_token');
      if (token) {
        const claims = decodeJwt(token);
        if (claims && applyTallerFromData(claims)) return;
      }

      // Intento 2: buscar en el listado sin params problemáticos.
      // Buscamos por email (único) y filtramos client-side.
      // NO usamos /{cedula} (→500), ?id_usuario (→400), ni /{uuid} (→404).
      try {
        const listRes = await apiClient.get<{ data: TutorAcademicoItem[] }>('/api/v1/tutores-academicos', {
          search: user.email,
          pageSize: 10,
        });
        const rawItems = Array.isArray(listRes?.data) ? listRes.data : [];
        const match = rawItems.find((t: TutorAcademicoItem) =>
          String(t.perfil?.email_contacto ?? t.email ?? '').toLowerCase() === user.email?.toLowerCase() ||
          String(t.id) === String(user.username) ||
          String(t.perfil?.cedula) === String(user.username)
        );
        if (match && applyTallerFromData(match as unknown as Record<string, unknown>)) return;
      } catch { /* no bloquear al usuario */ }
    };

    fetchTaller();
  }, [user]);

  const setUser = (newUser: AuthUser | null) => {
    // Enriquecer con taller si el backend lo envía como id_taller fuera del tipo
    const enriched = newUser ? enrichUserWithTaller(newUser as unknown as Record<string, unknown>) : null;
    setUserState(enriched);
    if (enriched) {
      setUserRole(getRoleFromUser(enriched));
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
