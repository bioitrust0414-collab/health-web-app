/**
 * LiffVerify 頁面
 * 手機 + 生日驗證表單
 * 驗證成功後建立 LINE userId ↔ LIS patientId 勾稽
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLiff } from '../hooks/useLiff.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Alert, AlertDescription } from '@/components/ui/alert.js';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

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
      setError('LINE 登入狀態異常，請重新登入');
      setLoading(false);
      return;
    }

    // 基本格式驗證
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
          const query = plan ? `?plan=${plan}` : '';
          setLocation(`/${target}${query}`);
        }, 1500);
      } else {
        setError(data.error || '驗證失敗，請確認資料是否正確');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError('系統錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  if (!liff.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-2" />
          <CardTitle className="text-xl">身分驗證</CardTitle>
          <CardDescription>
            請輸入您在診所留存的資料，以查詢檢驗報告
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                驗證成功！正在導向您的個人頁面...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">手機號碼</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">出生日期</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    驗證中...
                  </>
                ) : (
                  '確認驗證'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                連續驗證失敗 5 次將鎖定 30 分鐘，請確認資料正確
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
