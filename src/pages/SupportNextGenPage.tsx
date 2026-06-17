import { useState } from "react";
import { PageShell } from "../App";

const questionsBase = [
  "担当地域の生産者の高齢化と出荷量の減少が、進んでいる。",
  "担い手対策には取り組んでいるが、生産者数は維持できず減少傾向にある。",
  "優秀な生産者の技術や工夫を他の生産者へ展開しても、個人の能力差は埋まりにくいと感じる。",
  "生産者間の利害が絡む議論には、着手しにくい。",
  null, // Q5 は立場別
  "若手生産者や新規就農希望者とのコミュニケーションに難しさを感じている。",
  "次世代の担い手のために、自治体や他組織と話し合う場は必要だと感じるが、作りにくい。",
  "同じメンバーで議論を重ねるほど、新しい選択肢が出にくくなっている。",
];

const questionQ5: Record<string, string> = {
  union: "組合の機能維持に必要な数（出荷量・組合員数など）を割り込んでいる。",
  support: "担当地域の中には、統廃合や賦課金の上昇が議論されている組合組織がある。",
};

const TOTAL_QUESTIONS = 8;

const colors = {
  cream: "#fbfaf3",
  creamSoft: "#f7f4e9",
  white: "#ffffff",
  stone50: "#fafaf9",
  greenDeep: "#1b6b3a",
  green: "#2aa84a",
  greenSoft: "#e8f6ec",
  greenSofter: "#f4faf5",
  ink: "#1a2e22",
  inkSub: "#52665a",
  inkMute: "#7a8c82",
  line: "#d9e7dd",
  lineSoft: "#ecf2ee",
  gold: "#c89a00",
  goldSoft: "#fff4c2",
  redAccent: "#c54a4a",
};

type Role = "union" | "support";
type AnswerValue = "yes" | "no" | "unknown";
type Screen = "intro" | `q${number}` | "result";

