import { useEffect, useState } from "react";

/**
 * 輕量 LIFF 偵測 hook（前端階段）。
 * 在 LINE 內開啟時 UA 含 "Line/"，可用來調整版面與提示。
 * 之後接上真實 LINE Login / liff.init 時，只需替換此檔案內部實作。
 */
export function useLiffEnvironment() {
  const [isInClient, setIsInClient] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent ?? "";
    setIsInClient(/Line\//i.test(ua));
    setReady(true);
  }, []);

  return { isInClient, ready };
}
