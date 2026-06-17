import { useState, useRef } from "react";
import { PageShell } from "../App";

const CHECK_ITEMS = [
  {
    id: "c1",
    label: (
      <>
        訪問・ヒアリングに時間がかかり、<strong>1日に回れる農家数に限界</strong>を感じている
      </>
    ),
  },
  {
    id: "c2",
    label: (
      <>
        ヒアリングで話を聞いてみないと、<strong>何を支援すべきかが見えてこない</strong>
      </>
    ),
  },
  {
    id: "c3",
    label: (
      <>
        部署をまたぐ相談を受けたとき、<strong>農家を待たせたり、別の担当に繋ぎ直す</strong>ことに申し訳なさを感じる
      </>
    ),
  },
  {
    id: "c4",
    label: (
      <>
        農家ごとに状況がバラバラで、<strong>比較や全体把握が難しい</strong>
      </>
    ),
  },
  {
    id: "c5",
    label: (
      <>
        「優良経営体は何が違うのか」を、<strong>数字で説明できる材料が手元にない</strong>
      </>
    ),
  },
  {
    id: "c6",
    label: (
      <>
        日々の業務に追われて、<strong>本来やりたい具体的な支援に時間を割けない</strong>
      </>
    ),
  },
];

const s = {
  greenDeep: "#2d4a3e",
  greenMid: "#5a7a5e",
  greenBg: "#f5f7f3",
  greenAccent: "#d4e0d2",
  ink: "#1f2a24",
  inkSoft: "#4a5550",
  inkMute: "#7a8580",
  paper: "#fafaf6",
  line: "#d8dfd5",
  lineSoft: "#e8ede5",
  warm: "#f9f6ee",
};

