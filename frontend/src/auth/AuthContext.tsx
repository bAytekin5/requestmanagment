import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthResponse, UserProfile } from '../types';
import { setAuthToken } from '../services/api';

interface AuthState {
  profile: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

const STORAGE_KEY = 'reqman-auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AuthResponse;
      setProfile(parsed.profile);
      setAccessToken(parsed.accessToken);
      setRefreshToken(parsed.refreshToken);
      setAuthToken(parsed.accessToken);
    }
  }, []);

  const login = (auth: AuthResponse) => {
    setProfile(auth.profile);
    setAccessToken(auth.accessToken);
    setRefreshToken(auth.refreshToken);
    setAuthToken(auth.accessToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  };

  const logout = () => {
    setProfile(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthState = {
    profile,
    accessToken,
    refreshToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

