import { useState } from "react";
import { PageShell } from "../App";

type Variant = "relocation" | "business" | "expert" | "other" | null;

type VariantConfig = {
  badge: string;
  heroTitle: string;
  heroAccent: string;
  heroDesc: React.ReactNode;
  examples: string[];
  placeholder: string;
};

const VARIANT_CONFIG: Record<Exclude<Variant, null>, VariantConfig> = {
  relocation: {
    badge: "移住・就農をご検討の方",
    heroTitle: "暮らしと営農について、",
    heroAccent: "お気軽にご相談ください。",
    heroDesc: (
      <>
        就農・移住をご検討中の方からのご相談を受け付けています。<br />
        段階や条件は問いません。情報収集の段階でも歓迎です。<br />
        <span className="text-emerald-200 font-bold">通常2〜3営業日以内にご返信します。</span>
      </>
    ),
    examples: [
      "就農条件・支援制度を知りたい",
      "先輩就農者の話を聞きたい",
      "現地視察を希望",
      "住まい・暮らしの相談",
    ],
    placeholder: "ご質問やご要望、現在の状況など、ご自由にご記入ください",
  },
  business: {
    badge: "企業・事業者の方",
    heroTitle: "連携・取引について、",
    heroAccent: "お気軽にご相談ください。",
    heroDesc: (
      <>
        企業・事業者の皆さまからのご提案・ご相談を受け付けています。<br />
        業種・規模を問わず、まずはお話をお聞かせください。<br />
        <span className="text-emerald-200 font-bold">通常2〜3営業日以内にご返信します。</span>
      </>
    ),
    examples: [
      "連携・協業のご提案",
      "取引・仕入れのご相談",
      "資料・データのご請求",
      "個別打合せの希望",
    ],
    placeholder: "ご提案・ご相談の内容、貴社の状況など、ご自由にご記入ください",
  },
  expert: {
    badge: "専門家・実務者の方",
    heroTitle: "知見やスキルでの参画について、",
    heroAccent: "お気軽にご相談ください。",
    heroDesc: (
      <>
        専門家・実務者の皆さまからの参画・連携のご相談を受け付けています。<br />
        分野・関わり方は問いません。まずはお話をお聞かせください。<br />
        <span className="text-emerald-200 font-bold">通常2〜3営業日以内にご返信します。</span>
      </>
    ),
    examples: [
      "プロボノ・専門知見での参画",
      "現場視察・ヒアリング希望",
      "研究・取材目的のご相談",
      "個別相談・打合せの希望",
    ],
    placeholder: "ご関心の分野やご経験、関わり方のご希望など、ご自由にご記入ください",
  },
  other: {
    badge: "お問い合わせ・ご相談",
    heroTitle: "まずは、",
    heroAccent: "お気軽にご連絡ください。",
    heroDesc: (
      <>
        どのようなご質問・ご要望でも、お気軽にお寄せください。<br />
        <span className="text-emerald-200 font-bold">通常2〜3営業日以内にご返信します。</span>
      </>
    ),
    examples: [
      "構想全体の説明を聞きたい",
      "資料・データ等の追加情報が欲しい",
      "個別具体的な相談・打合せを設定したい",
    ],
    placeholder: "ご質問やご要望、貴自治体・組織の状況など、ご自由にご記入ください",
  },
};

const SELECT_OPTIONS: { variant: Exclude<Variant, null>; title: string; sub: string }[] = [
  { variant: "relocation", title: "移住・就農をご検討の方", sub: "暮らしと営農の相談" },
  { variant: "business", title: "企業・事業者の方", sub: "連携・取引のご提案" },
  { variant: "expert", title: "専門家・実務者の方", sub: "知見やスキルでの参画" },
  { variant: "other", title: "その他のお問合せ", sub: "上記に当てはまらないご相談" },
];

function getInitialVariant(): Variant {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const v = params.get("variant");
  if (v === "relocation" || v === "business" || v === "expert" || v === "other") return v;
  // 農家16問アプリなどからの遷移は「その他のお問合せ」フォームへ直接入る
  if (params.get("source") === "farmers-check") return "other";
  return null;
}

// Google Apps Script のWebアプリURL（…/exec）。
// スパムフィルター無しで全件 nouside70@gmail.com にメール送信＋スプレッドシート記録。
// 設定するとこちらが優先される。未設定の間は下記 Web3Forms にフォールバック。
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKcxKhOtWYeFEI65X2iVls0EFuzmWRQxaaEzdKLIVyM68jam0RJn3TGFH9rgQ-VG8y8w/exec";

// Web3Forms のアクセスキー（公開前提のキー。クライアントに埋め込んで使用）。
// 未設定の間はメール送信せず、完了画面のみ表示する。
const WEB3FORMS_ACCESS_KEY = "3151886d-6884-4459-81df-6f4abc52bd2b";

