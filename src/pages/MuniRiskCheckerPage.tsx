import { useState, useRef } from "react";
import { PageShell } from "../App";

const INFRASTRUCTURE = [
  { id: "clinic",      label: "一般診療所",     icon: "🏥", threshold: 500,   category: "医療", critical: true  },
  { id: "dental",      label: "歯科診療所",     icon: "🦷", threshold: 500,   category: "医療", critical: false },
  { id: "post",        label: "郵便局",         icon: "📮", threshold: 500,   category: "生活", critical: false },
  { id: "grocery",     label: "食料品店",       icon: "🛒", threshold: 500,   category: "生活", critical: true  },
  { id: "nursing",     label: "介護福祉施設",   icon: "🏡", threshold: 500,   category: "福祉", critical: false },
  { id: "homecare",    label: "訪問介護",       icon: "🤝", threshold: 500,   category: "福祉", critical: false },
  { id: "hotel",       label: "旅館・ホテル",   icon: "🛖", threshold: 500,   category: "観光", critical: false },
  { id: "books",       label: "書籍・文具店",   icon: "📖", threshold: 1500,  category: "生活", critical: false },
  { id: "juku",        label: "学習塾",         icon: "📚", threshold: 4500,  category: "教育", critical: false },
  { id: "music",       label: "習い事教室",     icon: "🎵", threshold: 5500,  category: "教育", critical: false },
  { id: "bank",        label: "銀行・金融",     icon: "🏦", threshold: 6500,  category: "金融", critical: true  },
  { id: "daycare",     label: "通所介護",       icon: "♿", threshold: 6500,  category: "福祉", critical: false },
  { id: "fitness",     label: "娯楽施設",       icon: "🏋️", threshold: 6500, category: "生活", critical: false },
  { id: "hospital",    label: "一般病院",       icon: "🏨", threshold: 7500,  category: "医療", critical: true  },
  { id: "emergency",   label: "救急病院",       icon: "🚑", threshold: 9500,  category: "医療", critical: true  },
  { id: "carehome",    label: "介護老人施設",   icon: "🏥", threshold: 9500,  category: "福祉", critical: false },
  { id: "nursinghome", label: "有料老人ホーム", icon: "🏘️", threshold: 22500, category: "福祉", critical: false },
  { id: "supermarket", label: "大型スーパー",   icon: "🏬", threshold: 87500, category: "生活", critical: true  },
];

const getStage = (pop: number) => {
  if (pop >= 10000) return {
    id: "low", label: "緊急性「低」", emoji: "🟡",
    description: "主要インフラは今はある。ただし同規模の地域でも既に消えている施設があります。人口減少が続けば数年以内に緊急性「中」へ移行します。今から備えを始める段階です。",
    action: "予防的モニタリングと協議会の準備を推奨",
    border: "border-yellow-400", bg: "bg-yellow-50", text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    accentBar: "bg-yellow-400",
    ctaBorder: "border-yellow-300", ctaBg: "bg-yellow-50",
    ctaBtn: "bg-yellow-500 hover:bg-yellow-600 text-white",
    ctaTitle: "今は安定。でも、備えは今から。",
    ctaBody: "人口減少が続けば5〜10年で緊急性「中」へ移行する可能性があります。早めに選択肢を知っておくことが、将来の幅を広げます。",
    ctaLabel: "地域の状況について相談する →",
  };
  if (pop >= 3000) return {
    id: "mid", label: "緊急性「中」", emoji: "🟠",
    description: "銀行・病院・介護施設などが消滅リスクに入り始めています。同規模地域の約半数では既に失われた施設もあります。行政と支援機関の連携介入が急務な段階です。",
    action: "地域協議会の設置・支援機関との連携強化が急務",
    border: "border-orange-400", bg: "bg-orange-50", text: "text-orange-700",
    badge: "bg-orange-100 text-orange-800 border border-orange-300",
    accentBar: "bg-orange-400",
    ctaBorder: "border-orange-300", ctaBg: "bg-orange-50",
    ctaBtn: "bg-orange-500 hover:bg-orange-600 text-white",
    ctaTitle: "選択肢を増やすためにも、早めに動き出すことが大切です。",
    ctaBody: "地域協議会の設置と支援機関との連携強化が急務です。今から選択肢を整理しておくことを推奨します。",
    ctaLabel: "地域の状況について相談する →",
  };
  return {
    id: "high", label: "緊急性「高」", emoji: "🔴",
    description: "医療・金融・生活インフラの多くが存在確率50%を下回っています。既存の支援策では間に合わない段階です。",
    action: "抜本的な対応を今すぐ検討してください",
    border: "border-red-400", bg: "bg-red-50", text: "text-red-700",
    badge: "bg-red-100 text-red-800 border border-red-300",
    accentBar: "bg-red-500",
    ctaBorder: "border-red-300", ctaBg: "bg-red-50",
    ctaBtn: "bg-red-600 hover:bg-red-700 text-white",
    ctaTitle: "この地域は緊急対応が必要な段階です",
    ctaBody: "既存の支援策だけでは間に合わない段階に入っています。まずはご相談ください。",
    ctaLabel: "地域の状況について相談する →",
  };
};

