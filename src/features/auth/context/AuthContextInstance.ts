import { createContext } from 'react';
import type { UserRole } from '../types';

export interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
