import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useLiff } from '../hooks/useLiff';

export default function LiffEntry() {
  const [, setLocation] = useLocation();
  const liff = useLiff();
  const [status, setStatus] = useState('初始化中...');

  useEffect(() => {
    const process = async () => {
      if (!liff.isReady) return;
      const params = new URLSearchParams(window.location.search);
      const target = params.get('target') || 'dashboard';
      const plan = params.get('plan') || '';
      sessionStorage.setItem('liff_target', target);
      sessionStorage.setItem('liff_plan', plan);

      if (!liff.isLoggedIn) {
        setStatus('正在導向 LINE 登入...');
        liff.login();
        return;
      }

      setStatus('檢查身分驗證狀態...');
      if (liff.profile?.userId) {
        try {
          const res = await fetch(`/api/verify-patient/check?lineUserId=${liff.profile.userId}`);
          const data = await res.json();
          if (data.success && data.mapped) {
            setLocation(`/${target}${plan ? `?plan=${plan}` : ''}`);
          } else {
            setLocation('/liff/verify');
          }
        } catch {
          setStatus('檢查失敗，請重新整理');
        }
      }
    };
    process();
  }, [liff.isReady, liff.isLoggedIn, liff.profile, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-lg">{status}</p>
      <p className="text-sm text-muted-foreground mt-2">大華醫事檢驗所</p>
    </div>
  );
}