const groupByCategory = (items: typeof INFRASTRUCTURE) =>
  items.reduce((acc: Record<string, typeof INFRASTRUCTURE>, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

export default function MuniRiskCheckerPage() {
  const [inputValue, setInputValue] = useState("");
  const [population, setPopulation] = useState<number | null>(null);
  const [diagnosed, setDiagnosed] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const diagnose = (pop: number) => {
    setPopulation(pop);
    setDiagnosed(null);
  };

  const handleDiagnose = () => {
    const pop = parseInt(inputValue, 10);
    if (!pop || pop <= 0) return;
    setPopulation(pop);
    setDiagnosed(pop);
    setTimeout(() => {
      if (resultRef.current) {
        const targetY = resultRef.current.getBoundingClientRect().top + window.scrollY - 24;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 1200;
        let startTime: number | null = null;
        const easeInOutQuad = (t: number) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
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

  const stage = diagnosed ? getStage(diagnosed) : null;
  const lost = diagnosed ? INFRASTRUCTURE.filter(i => diagnosed < i.threshold) : [];
  const surviving = diagnosed ? INFRASTRUCTURE.filter(i => diagnosed >= i.threshold) : [];
  const lostCritical = lost.filter(i => i.critical);
  const lostGroups = groupByCategory(lost);
  const survivingCount = population ? INFRASTRUCTURE.filter(i => population >= i.threshold).length : INFRASTRUCTURE.length;

  const presets = [
    { label: "500人", value: 500 },
    { label: "2,000人", value: 2000 },
    { label: "5,000人", value: 5000 },
    { label: "1万人", value: 10000 },
    { label: "3万人", value: 30000 },
  ];

  return (
    <PageShell>
      <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}
        className="min-h-screen bg-stone-50 text-stone-800 pb-40">

        <div className="max-w-2xl mx-auto px-4">

          {/* ヘッダー */}
          <div className="pt-5 pb-2 text-center">
            <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-300 text-stone-500 text-xs font-bold px-4 py-2 rounded-full mb-3 tracking-widest">
              国土交通省データに基づく存在確率分析
            </div>
            <h1 className="text-xl sm:text-2xl font-black mb-1 leading-tight tracking-tight text-stone-900">
              みなさんの自治体には、<br />
              <span className="text-emerald-700">いくつ残っていますか？</span>
            </h1>
            <p className="text-stone-500 text-xs leading-relaxed max-w-lg mx-auto mb-1">
              診療所・銀行・病院・売店——。人口規模に応じて、いつ・どんな生活インフラが消えるかを可視化します。
            </p>
            <div className="inline-block bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 mb-2">
              <p className="text-amber-800 text-xs leading-relaxed">
                国土交通省資料によると、同じ人口規模の自治体のうち
                <strong className="text-amber-900">約半数以上でこれらの生活インフラが存在しない</strong>ことが確認されています。
              </p>
            </div>
          </div>

          {/* アイコングリッド */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3 mb-2 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-stone-400 text-xs font-bold tracking-widest">
                {population ? "残存インフラ" : "対象インフラ一覧"}
              </p>
              <div className="flex items-center gap-3">
                {population && (
                  <span className="text-red-500 text-xs font-bold">
                    ✕ {INFRASTRUCTURE.filter(i => population < i.threshold).length}件 消滅リスク
                  </span>
                )}
                <span className="font-black text-base text-stone-700">
                  {survivingCount}
                  <span className="text-xs font-normal text-stone-400 ml-1">/ {INFRASTRUCTURE.length}件</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {INFRASTRUCTURE.map(item => {
                const isLost = population !== null && population < item.threshold;
                return (
                  <div
                    key={item.id}
                    title={`${item.label}（${item.threshold.toLocaleString()}人以上で存在確率50%）`}
                    style={{ transition: "opacity 0.7s ease, filter 0.7s ease", opacity: isLost ? 0.35 : 1 }}
                    className={`relative flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center ${!isLost ? "bg-stone-50 border border-stone-200" : ""}`}
                  >
                    {isLost && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                        <span className="text-stone-400 font-black" style={{ fontSize: "1.1rem" }}>×</span>
                      </div>
                    )}
                    <span style={{ fontSize: "1.25rem", lineHeight: 1, filter: isLost ? "grayscale(1)" : "none", transition: "filter 0.7s ease" }}>
                      {item.icon}
                    </span>
                    <p style={{ fontSize: "0.55rem", lineHeight: 1.2 }}
                      className={`font-medium w-full ${isLost ? "text-stone-400" : "text-stone-500"}`}>
                      {item.label}
                    </p>
                    {item.critical && !isLost && (
                      <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-red-400 rounded-full"></span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-2 justify-end">
              <div className="flex items-center gap-1 text-stone-400" style={{ fontSize: "0.6rem" }}>
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block"></span>
                特に重要
              </div>
              <div className="flex items-center gap-1 text-stone-400" style={{ fontSize: "0.6rem" }}>
                <span className="font-black text-sm leading-none">×</span>
                存在確率50%未満
              </div>
            </div>
          </div>

          {/* 入力エリア */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 pb-6 mb-4 shadow-sm">
            <label className="block text-stone-700 font-bold mb-2 text-xs tracking-wider">
              5年後のあなたの地域・自治体の人口を入力してください
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue ? Number(inputValue).toLocaleString() : ""}
                  onChange={(e) => setInputValue(e.target.value.replace(/[^0-9]/g, "").replace(/,/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleDiagnose()}
                  placeholder="例:3,500"
                  className="w-full bg-stone-50 border-2 border-stone-300 focus:border-emerald-500 text-stone-900 text-lg font-bold px-4 py-3 rounded-xl outline-none transition-colors placeholder-stone-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">人</span>
              </div>
              <button
                onClick={handleDiagnose}
                disabled={!inputValue}
                className="bg-emerald-700 hover:bg-emerald-600 disabled:bg-stone-200 disabled:text-stone-400 text-white font-black px-5 py-3 rounded-xl transition-all text-sm tracking-wider shadow-sm"
              >
                診断
              </button>
            </div>

            <div className="mt-3">
              <p className="text-stone-400 text-xs mb-1.5 font-bold">▸ クイック選択</p>
              <div className="flex flex-wrap gap-1.5">
                {presets.map(p => (
                  <button key={p.value}
                    onClick={() => { setInputValue(String(p.value)); diagnose(p.value); }}
                    className={`border px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      population === p.value
                        ? "bg-emerald-700 border-emerald-600 text-white"
                        : "bg-stone-100 border-stone-300 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
                    }`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 詳細結果エリア */}
          {diagnosed && diagnosed === population && stage && (
            <div ref={resultRef} className="pb-16 space-y-5">

              {/* ステージバッジ */}
              <div className={`rounded-2xl border-2 ${stage.border} ${stage.bg} p-6 relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full ${stage.accentBar}`}></div>
                <div className="flex items-start gap-4 pl-3">
                  <div className="text-4xl leading-none">{stage.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`font-black text-xl ${stage.text}`}>{stage.label}</span>
                      <span className="text-stone-400 font-medium">人口 {population.toLocaleString()}人</span>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed mb-3">{stage.description}</p>
                    <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${stage.badge}`}>
                      推奨アクション:{stage.action}
                    </div>
                  </div>
                </div>
              </div>

              {/* 消滅リスクインフラ */}
              {lost.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
                    <span className="text-red-500 text-xl">⚠️</span>
                    <div>
                      <h2 className="font-black text-red-700 text-lg">
                        存在確率50%を下回るインフラ
                        <span className="ml-2 bg-red-100 text-red-700 border border-red-200 text-xs px-2 py-0.5 rounded-full font-bold">{lost.length}件</span>
                      </h2>
                      <p className="text-red-400 text-xs mt-0.5">同規模地域の半数以上で既に消滅しているインフラです</p>
                    </div>
                  </div>
                  {lostCritical.length > 0 && (
                    <div className="px-6 py-4 border-b border-stone-100">
                      <p className="text-xs font-black text-red-500 tracking-widest mb-3">⚡ 特に深刻(生活・医療・経済の根幹)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {lostCritical.map(item => (
                          <div key={item.id} className="bg-red-50 border border-red-200 rounded-xl px-3 py-3 flex items-center gap-2">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <p className="text-red-700 font-bold text-xs leading-tight">{item.label}</p>
                              <p className="text-red-400 text-xs">{item.threshold.toLocaleString()}人以上で50%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="px-6 py-4 space-y-4">
                    {Object.entries(lostGroups).map(([cat, items]) => {
                      const nonCritical = items.filter(i => !i.critical);
                      if (nonCritical.length === 0) return null;
                      return (
                        <div key={cat}>
                          <p className="text-xs font-bold text-stone-400 tracking-widest mb-2">{cat}</p>
                          <div className="flex flex-wrap gap-2">
                            {nonCritical.map(item => (
                              <div key={item.id} className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                                <span>{item.icon}</span>
                                <span className="text-stone-600 font-medium">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 現存インフラ */}
              {surviving.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="border-b border-stone-100 px-6 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-stone-400 text-xl">📋</span>
                      <h2 className="font-black text-stone-700 text-lg">
                        あなたの自治体に、今は残っているインフラ
                        <span className="ml-2 bg-stone-100 text-stone-500 border border-stone-200 text-xs px-2 py-0.5 rounded-full font-bold">{surviving.length}件</span>
                      </h2>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <p className="text-amber-800 text-xs leading-relaxed">
                        <strong className="text-amber-900">「今はある」は「このまま続く」ではありません。</strong><br />
                        人口減少が続けば、あなたの自治体も同じ道をたどる可能性があります。
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex flex-wrap gap-2">
                    {surviving.map(item => (
                      <div key={item.id} className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 flex items-center gap-2 text-sm opacity-75">
                        <span>{item.icon}</span>
                        <span className="text-stone-500 font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className={`border-2 ${stage.ctaBorder} ${stage.ctaBg} rounded-2xl p-6 text-center`}>
                <p className={`font-black text-lg mb-2 ${stage.text}`}>{stage.ctaTitle}</p>
                <p className="text-stone-500 text-sm mb-5 leading-relaxed">{stage.ctaBody}</p>
                <a
                  href="/council-consultation"
                  className={`inline-block ${stage.ctaBtn} font-black px-8 py-3.5 rounded-full transition-all shadow-sm text-sm tracking-wider`}
                >
                  {stage.ctaLabel}
                </a>
              </div>

              <div className="text-center text-stone-400 text-xs leading-relaxed px-4 pb-4">
                ※本診断は国土交通省「都市圏参考資料」の存在確率50%基準を元に作成しています。個別自治体の実態とは異なる場合があります。
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
