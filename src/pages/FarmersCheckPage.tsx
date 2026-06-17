import { useState, type ReactNode } from "react";
import { PageShell } from "../App";
import "./farmers.css";

// ── 品目マスタ ───────────────────────────────────────────────

type CropEntry = {
  keys: string[];
  label: string;
  typical: number;
  max: number;
  pricePerKg: number;
};

type AreaEntry = {
  id: string;
  label: string;
  tan: number;
};

const CROPS: CropEntry[] = [
  { keys: ["なす","ナス","茄子"],           label: "ナス",     typical: 13,  max: 30,   pricePerKg: 400  },
  { keys: ["ピーマン","ぴーまん"],           label: "ピーマン", typical: 14,  max: 30,   pricePerKg: 350  },
  { keys: ["キュウリ","きゅうり","胡瓜"],    label: "キュウリ", typical: 15,  max: 35,   pricePerKg: 280  },
  { keys: ["シシトウ","ししとう","獅子唐"],  label: "シシトウ", typical: 6,   max: 11,   pricePerKg: 900  },
  { keys: ["ミョウガ","みょうが","茗荷"],    label: "ミョウガ", typical: 3,   max: 5,    pricePerKg: 1800 },
  { keys: ["ニラ","にら","韮"],              label: "ニラ",     typical: 5,   max: 8,    pricePerKg: 600  },
  { keys: ["ショウガ","しょうが","生姜"],    label: "ショウガ", typical: 4,   max: 6,    pricePerKg: 350  },
  { keys: ["ユズ","ゆず","柚子"],            label: "ユズ",     typical: 1.5, max: 3,    pricePerKg: 250  },
  { keys: ["文旦","ぶんたん","ブンタン"],    label: "文旦",     typical: 2.5, max: 4,    pricePerKg: 230  },
  { keys: ["米","コメ","こめ","稲","水稲"],  label: "米",       typical: 0.5, max: 0.65, pricePerKg: 250  },
];

const AREAS: AreaEntry[] = [
  { id: "u10a",   label: "10a未満",  tan: 0.5  },
  { id: "a10_30", label: "10〜30a",  tan: 2    },
  { id: "a30_50", label: "30〜50a",  tan: 4    },
  { id: "a50_1h", label: "50a〜1ha", tan: 7.5  },
  { id: "o1h",    label: "1ha以上",  tan: 15   },
];

// ── ユーティリティ ───────────────────────────────────────────

function matchCrop(text: string): CropEntry | null {
  const t = text.trim();
  for (const c of CROPS) {
    for (const k of c.keys) {
      if (t.includes(k)) return c;
    }
  }
  return null;
}

function niceStep(target: number): number {
  if (target <= 0) return 1;
  const exp = Math.floor(Math.log10(target));
  const base = Math.pow(10, exp);
  const candidates = [1 * base, 2 * base, 5 * base, 10 * base];
  const above = candidates.filter((c) => c >= target * 0.85);
  return above.length ? above[0] : candidates[candidates.length - 1];
}

function fmtT(n: number): string {
  if (n >= 5) return Math.round(n) + "t";
  if (n >= 0.5) {
    const r = Math.round(n * 10) / 10;
    return (r === Math.floor(r) ? Math.floor(r) : r) + "t";
  }
  return Math.round(n * 1000) + "kg";
}

function buildShipmentOptions(crop: CropEntry, area: AreaEntry) {
  const upperT = crop.max * area.tan;
  const typicalT = crop.typical * area.tan;
  const step = niceStep(upperT / 4);
  const edges = [step, step * 2, step * 3, step * 4];
  const useKg = edges[0] < 0.5;
  const fmt = useKg ? (n: number) => Math.round(n * 1000) + "kg" : fmtT;
  return {
    opts: [
      { v: "lt1", label: "① " + fmt(edges[0]) + "未満" },
      { v: "r12", label: "② " + fmt(edges[0]) + "〜" + fmt(edges[1]) },
      { v: "r23", label: "③ " + fmt(edges[1]) + "〜" + fmt(edges[2]) },
      { v: "r34", label: "④ " + fmt(edges[2]) + "〜" + fmt(edges[3]) },
      { v: "gt4", label: "⑤ " + fmt(edges[3]) + "以上" },
      { v: "unk", label: "⑥ 把握していない" },
    ],
    note: crop.label + "の" + area.label + "（≒" + area.tan + "反）の場合、標準水準で約" + fmt(typicalT) + "、達成上限の目安で約" + fmt(upperT) + "。",
  };
}

