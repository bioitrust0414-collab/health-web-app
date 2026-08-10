import { createFileRoute } from "@tanstack/react-router";
import stylesCss from "@/styles.css?url";
import dahuaCss from "@/styles/dahua.css?url";
import { Navbar } from "@/components/dahua/Navbar";
import { Footer } from "@/components/dahua/Footer";
import { SocialFab } from "@/components/dahua/SocialFab";

const LINE_OA_URL = "https://lin.ee/NCshL6k";
const LINE_PWA_URL = "https://liff.line.me/2010848952-VfGV0qlc";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [{ title: "健康服務中心 - 大華醫事檢驗所" }],
    links: [
      { rel: "stylesheet", href: stylesCss },
      { rel: "stylesheet", href: dahuaCss },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  const actions = [
    { title: "會員登錄", desc: "使用 LINE 帳號快速登入，查看檢驗報告與預約紀錄", href: LINE_OA_URL, external: true },
    { title: "健康 App", desc: "開啟 LINE 會員應用，追蹤