export default function SupportBurdenPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDiagnose = () => {
    setRevealed(true);
    setTimeout(() => {
      if (resultRef.current) {
        const y = resultRef.current.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  const count = checked.size;

  return (
    <PageShell>
      <div style={{ fontFamily: "'Noto Sans JP', sans-serif", color: s.ink, background: s.paper, lineHeight: 1.7 }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Hero */}
          <header style={{ textAlign: "center", marginBottom: "40px", paddingTop: "24px", position: "relative" }}>
            <div style={{ width: "40px", height: "1px", background: s.greenMid, margin: "0 auto 18px" }} />
            <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: s.greenMid, marginBottom: "18px", fontWeight: 500 }}>
              FOR JA &amp; SUPPORT STAFF
            </p>
            <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 600, color: s.greenDeep, lineHeight: 1.5, letterSpacing: "0.04em", marginBottom: "24px" }}>
              支援員の負担を、<br />仕組みで軽くする
            </h1>
            <p style={{ fontSize: "15px", color: s.inkSoft, lineHeight: 2, maxWidth: "620px", margin: "0 auto" }}>
              経験豊富な職員ほど、本来の支援以外の<br />作業に時間が取られている。<br />
              その構造的な課題に、<br />NOU-SIDEプロジェクトはAIで応えます。
            </p>
          </header>

          {/* Checklist */}
          <section>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "12px", letterSpacing: "0.3em", color: s.greenMid, marginBottom: "12px" }}>SELF CHECK</p>
              <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 600, color: s.greenDeep, letterSpacing: "0.04em", lineHeight: 1.6 }}>
                こんなお悩み、ありませんか？
              </h2>
            </div>

            <div style={{ background: s.paper, border: `1px solid ${s.line}`, padding: "24px clamp(20px, 4vw, 40px)", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", color: s.inkMute, marginBottom: "12px" }}>
                気になる項目にチェックを入れてください
              </p>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: "12px" }}>
                {CHECK_ITEMS.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <li key={item.id}
                      onClick={() => toggle(item.id)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "14px",
                        padding: "13px 0", borderBottom: `1px solid ${s.lineSoft}`,
                        cursor: "pointer", transition: "background 0.2s ease",
                        background: isChecked ? s.greenBg : "transparent",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0, marginTop: "2px",
                          width: "20px", height: "20px",
                          border: `1.5px solid ${s.greenMid}`,
                          background: isChecked ? s.greenDeep : s.paper,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isChecked && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span style={{ fontSize: "14px", color: s.ink, lineHeight: 1.65, flex: 1 }}>
                        {item.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div style={{ textAlign: "center", padding: "4px 0 0", fontSize: "11px", color: s.inkMute, letterSpacing: "0.05em" }}>
                当てはまった項目
                <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "14px", fontWeight: 600, color: s.greenDeep, margin: "0 3px" }}>{count}</span>
                ／6
              </div>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <button
                  onClick={handleDiagnose}
                  disabled={count === 0}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: count === 0 ? s.greenAccent : s.greenDeep,
                    color: count === 0 ? s.greenMid : "white",
                    border: "none", cursor: count === 0 ? "not-allowed" : "pointer",
                    fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700, fontSize: "15px",
                    padding: "14px 32px", borderRadius: "2px", letterSpacing: "0.05em",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>診断結果を見る</span>
                  <span>↓</span>
                </button>
                <div style={{ marginTop: "16px" }}>
                  <a href="/support-organizations" style={{ fontSize: "13px", color: s.inkMute, textDecoration: "none" }}>
                    ← 組合・支援機関の方へ トップに戻る
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Result */}
          {revealed && (
            <div ref={resultRef} style={{ marginTop: "40px" }}>
              <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 32px", background: s.warm, border: `1px solid ${s.line}` }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.35em", color: s.greenMid, fontWeight: 500, marginBottom: "20px" }}>DIAGNOSIS</p>
                <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 600, color: s.greenDeep, lineHeight: 1.55, letterSpacing: "0.04em", marginBottom: "32px" }}>
                  支援の前に、<br />整理できることがあります
                </h2>

                {[
                  <>こうしたお悩みの多くは、<br /><strong>支援に入る前の整理</strong>に負担が集中していることから生まれています。</>,
                  <>農家の悩みは、<br />一言では表せないことが少なくありません。</>,
                  <>経営の数字、作業の状況、今後の希望。<br />それらを短時間で聞き取り、整理することは、<br /><em style={{ fontStyle: "normal", color: s.inkMute }}>農家にも、支援員にも負担となります。</em></>,
                ].map((text, i) => (
                  <p key={i} style={{ fontSize: "15px", color: s.inkSoft, lineHeight: 1.95, marginBottom: "20px" }}>{text}</p>
                ))}

                <div style={{ width: "100%", height: "1px", background: s.greenAccent, margin: "32px 0" }} />

                <p style={{ fontSize: "13px", letterSpacing: "0.1em", color: s.greenMid, fontWeight: 500, marginBottom: "20px" }}>
                  NOU-SIDEプロジェクトでは、
                </p>

                {[
                  <>農家が入力したデータをもとに、<br /><strong>AIが支援前の整理</strong>を行います。</>,
                  <>支援員は、<br /><span style={{ fontWeight: 700, color: s.greenDeep }}>課題の輪郭が見えた状態</span>から、<br />具体的な支援に入ることができます。</>,
                ].map((text, i) => (
                  <p key={i} style={{ fontSize: "15px", color: s.inkSoft, lineHeight: 1.95, marginBottom: "20px" }}>{text}</p>
                ))}

                <p style={{ fontSize: "15px", color: s.greenDeep, fontWeight: 600, lineHeight: 1.95, marginBottom: 0 }}>
                  人が向き合う時間を、<br />より本質的な支援に使うための仕組みです。
                </p>
              </div>

              {/* CTA */}
              <div style={{ textAlign: "center", marginTop: "48px", padding: "48px 24px", background: s.greenDeep, color: "white" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.3em", opacity: 0.7, marginBottom: "16px" }}>NEXT STEP</p>
                <h2 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 600, lineHeight: 1.6, marginBottom: "12px" }}>
                  業務の整理について、<br />一緒に考えませんか。
                </h2>
                <p style={{ fontSize: "14px", opacity: 0.85, lineHeight: 2, marginBottom: "32px" }}>
                  どの部分から手をつけるか、状況を聞かせていただいた上でご提案します。
                </p>
                <a
                  href="/council-consultation"
                  style={{
                    display: "inline-block",
                    background: "white", color: s.greenDeep,
                    fontWeight: 700, fontSize: "15px", letterSpacing: "0.05em",
                    padding: "16px 40px", borderRadius: "2px", textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                >
                  相談してみる →
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </PageShell>
  );
}