function buildRevenueOptions(crop: CropEntry, area: AreaEntry) {
  const upperMan = (crop.max * 1000 * area.tan * crop.pricePerKg) / 10000;
  const step = niceStep(upperMan / 4);
  const edges = [step, step * 2, step * 3, step * 4];
  const fmtMan = (n: number) => {
    if (n >= 10000) {
      const oku = n / 10000;
      return (oku === Math.floor(oku) ? Math.floor(oku) : Math.round(oku * 10) / 10) + "億円";
    }
    return Math.round(n) + "万円";
  };
  return {
    opts: [
      { v: "lt1", label: "① " + fmtMan(edges[0]) + "未満" },
      { v: "r12", label: "② " + fmtMan(edges[0]) + "〜" + fmtMan(edges[1]) },
      { v: "r23", label: "③ " + fmtMan(edges[1]) + "〜" + fmtMan(edges[2]) },
      { v: "r34", label: "④ " + fmtMan(edges[2]) + "〜" + fmtMan(edges[3]) },
      { v: "gt4", label: "⑤ " + fmtMan(edges[3]) + "以上" },
      { v: "unk", label: "⑥ 把握していない" },
    ],
  };
}

const SHIPMENT_FALLBACK = {
  opts: [
    { v: "lt1", label: "① 5t未満" },
    { v: "r12", label: "② 5〜15t" },
    { v: "r23", label: "③ 15〜30t" },
    { v: "r34", label: "④ 30〜100t" },
    { v: "gt4", label: "⑤ 100t以上" },
    { v: "unk", label: "⑥ 把握していない" },
  ],
  note: "品目を判定できなかったため、汎用的な選択肢を表示しています。",
};

const REVENUE_FALLBACK = {
  opts: [
    { v: "lt1", label: "① 1,000万円未満" },
    { v: "r12", label: "② 1,000〜2,000万円" },
    { v: "r23", label: "③ 2,000〜3,000万円" },
    { v: "r34", label: "④ 3,000〜5,000万円" },
    { v: "gt4", label: "⑤ 5,000万円以上" },
    { v: "unk", label: "⑥ 把握していない" },
  ],
};

// ── 状態型 ──────────────────────────────────────────────────

type AppState = {
  screen: string;
  answers: Record<string, string>;
  cropMatch: CropEntry | null;
  areaMatch: AreaEntry | null;
  textInputs: Record<string, string>;
};

// ── コンポーネント ────────────────────────────────────────────