export default function ContactPage() {
  const [variant, setVariant] = useState<Variant>(getInitialVariant);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim();

  const handleSelect = (v: Exclude<Variant, null>) => {
    setVariant(v);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleBackToSelect = () => {
    setVariant(null);
    setForm({ name: "", email: "", phone: "", message: "" });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSubmit = async () => {
    if (!canSubmit || sending) return;
    setError(false);
    const source = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("source") || "直接"
      : "直接";
    const badge = variant ? VARIANT_CONFIG[variant].badge : "未選択";

    // Google Apps Script（優先）。スパムフィルター無しで全件届く。
    // GASはCORSヘッダを返せないため no-cors（fire-and-forget）で送信する。
    if (APPS_SCRIPT_URL) {
      setSending(true);
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            種別: badge,
            流入元: source,
            お名前: form.name,
            メールアドレス: form.email,
            電話番号: form.phone || "（未記入）",
            お問い合わせ内容: form.message,
          }),
        });
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setError(true);
      } finally {
        setSending(false);
      }
      return;
    }

    // キー未設定時は従来どおり完了画面のみ（メール送信なし）
    if (!WEB3FORMS_ACCESS_KEY) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          // ハニーポット：人間の送信では空。スパム誤判定を減らす（Web3Forms推奨）。
          botcheck: false,
          subject: `【NOU-SIDE】お問い合わせ（${badge}）`,
          from_name: "NOU-SIDE サイト",
          replyto: form.email,
          種別: badge,
          流入元: source,
          お名前: form.name,
          メールアドレス: form.email,
          電話番号: form.phone || "（未記入）",
          お問い合わせ内容: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const handleResetAll = () => {
    setSubmitted(false);
    setError(false);
    setVariant(null);
    setForm({ name: "", email: "", phone: "", message: "" });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // ── 送信完了画面 ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <PageShell>
        <div
          style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}
          className="min-h-screen bg-white text-stone-800 flex items-center justify-center px-5 py-12"
        >
          <div className="max-w-xl w-full">
            <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-3xl p-8 sm:p-10 text-center shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur rounded-full mb-5">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="font-black text-2xl sm:text-3xl mb-3">
                  お問い合わせを<br className="sm:hidden" />受け付けました
                </p>
                <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                  ご連絡ありがとうございます。<br />
                  内容を確認の上、<strong className="text-white">通常2〜3営業日以内</strong>にご返信いたします。
                </p>
                <p className="text-emerald-200 text-xs leading-relaxed">
                  返信が届かない場合は、迷惑メールフォルダもご確認ください。
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleResetAll}
                className="text-stone-500 text-sm hover:text-emerald-700 transition-colors bg-transparent border-0 cursor-pointer"
              >
                ← トップページに戻る
              </button>
            </div>
          </div>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Noto+Serif+JP:wght@500;600&display=swap');
            * { box-sizing: border-box; }
          `}</style>
        </div>
      </PageShell>
    );
  }

  // ── 四択選択画面 ──────────────────────────────────────────────────────────
  if (variant === null) {
    return (
      <PageShell>
        <div
          style={{
            fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
            backgroundColor: "#fafaf6",
            color: "#1f2a24",
            minHeight: "100vh",
          }}
          className="flex items-center justify-center px-6 py-12"
        >
          <div className="w-full max-w-3xl">
            <header className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 border text-xs font-bold px-4 py-2 rounded-full mb-5 tracking-widest"
                style={{ backgroundColor: "#f5f7f3", borderColor: "#5a7a5e", color: "#2d4a3e" }}
              >
                お問い合わせ・ご相談
              </div>
              <h1
                style={{ fontFamily: "'Noto Serif JP', serif", color: "#2d4a3e", letterSpacing: "0.04em" }}
                className="text-2xl sm:text-3xl font-semibold mb-3"
              >
                お問合せ内容をお選びください
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "#4a5550" }}>
                ご相談の内容に近いものをお選びください。
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SELECT_OPTIONS.map((opt) => (
                <button
                  key={opt.variant}
                  type="button"
                  onClick={() => handleSelect(opt.variant)}
                  className="contact-select-btn group flex items-center justify-between gap-4 px-6 py-5 transition-all relative bg-white text-left cursor-pointer w-full"
                  style={{ border: "1px solid #d8dfd5", color: "inherit" }}
                >
                  <span className="flex flex-col gap-1">
                    <span
                      style={{ fontFamily: "'Noto Serif JP', serif", color: "#2d4a3e", letterSpacing: "0.02em" }}
                      className="text-[15px] font-semibold"
                    >
                      {opt.title}
                    </span>
                    <span className="text-xs leading-snug" style={{ color: "#7a8580" }}>
                      {opt.sub}
                    </span>
                  </span>
                  <span
                    className="text-sm flex-shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: "#2d4a3e" }}
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-xs leading-relaxed" style={{ color: "#7a8580" }}>
                通常2〜3営業日以内にご返信いたします
              </p>
            </div>
          </div>

          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;600&family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
            * { box-sizing: border-box; }
            .contact-select-btn::before {
              content: "";
              position: absolute;
              top: 0; left: 0;
              width: 3px; height: 100%;
              background: #2d4a3e;
              transform: scaleY(0);
              transform-origin: top;
              transition: transform 0.25s ease;
            }
            .contact-select-btn:hover { background: #f5f7f3 !important; border-color: #5a7a5e !important; }
            .contact-select-btn:hover::before { transform: scaleY(1); }
          `}</style>
        </div>
      </PageShell>
    );
  }

  // ── フォーム画面 ──────────────────────────────────────────────────────────
  const config = VARIANT_CONFIG[variant];

  return (
    <PageShell>
      <div
        style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}
        className="min-h-screen bg-white text-stone-800"
      >
        {/* ヒーロー */}
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-emerald-300 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-400 blur-3xl"></div>
          </div>
          <div className="relative max-w-2xl mx-auto px-5 pt-12 pb-12 sm:pt-16 sm:pb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-5 tracking-widest">
              {config.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-[1.3] tracking-tight">
              {config.heroTitle}
              <br className="sm:hidden" />
              <span className="text-emerald-200">{config.heroAccent}</span>
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed mb-5">
              {config.heroDesc}
            </p>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3.5">
              <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed">
                {config.examples.map((ex, i) => (
                  <span key={i}>
                    <span className="text-white font-bold">「{ex}」</span>
                    {i < config.examples.length - 1 && " "}
                  </span>
                ))}
                <span>など、ご関心のある内容をご自由にご記入ください。</span>
              </p>
            </div>
          </div>
        </section>

        {/* フォーム */}
        <section className="bg-stone-50 py-10 sm:py-14">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-7">
              <div>
                <label className="block font-black text-stone-900 text-sm mb-2">
                  お名前<span className="text-red-500 text-xs ml-2 font-bold">必須</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="山田 太郎"
                  className="w-full bg-stone-50 border-2 border-stone-200 focus:border-emerald-700 text-stone-900 text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder-stone-400"
                />
              </div>
              <div>
                <label className="block font-black text-stone-900 text-sm mb-2">
                  メールアドレス<span className="text-red-500 text-xs ml-2 font-bold">必須</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@example.com"
                  className="w-full bg-stone-50 border-2 border-stone-200 focus:border-emerald-700 text-stone-900 text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder-stone-400"
                />
              </div>
              <div>
                <label className="block font-black text-stone-900 text-sm mb-2">
                  電話番号<span className="text-stone-400 text-xs ml-2 font-bold">任意</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="090-1234-5678"
                  className="w-full bg-stone-50 border-2 border-stone-200 focus:border-emerald-700 text-stone-900 text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder-stone-400"
                />
                <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                  急ぎの場合や、電話でのご連絡をご希望の場合のみ
                </p>
              </div>
              <div>
                <label className="block font-black text-stone-900 text-sm mb-2">
                  お問い合わせ詳細・ご質問<span className="text-red-500 text-xs ml-2 font-bold">必須</span>
                </label>
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl px-4 py-3 mb-3">
                  <p className="text-stone-700 text-xs leading-relaxed mb-2">
                    例：
                    {config.examples.map((ex, i) => (
                      <span key={i}>
                        <span className="text-emerald-800 font-bold">「{ex}」</span>
                        {i < config.examples.length - 1 && " "}
                      </span>
                    ))}
                    <span>など、ご関心のある内容をご記入ください。</span>
                  </p>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    その他、ご質問やご相談があればご自由にご記入ください。
                  </p>
                </div>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={config.placeholder}
                  rows={6}
                  className="w-full bg-stone-50 border-2 border-stone-200 focus:border-emerald-700 text-stone-900 text-sm px-4 py-3 rounded-xl outline-none transition-colors placeholder-stone-400 resize-none leading-relaxed"
                />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
                <p className="text-stone-500 text-xs leading-relaxed">
                  ご記入いただいた個人情報は、お問い合わせへの回答および本構想に関するご連絡以外には使用いたしません。
                  第三者への提供も行いません。
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit || sending}
                  className={`w-full font-black px-8 py-4 rounded-full transition-all text-sm tracking-wider shadow-md
                    ${canSubmit && !sending
                      ? "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                    }`}
                >
                  {sending ? "送信中…" : canSubmit ? "送信する →" : "必須項目をご記入ください"}
                </button>
                {error && (
                  <p className="text-red-600 text-xs text-center mt-3 leading-relaxed">
                    送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。
                  </p>
                )}
                <p className="text-stone-400 text-xs text-center mt-3 leading-relaxed">
                  送信後、通常2〜3営業日以内にご返信いたします
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleBackToSelect}
                className="text-stone-500 text-sm hover:text-emerald-700 transition-colors bg-transparent border-0 cursor-pointer"
              >
                ← お問合せ種別の選択に戻る
              </button>
            </div>

            <div className="mt-6 bg-white border border-stone-200 rounded-2xl p-5 text-center">
              <p className="text-stone-600 text-xs leading-relaxed">
                ご質問の前に、まずは
                <a href="#" className="text-emerald-700 font-bold underline hover:text-emerald-800">
                  構想資料（PDF）
                </a>
                もご覧いただけます。
              </p>
            </div>
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Noto+Serif+JP:wght@500;600&display=swap');
          * { box-sizing: border-box; }
        `}</style>
      </div>
    </PageShell>
  );
}
