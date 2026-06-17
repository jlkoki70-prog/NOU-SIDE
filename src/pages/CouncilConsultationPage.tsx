import { useState } from "react";
import { PageShell } from "../App";

// ======= 型定義 =======
type Q1Val = "farmer" | "successor" | "union" | "gov" | "other";
type Screen = "intro" | "q1" | "q2" | "q3" | "q5" | "q6" | "q7" | "complete";

interface ContactState { name: string; city: string; phone: string; email: string; method: string | null; }
interface FormState {
  q1: Q1Val | null; q2: string[]; q3: string | null; q3_freetext: string;
  q5: string | null; q6: string | null; contact: ContactState;
}

const initForm: FormState = {
  q1: null, q2: [], q3: null, q3_freetext: "",
  q5: null, q6: null,
  contact: { name: "", city: "", phone: "", email: "", method: null },
};

const cc = {
  greenDeep: "#1b6b3a", greenMain: "#2aa84a", greenSoft: "#e8f6ec",
  greenSofter: "#f4faf5", ink: "#1a2e22", inkSub: "#52665a", inkMute: "#7a8c82",
  line: "#d9e7dd", lineSoft: "#ecf2ee", white: "#ffffff", warmBg: "#fbfaf3",
  stone50: "#fafaf9", goldSoft: "#fff4c2", gold: "#c89a00",
};

// Q2 定義
const Q2_DEFS: Record<string, { title: string; options: { v: string; t: string; exclusive?: boolean; soft?: boolean }[] }> = {
  farmer: {
    title: "地域の議論について、思い当たることはありますか？",
    options: [
      { v: "past_conflict", t: "過去の統廃合などで、金銭や権利が絡む議論で対立した経験がある" },
      { v: "delegate", t: "深い対立を避けるため、部会長や代表的な誰かに任せる雰囲気がある" },
      { v: "gap", t: "個人として思っていることと、全体の場で言えることは違う" },
      { v: "none", t: "どれも当てはまらない", exclusive: true, soft: true },
    ],
  },
  successor: {
    title: "自分たちの世代に関わることについて、思い当たることはありますか？",
    options: [
      { v: "decided_by_parents", t: "自分たちの未来のことなのに、親世代で物事が決まっていく" },
      { v: "methods", t: "親から継いだやり方（手法）を、自分の判断で変えにくい" },
      { v: "opinion_diff", t: "農業技術や営農環境の理想について、親世代と意見が違う箇所がいくつかある" },
      { v: "hard_to_speak", t: "自分の意見を、地域の議論の場で言いづらい" },
      { v: "none", t: "どれも当てはまらない", exclusive: true, soft: true },
    ],
  },
  union: {
    title: "業務の中で、思い当たることはありますか？",
    options: [
      { v: "limited_options", t: "農家の限界が見えていても、組合機能を地域内に維持するためには、出荷量を増やしてもらうか、利用料の負担を上げてもらうかしか提示できない" },
      { v: "merge_consensus", t: "組合の機能維持や近隣との統合議論には、生産者間の利害が絡むため、組合の枠内では合意形成が難しい" },
      { v: "no_forum", t: "次世代の営農環境の魅力創出や、地域全体の暮らしやすさを中心に据えた議論の場がない" },
      { v: "none", t: "どれも当てはまらない", exclusive: true, soft: true },
    ],
  },
  gov: {
    title: "業務の中で、思い当たることはありますか？",
    options: [
      { v: "distance", t: "生産者や組合が主体となっている取り組みには、どうしても距離を置く必要を感じる" },
      { v: "internal_limit", t: "地域の魅力創出は、内部関係者だけでは限界を感じる" },
      { v: "low_conversion", t: "移住希望者と首都圏で面談しても、移住や定住に繋がる割合が低いと感じる" },
      { v: "no_contact", t: "移住希望者と接点を持つ機会自体がなかなか作れない" },
      { v: "none", t: "どれも当てはまらない", exclusive: true, soft: true },
    ],
  },
};

const PROGRESS_MAP: Record<string, { num: number; total: number }> = {
  q1: { num: 1, total: 6 }, q2: { num: 2, total: 6 }, q3: { num: 3, total: 6 },
  q5: { num: 4, total: 6 }, q6: { num: 5, total: 6 }, q7: { num: 6, total: 6 },
};

