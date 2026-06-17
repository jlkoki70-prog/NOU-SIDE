import { useState, useEffect } from "react";
import { PageShell } from "../App";

// ======= 型定義 =======
type Screen =
  | "intro" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6"
  | "choice" | "q7" | "q8" | "q9" | "q10" | "q11"
  | "complete-basic" | "complete-detailed";

interface ContactState {
  name: string; city: string; phone: string; email: string; method: string | null;
}

interface FormState {
  q1: string | null;
  q2: string[];
  q2_other: string;
  q3: string[];
  q3_other: string;
  q4: string | null;
  q5: string | null;
  contact: ContactState;
  q7: string | null;
  q8: string | null;
  q8_sub: string | null;
  q8_detail: string;
  q9: string | null;
  q10: string[];
  q11: string;
}

const initialState: FormState = {
  q1: null, q2: [], q2_other: "", q3: [], q3_other: "",
  q4: null, q5: null,
  contact: { name: "", city: "", phone: "", email: "", method: null },
  q7: null, q8: null, q8_sub: null, q8_detail: "", q9: null, q10: [], q11: "",
};

const cs = {
  greenDeep: "#1b6b3a", greenMain: "#2aa84a", greenSoft: "#e8f6ec",
  greenSofter: "#f4faf5", ink: "#1a2e22", inkSub: "#52665a", inkMute: "#7a8c82",
  line: "#d9e7dd", lineSoft: "#ecf2ee", white: "#ffffff", warmBg: "#fbfaf3",
  stone50: "#fafaf9", error: "#c54a4a", gold: "#c89a00", goldSoft: "#fff4c2",
};

const KOCHI_CITIES = [
  ["kochi","高知市"],["muroto","室戸市"],["aki","安芸市"],["nankoku","南国市"],
  ["tosa","土佐市"],["susaki","須崎市"],["sukumo","宿毛市"],["tosashimizu","土佐清水市"],
  ["shimanto_city","四万十市"],["kounan","香南市"],["kami","香美市"],["toyo","東洋町"],
  ["nahari","奈半利町"],["tano","田野町"],["yasuda","安田町"],["kitagawa","北川村"],
  ["umaji","馬路村"],["geisei","芸西村"],["motoyama","本山町"],["otoyo","大豊町"],
  ["tosa_town","土佐町"],["okawa","大川村"],["ino","いの町"],["niyodogawa","仁淀川町"],
  ["nakatosa","中土佐町"],["sakawa","佐川町"],["ochi","越知町"],["yusuhara","梼原町"],
  ["hidaka","日高村"],["tsuno","津野町"],["shimanto_town","四万十町"],["otsuki","大月町"],
  ["mihara","三原村"],["kuroshio","黒潮町"],
];

// ======= サブコンポーネント =======
function ProgressBar({ screen }: { screen: Screen }) {
  const basicMap: Record<string, number> = { q1:1, q2:2, q3:3, q4:4, q5:5, q6:6 };
  const detailMap: Record<string, number> = { q7:1, q8:2, q9:3, q10:4, q11:5 };
  if (!basicMap[screen] && !detailMap[screen]) return null;

  const isDetail = !!detailMap[screen];
  const n = isDetail ? detailMap[screen] : basicMap[screen];
  const total = isDetail ? 5 : 6;
  const label = isDetail ? `詳しい条件 ${n} / ${total}` : `基本情報 ${n} / ${total}`;
  const pct = Math.round((n / total) * 100);

  return (
    <div style={{ background: cs.greenSofter, padding: "14px 24px 10px", borderBottom: `1px solid ${cs.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: cs.inkSub, marginBottom: "6px" }}>
        <span>{label}</span>
        <strong style={{ color: cs.greenDeep }}>{pct}%</strong>
      </div>
      <div style={{ height: "6px", background: cs.line, borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${cs.greenMain}, ${cs.greenDeep})`, borderRadius: "3px", transition: "width 0.5s ease", width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QNum({ label, gold }: { label: string; gold?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: gold ? cs.goldSoft : cs.greenSoft,
      color: gold ? cs.gold : cs.greenDeep,
      padding: "4px 12px", borderRadius: "999px", fontSize: "11px",
      fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px",
    }}>
      {label}
    </div>
  );
}

function NavButtons({ onBack, onNext, nextId, nextDisabled, nextLabel = "次へ" }: {
  onBack: () => void; onNext?: () => void; nextId?: string;
  nextDisabled?: boolean; nextLabel?: string;
}) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
      <button onClick={onBack} style={{ flex: 1, background: cs.white, color: cs.inkSub, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 500, fontSize: "14px", padding: "18px 12px", border: `1.5px solid ${cs.line}`, borderRadius: "14px", cursor: "pointer" }}>
        戻る
      </button>
      <button onClick={onNext} disabled={nextDisabled} style={{ flex: 2, background: nextDisabled ? "rgba(42,168,74,0.3)" : `linear-gradient(135deg, ${cs.greenMain}, ${cs.greenDeep})`, color: cs.white, fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "17px", padding: "18px 24px", border: "none", borderRadius: "14px", cursor: nextDisabled ? "not-allowed" : "pointer", opacity: nextDisabled ? 0.6 : 1 }}>
        {nextLabel}<span style={{ marginLeft: "8px" }}>→</span>
      </button>
    </div>
  );
}

