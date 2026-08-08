import { useState, useEffect, useCallback } from 'react';
import liff from '@line/liff';

interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UseLiffReturn {
  isReady: boolean;
  isLoggedIn: boolean;
  profile: LiffProfile | null;
  error: string | null;
  login: () => void;
  logout: () => void;
}

export function useLiff(): UseLiffReturn {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID;
        if (!liffId) {
          setError('缺少 LIFF_ID');
          return;
        }
        await liff.init({ liffId });
        setIsReady(true);
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const p = await liff.getProfile();
          setProfile({ userId: p.userId, displayName: p.displayName, pictureUrl: p.pictureUrl, statusMessage: p.statusMessage });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'LIFF 初始化失敗');
      }
    };
    init();
  }, []);

  const login = useCallback(() => { if (isReady) liff.login(); }, [isReady]);
  const logout = useCallback(() => { if (isReady) { liff.logout(); setIsLoggedIn(false); setProfile(null); window.location.reload(); } }, [isReady]);

  return { isReady, isLoggedIn, profile, error, login, logout };
}

export default useLiff;
