import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  isLiffConfigured,
  ensureLiffLogin,
  getLiffIdToken,
} from "@/lib/liffClient";
import { useAuth } from "@/contexts/AuthContext";
import { createServerFn } from "@tanstack/react-start";

const verifyLineLogin = createServerFn({ method: "POST" })
  .validator((idToken: unknown) => {
    if (typeof idToken !== "string" || idToken.length === 0) {
      throw new Error("idToken is required");
    }
    return idToken;
  })
  .handler(async ({ data: idToken }) => {
    const { upsertProfileForLineUser } = await import("@/lib/lineAuth.server");
    return upsertProfileForLineUser(idToken);
  });

const checkPatientMapping = createServerFn({ method: "GET" })
  .validator((profileId: unknown) => {
    if (typeof profileId !== "string" || profileId.length === 0) {
      throw new Error("profileId is required");
    }
    return profileId;
  })
  .handler(async ({ data: profileId }) => {
    const { restGetOne } = await import("@/lib/supabaseAdmin");
    const mapping = await restGetOne(
      "patient_mappings",
      `profile_id=eq.${profileId}`
    );
    return { hasMapping: !!mapping };
  });

export const Route = createFileRoute("/liff/entry")({
  component: LiffEntryPage,
});

function LiffEntryPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!isLiffConfigured()) {
          setError("LIFF 尚未設定，請聯繫管理員");
          return;
        }

        await ensureLiffLogin();
        const idToken = getLiffIdToken();

        if (!idToken) {
          setError("無法取得 LINE 登入資訊");
          return;
        }

        const { profileId } = await verifyLineLogin({ data: idToken });
        const { hasMapping } = await checkPatientMapping({ data: profileId });

        setUser({ profileId }, hasMapping);

        if (hasMapping) {
          navigate({ to: "/dashboard" });
        } else {
          navigate({ to: "/liff/verify" });
        }
      } catch (err) {
        console.error("LIFF entry error:", err);
        setError(err instanceof Error ? err.message : "LINE 登入失敗");
      }
    };

    init();
  }, [navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">登入失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
        <p className="text-gray-600">正在透過 LINE 登入...</p>
        <p className="text-sm text-gray-400 mt-2">大華健康管理中心</p>
      </div>
    </div>
  );
}