function Option({ label, selected, onClick, multi, soft }: { label: React.ReactNode; selected: boolean; onClick: () => void; multi?: boolean; soft?: boolean }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "14px",
      background: selected ? cs.greenSofter : cs.white,
      border: `1.5px solid ${selected ? cs.greenMain : cs.line}`,
      borderRadius: "12px", padding: "16px 18px", cursor: "pointer",
      transition: "all 0.15s", fontSize: "15px", lineHeight: 1.6,
      color: soft ? cs.inkMute : cs.ink, textAlign: "left", width: "100%",
      fontStyle: soft ? "italic" : "normal",
    }}>
      {multi ? (
        <span style={{ flexShrink: 0, width: "22px", height: "22px", border: `2px solid ${selected ? cs.greenMain : cs.line}`, borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", background: selected ? cs.greenMain : "transparent" }}>
          {selected && <span style={{ color: "white", fontSize: "14px", fontWeight: 900 }}>✓</span>}
        </span>
      ) : (
        <span style={{ flexShrink: 0, width: "22px", height: "22px", border: `2px solid ${selected ? cs.greenMain : cs.line}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {selected && <span style={{ width: "10px", height: "10px", background: cs.greenMain, borderRadius: "50%", display: "block" }} />}
        </span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

function FieldInput({ label, required, optional, type = "text", value, onChange, placeholder }: {
  label: string; required?: boolean; optional?: string;
  type?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: cs.ink, marginBottom: "8px" }}>
        {label}
        {required && <span style={{ display: "inline-block", background: cs.greenMain, color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", marginLeft: "6px", verticalAlign: "2px" }}>必須</span>}
        {optional && <span style={{ color: cs.inkMute, fontSize: "11px", marginLeft: "6px" }}>{optional}</span>}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", border: `1.5px solid ${cs.line}`, borderRadius: "10px", padding: "14px 16px", fontSize: "16px", fontFamily: "inherit", color: cs.ink, background: cs.white, outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
}

// ======= メインコンポーネント =======
export default function FarmersSuccessionPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [form, setForm] = useState<FormState>(initialState);

  const go = (s: Screen) => { setScreen(s); requestAnimationFrame(() => window.scrollTo(0, 0)); };
  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));
  const updateContact = (patch: Partial<ContactState>) => setForm((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));

  const toggleMulti = (key: "q2" | "q3" | "q10", val: string, exclusive = false) => {
    setForm((prev) => {
      const arr = prev[key] as string[];
      if (exclusive) {
        return { ...prev, [key]: arr.includes(val) ? [] : [val] };
      }
      const filtered = arr.filter((v) => {
        // remove exclusive items when selecting non-exclusive
        const q3Exclusive = ["none"];
        const q10Exclusive: string[] = [];
        if (key === "q3") return !q3Exclusive.includes(v);
        if (key === "q10") return !q10Exclusive.includes(v);
        return true;
      });
      if (filtered.includes(val)) return { ...prev, [key]: filtered.filter((v) => v !== val) };
      return { ...prev, [key]: [...filtered, val] };
    });
  };

  const q6Valid =
    form.contact.name.trim() &&
    form.contact.city &&
    (form.contact.phone.trim() || form.contact.email.trim()) &&
    form.contact.method;

  const submitBasic = () => { console.log("[基本情報送信]", form); go("complete-basic"); };
  const submitDetailed = () => { console.log("[詳細情報送信]", form); go("complete-detailed"); };

  const reset = () => { setForm(initialState); go("intro"); };

  return (
    <PageShell>
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", backgroundColor: cs.stone50, color: cs.ink, minHeight: "100vh", lineHeight: 1.85 }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", background: cs.white, minHeight: "100vh", boxShadow: "0 0 40px rgba(27,107,58,0.04)", position: "relative" }}>

          {/* ページヘッダー */}
          <div style={{ background: `linear-gradient(180deg, ${cs.greenDeep} 0%, #155830 100%)`, color: cs.white, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🌾</span>
              <div>
                <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "16px", lineHeight: 1.4, margin: 0 }}>
                  経営・農地の引き継ぎを相談する
                </h1>
                <div style={{ fontSize: "11px", opacity: 0.75, marginTop: "2px" }}>NOU-SIDE 承継相談フォーム</div>
              </div>
            </div>
          </div>

          <ProgressBar screen={screen} />

          <div style={{ padding: "32px 24px 120px", animation: "fadeIn 0.4s ease" }}>

            {/* ===== イントロ ===== */}
            {screen === "intro" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", background: `linear-gradient(135deg, ${cs.greenSoft}, ${cs.white})`, border: `2px solid ${cs.greenMain}`, borderRadius: "50%", fontSize: "32px", boxShadow: "0 4px 16px rgba(27,107,58,0.08)" }}>🌾</div>
                </div>
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "24px", lineHeight: 1.5, textAlign: "center", marginBottom: "8px" }}>農地・設備・技術を、<br />次世代へ。</h2>
                <p style={{ textAlign: "center", color: cs.inkSub, fontSize: "13px", marginBottom: "28px", letterSpacing: "0.05em" }}>FOR THE NEXT GENERATION</p>

                <div style={{ textAlign: "center", margin: "32px 0 36px", padding: "28px 24px", background: cs.greenSofter, borderRadius: "16px" }}>
                  <p style={{ fontSize: "16px", lineHeight: 2, color: cs.ink }}>
                    <strong style={{ color: cs.greenDeep, fontWeight: 700, fontSize: "17px" }}>6つの質問に答えるだけ</strong>で、<br />
                    事業承継を望む次世代と<br />お繋ぎします。
                  </p>
                  <p style={{ textAlign: "center", color: cs.inkMute, fontSize: "12px", marginTop: "16px", letterSpacing: "0.05em" }}>所要時間 約5分</p>
                </div>

                <button onClick={() => go("q1")} style={{ display: "block", width: "100%", background: `linear-gradient(135deg, ${cs.greenMain}, ${cs.greenDeep})`, color: cs.white, fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "17px", padding: "18px 24px", border: "none", borderRadius: "14px", cursor: "pointer", letterSpacing: "0.02em" }}>
                  相談をはじめる<span style={{ marginLeft: "8px" }}>→</span>
                </button>
              </div>
            )}

            {/* ===== Q1: 農地規模 ===== */}
            {screen === "q1" && (
              <div>
                <QNum label="基本情報 Q1" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  引き継ぎたい農地の合計面積は<br />どのくらいですか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["under_30a","30a未満"],["30a_to_1ha","30a〜1ha"],["over_1ha","1ha以上"],["not_sure","正確に把握していない／相談したい"]].map(([v,l]) => (
                    <Option key={v} label={<span style={v === "not_sure" ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l}</span>} selected={form.q1 === v} onClick={() => update({ q1: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("intro")} onNext={() => go("q2")} nextDisabled={!form.q1} />
              </div>
            )}

            {/* ===== Q2: 品目 ===== */}
            {screen === "q2" && (
              <div>
                <QNum label="基本情報 Q2" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  現在、主に作っている品目を<br />教えてください
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>複数選択できます。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["facility_veg","施設野菜（ナス・ピーマン・シシトウ・キュウリ等）"],["open_veg","露地野菜"],["fruit","果樹（ユズ・文旦・小夏等）"],["rice","米"],["flower","花き"],["tea","茶"],["other","その他"]].map(([v,l]) => (
                    <Option key={v} label={l} multi selected={form.q2.includes(v)} onClick={() => toggleMulti("q2", v)} />
                  ))}
                </div>
                {form.q2.includes("other") && (
                  <div style={{ marginBottom: "16px" }}>
                    <input type="text" value={form.q2_other} onChange={(e) => update({ q2_other: e.target.value })} placeholder="品目をご記入ください" style={{ width: "100%", border: `1.5px solid ${cs.line}`, borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit" }} />
                  </div>
                )}
                <NavButtons onBack={() => go("q1")} onNext={() => go("q3")} nextDisabled={form.q2.length === 0} />
              </div>
            )}

            {/* ===== Q3: 設備 ===== */}
            {screen === "q3" && (
              <div>
                <QNum label="基本情報 Q3" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  引き継ぎ可能な設備は、<br />どのようなものがありますか？
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>複数選択できます。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[
                    ["house","ビニールハウス",false],["heating","暖房・温度管理設備",false],["watering","灌水・養液栽培設備",false],
                    ["warehouse","倉庫・作業場",false],["tractor","トラクター・耕運機",false],["harvester","防除機・収穫機",false],
                    ["packing","選別・梱包設備",false],["none","設備はない／引き継がない",true],["other","その他",false],
                  ].map(([v,l,exc]) => (
                    <Option key={v as string} label={<span style={(exc as boolean) ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l as string}</span>} multi selected={form.q3.includes(v as string)} onClick={() => toggleMulti("q3", v as string, exc as boolean)} />
                  ))}
                </div>
                {form.q3.includes("other") && (
                  <div style={{ marginBottom: "16px" }}>
                    <input type="text" value={form.q3_other} onChange={(e) => update({ q3_other: e.target.value })} placeholder="設備をご記入ください" style={{ width: "100%", border: `1.5px solid ${cs.line}`, borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit" }} />
                  </div>
                )}
                <NavButtons onBack={() => go("q2")} onNext={() => go("q4")} nextDisabled={form.q3.length === 0} />
              </div>
            )}

            {/* ===== Q4: 住居 ===== */}
            {screen === "q4" && (
              <div>
                <QNum label="基本情報 Q4" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  後継者が住める住居について、<br />ご紹介できる状況はありますか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["own_house","自宅を譲れる（転居予定）"],["nearby_vacant","近隣に空き家を紹介できる"],["search_together","地域の空き家情報を一緒に探せる"],["difficult","紹介は難しい"],["not_sure","まだ分からない／相談したい"]].map(([v,l]) => (
                    <Option key={v} label={<span style={v === "not_sure" ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l}</span>} selected={form.q4 === v} onClick={() => update({ q4: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q3")} onNext={() => go("q5")} nextDisabled={!form.q4} />
              </div>
            )}

            {/* ===== Q5: 時期 ===== */}
            {screen === "q5" && (
              <div>
                <QNum label="基本情報 Q5" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  いつ頃までに引き継ぎを<br />進めたいとお考えですか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["within_1y","1年以内"],["within_3y","2〜3年以内"],["within_5y","3〜5年以内"],["over_5y","5年以上先"],["undecided","時期はまだ決めていない／相談したい"]].map(([v,l]) => (
                    <Option key={v} label={<span style={v === "undecided" ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l}</span>} selected={form.q5 === v} onClick={() => update({ q5: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q4")} onNext={() => go("q6")} nextDisabled={!form.q5} />
              </div>
            )}

            {/* ===== Q6: 連絡先 ===== */}
            {screen === "q6" && (
              <div>
                <QNum label="基本情報 Q6" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  ご連絡先を教えてください
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>電話・メールはどちらか一方で構いません。</p>

                <div style={{ background: cs.greenSofter, border: `1px solid ${cs.greenSoft}`, borderRadius: "10px", padding: "14px 16px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: cs.greenDeep, marginBottom: "8px" }}>🔒 情報の取り扱いについて</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ fontSize: "12.5px", color: cs.inkSub, paddingLeft: "14px", position: "relative" }}>・ご相談内容は、引き継ぎ支援に関係する機関と共有する場合があります。</li>
                    <li style={{ fontSize: "12.5px", color: cs.inkSub, paddingLeft: "14px", position: "relative" }}>・外部への共有を進める前には、必ずご本人の同意を確認します。</li>
                  </ul>
                </div>

                <FieldInput label="お名前" required value={form.contact.name} onChange={(v) => updateContact({ name: v })} placeholder="例：山田 太郎" />

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: cs.ink, marginBottom: "8px" }}>
                    お住まいの市町村<span style={{ display: "inline-block", background: cs.greenMain, color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", marginLeft: "6px", verticalAlign: "2px" }}>必須</span>
                  </label>
                  <select value={form.contact.city} onChange={(e) => updateContact({ city: e.target.value })} style={{ width: "100%", border: `1.5px solid ${cs.line}`, borderRadius: "10px", padding: "14px 16px", fontSize: "16px", fontFamily: "inherit", color: cs.ink, background: cs.white, outline: "none" }}>
                    <option value="">選択してください</option>
                    {KOCHI_CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>

                <FieldInput label="電話番号" optional="電話・メールのいずれかご入力ください" type="tel" value={form.contact.phone} onChange={(v) => updateContact({ phone: v })} placeholder="例：088-123-4567" />
                <FieldInput label="メールアドレス" optional="電話・メールのいずれかご入力ください" type="email" value={form.contact.email} onChange={(v) => updateContact({ email: v })} placeholder="例：example@email.com" />

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: cs.ink, marginBottom: "8px" }}>ご希望の連絡方法</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[["phone","電話で連絡してほしい"],["email","メールで連絡してほしい"],["either","どちらでもよい"]].map(([v,l]) => (
                      <Option key={v} label={l} selected={form.contact.method === v} onClick={() => updateContact({ method: v })} />
                    ))}
                  </div>
                </div>

                <NavButtons onBack={() => go("q5")} onNext={() => go("choice")} nextDisabled={!q6Valid} />
              </div>
            )}

            {/* ===== 2択 ===== */}
            {screen === "choice" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>✨</div>
                  <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", marginBottom: "8px", lineHeight: 1.5 }}>入力ありがとうございます</h2>
                  <p style={{ fontSize: "14px", color: cs.inkSub, lineHeight: 1.85 }}>
                    ここまでの内容で送信するか、<br />さらに詳しい引き継ぎ条件まで入力するか、<br />お選びください。
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                  {[
                    { onClick: submitBasic, title: "この内容で相談を始める", meta: "追加質問なし・すぐ送信", body: "まずは担当者からご連絡し、お話を伺います。無理に詳細を決める必要はありません。" },
                    { onClick: () => go("q7"), title: "詳しい引き継ぎ条件まで入力する", meta: "あと5問・約3分", body: "入力内容は、引き継ぎ支援に関係する機関に共有されます。引き継ぎ候補の探索を早く始められます。" },
                  ].map((card) => (
                    <button key={card.title} onClick={card.onClick} style={{ background: cs.white, border: `2px solid ${cs.line}`, borderRadius: "16px", padding: "22px", cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "inherit", transition: "all 0.2s" }}>
                      <div style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "17px", color: cs.greenDeep, marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {card.title}<span style={{ color: cs.greenMain }}>→</span>
                      </div>
                      <span style={{ display: "inline-block", background: cs.greenSoft, color: cs.greenDeep, fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", padding: "4px 10px", borderRadius: "999px", marginBottom: "12px" }}>{card.meta}</span>
                      <div style={{ fontSize: "14px", lineHeight: 1.85, color: cs.inkSub }}>{card.body}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => go("q6")} style={{ display: "block", width: "100%", textAlign: "center", color: cs.inkMute, fontSize: "13px", background: "transparent", border: "none", cursor: "pointer", padding: "12px" }}>← 前の質問に戻る</button>
              </div>
            )}

            {/* ===== Q7: 技術指導 ===== */}
            {screen === "q7" && (
              <div>
                <QNum label="詳しい条件 Q1" gold />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  引き継ぎ後、後継者への技術指導を<br />していただくことは可能ですか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["long_onsite","1年程度、現場で一緒に作業しながら指導できる"],["short_onsite","数ヶ月程度、要点を伝える形で指導できる"],["qa_only","質問に答える形でなら対応できる"],["docs_only","指導は難しい（資料・記録での引き継ぎのみ）"],["not_sure","まだ分からない／相談したい"]].map(([v,l]) => (
                    <Option key={v} label={<span style={v === "not_sure" ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l}</span>} selected={form.q7 === v} onClick={() => update({ q7: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("choice")} onNext={() => go("q8")} nextDisabled={!form.q7} />
              </div>
            )}

            {/* ===== Q8: 販路 ===== */}
            {screen === "q8" && (
              <div>
                <QNum label="詳しい条件 Q2" gold />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  JAや市場以外に、<br />独自の販路をお持ちですか？
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>直販・契約販売・飲食店・加工業者などへの販路があれば教えてください。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: form.q8 === "has_route" ? "0" : "32px" }}>
                  {[["has_route","独自販路がある"],["ja_market_only","JA・市場のみ"],["not_sure","まだ分からない／相談したい"]].map(([v,l]) => (
                    <Option key={v} label={<span style={v === "not_sure" ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l}</span>} selected={form.q8 === v} onClick={() => update({ q8: v, q8_sub: null })} />
                  ))}
                </div>
                {form.q8 === "has_route" && (
                  <div style={{ marginLeft: "36px", padding: "16px 18px", background: cs.greenSofter, borderLeft: `3px solid ${cs.greenMain}`, borderRadius: "0 10px 10px 0", marginTop: "14px", marginBottom: "32px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: cs.greenDeep, marginBottom: "10px" }}>独自販路の引き継ぎは可能ですか？</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[["introducible","紹介して引き継げる"],["cooperative","一定期間、共同で続けながら引き継げる"],["end_with_me","引き継ぎは難しい（自分の代で終了予定）"]].map(([v,l]) => (
                        <button key={v} onClick={() => update({ q8_sub: v })} style={{ display: "flex", alignItems: "center", gap: "10px", background: form.q8_sub === v ? cs.greenSofter : cs.white, border: `1px solid ${form.q8_sub === v ? cs.greenMain : cs.line}`, borderRadius: "8px", padding: "12px 14px", cursor: "pointer", fontSize: "14px", textAlign: "left" }}>
                          <span style={{ width: "18px", height: "18px", border: `2px solid ${form.q8_sub === v ? cs.greenMain : cs.line}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {form.q8_sub === v && <span style={{ width: "8px", height: "8px", background: cs.greenMain, borderRadius: "50%", display: "block" }} />}
                          </span>
                          <span>{l}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: "14px" }}>
                      <label style={{ fontSize: "13px", fontWeight: 700, color: cs.ink }}>
                        主な販路の内容<span style={{ color: cs.inkMute, fontSize: "11px", marginLeft: "6px" }}>任意</span>
                      </label>
                      <input type="text" value={form.q8_detail} onChange={(e) => update({ q8_detail: e.target.value })} placeholder="例：県内飲食店3店舗、東京の青果店など" style={{ width: "100%", border: `1.5px solid ${cs.line}`, borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontFamily: "inherit", marginTop: "8px" }} />
                    </div>
                  </div>
                )}
                <NavButtons onBack={() => go("q7")} onNext={() => go("q9")} nextDisabled={!form.q8 || (form.q8 === "has_route" && !form.q8_sub)} />
              </div>
            )}

            {/* ===== Q9: 負債 ===== */}
            {screen === "q9" && (
              <div>
                <QNum label="詳しい条件 Q3" gold />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  現在、農業経営に関する負債や<br />リース契約の残高はありますか？
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>具体的な金額の入力は不要です。有無と引き継ぎ意向のみお選びください。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["none","ない"],["has_pass","ある（後継者への引き継ぎを希望）"],["has_clear","ある（自分の代で清算予定）"],["not_sure","詳細を確認中／相談したい"]].map(([v,l]) => (
                    <Option key={v} label={<span style={v === "not_sure" ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l}</span>} selected={form.q9 === v} onClick={() => update({ q9: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q8")} onNext={() => go("q10")} nextDisabled={!form.q9} />
              </div>
            )}

            {/* ===== Q10: 地域コミュニティ ===== */}
            {screen === "q10" && (
              <div>
                <QNum label="詳しい条件 Q4" gold />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  地域コミュニティへの加入状況と、<br />引き継ぎ可否を教えてください
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>集落・水利組合・営農組合など。複数選択できます。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[
                    ["settlement_pass","集落・自治会に加入している（引き継ぎ希望）",false],
                    ["water_pass","水利組合に加入している（引き継ぎ希望）",false],
                    ["farming_pass","営農組合・生産部会に加入している（引き継ぎ希望）",false],
                    ["discuss","加入しているが、引き継ぎ可否は相談したい",false],
                    ["none","加入していない／該当しない",true],
                  ].map(([v,l,exc]) => (
                    <Option key={v as string} label={<span style={(exc as boolean) ? { fontStyle: "italic", color: cs.inkMute } : {}}>{l as string}</span>} multi selected={form.q10.includes(v as string)} onClick={() => toggleMulti("q10", v as string, exc as boolean)} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q9")} onNext={() => go("q11")} nextDisabled={form.q10.length === 0} />
              </div>
            )}

            {/* ===== Q11: 自由記述 ===== */}
            {screen === "q11" && (
              <div>
                <QNum label="詳しい条件 Q5" gold />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  引き継ぎにあたって、<br />伝えておきたいことはありますか？
                </h2>
                <p style={{ fontSize: "13px", color: cs.inkSub, marginBottom: "24px" }}>後継者像のご希望、引き継ぎの条件、ご家族との合意状況など。空欄でも構いません。</p>
                <div style={{ marginBottom: "24px" }}>
                  <textarea
                    value={form.q11} onChange={(e) => update({ q11: e.target.value })}
                    placeholder={"例：\n・若い夫婦に引き継いでもらえると嬉しい\n・引き継ぎ期間は2年ほどを希望\n・家族とは話し合い済み"}
                    style={{ width: "100%", border: `1.5px solid ${cs.line}`, borderRadius: "10px", padding: "14px 16px", fontSize: "16px", fontFamily: "inherit", color: cs.ink, background: cs.white, minHeight: "120px", resize: "vertical", lineHeight: 1.7, outline: "none" }}
                  />
                </div>
                <NavButtons onBack={() => go("q10")} onNext={submitDetailed} nextLabel="この内容で送信する" />
              </div>
            )}

            {/* ===== 完了（基本） ===== */}
            {screen === "complete-basic" && (
              <div style={{ textAlign: "center", padding: "24px 0 40px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "88px", height: "88px", background: `linear-gradient(135deg, ${cs.greenMain}, ${cs.greenDeep})`, borderRadius: "50%", color: "white", fontSize: "40px", marginBottom: "24px" }}>✓</div>
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "16px", color: cs.ink }}>ご相談ありがとうございました</h2>
                <div style={{ background: cs.greenSofter, borderRadius: "14px", padding: "22px 24px", marginBottom: "28px", textAlign: "left" }}>
                  <p style={{ fontSize: "14.5px", lineHeight: 1.95 }}>ご希望の連絡方法で<br /><strong>3営業日以内</strong>にご連絡いたします。</p>
                </div>
                <button onClick={reset} style={{ display: "inline-block", color: cs.greenDeep, background: "transparent", fontSize: "14px", padding: "14px 28px", border: `1.5px solid ${cs.greenMain}`, borderRadius: "999px", cursor: "pointer" }}>トップに戻る</button>
              </div>
            )}

            {/* ===== 完了（詳細） ===== */}
            {screen === "complete-detailed" && (
              <div style={{ textAlign: "center", padding: "24px 0 40px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "88px", height: "88px", background: `linear-gradient(135deg, ${cs.greenMain}, ${cs.greenDeep})`, borderRadius: "50%", color: "white", fontSize: "40px", marginBottom: "24px" }}>✓</div>
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "16px", color: cs.ink }}>ご相談ありがとうございました</h2>
                <div style={{ background: cs.greenSofter, borderRadius: "14px", padding: "22px 24px", marginBottom: "28px", textAlign: "left" }}>
                  <p style={{ fontSize: "14.5px", lineHeight: 1.95, marginBottom: "12px" }}>入力内容を引き継ぎ支援機関と共有し、<br />候補者の探索を始めます。</p>
                  <p style={{ fontSize: "14.5px", lineHeight: 1.95 }}>ご希望の連絡方法で<br /><strong>3営業日以内</strong>にご連絡いたします。</p>
                </div>
                <button onClick={reset} style={{ display: "inline-block", color: cs.greenDeep, background: "transparent", fontSize: "14px", padding: "14px 28px", border: `1.5px solid ${cs.greenMain}`, borderRadius: "999px", cursor: "pointer" }}>トップに戻る</button>
              </div>
            )}

          </div>

          {/* 監修バッジ */}
          <div style={{ background: cs.warmBg, borderTop: `1px solid ${cs.line}`, padding: "16px 24px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ flexShrink: 0, width: "36px", height: "36px", background: `linear-gradient(135deg, ${cs.greenSoft}, ${cs.white})`, border: `1.5px solid ${cs.greenMain}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🏛</div>
            <div style={{ fontSize: "11px", color: cs.inkSub, lineHeight: 1.6 }}>
              <strong style={{ display: "block", color: cs.greenDeep, fontSize: "12px", fontWeight: 700 }}>NOU-SIDEプロジェクト</strong>
              地域農業承継・再生構想／高知県の農業行政経験者が監修
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </PageShell>
  );
}
