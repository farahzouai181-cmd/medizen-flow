import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/data/mockData';

interface AuthUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (_email: string, _password: string, role: UserRole): boolean => {
    const roleNames: Record<UserRole, { nom: string; prenom: string }> = {
      admin: { nom: 'Mejri', prenom: 'Sofiane' },
      medecin: { nom: 'Mansour', prenom: 'Karim' },
      urgentiste: { nom: 'Chaabane', prenom: 'Nizar' },
      receptionniste: { nom: 'Gharbi', prenom: 'Amira' },
    };

    setUser({
      id: `U-${role}`,
      email: _email || `${role}@hopital-teboulba.tn`,
      role,
      ...roleNames[role],
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