// ======= サブコンポーネント =======
function ProgressBar({ screen }: { screen: Screen }) {
  const info = PROGRESS_MAP[screen];
  if (!info) return null;
  const pct = Math.round((info.num / info.total) * 100);
  return (
    <div style={{ background: cc.greenSofter, padding: "14px 24px 10px", borderBottom: `1px solid ${cc.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: cc.inkSub, marginBottom: "6px" }}>
        <span>基本情報 {info.num} / {info.total}</span>
        <strong style={{ color: cc.greenDeep }}>{pct}%</strong>
      </div>
      <div style={{ height: "6px", background: cc.line, borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${cc.greenMain}, ${cc.greenDeep})`, borderRadius: "3px", transition: "width 0.5s ease", width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QNum({ label }: { label: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", background: cc.greenSoft, color: cc.greenDeep, padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "16px" }}>
      {label}
    </div>
  );
}

function Option({ label, selected, onClick, multi, soft }: { label: string; selected: boolean; onClick: () => void; multi?: boolean; soft?: boolean }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "14px",
      background: selected ? cc.greenSofter : cc.white,
      border: `1.5px solid ${selected ? cc.greenMain : cc.line}`,
      borderRadius: "12px", padding: "16px 18px", cursor: "pointer",
      transition: "all 0.15s", fontSize: "15px", lineHeight: 1.6,
      color: soft ? cc.inkMute : cc.ink, textAlign: "left", width: "100%",
      fontStyle: soft ? "italic" : "normal",
    }}>
      {multi ? (
        <span style={{ flexShrink: 0, width: "22px", height: "22px", border: `2px solid ${selected ? cc.greenMain : cc.line}`, borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", background: selected ? cc.greenMain : "transparent" }}>
          {selected && <span style={{ color: "white", fontSize: "14px", fontWeight: 900 }}>✓</span>}
        </span>
      ) : (
        <span style={{ flexShrink: 0, width: "22px", height: "22px", border: `2px solid ${selected ? cc.greenMain : cc.line}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {selected && <span style={{ width: "10px", height: "10px", background: cc.greenMain, borderRadius: "50%", display: "block" }} />}
        </span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = "次へ" }: { onBack: () => void; onNext?: () => void; nextDisabled?: boolean; nextLabel?: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
      <button onClick={onBack} style={{ flex: 1, background: cc.white, color: cc.inkSub, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 500, fontSize: "14px", padding: "18px 12px", border: `1.5px solid ${cc.line}`, borderRadius: "14px", cursor: "pointer" }}>
        戻る
      </button>
      <button onClick={onNext} disabled={nextDisabled} style={{ flex: 2, background: nextDisabled ? "rgba(42,168,74,0.3)" : `linear-gradient(135deg, ${cc.greenMain}, ${cc.greenDeep})`, color: cc.white, fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "17px", padding: "18px 24px", border: "none", borderRadius: "14px", cursor: nextDisabled ? "not-allowed" : "pointer", opacity: nextDisabled ? 0.6 : 1 }}>
        {nextLabel}<span style={{ marginLeft: "8px" }}>→</span>
      </button>
    </div>
  );
}

// ======= メインコンポーネント =======
export default function CouncilConsultationPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [form, setForm] = useState<FormState>(initForm);

  const go = (s: Screen) => { setScreen(s); requestAnimationFrame(() => window.scrollTo(0, 0)); };
  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));
  const updateContact = (patch: Partial<ContactState>) => setForm((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }));

  const toggleQ2 = (val: string, exclusive?: boolean) => {
    setForm((prev) => {
      const arr = prev.q2;
      if (exclusive) {
        return { ...prev, q2: arr.includes(val) ? [] : [val] };
      }
      const filtered = arr.filter((v) => {
        const def = form.q1 ? Q2_DEFS[form.q1] : null;
        const excVals = def ? def.options.filter((o) => o.exclusive).map((o) => o.v) : [];
        return !excVals.includes(v);
      });
      if (filtered.includes(val)) return { ...prev, q2: filtered.filter((v) => v !== val) };
      return { ...prev, q2: [...filtered, val] };
    });
  };

  const nextFromQ1 = () => {
    if (form.q1 === "other") {
      update({ q2: [] });
      go("q3");
    } else {
      update({ q2: [] });
      go("q2");
    }
  };

  const backFromQ3 = () => {
    if (form.q1 === "other" || !form.q1) go("q1");
    else go("q2");
  };

  const q7Valid = form.contact.name.trim() && form.contact.city.trim() && (form.contact.phone.trim() || form.contact.email.trim()) && form.contact.method;

  const submitForm = () => { console.log("[協議相談送信]", form); go("complete"); };
  const reset = () => { setForm(initForm); go("intro"); };

  const q2Def = form.q1 && form.q1 !== "other" ? Q2_DEFS[form.q1] : null;

  return (
    <PageShell>
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", backgroundColor: cc.stone50, color: cc.ink, minHeight: "100vh", lineHeight: 1.85 }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", background: cc.white, minHeight: "100vh", boxShadow: "0 0 40px rgba(27,107,58,0.04)", position: "relative" }}>

          {/* ページ内ヘッダー */}
          <div style={{ background: `linear-gradient(180deg, ${cc.greenDeep} 0%, #155830 100%)`, color: cc.white, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🤝</span>
              <div>
                <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "16px", lineHeight: 1.4, margin: 0 }}>
                  地域で話し合う場づくりを相談する
                </h1>
                <div style={{ fontSize: "11px", opacity: 0.75, marginTop: "2px" }}>NOU-SIDE 協議相談フォーム</div>
              </div>
            </div>
          </div>

          <ProgressBar screen={screen} />

          <div style={{ padding: "32px 24px 120px", animation: "fadeIn 0.4s ease" }}>

            {/* ===== イントロ ===== */}
            {screen === "intro" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", background: `linear-gradient(135deg, ${cc.greenSoft}, ${cc.white})`, border: `2px solid ${cc.greenMain}`, borderRadius: "50%", fontSize: "32px", boxShadow: "0 4px 16px rgba(27,107,58,0.08)" }}>🤝</div>
                </div>
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "24px", lineHeight: 1.5, textAlign: "center", marginBottom: "8px" }}>
                  地域で話し合う場を、<br />一緒につくる。
                </h2>
                <p style={{ textAlign: "center", color: cc.inkSub, fontSize: "13px", marginBottom: "28px", letterSpacing: "0.05em" }}>FOR THE FUTURE OF YOUR REGION</p>

                <div style={{ background: cc.white, border: `1.5px solid ${cc.greenSoft}`, borderLeft: `4px solid ${cc.greenMain}`, borderRadius: "0 12px 12px 0", padding: "18px 20px", marginBottom: "28px", fontSize: "14.5px", lineHeight: 1.95, color: cc.ink }}>
                  <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: cc.greenDeep, marginBottom: "6px", letterSpacing: "0.05em" }}>このフォームでお伺いする「協議会」とは</span>
                  農家・組合・自治体・新規就農希望者が、立場を超えて地域の未来を考える場のことです。
                </div>

                <div style={{ textAlign: "center", margin: "32px 0 28px", padding: "28px 24px", background: cc.greenSofter, borderRadius: "16px" }}>
                  <p style={{ fontSize: "16px", lineHeight: 2, color: cc.ink }}>
                    <strong style={{ color: cc.greenDeep, fontWeight: 700, fontSize: "17px" }}>6つの質問</strong>でお話を伺い、<br />場づくりのご相談を承ります。
                  </p>
                  <p style={{ textAlign: "center", color: cc.inkMute, fontSize: "12px", marginTop: "16px", letterSpacing: "0.05em" }}>所要時間 約3〜5分</p>
                </div>

                <button onClick={() => go("q1")} style={{ display: "block", width: "100%", background: `linear-gradient(135deg, ${cc.greenMain}, ${cc.greenDeep})`, color: cc.white, fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "17px", padding: "18px 24px", border: "none", borderRadius: "14px", cursor: "pointer", letterSpacing: "0.02em" }}>
                  相談をはじめる<span style={{ marginLeft: "8px" }}>→</span>
                </button>
              </div>
            )}

            {/* ===== Q1: ご職業 ===== */}
            {screen === "q1" && (
              <div>
                <QNum label="基本情報 Q1" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  ご職業を教えてください
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {([["farmer","農家（生産者）"],["successor","後継者"],["union","組合・支援機関の職員"],["gov","自治体・行政の職員"],["other","その他"]] as [Q1Val, string][]).map(([v,l]) => (
                    <Option key={v} label={l} selected={form.q1 === v} onClick={() => update({ q1: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("intro")} onNext={nextFromQ1} nextDisabled={!form.q1} />
              </div>
            )}

            {/* ===== Q2: 立場別（動的） ===== */}
            {screen === "q2" && q2Def && (
              <div>
                <QNum label="基本情報 Q2" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  {q2Def.title}
                </h2>
                <p style={{ fontSize: "13px", color: cc.inkSub, marginBottom: "24px" }}>複数選択できます。</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {q2Def.options.map((opt) => (
                    <Option key={opt.v} label={opt.t} multi selected={form.q2.includes(opt.v)} soft={opt.soft} onClick={() => toggleQ2(opt.v, opt.exclusive)} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q1")} onNext={() => go("q3")} nextDisabled={form.q2.length === 0} />
              </div>
            )}

            {/* ===== Q3: 関与スタンス ===== */}
            {screen === "q3" && (
              <div>
                <QNum label="基本情報 Q3" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  この協議会について、ご自身は<br />どのような関わり方を想定していますか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: form.q3 === "alternative" ? "0" : "32px" }}>
                  {[["leader","自分（または自分の組織）が中心になって動かしたい"],["participant","議論を担う一員として関わりたい"],["listener","まずは情報を得たい・話を聞きたい"],["alternative","協議会という形ではなく、別のやり方を提案したい"]].map(([v,l]) => (
                    <Option key={v} label={l} selected={form.q3 === v} onClick={() => update({ q3: v })} />
                  ))}
                </div>
                {form.q3 === "alternative" && (
                  <div style={{ marginTop: "16px", marginLeft: "36px", padding: "16px 18px", background: cc.greenSofter, borderLeft: `3px solid ${cc.greenMain}`, borderRadius: "0 10px 10px 0", marginBottom: "32px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: cc.greenDeep, marginBottom: "4px" }}>貴重なご意見として、ぜひ伺わせてください</p>
                    <p style={{ fontSize: "12px", color: cc.inkSub, marginBottom: "10px" }}>どのような点に気をつけながら進めるとよいとお考えでしょうか？（任意）</p>
                    <textarea
                      value={form.q3_freetext}
                      onChange={(e) => update({ q3_freetext: e.target.value })}
                      maxLength={600}
                      style={{ width: "100%", border: `1.5px solid ${cc.line}`, borderRadius: "8px", padding: "12px", fontSize: "14px", fontFamily: "inherit", minHeight: "120px", resize: "vertical", outline: "none" }}
                    />
                    <p style={{ textAlign: "right", fontSize: "11px", color: cc.inkMute, marginTop: "4px" }}>{form.q3_freetext.length} / 500</p>
                  </div>
                )}
                <NavButtons onBack={backFromQ3} onNext={() => go("q5")} nextDisabled={!form.q3} />
              </div>
            )}

            {/* ===== Q5: 主催者 ===== */}
            {screen === "q5" && (
              <div>
                <QNum label="基本情報 Q4" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  どこが主催者（運営元）となるのが<br />適切だとお考えでしょうか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["union","組合・支援機関"],["gov","自治体・行政"],["individual_leader","地域のリーダー的個人"],["self","自分自身・自分の組織"],["unknown","まだ分からない"]].map(([v,l]) => (
                    <Option key={v} label={l} soft={v === "unknown"} selected={form.q5 === v} onClick={() => update({ q5: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q3")} onNext={() => go("q6")} nextDisabled={!form.q5} />
              </div>
            )}

            {/* ===== Q6: 牽引役 ===== */}
            {screen === "q6" && (
              <div>
                <QNum label="基本情報 Q5" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "24px" }}>
                  牽引役（リーダー）として<br />思い浮かぶ適任者は、いますか？
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
                  {[["yes","はい"],["no","いいえ"],["multiple","複数人いる"]].map(([v,l]) => (
                    <Option key={v} label={l} selected={form.q6 === v} onClick={() => update({ q6: v })} />
                  ))}
                </div>
                <NavButtons onBack={() => go("q5")} onNext={() => go("q7")} nextDisabled={!form.q6} />
              </div>
            )}

            {/* ===== Q7: 連絡先 ===== */}
            {screen === "q7" && (
              <div>
                <QNum label="基本情報 Q6" />
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "21px", lineHeight: 1.55, marginBottom: "8px" }}>
                  ご連絡先を教えてください
                </h2>
                <p style={{ fontSize: "13px", color: cc.inkSub, marginBottom: "24px" }}>電話・メールはどちらか一方で構いません。</p>

                <div style={{ background: cc.greenSofter, border: `1px solid ${cc.greenSoft}`, borderRadius: "10px", padding: "14px 16px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: cc.greenDeep, marginBottom: "8px" }}>🔒 情報の取り扱いについて</p>
                  <p style={{ fontSize: "12.5px", color: cc.inkSub }}>・ご相談内容は、場づくりの支援に関係する機関と共有する場合があります。</p>
                  <p style={{ fontSize: "12.5px", color: cc.inkSub }}>・外部への共有を進める前には、必ずご本人の同意を確認します。</p>
                </div>

                {[
                  { label: "お名前", req: true, opt: "", type: "text", val: form.contact.name, onChange: (v: string) => updateContact({ name: v }), ph: "例：山田 太郎" },
                  { label: "お住まいの市町村", req: true, opt: "", type: "text", val: form.contact.city, onChange: (v: string) => updateContact({ city: v }), ph: "例：高知市" },
                  { label: "電話番号", req: false, opt: "電話・メールのいずれかご入力ください", type: "tel", val: form.contact.phone, onChange: (v: string) => updateContact({ phone: v }), ph: "例：088-123-4567" },
                  { label: "メールアドレス", req: false, opt: "電話・メールのいずれかご入力ください", type: "email", val: form.contact.email, onChange: (v: string) => updateContact({ email: v }), ph: "例：example@email.com" },
                ].map((f) => (
                  <div key={f.label} style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: cc.ink, marginBottom: "8px" }}>
                      {f.label}
                      {f.req && <span style={{ display: "inline-block", background: cc.greenMain, color: "white", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", marginLeft: "6px", verticalAlign: "2px" }}>必須</span>}
                      {f.opt && <span style={{ color: cc.inkMute, fontSize: "11px", marginLeft: "6px" }}>{f.opt}</span>}
                    </label>
                    <input type={f.type} value={f.val} onChange={(e) => f.onChange(e.target.value)} placeholder={f.ph} style={{ width: "100%", border: `1.5px solid ${cc.line}`, borderRadius: "10px", padding: "14px 16px", fontSize: "16px", fontFamily: "inherit", color: cc.ink, background: cc.white, outline: "none", boxSizing: "border-box" }} />
                  </div>
                ))}

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: cc.ink, marginBottom: "8px" }}>ご希望の連絡方法</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[["phone","電話で連絡してほしい"],["email","メールで連絡してほしい"],["either","どちらでもよい"]].map(([v,l]) => (
                      <Option key={v} label={l} selected={form.contact.method === v} onClick={() => updateContact({ method: v })} />
                    ))}
                  </div>
                </div>

                <NavButtons onBack={() => go("q6")} onNext={submitForm} nextDisabled={!q7Valid} nextLabel="送信する" />
              </div>
            )}

            {/* ===== 完了 ===== */}
            {screen === "complete" && (
              <div style={{ textAlign: "center", padding: "24px 0 40px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "88px", height: "88px", background: `linear-gradient(135deg, ${cc.greenMain}, ${cc.greenDeep})`, borderRadius: "50%", color: "white", fontSize: "40px", marginBottom: "24px" }}>✓</div>
                <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "24px", marginBottom: "16px", color: cc.ink }}>ご相談ありがとうございました</h2>
                <div style={{ background: cc.greenSofter, borderRadius: "14px", padding: "22px 24px", marginBottom: "28px", textAlign: "left" }}>
                  <p style={{ fontSize: "14.5px", lineHeight: 1.95 }}>ご希望の連絡方法で<br /><strong>3営業日以内</strong>にご連絡いたします。</p>
                </div>
                <button onClick={reset} style={{ display: "inline-block", color: cc.greenDeep, background: "transparent", fontSize: "14px", padding: "14px 28px", border: `1.5px solid ${cc.greenMain}`, borderRadius: "999px", cursor: "pointer" }}>トップに戻る</button>
              </div>
            )}

          </div>

          {/* 監修バッジ */}
          <div style={{ background: cc.warmBg, borderTop: `1px solid ${cc.line}`, padding: "16px 24px", display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ flexShrink: 0, width: "36px", height: "36px", background: `linear-gradient(135deg, ${cc.greenSoft}, ${cc.white})`, border: `1.5px solid ${cc.greenMain}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🏛</div>
            <div style={{ fontSize: "11px", color: cc.inkSub, lineHeight: 1.6 }}>
              <strong style={{ display: "block", color: cc.greenDeep, fontSize: "12px", fontWeight: 700 }}>NOU-SIDEプロジェクト</strong>
              地域農業承継・再生構想／高知県の農業行政経験者が監修
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </PageShell>
  );
}
