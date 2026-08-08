import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useLiff } from '../hooks/useLiff';

interface AuthUser {
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isMapped: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  checkMapping: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const liff = useLiff();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMapped, setIsMapped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (liff.isReady && liff.isLoggedIn && liff.profile) {
      setUser({ lineUserId: liff.profile.userId, displayName: liff.profile.displayName, pictureUrl: liff.profile.pictureUrl });
    } else if (liff.isReady && !liff.isLoggedIn) {
      setUser(null);
    }
    if (liff.error) setError(liff.error);
    setIsLoading(false);
  }, [liff.isReady, liff.isLoggedIn, liff.profile, liff.error]);

  const checkMapping = useCallback(async (): Promise<boolean> => {
    if (!user?.lineUserId) return false;
    try {
      const res = await fetch(`/api/verify-patient/check?lineUserId=${user.lineUserId}`);
      const data = await res.json();
      if (data.success && data.mapped) { setIsMapped(true); return true; }
      setIsMapped(false); return false;
    } catch { setIsMapped(false); return false; }
  }, [user?.lineUserId]);

  useEffect(() => { if (user?.lineUserId) checkMapping(); }, [user?.lineUserId, checkMapping]);

  const login = useCallback(() => liff.login(), [liff]);
  const logout = useCallback(() => { liff.logout(); setUser(null); setIsMapped(false); }, [liff]);

  return <AuthContext.Provider value={{ user, isLoggedIn: !!user, isMapped, isLoading, error, login, logout, checkMapping }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