export default function SupportNextGenPage() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [role, setRole] = useState<Role | null>(null);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setScreen("q1");
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleAnswer = (qIndex: number, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
    setTimeout(() => {
      const nextQ = qIndex + 2;
      if (nextQ <= TOTAL_QUESTIONS) {
        setScreen(`q${nextQ}` as Screen);
      } else {
        setScreen("result");
      }
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }, 320);
  };

  const handleBack = () => {
    if (screen === "q1") {
      setScreen("intro");
    } else if (screen === "result") {
      setScreen(`q${TOTAL_QUESTIONS}` as Screen);
    } else {
      const currentNum = parseInt((screen as string).replace("q", ""), 10);
      setScreen(`q${currentNum - 1}` as Screen);
    }
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const handleReset = () => {
    setScreen("intro");
    setRole(null);
    setAnswers({});
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  const currentQNum = (screen as string).startsWith("q")
    ? parseInt((screen as string).replace("q", ""), 10)
    : 0;

  let currentQuestionText: string | null = null;
  if (currentQNum >= 1 && currentQNum <= TOTAL_QUESTIONS) {
    if (currentQNum === 5) {
      currentQuestionText = role ? questionQ5[role] : null;
    } else {
      currentQuestionText = questionsBase[currentQNum - 1];
    }
  }

  return (
    <PageShell>
      <div
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          backgroundColor: colors.stone50,
          color: colors.ink,
          minHeight: "100vh",
          lineHeight: 1.85,
          fontFeatureSettings: '"palt"',
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            background: colors.white,
            minHeight: "100vh",
            boxShadow: "0 0 40px rgba(27, 107, 58, 0.04)",
            position: "relative",
          }}
        >
          {/* ページ内ヘッダー */}
          <div
            style={{
              background: `linear-gradient(180deg, ${colors.greenDeep} 0%, #155830 100%)`,
              color: colors.white,
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🌾</span>
              <div>
                <h1
                  style={{
                    fontFamily: "'Zen Maru Gothic', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  組合・支援機関 用 簡易診断
                </h1>
                <div style={{ fontSize: "11px", opacity: 0.75, marginTop: "2px", letterSpacing: "0.05em" }}>
                  NOU-SIDE プロジェクト
                </div>
              </div>
            </div>
          </div>

          {/* 進捗バー */}
          {currentQNum >= 1 && currentQNum <= TOTAL_QUESTIONS && (
            <ProgressBar current={currentQNum} total={TOTAL_QUESTIONS} />
          )}

          {screen === "intro" && <IntroScreen onRoleSelect={handleRoleSelect} />}

          {currentQNum >= 1 && currentQNum <= TOTAL_QUESTIONS && currentQuestionText && (
            <QuestionScreen
              key={screen}
              qNum={currentQNum}
              questionText={currentQuestionText}
              onAnswer={(value) => handleAnswer(currentQNum - 1, value)}
              onBack={handleBack}
            />
          )}

          {screen === "result" && (
            <ResultScreen role={role} answers={answers} onReset={handleReset} onBack={handleBack} />
          )}

          {/* 監修バッジ */}
          <div
            style={{
              background: colors.cream,
              borderTop: `1px solid ${colors.line}`,
              padding: "16px 24px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: "36px",
                height: "36px",
                background: `linear-gradient(135deg, ${colors.greenSoft}, ${colors.white})`,
                border: `1.5px solid ${colors.green}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              🏛
            </div>
            <div style={{ fontSize: "11px", color: colors.inkSub, lineHeight: 1.6 }}>
              <strong style={{ display: "block", color: colors.greenDeep, fontSize: "12px", fontWeight: 700 }}>
                NOU-SIDEプロジェクト
              </strong>
              地域農業承継・再生構想／高知県の農業行政経験者が監修
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceIn {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </PageShell>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div style={{ background: colors.greenSofter, padding: "14px 24px 10px", borderBottom: `1px solid ${colors.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: colors.inkSub, marginBottom: "6px" }}>
        <span>診断 {current} / {total}</span>
        <strong style={{ color: colors.greenDeep, fontWeight: 700 }}>{percent}%</strong>
      </div>
      <div style={{ height: "6px", background: colors.line, borderRadius: "3px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg, ${colors.green}, ${colors.greenDeep})`,
            borderRadius: "3px",
            transition: "width 0.5s ease",
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}

function IntroScreen({ onRoleSelect }: { onRoleSelect: (role: Role) => void }) {
  return (
    <section style={{ padding: "40px 24px 80px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "24px", height: "1px", backgroundColor: colors.green }} />
        <span style={{ fontSize: "11px", letterSpacing: "0.25em", color: colors.greenDeep, textTransform: "uppercase", fontWeight: 700 }}>
          For Cooperatives &amp; Support Organizations
        </span>
      </div>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 5vw, 1.875rem)", lineHeight: 1.55, letterSpacing: "0.005em", color: colors.ink, marginBottom: "24px" }}>
        新規就農者数が、<br />
        離農者数を上回る<br />
        <span style={{ background: `linear-gradient(transparent 60%, ${colors.goldSoft} 60%)`, padding: "0 0.1em" }}>
          地域を目指して。
        </span>
      </h2>

      <div style={{ background: colors.greenSofter, borderLeft: `4px solid ${colors.green}`, borderRadius: "0 12px 12px 0", padding: "20px 22px", marginBottom: "32px" }}>
        <FactRow num="01">全国の新規就農者は、年に<Emphasis>約4.3万人</Emphasis>。</FactRow>
        <FactRow num="02">基幹的農業従事者は、4年で<Emphasis>約25万人減</Emphasis>（年平均6.3万人減）。</FactRow>
        <FactRow num="03" last>全国レベルでは、すでに離農が新規を上回っています。</FactRow>
        <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "15px", color: colors.greenDeep, lineHeight: 1.85, marginTop: "20px", marginBottom: 0 }}>
          組合・支援機関の枠を超えた議論が、いま必要になっています。
        </p>
        <p style={{ fontSize: "11px", color: colors.inkMute, letterSpacing: "0.02em", marginTop: "12px", marginBottom: 0 }}>
          ※ 農林水産省「新規就農者調査（令和5年）」「農業構造動態調査」より作成。
        </p>
      </div>

      <div>
        <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "14px", color: colors.greenDeep, letterSpacing: "0.1em", marginBottom: "12px" }}>
          ご所属を、お選びください
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <RoleButton role="union" onSelect={onRoleSelect} title="組合の職員" subtitle="JA、その他の協同組合" />
          <RoleButton role="support" onSelect={onRoleSelect} title="支援機関の職員" subtitle="普及センター、JA中央会、農業会議など" />
        </div>
        <p style={{ fontSize: "12px", color: colors.inkMute, marginTop: "16px", textAlign: "center" }}>
          全8問・約2分／回答は記録されません
        </p>
      </div>
    </section>
  );
}

function FactRow({ num, children, last }: { num: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: last ? 0 : "14px" }}>
      <span style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 600, fontSize: "1.5rem", color: colors.gold, lineHeight: 1, flexShrink: 0 }}>{num}</span>
      <p style={{ fontSize: "14.5px", color: colors.ink, lineHeight: 1.85, margin: 0, flex: 1 }}>{children}</p>
    </div>
  );
}

