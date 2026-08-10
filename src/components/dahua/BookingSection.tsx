import { useState, type FormEvent } from "react";
import { bookingOptions } from "@/data/dahua";
import { LINE_OA_ADD_FRIEND_URL, LINE_OA_ID, lineOaMessageUrl } from "@/data/externalLinks";
import { SectionHeader } from "./SectionHeader";

// 預約流程刻意不寫入資料庫，也不需要登入。
//
// 訪客填完表單後，我們把內容組成一則訊息帶進 LINE 官方帳號的輸入框，由
// 訪客自己按傳送；門市在 LINE 收到訊息後人工跟進。這樣做的理由：
//
//  1. 本站不再保存任何個人資料 —— 姓名與電話只存在於訪客自己的 LINE 對話
//     中，沒有伺服器端資料庫，也就沒有個資或病歷外洩的路徑。
//  2. 免登入，訪客不必先加好友、不必授權，門檻最低。
//  3. 對話留在 LINE，門市本來就在那裡回覆客戶，不必再開一套後台。
//
// 代價是預約紀錄不會自動彙整。若日後需要後台報表，再回頭接資料庫，屆時
// 務必一併處理匿名寫入的防灌水機制。

const contacts = [
  {
    icon: "💬",
    title: "LINE 官方帳號",
    info: LINE_OA_ID,
    href: LINE_OA_ADD_FRIEND_URL,
    cta: "加入好友 →",
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

function buildMessage(form: { name: string; phone: string; pkg: string; note: string }) {
  return [
    "【大華醫事檢驗所 預約諮詢】",
    `姓名：${form.name}`,
    `電話：${form.phone}`,
    `諮詢套組：${form.pkg}`,
    `備註：${form.note}`,
  ].join("\n");
}

export function BookingSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", pkg: "", note: "" });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.open(lineOaMessageUrl(buildMessage(form)), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  function reset() {
    setSent(false);
    setForm({ name: "", phone: "", pkg: "", note: "" });
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
          {contacts.map((c) => (
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
          ))}
        </div>
        <div className="booking-form-container">
          <h3 className="form-title">預約專業諮詢</h3>
          <p className="form-desc">
            填寫以下資料並送出，我們會透過 LINE 官方帳號與您聯繫確認。不需註冊或登入。
          </p>
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
              <button type="submit" className="form-submit">
                透過 LINE 送出預約
              </button>
            </form>
          ) : (
            <div className="form-success">
              <div className="success-icon">💬</div>
              <div className="success-title">已為您開啟 LINE 對話</div>
              <div className="success-desc">
                預約內容已填入 LINE 的輸入框，<strong>請在 LINE 中按下傳送</strong>，我們才會收到。
                若沒有自動跳轉，請點下方按鈕重新開啟。
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <a
                  href={lineOaMessageUrl(buildMessage(form))}
                  target="_blank"
                  rel="noreferrer"
                  className="form-submit"
                  style={{ width: "auto", padding: "12px 28px", display: "inline-block", textAlign: "center" }}
                >
                  重新開啟 LINE
                </a>
                <button type="button" onClick={reset} className="form-submit" style={{ width: "auto", padding: "12px 28px" }}>
                  再填一筆
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
