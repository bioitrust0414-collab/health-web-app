import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import liff from '@line/liff';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  line_user_id: string | null;
  auth_provider: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 取得用戶 profile
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    // 檢查既有 session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // 監聽登入狀態變化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  // LIFF 自動登入
  const signInWithLIFF = async () => {
    try {
      await liff.init({ liffId: import.meta.env['VITE_LIFF_ID'] });
      
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      // 使用 Supabase LINE OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'line' as never,
        options: { redirectTo: window.location.origin }
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('LIFF 登入失敗:', err);
      throw err;
    }
  };

  // Email + 密碼登入
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // 註冊
  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    return data;
  };

  // 登出
  const signOut = async () => {
    await supabase.auth.signOut();
    if (liff.isLoggedIn()) liff.logout();
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    loading,
    signInWithLIFF,
    signInWithEmail,
    signUp,
    signOut,
    isLoggedIn: !!user
  };
};
