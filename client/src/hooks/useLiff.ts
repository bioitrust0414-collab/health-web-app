/**
 * useLiff Hook
 * 管理 LIFF 初始化、登入、登出、取得 Profile
 */

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
          setError('缺少 LIFF_ID 環境變數');
          return;
        }

        await liff.init({ liffId });

        setIsReady(true);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const userProfile = await liff.getProfile();
          setProfile({
            userId: userProfile.userId,
            displayName: userProfile.displayName,
            pictureUrl: userProfile.pictureUrl,
            statusMessage: userProfile.statusMessage,
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'LIFF 初始化失敗';
        setError(message);
        console.error('LIFF init error:', err);
      }
    };

    init();
  }, []);

  const login = useCallback(() => {
    if (!isReady) return;
    liff.login();
  }, [isReady]);

  const logout = useCallback(() => {
    if (!isReady) return;
    liff.logout();
    setIsLoggedIn(false);
    setProfile(null);
    window.location.reload();
  }, [isReady]);

  return {
    isReady,
    isLoggedIn,
    profile,
    error,
    login,
    logout,
  };
}

export default useLiff;
