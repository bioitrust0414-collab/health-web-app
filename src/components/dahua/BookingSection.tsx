import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { bookingOptions } from "@/data/dahua";
import { getStoredProfileId } from "@/lib/memberSession";
import { useSessionToken } from "@/lib/useSessionToken";
import { createBooking } from "@/lib/memberActions.server";
import { SectionHeader } from "./SectionHeader";

const contacts = [
  {
    icon: "💬",
    title: "LINE 官方帳號",
    info: "@932cczax",
    href: "https://line.me/ti/p/@932cczax",
    cta: "立即加入 →",
    external: true,
  },
  {
    icon: "📞",
    title: "諮詢專線",
    info: "04-7616801",
    href: "tel:047616801",
    cta: "立即撥打 →",
    external: false,
  },
  {
    icon: "📍",
    title: "診所地址",
    info: "彰化市崙平南路 532 號",
    href: "https://maps.google.com/?q=彰化市崙平南路532號",
    cta: "Google 地圖 →",
    external: true,
  },
];

export function BookingSection() {
  const { getSessionToken } = useSessionToken();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", pkg: "", note: "" });
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    setIsMember(Boolean(getStoredProfileId()));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 登入（LIFF 或 demo）後才能真正寫入預約紀錄，未登入時 getSessionToken()
      // 在 LIFF 環境下會直接跳轉到 LINE 登入頁。
      const sessionToken = await getSessionToken();
      await createBooking({
        data: {
          sessionToken,
          bookingType: "consultation",
          packageName: form.pkg,
          contactName: form.name,
          contactPhone: form.phone,
          notes: form.note,
        },
      });
      setIsMember(true);

      // 同時用 LINE 訊息通知門市，方便人工立即跟進。
      const msg = `【大華醫事檢驗所預約諮詢】\n姓名：${form.name}\n電話：${form.phone}\n諮詢套組：${form.pkg}\n備註：${form.note}`;
      window.open(`https://line.me/R/oaMessage/@932cczax/?text=${encodeURIComponent(msg)}`, "_blank");

      setSent(true);
      window.setTimeout(() => {
        setSent(false);
        setForm({ name: "", phone: "", pkg: "", note: "" });
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "預約送出失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="booking" className="booking-section">
      <div className="container">
        <SectionHeader
          badge="Contact & Booking"
          title="聯絡與預約諮詢"
          desc="歡迎透過以下方式與我們聯絡，或直接填寫預約表單。"
        />
        <div className="contact-grid">
          {contacts.map((c) => {
            // 已經登入過的會員點 LINE 官方帳號卡片，直接進會員專區看報告，
            // 不用再走一次加好友的 QR code 流程。
            if (c.title === "LINE 官方帳號" && isMember) {
              return (
                <div key={c.title} className="contact-card">
                  <div className="contact-icon">{c.icon}</div>
                  <div className="contact-title">{c.title}</div>
                  <div className="contact-info">{c.info}</div>
                  <Link to="/member" search={{ profileId: undefined, token: undefined }} className="contact-link">
                    前往會員專區 →
                  </Link>
                </div>
              );
            }

            return (
              <div key={c.title} className="contact-card">
                <div className="contact-icon">{c.icon}</div>
                <div className="contact-title">{c.title}</div>
                <div className="contact-info">{c.info}</div>
                <a
                  href={c.href}
                  className="contact-link"
                  {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {c.cta}
                </a>
              </div>
            );
          })}
        </div>
        <div className="booking-form-container">
          <h3 className="form-title">預約專業諮詢</h3>
          {isMember ? (
            <>
              <p className="form-desc">
                填寫以下資料並送出，預約會直接記錄在您的會員專區，我們也會於工作日 24 小時內與您聯繫確認。
              </p>
              {error && (
                <p style={{ color: "#f87171", textAlign: "center", marginBottom: "16px", fontSize: "14px" }}>
                  {error}
                </p>
              )}
              {!sent ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="您的姓名 / 單位名稱"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="聯絡電話"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                  <select
                    className="form-select"
                    value={form.pkg}
                    onChange={(e) => setForm({ ...form, pkg: e.target.value })}
                    required
                  >
                    <option value="">請選擇諮詢套組</option>
                    {bookingOptions.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.values.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <textarea
                    className="form-textarea"
                    placeholder="請描述您的具體需求或想了解的套組..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    required
                  />
                  <button type="submit" className="form-submit" disabled={loading}>
                    {loading ? "送出中..." : "送出預約"}
                  </button>
                </form>
              ) : (
                <div className="form-success">
                  <div className="success-icon">✓</div>
                  <div className="success-title">預約資料已成功送出</div>
                  <div className="success-desc">已記錄在您的會員專區，我們將盡快與您聯繫，感謝您的信任。</div>
                </div>
              )}
            </>
          ) : (
            <div className="booking-login-prompt" style={{ textAlign: "center", padding: "40px 20px" }}>
              <p className="form-desc" style={{ marginBottom: "24px" }}>
                預約諮詢功能僅限會員使用。請先登入會員以繼續預約。
              </p>
              <Link
                to="/member"
                search={{ profileId: undefined, token: undefined }}
                className="form-submit"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  maxWidth: "200px",
                  margin: "0 auto"
                }}
              >
                前往會員登入
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
