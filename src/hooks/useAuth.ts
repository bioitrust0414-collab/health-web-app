import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import liff from '@line/liff';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查既有 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 監聽登入狀態變化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // LIFF 自動登入
  const signInWithLIFF = async () => {
    await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
    
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 透過 Supabase LINE OAuth 登入
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'line',
      options: { redirectTo: window.location.origin }
    });
    
    if (error) throw error;
    return data;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    if (liff.isLoggedIn()) liff.logout();
  };

  return { user, loading, signInWithLIFF, signInWithEmail, signOut };
};