function Emphasis({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "1.05em", color: colors.greenDeep }}>{children}</span>
  );
}

function RoleButton({ role, onSelect, title, subtitle }: { role: Role; onSelect: (role: Role) => void; title: string; subtitle: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onSelect(role)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        background: hover ? colors.greenSofter : colors.white,
        padding: "16px 20px",
        border: `1.5px solid ${hover ? colors.green : colors.line}`,
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        WebkitTapHighlightColor: "transparent",
        boxShadow: hover ? "0 4px 16px rgba(27, 107, 58, 0.08)" : "0 1px 3px rgba(27, 107, 58, 0.04)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      <span style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "16px", color: colors.greenDeep, display: "block" }}>{title}</span>
      <span style={{ display: "block", fontSize: "12px", marginTop: "4px", color: colors.inkSub }}>{subtitle}</span>
    </button>
  );
}

function QuestionScreen({ qNum, questionText, onAnswer, onBack }: { qNum: number; questionText: string; onAnswer: (value: AnswerValue) => void; onBack: () => void }) {
  const [pendingValue, setPendingValue] = useState<AnswerValue | null>(null);
  const handleClick = (value: AnswerValue) => { setPendingValue(value); onAnswer(value); };

  return (
    <section style={{ padding: "32px 24px 100px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: colors.greenSoft, color: colors.greenDeep, padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "20px" }}>
        Q{qNum}
      </div>
      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "clamp(1.125rem, 4vw, 1.3125rem)", lineHeight: 1.65, letterSpacing: "0.005em", color: colors.ink, marginBottom: "8px" }}>
        {questionText}
      </h2>
      <p style={{ fontSize: "13px", color: colors.inkSub, marginBottom: "28px", lineHeight: 1.75 }}>
        この記述は、あなたの地域の現状にあてはまりますか？
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {(["yes", "no", "unknown"] as AnswerValue[]).map((v) => (
          <AnswerOption key={v} label={v === "yes" ? "はい" : v === "no" ? "いいえ" : "分からない"} value={v} selected={pendingValue === v} onClick={() => handleClick(v)} />
        ))}
      </div>
      <div style={{ marginTop: "24px" }}>
        <button onClick={onBack} style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "13px", color: colors.inkSub, background: "transparent", border: "none", cursor: "pointer", padding: "8px 4px" }}>
          ← 前の質問に戻る
        </button>
      </div>
    </section>
  );
}

