import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/liff/verify")({
  component: LiffVerifyPage,
});

function LiffVerifyPage() {
  const navigate = useNavigate();
  const { user, setVerified, logout } = useAuth();
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/patient-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          dob: birthday,
          profileId: user?.profileId,
        }),
      });

      if (!res.ok) {
        setError("手機或生日驗證失敗，請確認資料是否與診所登記一致");
        setLoading(false);
        return;
      }

      const result = await res.json();
      if (result.success) {
        setVerified(true);
        setSuccess(true);
        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 1500);
      } else {
        setError(result.message || "驗證失敗");
      }
    } catch {
      setError("驗證過程發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="text-emerald-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">驗證成功</h2>
            <p className="text-gray-600">正在導向您的個人儀表板...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>身分驗證</CardTitle>
          <p className="text-sm text-gray-500">
            請輸入您在診所登記的手機與生日以綁定病歷
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手機號碼</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">生日</Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "驗證中..." : "確認綁定"}
            </Button>
          </form>

          <Button
            variant="ghost"
            className="w-full mt-2 text-gray-500"
            onClick={logout}
          >
            使用其他帳號
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
