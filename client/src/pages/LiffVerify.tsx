import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLiff } from '../hooks/useLiff';

export default function LiffVerify() {
  const [, setLocation] = useLocation();
  const liff = useLiff();
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!liff.profile?.userId) {
      setError('LINE 登入狀態異常');
      setLoading(false);
      return;
    }

    const phoneClean = phone.replace(/-/g, '').trim();
    if (!/^\d{10}$/.test(phoneClean)) {
      setError('請輸入正確的手機號碼（10碼）');
      setLoading(false);
      return;
    }
    if (!birthDate) {
      setError('請選擇出生日期');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/verify-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneClean,
          birthDate,
          lineUserId: liff.profile.userId,
          referralSourceId: sessionStorage.getItem('liff_ref') || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          const target = sessionStorage.getItem('liff_target') || 'dashboard';
          const plan = sessionStorage.getItem('liff_plan');
          setLocation(`/${target}${plan ? `?plan=${plan}` : ''}`);
        }, 1500);
      } else {
        setError(data.error || '驗證失敗');
      }
    } catch {
      setError('系統錯誤');
    } finally {
      setLoading(false);
    }
  };

  if (!liff.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border rounded-lg shadow-sm">
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">身分驗證</h2>
          <p className="text-sm text-muted-foreground mt-1">請輸入您在診所留存的資料</p>
        </div>
        <div className="px-6 pb-6">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700 text-sm">
              驗證成功！正在導向...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">手機號碼</label>
                <input type="tel" placeholder="0912345678" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} maxLength={10}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">出生日期</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} disabled={loading}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {loading ? '驗證中...' : '確認驗證'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
