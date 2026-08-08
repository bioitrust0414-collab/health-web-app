/**
 * LiffEntry 頁面
 * LINE OA 連結的統一入口
 * 判斷：登入狀態 → 勾稽狀態 → 導向對應頁面
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useLiff } from '../hooks/useLiff.js';
import { Loader2 } from 'lucide-react';

export default function LiffEntry() {
  const [, setLocation] = useLocation();
  const liff = useLiff();
  const [status, setStatus] = useState('初始化中...');

  useEffect(() => {
    const processEntry = async () => {
      // 等待 LIFF 初始化
      if (!liff.isReady) return;

      // 解析 URL 參數
      const params = new URLSearchParams(window.location.search);
      const target = params.get('target') || 'dashboard';
      const plan = params.get('plan') || '';
      const source = params.get('source') || '';
      const ref = params.get('ref') || '';

      // 儲存目標（驗證完成後導向用）
      sessionStorage.setItem('liff_target', target);
      sessionStorage.setItem('liff_plan', plan);
      sessionStorage.setItem('liff_source', source);
      sessionStorage.setItem('liff_ref', ref);

      // 檢查是否已登入
      if (!liff.isLoggedIn) {
        setStatus('正在導向 LINE 登入...');
        liff.login();
        return;
      }

      setStatus('檢查身分驗證狀態...');

      // 已登入 → 檢查是否已勾稽
      if (liff.profile?.userId) {
        try {
          const res = await fetch(
            `/api/verify-patient/check?lineUserId=${liff.profile.userId}`
          );
          const data = await res.json();

          if (data.success && data.mapped) {
            // 已勾稽 → 導向目標頁面
            const query = plan ? `?plan=${plan}` : '';
            setLocation(`/${target}${query}`);
          } else {
            // 未勾稽 → 去驗證頁面
            setLocation('/liff/verify');
          }
        } catch (err) {
          console.error('Check mapping error:', err);
          setStatus('檢查失敗，請重新整理頁面');
        }
      }
    };

    processEntry();
  }, [liff.isReady, liff.isLoggedIn, liff.profile, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-lg text-foreground">{status}</p>
      <p className="text-sm text-muted-foreground mt-2">
        大華醫事檢驗所
      </p>
    </div>
  );
}