export default function FarmersCheckPage() {
  const [st, setSt] = useState<AppState>({
    screen: "intro",
    answers: {},
    cropMatch: null,
    areaMatch: null,
    textInputs: {},
  });

  function navigate(to: string, transform?: (prev: AppState) => Partial<AppState>) {
    setSt((prev) => ({ ...prev, screen: to, ...(transform ? transform(prev) : {}) }));
    window.scrollTo(0, 0);
  }

  function storeAndGo(key: string, value: string, to: string) {
    navigate(to, (prev) => ({ answers: { ...prev.answers, [key]: value } }));
  }

  function setTextInput(id: string, value: string) {
    setSt((prev) => ({ ...prev, textInputs: { ...prev.textInputs, [id]: value } }));
  }

  function reset() {
    setSt({ screen: "intro", answers: {}, cropMatch: null, areaMatch: null, textInputs: {} });
    window.scrollTo(0, 0);
  }

  // ── UIパーツ ─────────────────────────────────────────────

  function Bubble({ lines }: { lines: (string | ReactNode)[] }) {
    return (
      <div className="fc-bot-row">
        <div className="fc-bot-icon" aria-hidden="true">
          <span className="fc-bot-icon-inner">NOU</span>
        </div>
        <div className="fc-bubble">
          {lines.map((line, i) =>
            typeof line === "string" ? <p key={i}>{line}</p> : <div key={i}>{line}</div>
          )}
        </div>
      </div>
    );
  }

  function Choices({ items }: { items: { label: string; onSelect: () => void }[] }) {
    return (
      <div className="fc-choices">
        {items.map((item) => (
          <button key={item.label} className="fc-choice" type="button" onClick={item.onSelect}>
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  function BackBtn({ to }: { to: string }) {
    return (
      <div className="fc-back-wrap">
        <button className="fc-back-btn" type="button" onClick={() => navigate(to)}>
          ← 前に戻る
        </button>
      </div>
    );
  }

  function TagBadge({ label }: { label: string }) {
    return <span className="fc-tag-badge">{label}</span>;
  }

  // ── 画面レンダリング ──────────────────────────────────────

  function renderScreen() {
    const { screen, answers, cropMatch, areaMatch, textInputs } = st;

    switch (screen) {
      case "intro":
        return (
          <>
            <Bubble lines={[
              "農業経営の現在地を、一緒に整理しましょう。",
              "品目・面積・売上・後継者などについてお聞きします。所要時間は3〜5分です。整理した内容は、相談の出発点として活用できます。",
              <p key="note" className="fc-note">※ 現在は高知県の主要品目をもとにした試算項目です。</p>,
            ]} />
            <Choices items={[
              { label: "① 始める", onSelect: () => navigate("q1") },
              { label: "② また後で", onSelect: () => navigate("introExit") },
            ]} />
          </>
        );

      case "q1":
        return (
          <>
            <Bubble lines={["Q1. 現在の営農状況", "現在のご自身の状況について、もっとも近いものを選んでください。"]} />
            <Choices items={[
              { label: "① 農業の研修中", onSelect: () => storeAndGo("q1", "研修中", "q2") },
              { label: "② 独立し1人で営農中", onSelect: () => storeAndGo("q1", "個人営農", "q2") },
              { label: "③ 複数名で営農中（雇用や法人化している）", onSelect: () => storeAndGo("q1", "複数営農", "q2") },
              { label: "④ 引退を検討中", onSelect: () => storeAndGo("q1", "引退検討", "q2") },
            ]} />
            <BackBtn to="intro" />
          </>
        );

      case "q2":
        return (
          <>
            <Bubble lines={["Q2. 決算・数字の把握方法", "ご自身の経営数字（決算）は、以下のどちらで把握されていますか？"]} />
            <Choices items={[
              { label: "① 個人事業主としての確定申告の数字のみ", onSelect: () => storeAndGo("q2", "確定申告のみ", "q3") },
              { label: "② 確定申告とは別に、作期（園芸年度）ごとの数字を出して管理している", onSelect: () => storeAndGo("q2", "作期管理あり", "q3") },
            ]} />
            <BackBtn to="q1" />
          </>
        );

      case "q3":
        return (
          <>
            <Bubble lines={["Q3. 現在の所得への満足度", "現在、手元に残る所得（利益）に満足されていますか？"]} />
            <Choices items={[
              { label: "① 満足している", onSelect: () => storeAndGo("q3", "満足", "q4") },
              { label: "② やや不満", onSelect: () => storeAndGo("q3", "やや不満", "q4") },
              { label: "③ 不満", onSelect: () => storeAndGo("q3", "不満", "q4") },
              { label: "④ 現在は満足だが未来が不安", onSelect: () => storeAndGo("q3", "未来不安", "q4") },
            ]} />
            <BackBtn to="q2" />
          </>
        );

      case "q4":
        return (
          <>
            <Bubble lines={["Q4. 農業所得の確保状況", "ここ数年を平均して、農業所得は安定して確保できていると感じますか？"]} />
            <Choices items={[
              { label: "① はい", onSelect: () => storeAndGo("q4", "安定", "q5") },
              { label: "② いいえ", onSelect: () => storeAndGo("q4", "不安定", "q5") },
            ]} />
            <BackBtn to="q3" />
          </>
        );

      case "q5":
        return (
          <>
            <Bubble lines={["Q5. 具体的な目標額", "今の所得から、具体的にどのくらい増やしたいとお考えですか？"]} />
            <Choices items={[
              { label: "① 100万円未満", onSelect: () => storeAndGo("q5", "〜100万", "q6") },
              { label: "② 200万円程度", onSelect: () => storeAndGo("q5", "200万", "q6") },
              { label: "③ 300万円以上", onSelect: () => storeAndGo("q5", "300万以上", "q6") },
            ]} />
            <BackBtn to="q4" />
          </>
        );

      case "q6":
        return (
          <>
            <Bubble lines={["Q6. 目標達成に向けた戦略", "その目標額に近づけるために、特に必要と感じていることは何ですか？"]} />
            <Choices items={[
              { label: "① 具体的なプラン（技術導入や設備投資など）がある", onSelect: () => storeAndGo("q6", "プランあり", "q7") },
              { label: "② 売上拡大や経費削減など方向性は決まっているが、具体策はこれから", onSelect: () => storeAndGo("q6", "方向のみ", "q7") },
              { label: "③ まだ分からない・どうすればいいか悩んでいる", onSelect: () => storeAndGo("q6", "未定", "q7") },
            ]} />
            <BackBtn to="q5" />
          </>
        );

      case "q7":
        return (
          <>
            <Bubble lines={["Q7. トップ農家とのギャップ認識", "同じ地域・同じ品目のトップクラスの農家と自分の経営数字を比べたとき、どの程度の差があると感じますか？"]} />
            <Choices items={[
              { label: "① ほぼ差はないと思う", onSelect: () => storeAndGo("q7", "差なし", "q8") },
              { label: "② 多少の差はあると思う", onSelect: () => storeAndGo("q7", "多少差", "q8") },
              { label: "③ かなりの差があると思う", onSelect: () => storeAndGo("q7", "かなり差", "q8") },
              { label: "④ 比べられるほど把握できていない", onSelect: () => storeAndGo("q7", "把握不足", "q8") },
            ]} />
            <BackBtn to="q6" />
          </>
        );

      case "q8":
        return (
          <>
            <Bubble lines={["Q8. 相談意向の確認", "現状の課題への具体的な対策について、専門家や支援機関に相談することにご興味はありますか？"]} />
            <Choices items={[
              { label: "① はい", onSelect: () => storeAndGo("q8", "はい", "q9") },
              { label: "② いいえ", onSelect: () => storeAndGo("q8", "いいえ", "q8Exit") },
            ]} />
            <BackBtn to="q7" />
          </>
        );

      case "q9":
        return (
          <>
            <Bubble lines={[
              "それでは、整理をスムーズに進めるため、いくつか確認させてください。",
              "Q9. 主な栽培品目\n現在の主な栽培品目を教えてください。複数ある場合は、売上の割合が最も高いものを1つお答えください。",
            ]} />
            <div className="fc-free-input">
              <input
                className="fc-text-input"
                type="text"
                placeholder="例：なす"
                value={textInputs["q9"] ?? ""}
                onChange={(e) => setTextInput("q9", e.target.value)}
              />
            </div>
            <Choices items={[
              { label: "次へ", onSelect: () => {
                const v = textInputs["q9"] ?? "";
                navigate("q10", (prev) => ({
                  answers: { ...prev.answers, q9: v },
                  cropMatch: matchCrop(v),
                }));
              }},
            ]} />
            <BackBtn to="q8" />
          </>
        );

      case "q10":
        return (
          <>
            <Bubble lines={["Q10. 栽培地域", "お住まいの地域（市町村）を教えてください。"]} />
            <div className="fc-free-input">
              <input
                className="fc-text-input"
                type="text"
                placeholder="例：安芸市"
                value={textInputs["q10"] ?? ""}
                onChange={(e) => setTextInput("q10", e.target.value)}
              />
            </div>
            <Choices items={[
              { label: "次へ", onSelect: () => {
                const v = textInputs["q10"] ?? "";
                navigate("q11", (prev) => ({
                  answers: { ...prev.answers, q10: v },
                }));
              }},
            ]} />
            <BackBtn to="q9" />
          </>
        );

      case "q11":
        return (
          <>
            <Bubble lines={["Q11. 経営規模", "おおよその栽培面積はどのくらいですか？"]} />
            <Choices items={AREAS.map((a, i) => ({
              label: ["①","②","③","④","⑤"][i] + " " + a.label,
              onSelect: () => navigate("q12", (prev) => ({
                answers: { ...prev.answers, q11: a.label },
                areaMatch: a,
              })),
            }))} />
            <BackBtn to="q10" />
          </>
        );

      case "q12": {
        const crop = st.cropMatch;
        const area = st.areaMatch;
        const data = crop && area ? buildRevenueOptions(crop, area) : REVENUE_FALLBACK;
        const tagLabel = crop && area ? crop.label + " × " + area.label : "汎用レンジ";
        return (
          <>
            <Bubble lines={["Q12. 売上規模", "直近の年間売上はおおよそどのくらいですか？"]} />
            <TagBadge label={tagLabel} />
            <Choices items={data.opts.map((o) => ({
              label: o.label,
              onSelect: () => storeAndGo("q12", o.label, "q13"),
            }))} />
            <BackBtn to="q11" />
          </>
        );
      }

      case "q13": {
        const crop = st.cropMatch;
        const area = st.areaMatch;
        const data = crop && area ? buildShipmentOptions(crop, area) : SHIPMENT_FALLBACK;
        const tagLabel = crop && area ? crop.label + " × " + area.label : "汎用レンジ";
        return (
          <>
            <Bubble lines={["Q13. 出荷量", "直近の年間出荷量はおおよそどのくらいですか？"]} />
            <TagBadge label={tagLabel} />
            {data.note && <p className="fc-note" style={{ marginBottom: "12px" }}>{data.note}</p>}
            <Choices items={data.opts.map((o) => ({
              label: o.label,
              onSelect: () => storeAndGo("q13", o.label, "q14"),
            }))} />
            <BackBtn to="q12" />
          </>
        );
      }

      case "q14":
        return (
          <>
            <Bubble lines={["Q14. 労働力構成", "現在の経営における労働力の構成を教えてください。"]} />
            <Choices items={[
              { label: "① 本人のみ", onSelect: () => storeAndGo("q14", "本人のみ", "q15") },
              { label: "② 家族労働あり", onSelect: () => storeAndGo("q14", "家族労働", "q15") },
              { label: "③ 雇用労働力あり（パート・アルバイト含む）", onSelect: () => storeAndGo("q14", "雇用あり", "q15") },
            ]} />
            <BackBtn to="q13" />
          </>
        );

      case "q15":
        return (
          <>
            <Bubble lines={["Q15. 後継者の有無", "農業を引き継ぐ後継者はいますか？"]} />
            <Choices items={[
              { label: "① いる", onSelect: () => storeAndGo("q15", "いる", "q16") },
              { label: "② いない", onSelect: () => storeAndGo("q15", "いない", "q16") },
              { label: "③ 未定", onSelect: () => storeAndGo("q15", "未定", "q16") },
            ]} />
            <BackBtn to="q14" />
          </>
        );

      case "q16":
        return (
          <>
            <Bubble lines={["Q16. 相談したい支援機関", "サポートを受けるとしたら、どの機関に相談したいですか？"]} />
            <Choices items={[
              { label: "① 県の普及員", onSelect: () => storeAndGo("q16", "県普及員", "end") },
              { label: "② JAの営農指導員", onSelect: () => storeAndGo("q16", "JA", "end") },
              { label: "③ その他・民間コンサルタントなど", onSelect: () => storeAndGo("q16", "民間", "end") },
              { label: "④ 有意義な支援はすべて受けたい", onSelect: () => storeAndGo("q16", "すべて", "end") },
            ]} />
            <BackBtn to="q15" />
          </>
        );

      case "end": {
        const a = answers;
        const cropLabel = cropMatch ? cropMatch.label : (a.q9 || "—");
        const areaLabel = areaMatch ? areaMatch.label : (a.q11 || "—");
        return (
          <div className="fc-result-wrap">
            <Bubble lines={[
              "整理が完了しました。以下が、現在地の見え方です。",
              "この内容を持参して、支援機関に相談することができます。",
            ]} />
            <p className="fc-result-eyebrow">整理の結果</p>
            <dl className="fc-result-summary">
              <dt>主な品目</dt>
              <dd>{a.q9 || "—"}{cropMatch && a.q9 !== cropMatch.label ? "（確認品目：" + cropLabel + "）" : ""}</dd>
              <dt>地域</dt>
              <dd>{a.q10 || "—"}</dd>
              <dt>栽培面積</dt>
              <dd>{areaLabel}</dd>
              <dt>年間売上の規模</dt>
              <dd>{a.q12 || "—"}</dd>
              <dt>年間出荷量の規模</dt>
              <dd>{a.q13 || "—"}</dd>
              <dt>労働力</dt>
              <dd>{a.q14 || "—"}</dd>
              <dt>後継者</dt>
              <dd>{a.q15 || "—"}</dd>
              <dt>相談希望の支援機関</dt>
              <dd>{a.q16 || "—"}</dd>
            </dl>
            <p className="fc-result-cta-note">
              この整理をもとに、NOU-SIDEへ相談することができます。<br />
              状況に応じて、支援機関への橋渡しや課題の整理をお手伝いします。
            </p>
            <a className="fc-result-cta-btn" href="/contact?source=farmers-check">
              この内容をもとに相談する →
            </a>
            <div className="fc-restart-wrap">
              <button className="fc-restart-btn" type="button" onClick={reset}>
                最初からやり直す
              </button>
            </div>
          </div>
        );
      }

      case "q8Exit":
        return (
          <>
            <Bubble lines={[
              "承知いたしました。",
              "ご自身のペースで取り組まれる姿勢を応援しています。もし専門家や支援機関の力が必要と感じたとき、この整理結果は相談の出発点として使えます。",
            ]} />
            <p className="fc-exit-note">いつでも相談を受け付けています。</p>
            <a className="fc-exit-contact-link" href="/contact?source=farmers-check">お問い合わせ・ご相談はこちら</a>
            <div className="fc-restart-wrap" style={{ marginTop: "20px" }}>
              <button className="fc-restart-btn" type="button" onClick={() => navigate("q8")}>
                戻る
              </button>
              <button className="fc-restart-btn" type="button" onClick={reset}>
                最初からやり直す
              </button>
            </div>
          </>
        );

      case "introExit":
        return (
          <>
            <Bubble lines={["承知いたしました。またいつでもどうぞ。"]} />
            <div className="fc-restart-wrap">
              <button className="fc-restart-btn" type="button" onClick={reset}>
                最初からやり直す
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <PageShell>
      <section className="fc-check-section" aria-labelledby="check-title">
        <div className="fc-check-lead-bar">
          <p>
            <strong>営農状況の整理（相談前チェック）</strong><br />
            経営の現在地を確認し、相談に向けた材料を整えます。
          </p>
        </div>
        <div className="fc-chat-area">
          {renderScreen()}
        </div>
      </section>
    </PageShell>
  );
}
