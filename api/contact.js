// Vercel サーバーレス関数：お問い合わせを Resend 経由で nouside70@gmail.com にメール送信する。
// スパムフィルターなし・全件配信。APIキーは環境変数 RESEND_API_KEY（Vercelに設定）から読む。
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method not allowed" });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return res.status(500).json({ ok: false, error: "RESEND_API_KEY not set" });
  }

  const d = req.body || {};
  const subject = `【NOU-SIDE】お問い合わせ（${d["種別"] || ""}）`;
  const text =
    `種別: ${d["種別"] || ""}\n` +
    `流入元: ${d["流入元"] || ""}\n` +
    `お名前: ${d["お名前"] || ""}\n` +
    `メールアドレス: ${d["メールアドレス"] || ""}\n` +
    `電話番号: ${d["電話番号"] || ""}\n\n` +
    `お問い合わせ内容:\n${d["お問い合わせ内容"] || ""}`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NOU-SIDE <onboarding@resend.dev>",
        to: ["nouside70@gmail.com"],
        reply_to: d["メールアドレス"] || undefined,
        subject,
        text,
      }),
    });

    if (r.ok) {
      return res.status(200).json({ ok: true });
    }
    const errText = await r.text();
    return res.status(502).json({ ok: false, error: errText });
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) });
  }
}
