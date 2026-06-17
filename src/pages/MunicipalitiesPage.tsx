import { useState, useMemo, useRef } from "react";
import { PageShell } from "../App";

export default function MunicipalitiesPage() {
  const [showDetail, setShowDetail] = useState(false);
  const [showAppExplanation, setShowAppExplanation] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [diagnosed, setDiagnosed] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const appExplanationRef = useRef<HTMLElement>(null);

  const checkItems = [
    { id: "q1", label: "人口は減少している" },
    { id: "q2", label: "消滅可能性のある生活インフラと、その消滅時期までは具体的に把握できていない" },
    { id: "q3", label: "耕作放棄地や、借り手のつかない空き家が増えている" },
    { id: "q4", label: "移住対策は行っているが、人口減少を反転させるには至っていない" },
    { id: "q5", label: "首都圏の移住希望者と接するが、実際の定住までには複数のハードルがあると感じる" },
    { id: "q6", label: "それらのハードルは、自治体だけでは解消しきれないと感じている" },
    { id: "q7", label: "議会や住民への説明で、危機の客観的な根拠データが不足していると感じる" },
    { id: "q8", label: "民間主導の取り組みに対して、自治体として正しい距離感で適切な関係性を築くことに難しさを感じる" },
    { id: "q9", label: "地域内で、統廃合や賦課金値上げを検討している組合がある" },
  ];

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    if (diagnosed) setDiagnosed(false);
  };

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  const smoothScrollTo = (ref: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    setTimeout(() => {
      if (ref.current) {
        const targetY = ref.current.getBoundingClientRect().top + window.scrollY - 24;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 800;
        let startTime: number | null = null;
        const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          window.scrollTo(0, startY + distance * easeInOutQuad(progress));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, 150);
  };

  const handleDiagnose = () => {
    setDiagnosed(true);
    smoothScrollTo(resultRef);
  };

  const handleShowAppExplanation = () => {
    setShowAppExplanation(true);
    smoothScrollTo(appExplanationRef);
  };

  const judgement = useMemo(() => {
    if (checkedCount <= 2) {
      return {
        level: "低",
        levelColor: "emerald" as const,
        title: "新しいアプローチの必要性:低",
        subtitle: "現状の延長線上で進められる段階",
        desc: "現状認識を整理し、これまでの取り組みを丁寧に深める段階です。NOU-SIDEプロジェクトの構想全体は、参考情報としてご活用ください。",
      };
    }
    if (checkedCount <= 5) {
      return {
        level: "中",
        levelColor: "amber" as const,
        title: "新しいアプローチの必要性:中",
        subtitle: "従来の枠組みに加え、新しい視点が議論を深める段階",
        desc: "庁内の議論は始まっているものの、根拠データや外部の視点があると、合意形成が進みやすい段階です。まずは推計人口での診断から始めることをおすすめします。",
      };
    }
    return {
      level: "高",
      levelColor: "rose" as const,
      title: "新しいアプローチの必要性:高",
      subtitle: "従来の枠組みでは届きにくい段階",
      desc: "自治体単独での対応では、再生プロセスに必要な時間軸・専門性・関係性のいずれかが不足する可能性があります。新しい枠組みでの議論を前提に、診断と構想設計を進めることを強く推奨します。",
    };
  }, [checkedCount]);

  const judgementBg = {
    emerald: "from-emerald-50 to-emerald-100 border-emerald-300",
    amber: "from-amber-50 to-amber-100 border-amber-300",
    rose: "from-rose-50 to-rose-100 border-rose-300",
  };
  const judgementText = {
    emerald: "text-emerald-800",
    amber: "text-amber-800",
    rose: "text-rose-800",
  };
  const judgementAccent = {
    emerald: "bg-emerald-700",
    amber: "bg-amber-600",
    rose: "bg-rose-700",
  };

  return (
    <PageShell>
      <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}
        className="min-h-screen bg-white text-stone-800">

        {/* PART 1: ヒーロー */}
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-emerald-300 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-emerald-400 blur-3xl"></div>
          </div>
          <div className="relative max-w-3xl mx-auto px-5 pt-12 pb-14 sm:pt-16 sm:pb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest">
              自治体・行政ご担当者さまへ
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-5 leading-[1.3] tracking-tight">
              地域の未来へ、<br />
              <span className="text-emerald-200">新たなアプローチ</span>を<br className="sm:hidden" />してみませんか?
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed max-w-xl">
              まずは、あなたの自治体の現在地を確認することから。<br />
              <strong className="text-white">1分の簡易セルフチェック</strong>で、
              新しい枠組みの議論を始めるべきタイミングが見えます。
            </p>
          </div>
        </section>

        {/* PART 2: 簡易あるある診断 */}
        <section className="bg-gradient-to-b from-white to-stone-50 py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-0.5 bg-emerald-700"></div>
              <p className="text-emerald-700 text-xs font-black tracking-[0.2em]">簡易セルフチェック</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-4 leading-tight">
              皆さんの自治体では、<br className="sm:hidden" />
              <span className="text-emerald-700">いくつ当てはまります</span>か?
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8">
              <strong className="text-stone-900">該当項目が多いほど、新しいアプローチが効果的となる可能性が高まります。</strong>
            </p>

            <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden mb-4">
              <div className="bg-emerald-800 text-white px-5 py-3.5">
                <p className="font-black text-sm tracking-wider">あなたの自治体・地域の現状</p>
              </div>
              <div className="divide-y divide-stone-100">
                {checkItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3.5 transition-colors ${
                      checked[item.id] ? "bg-emerald-50/60" : "bg-white hover:bg-stone-50"
                    }`}
                  >
                    <span className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      checked[item.id] ? "bg-emerald-700 border-emerald-700" : "bg-white border-stone-300"
                    }`}>
                      {checked[item.id] && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-stone-400 text-xs font-bold tracking-wider mb-0.5">Q{idx + 1}</p>
                      <p className={`text-sm leading-relaxed ${checked[item.id] ? "text-stone-900 font-bold" : "text-stone-700"}`}>
                        {item.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 flex items-center justify-between">
                <p className="text-stone-500 text-xs font-bold tracking-wider">CHECKED</p>
                <p className="text-stone-900 font-black">
                  <span className="text-2xl text-emerald-700">{checkedCount}</span>
                  <span className="text-sm text-stone-400"> / {checkItems.length}</span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={handleDiagnose}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 rounded-2xl transition-all text-base tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                {diagnosed ? "診断結果を再表示する" : "診断結果を見る"}
                <span aria-hidden="true">→</span>
              </button>
              <p className="text-stone-400 text-xs text-center mt-2">
                ※ チェックなしでも診断できます
              </p>
            </div>

            {diagnosed && judgement && (
              <div ref={resultRef} className="space-y-3">
                <div className={`bg-gradient-to-br ${judgementBg[judgement.levelColor]} border-2 rounded-2xl p-5 sm:p-6 transition-all`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 ${judgementAccent[judgement.levelColor]} text-white rounded-full flex flex-col items-center justify-center shadow-md`}>
                      <span className="text-[10px] font-bold leading-none mb-0.5">LEVEL</span>
                      <span className="text-lg sm:text-xl font-black leading-none">{judgement.level}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black tracking-[0.2em] ${judgementText[judgement.levelColor]} mb-1`}>DIAGNOSIS</p>
                      <p className={`text-base sm:text-lg font-black ${judgementText[judgement.levelColor]} mb-1.5 leading-tight`}>{judgement.title}</p>
                      <p className="text-stone-700 font-bold text-xs sm:text-sm mb-2 leading-snug">{judgement.subtitle}</p>
                      <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">{judgement.desc}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900 rounded-2xl p-5 sm:p-7 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                  <div className="relative">
                    <p className="text-emerald-300 text-xs font-black tracking-[0.25em] mb-2">NEXT STEP</p>
                    <p className="text-white font-black text-lg sm:text-xl mb-3 leading-snug">
                      診断結果を、次の議論につなげませんか?
                    </p>
                    <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed mb-2.5">
                      人口減少、担い手不足、支援体制の限界。こうした課題は、自治体だけで抱えるよりも、農家・組合・支援機関と共有しながら整理することで、次の打ち手が見えやすくなります。
                    </p>
                    <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed mb-4">
                      <strong className="text-white">NOU-SIDEプロジェクト</strong>では、診断結果をもとに、地域の状況に合わせた進め方をご説明します。
                    </p>
                    <a
                      href="/council-consultation"
                      className="w-full bg-white hover:bg-emerald-50 text-emerald-900 font-black px-6 py-3.5 rounded-2xl transition-all text-sm tracking-wider shadow-md flex items-center justify-center gap-2"
                    >
                      まずは話を聞いてみる
                      <span aria-hidden="true">→</span>
                    </a>

                    {!showAppExplanation && (
                      <div className="mt-4 pt-4 border-t border-emerald-700/60">
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <span className="text-emerald-300 text-base leading-none mt-0.5">🔍</span>
                          <div className="flex-1">
                            <p className="text-emerald-100 font-bold text-sm mb-0.5">さらに具体的に検証したい方へ</p>
                            <p className="text-emerald-200/80 text-xs leading-relaxed">
                              5年後の推計人口を入力して、その時点で<strong className="text-emerald-50">消滅する可能性のある施設</strong>を確認することもできます。
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleShowAppExplanation}
                          className="w-full bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-50 font-bold px-5 py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                        >
                          5年後を見てみる
                          <span aria-hidden="true">↓</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PART 3: 推計人口診断アプリの説明 */}
        {showAppExplanation && (
          <section ref={appExplanationRef} className="bg-stone-50 py-14 sm:py-16 border-t border-stone-200">
            <div className="max-w-3xl mx-auto px-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-0.5 bg-emerald-700"></div>
                <p className="text-emerald-700 text-xs font-black tracking-[0.2em]">推計人口診断について</p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-5 leading-tight">
                お手元の<span className="text-emerald-700">人口ビジョン</span>を、<br className="hidden sm:inline" />
                診断アプリに入力するだけ。
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                農村再生は、議論開始から次世代農家の定着まで<strong className="text-stone-900">5〜7年</strong>かかります。
                だから「今」ではなく、<strong className="text-stone-900">その時点の推計人口</strong>で診断します。
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { step: "STEP1", title: "人口ビジョンを開く", body: "各自治体が策定している人口ビジョン・将来推計から、5年後・7年後・10年後の推計人口を確認します。" },
                  { step: "STEP2", title: "診断アプリに入力", body: "推計人口を入力すると、同じ人口規模の自治体で消えているインフラが一覧表示されます。" },
                  { step: "STEP3", title: "緊急性判定で次のアクションを把握", body: "🟡緊急性「低」 🟠緊急性「中」 🔴緊急性「高」の3段階で、その人口規模に応じた具体的な打ち手が示されます。" },
                ].map(({ step, title, body }) => (
                  <div key={step} className="bg-white border border-stone-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-emerald-700 text-white text-xs font-black rounded-full tracking-wider">{step}</span>
                    <div className="flex-1 pt-1">
                      <p className="font-black text-stone-900 text-sm mb-1">{title}</p>
                      <p className="text-stone-600 text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <p className="text-amber-900 text-xs leading-relaxed">
                  <strong>💡 効果的な使い方:</strong> 5年後・7年後・10年後を続けて入力すると、
                  <strong>「どのインフラが、いつ消えるか」のタイムライン</strong>が見えます。
                </p>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowDetail(!showDetail)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-stone-100 transition-colors"
                >
                  <span className="text-stone-700 text-sm font-bold">
                    {showDetail ? "▼" : "▶"} この診断の根拠データについて
                  </span>
                  <span className="text-stone-400 text-xs">国土交通省資料</span>
                </button>
                {showDetail && (
                  <div className="mt-2 bg-white border border-stone-200 rounded-xl p-5 text-stone-600 text-xs leading-relaxed space-y-2">
                    <p>本診断は<strong className="text-stone-900">国土交通省「都市圏参考資料」</strong>の存在確率50%基準（三大都市圏を除く市区町村データ）を根拠としています。</p>
                    <p>「存在確率50%」とは、ある人口規模の自治体のうち半数以上で、そのインフラが既に存在しなくなっている水準を指します。</p>
                    <p className="text-stone-500">個別の自治体の実態とは異なる場合があります。あくまで「全国平均として、この規模になると何が失われやすいか」の傾向把握にお使いください。</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-3xl p-8 sm:p-10 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="relative">
                  <p className="text-emerald-200 text-xs font-black tracking-[0.3em] mb-3">DIAGNOSIS</p>
                  <p className="text-white font-black text-2xl sm:text-3xl mb-3 leading-tight">
                    推計人口で、<br className="sm:hidden" />診断を始める
                  </p>
                  <p className="text-emerald-100 text-sm mb-7 leading-relaxed">
                    入力は1分。5〜10年後のあなたの自治体が、どの緊急性レベルにあるかが見えます。
                  </p>
                  <a
                    href="/municipalities/facility-check"
                    className="inline-block bg-white hover:bg-emerald-50 text-emerald-800 font-black px-10 py-4 rounded-full transition-all text-sm tracking-wider shadow-md w-full sm:w-auto text-center"
                  >
                    診断アプリを開く →
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
