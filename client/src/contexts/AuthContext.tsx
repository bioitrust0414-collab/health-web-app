/**
 * AuthContext
 * 全站認證狀態管理：LINE 登入 + 勾稽狀態
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useLiff } from '../hooks/useLiff.js';

interface AuthUser {
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isMapped: boolean;      // 是否已完成身分勾稽
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
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

  // 當 LIFF 就緒且已登入時，設定 user
  useEffect(() => {
    if (liff.isReady && liff.isLoggedIn && liff.profile) {
      setUser({
        lineUserId: liff.profile.userId,
        displayName: liff.profile.displayName,
        pictureUrl: liff.profile.pictureUrl,
      });
    } else if (liff.isReady && !liff.isLoggedIn) {
      setUser(null);
    }

    if (liff.error) {
      setError(liff.error);
    }

    setIsLoading(false);
  }, [liff.isReady, liff.isLoggedIn, liff.profile, liff.error]);

  // 檢查是否已勾稽
  const checkMapping = useCallback(async (): Promise<boolean> => {
    if (!user?.lineUserId) return false;

    try {
      const res = await fetch(
        `/api/verify-patient/check?lineUserId=${user.lineUserId}`
      );
      const data = await res.json();

      if (data.success && data.mapped) {
        setIsMapped(true);
        return true;
      } else {
        setIsMapped(false);
        return false;
      }
    } catch (err) {
      console.error('Check mapping error:', err);
      setIsMapped(false);
      return false;
    }
  }, [user?.lineUserId]);

  // 登入後自動檢查勾稽
  useEffect(() => {
    if (user?.lineUserId) {
      checkMapping();
    }
  }, [user?.lineUserId, checkMapping]);

  const login = useCallback(() => {
    liff.login();
  }, [liff]);

  const logout = useCallback(() => {
    liff.logout();
    setUser(null);
    setIsMapped(false);
  }, [liff]);

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isMapped,
    isLoading,
    error,
    login,
    logout,
    checkMapping,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