function AnswerOption({ label, value, selected, onClick }: { label: string; value: AnswerValue; selected: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const isUnknown = value === "unknown";
  const bgColor = selected ? (isUnknown ? "#fffaf0" : colors.greenSofter) : colors.white;
  const borderColor = selected ? (isUnknown ? colors.gold : colors.green) : colors.line;
  const textColor = selected && !isUnknown ? colors.greenDeep : colors.ink;
  const radioColor = selected ? (isUnknown ? colors.gold : colors.green) : colors.line;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        background: bgColor, border: `1.5px solid ${borderColor}`, borderRadius: "12px",
        padding: "16px 18px", cursor: "pointer", transition: "all 0.18s",
        fontSize: "15px", lineHeight: 1.6, color: textColor,
        userSelect: "none", textAlign: "left",
        fontFamily: "'Noto Sans JP', sans-serif", fontWeight: selected ? 700 : 500,
        WebkitTapHighlightColor: "transparent",
        boxShadow: selected ? "0 1px 3px rgba(27, 107, 58, 0.08)" : hover ? "0 2px 8px rgba(27, 107, 58, 0.06)" : "none",
      }}
    >
      <span style={{ flexShrink: 0, width: "22px", height: "22px", border: `2px solid ${radioColor}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {selected && <span style={{ width: "10px", height: "10px", background: radioColor, borderRadius: "50%" }} />}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

function ResultScreen({ role, answers, onReset, onBack }: { role: Role | null; answers: Record<number, AnswerValue>; onReset: () => void; onBack: () => void }) {
  const yesCount = Object.values(answers).filter((a) => a === "yes").length;

  let levelLabel: string, levelColor: string, borderWidth: string, message: React.ReactNode, ctaLabel: string;

  if (yesCount <= 2) {
    levelLabel = "低"; levelColor = colors.green; borderWidth = "1px"; ctaLabel = "状況を共有する";
    message = (
      <>
        <p style={{ fontSize: "15px", color: colors.ink, lineHeight: 1.95, marginBottom: "14px" }}>一部の領域で詰まりが見え始めている段階です。</p>
        <p style={{ fontSize: "15px", color: colors.inkSub, lineHeight: 1.95, margin: 0 }}>個別の対応で十分対処できる範囲ですが、複数の領域に広がる前に、状況を共有しておくことに意味があります。</p>
      </>
    );
  } else if (yesCount <= 4) {
    levelLabel = "中"; levelColor = colors.gold; borderWidth = "1.5px"; ctaLabel = "枠を超えた議論をはじめたい";
    message = (
      <>
        <p style={{ fontSize: "15px", color: colors.ink, lineHeight: 1.95, marginBottom: "14px" }}>複数の領域で課題同士がつながりつつある段階です。</p>
        <p style={{ fontSize: "15px", color: colors.inkSub, lineHeight: 1.95, marginBottom: "14px" }}>組合・支援機関の通常の業務範囲では、対応が追いつきにくくなっています。</p>
        <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "16px", color: colors.greenDeep, lineHeight: 1.8, margin: 0 }}>枠を超えた議論の準備を、いま始めるタイミングです。</p>
      </>
    );
  } else {
    levelLabel = "高"; levelColor = colors.redAccent; borderWidth = "2px"; ctaLabel = "枠を超えた議論をはじめたい";
    message = (
      <>
        <p style={{ fontSize: "15px", color: colors.ink, lineHeight: 1.95, marginBottom: "14px" }}>組合・支援機関の枠を超えた議論が必要な段階です。</p>
        <p style={{ fontSize: "15px", color: colors.inkSub, lineHeight: 1.95, marginBottom: "14px" }}>組織の内側だけでは、新規就農者数が離農者数を上回る状態はつくれません。</p>
        <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "16px", color: colors.greenDeep, lineHeight: 1.8, margin: 0 }}>相談フォームから、お気軽にご連絡ください。</p>
      </>
    );
  }

  return (
    <>
      <section style={{ padding: "40px 24px 32px", animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "72px", height: "72px", background: `linear-gradient(135deg, ${colors.green}, ${colors.greenDeep})`, borderRadius: "50%", color: colors.white, fontSize: "32px", boxShadow: "0 8px 28px rgba(27, 107, 58, 0.18)", animation: "bounceIn 0.5s ease" }}>✓</div>
        </div>
        <p style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "12px", color: colors.gold, letterSpacing: "0.2em", textAlign: "center", marginBottom: "8px" }}>DIAGNOSIS RESULT</p>
        <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 5vw, 1.75rem)", color: colors.ink, textAlign: "center", marginBottom: "32px" }}>診断結果</h2>

        <div style={{ background: colors.white, border: `${borderWidth} solid ${levelLabel === "高" ? colors.redAccent : colors.line}`, borderRadius: "16px", padding: "28px 24px", boxShadow: "0 4px 16px rgba(27, 107, 58, 0.06)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px solid ${colors.lineSoft}`, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "11px", color: colors.inkSub, letterSpacing: "0.2em" }}>警戒レベル</span>
            <span style={{ fontFamily: "'Shippori Mincho', serif", fontWeight: 700, fontSize: "clamp(2.25rem, 8vw, 2.75rem)", color: levelColor, lineHeight: 1 }}>{levelLabel}</span>
            <span style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "13px", color: colors.inkSub, marginLeft: "auto" }}>該当 <span style={{ fontSize: "16px", color: colors.ink }}>{yesCount}</span> / 8</span>
          </div>
          {message}
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ fontSize: "13px", color: colors.inkSub, background: "transparent", border: "none", cursor: "pointer", padding: "8px 4px", fontFamily: "'Noto Sans JP', sans-serif" }}>← 最後の質問に戻る</button>
          <button onClick={onReset} style={{ fontSize: "13px", color: colors.inkSub, textDecoration: "underline", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>最初からやり直す</button>
        </div>
      </section>

      <section style={{ background: `linear-gradient(180deg, ${colors.greenDeep} 0%, #155830 100%)`, color: colors.white, padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: colors.goldSoft, textTransform: "uppercase", fontWeight: 700, marginBottom: "16px", fontFamily: "'Zen Maru Gothic', sans-serif" }}>FOR THE NEXT MOVE</p>
        <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 900, fontSize: "clamp(1.375rem, 4.5vw, 1.625rem)", lineHeight: 1.6, marginBottom: "20px" }}>枠を超えた議論を、はじめたい。</h2>
        <p style={{ fontSize: "14.5px", opacity: 0.9, lineHeight: 1.95, maxWidth: "36rem", margin: "0 auto 32px" }}>
          NOU-SIDEプロジェクトでは、組合・支援機関・自治体・生産者をつなぐ場づくりをご相談いただけます。
        </p>
        <CtaButton label={ctaLabel} />
        <p style={{ marginTop: "14px", fontSize: "11px", opacity: 0.6 }}>NOU-SIDEの相談フォームへ移動します</p>
      </section>
    </>
  );
}

function CtaButton({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="/council-consultation"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: "15px",
        padding: "16px 32px",
        background: hover ? colors.cream : colors.white,
        color: colors.greenDeep,
        letterSpacing: "0.05em", transition: "all 0.2s ease", textDecoration: "none",
        WebkitTapHighlightColor: "transparent", cursor: "pointer", borderRadius: "999px",
        boxShadow: hover ? "0 8px 28px rgba(0, 0, 0, 0.18)" : "0 4px 16px rgba(0, 0, 0, 0.12)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {label}
      <span style={{ transition: "transform 0.2s", transform: hover ? "translateX(4px)" : "translateX(0)" }}>→</span>
    </a>
  );
}
