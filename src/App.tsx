import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import FarmersPage from "./pages/FarmersPage";
import FarmersCheckPage from "./pages/FarmersCheckPage";
import FarmersSuccessionPage from "./pages/FarmersSuccessionPage";
import SupportOrganizationsPage from "./pages/SupportOrganizationsPage";
import SupportNextGenPage from "./pages/SupportNextGenPage";
import SupportBurdenPage from "./pages/SupportBurdenPage";
import MunicipalitiesPage from "./pages/MunicipalitiesPage";
import MuniRiskCheckerPage from "./pages/MuniRiskCheckerPage";
import CouncilConsultationPage from "./pages/CouncilConsultationPage";
import ContactPage from "./pages/ContactPage";

// ── Types ─────────────────────────────────────────────────────────────────────

type Figure = {
  src: string;
  alt: string;
};

type AccordionItem = {
  title: string;
  image: string;
  imageAlt: string;
};

type LPSection = {
  id: string;
  title: string;
  subtitle?: string;
  body: string[];
  image?: string;
  imageAlt?: string;
  steps?: string[];
  summaryImage?: string;
  summaryImageAlt?: string;
  summary?: string;
  accordionLabel?: string;
  accordionItems?: AccordionItem[];
  closingNote?: string;
};

type DetailSectionData = {
  id: string;
  number: number;
  title: string;
  body: string[];
  image?: string;
  imageAlt?: string;
  placeholderLabel?: string;
};

// 改行機会(<wbr>)を挿入する。「|」は明示的な改行ポイント（出力からは除去）。
// 句読点（、。」）の直後にも改行機会を入れる。
// スマホ縦の word-break: keep-all 時に、自然な位置（文の区切り）で折り返すための補助。
// PC・スマホ横では keep-all が無効なので <wbr> は実質的に影響しない。
function jpWrap(text: string): ReactNode {
  const out: ReactNode[] = [];
  const tokens = text.split("|");
  tokens.forEach((tok, ti) => {
    const parts = tok.split(/(?<=[、。」])/);
    parts.forEach((part, i) => {
      out.push(part);
      if (i < parts.length - 1) out.push(<wbr key={`${ti}-${i}`} />);
    });
    if (ti < tokens.length - 1) out.push(<wbr key={`b${ti}`} />);
  });
  return out;
}

// ── メインLP セクション（Section 2–6） ─────────────────────────────────────────

const lpSections: LPSection[] = [
  {
    id: "section-02",
    title: "人が減るほど、地域を支える力は|弱くなります。",
    body: [
      "人が減ると、地域を支える力も魅力も弱まっていきます。",
      "地域の暮らしや仕組みは、すべて人の手で支えられているからです。",
      "現在も人口減少が止まらないのは、これまでの対策が届きにくい場所に、まだ課題が残っているからです。",
      "だからこそ、地域の力がまだ残っている今のうちに、再生に取り組む必要があります。",
    ],
    image: "/images/lp/section3-hero-infra-grid.webp",
    imageAlt: "買い物・医療・教育・交通・通信・金融・生活支援・ガソリンスタンドの8つの生活インフラを示す図",
    summary: "▶ 力が残っているうちに、次の一手を整えることが大切です。",
    accordionLabel: "課題が残りやすい場所を詳しく見る",
    accordionItems: [
      { title: "早めの対策が必要な理由", image: "/images/lp/section2-accordion-infra-decline.webp", imageAlt: "生活インフラが減るほど農村再生が難しくなることを示す図" },
      { title: "課題が残りやすい場所", image: "/images/lp/section2-accordion-uncovered-roles.webp", imageAlt: "農家・組合・自治体の各業務のあいだに残りやすい課題を示す図" },
    ],
  },
  {
    id: "section-03",
    title: "次世代に選ばれる地域は、何が違うのか。",
    subtitle: "その違いは、地域の「将来性」にあります。",
    body: [
      "農地や補助金だけでは、判断材料として足りません。",
      "知りたいのは収入だけではありません。住まい、教育、医療、もしものときの備え。そして、農地や技術を引き継げるか。暮らし全体が成り立つかどうかです。",
      "「ここでやっていける」と思える判断材料を、地域がそろえておく必要があります。",
    ],
    image: "/images/lp/section3-hero-smartphone-couple.webp",
    imageAlt: "都会にいる次世代が地域の情報をスマートフォンで確認しているイラスト",
    summary: "▶ 稼ぎ・暮らし・備えの3つをそろえることが、次世代の判断につながります。",
    accordionLabel: "判断につながる見通しを詳しく見る",
    accordionItems: [
      { title: "就農判断で、もう一歩見えた方がよいこと", image: "/images/lp/section4-accordion-judgment-factors.webp", imageAlt: "経営の数字・暮らしの条件・地域との関係の3つが見えると就農判断につながることを示す図" },
      { title: "稼ぎ・暮らし・備えで見る", image: "/images/lp/section3-accordion-earn-live-prepare.webp", imageAlt: "次世代が知りたい情報は、稼ぎ・暮らし・備えの3つに整理できる" },
      { title: "認知・判断・行動で見る、選ばれる地域の違い", image: "/images/lp/section2-accordion-recognition-flow.webp", imageAlt: "認知・判断・行動の3ステップで選ばれる地域の違いを示す図" },
      { title: "判断できる導線を見る", image: "/images/lp/section3-accordion-journey.webp", imageAlt: "選ばれる地域には、次世代が「判断できる導線」が整っている" },
      { title: "伸びていく道筋まで見える条件を見る", image: "/images/lp/section4-accordion-growth-path.webp", imageAlt: "始められる条件に加えて、伸びていく道筋まで見える" },
    ],
  },
  {
    id: "section-06",
    title: "地域の将来性には、何が必要か。",
    subtitle: "将来性に必要なのは、実行する当事者の「納得感」です。",
    body: [
      "地域の将来性は、すばらしい環境が整っていることがすべてではありません。",
      "地域の課題は、解決へ進もうとすれば、役割分担や費用、既存の仕組みとの調整、現場の負担など、新たな課題が生まれます。",
      "だからこそ必要なのは、関係者が本音を出し合い、建設的な協議を通じて、納得できる形で具体的な実行へ進められる体制です。",
      "なかでも大切なのは、地域の未来を担う次世代が、その地域と自分自身の未来に可能性を見いだせるかどうかです。\n納得がなければ、実行にも継続にもつながらないからです。",
      "関係者が同じ前提に立って話せる場があり、そこで出た意見が次の行動につながっていく。その積み重ねが、次世代の「ここでやっていける」という判断を支え、地域の未来を動かし、その将来性をつくっていきます。",
      "NOU-SIDEは、そのための協議と合意形成を支えます。",
    ],
    summaryImage: "/images/lp/section5-body-village-charm.webp",
    summaryImageAlt: "四位一体でつくる村の魅力——ベテラン農家・組合・支援機関・自治体・次世代の担い手が連携して次世代に選ばれる条件を整えることを示す図",
    summary: "▶ 実行する当事者の納得が、地域施策の実行力と継続性を左右します。",
    accordionLabel: "合意形成の仕組みを詳しく見る",
    accordionItems: [
      { title: "誰の仕事でもない課題こそ、地域の当事者が話し合う場が必要（協議の場）", image: "/images/lp/section5-accordion-community-discussion.webp", imageAlt: "農家・組合・自治体それぞれが単独では動かしにくい課題を、本音で話し合う地域協議の場が合意形成と実行につなげることを示す図" },
      { title: "実行する当事者を議論に入れることが大切（参加者）", image: "/images/lp/section5-accordion-nextgen-consensus.webp", imageAlt: "当事者不在の議論と次世代が入る協議の比較図。次世代に選ばれる地域は、当事者を交えた建設的な協議ができる。" },
      { title: "次世代の議論は、当事者である次世代の\"納得\"が不可欠（協議の出口）", image: "/images/lp/section5-accordion-consensus.webp", imageAlt: "関係者が円卓で協議している図解。実行する当事者の納得感は、その将来性を大きく左右する。" },
    ],
  },
  {
    id: "section-07",
    title: "将来性が見えると、可能性や選択肢が広がる。",
    subtitle: "未来が見える地域には、関わる相手が広がっていきます。",
    body: [
      "就農までの道筋や成長の可能性、生産・供給体制、地域内の連携。こうした情報が見える形に整うほど、次世代は自分の将来を描きやすくなり、企業は事業や連携の可能性を判断しやすくなります。",
      "大切なのは、将来性があると伝えることではありません。関わる相手が、自ら将来性を判断できる状態をつくることです。",
      "地域の未来が見える形になるほど、就農や移住だけでなく、販路開拓、企業連携、雇用、投資など、つながれる相手と可能性は広がっていきます。",
      "NOU-SIDEは、地域に残る力と進む方向を整理し、人・企業・資金が関わるための判断材料を、地域とともに整えます。",
    ],
    image: "/images/lp/section7-growing-future-v2.webp",
    imageAlt: "次世代が地域に定着し、計画的な行動が周囲の信頼と協力を生むことで、地域の新たな将来性へと繋がっていくことを示すイラスト",
    summary: "▶ 地域の未来が見える形になるほど、関わる相手と可能性は広がっていきます。",
    accordionLabel: "可能性が広がる仕組みを詳しく見る",
    accordionItems: [
      { title: "将来性が見える地域に、人も企業も資金も集まる", image: "/images/lp/section6-accordion-future-visibility.webp", imageAlt: "将来性が見える地域に人・企業・資金が集まる仕組みを示す図" },
      { title: "地域側の覚悟が、都市側の相手を変える", image: "/images/lp/section6-accordion-partner-depth.webp", imageAlt: "地域側の整える範囲が広がるほど、つながれる都市側の相手も深くなることを示す図" },
    ],
  },
  {
    id: "section-04",
    title: "地域ごとに、やるべきことはそれぞれ違う。",
    subtitle: "大切なのは、取組みの有無ではなく、次世代が判断し、動ける状態まで整っているか。",
    body: [
      "支援策も、相談窓口も、協議の場もあり、農家、組合・支援機関、自治体が、それぞれの立場で取り組んでいる地域も少なくありません。",
      "もちろん、その途中で止まってしまっている地域も少なくありません。",
      "そして、取り組んでいることと、次世代が本当に判断できる状態になっていることは、同じではありません。",
      "次世代が必要な情報を整えられるか。そして、その情報に気づけるか。この地域で暮らし、農業を続けられる見通しが立つか。次の一歩へ進めるだけの具体性があるか。",
      "NOU-SIDEは、地域にある取組みや機能を見立て、次世代が認知し、判断し、行動できる状態へ整えるための段取りを支えます。",
    ],
    image: "/images/lp/section4-hero-current-position.webp",
    imageAlt: "地域ごとに現在地は異なっている。知っている・やっている・できているの3段階を示す図",
    accordionLabel: "見える状態に整える条件を詳しく見る",
    accordionItems: [
      { title: "地域によって、必要な一歩は違います", image: "/images/lp/section4-accordion-region-differs.webp", imageAlt: "地域の機能・余力と見せられる中身の2軸で、地域ごとに必要な一歩が異なることを示す図" },
      { title: "地域側にも、移住希望者側にも本音がある", image: "/images/lp/section4-accordion-honest-intentions.webp", imageAlt: "地域側・移住希望者側それぞれの建前と本音の違いを示す図" },
      { title: "空き農地があっても、すぐに受け入れできるとは限らない", image: "/images/lp/section4-accordion-vacant-farmland.webp", imageAlt: "空き農地の受け入れに関わる隣地作物・農薬ドリフト・水源水利など6つの条件を示す図" },
      { title: "議論の難関——地域全体でつなぐ議論が必要になる", image: "/images/lp/section4-accordion-discussion-barrier.webp", imageAlt: "農家・組合・支援機関・自治体それぞれの守備範囲と本音・限界点、議論の難関を示す図" },
    ],
  },
  {
    id: "section-09",
    title: "総論の賛成を、実行できる各論へ。",
    subtitle: "本音と数字をそろえ、地域が納得して次の一歩を選べる状態へ整える。",
    body: [
      "「次世代の担い手が必要だ」という総論には、多くの人が賛成できます。",
      "けれど、実行の段階では、地域内の関係性が複雑に絡み合います。",
      "農家にも組合・支援機関にも、自治体にも、それぞれの力には限界があります。",
      "また、小さな地域では、お互いの事情が見えているからこそ、強く言えないことがあります。無理強いはできない、けれど言わなければ課題は残ったままになる。しかし、必要性を訴えるだけでは、議論は前に進まず解決には至らない。",
      "地域には、残したい知恵や仕組みがある一方で、次世代が続けられる形に変えたほうがいいものもあります。\n過去を否定する話ではなく、これからどうするかを、地域で決める話です。",
      "NOU-SIDEは、立場ごとの本音に加え、再生産価格・出荷量・施設維持費といった数字をもとに、複雑に絡み合う論点を整理します。感情論でも慣習論でもなく、続けられる条件を見える形に整え、地域が答えを選べる状態をつくります。",
    ],
    image: "/images/lp/section9-honne-numbers-main.webp",
    imageAlt: "本音と数字を整えて、次の一歩へつなげる。農家・組合・自治体が地図と資料を囲んで対話し、NOU-SIDEが論点を整理して地域が判断できる状態を整えることを示すイラスト",
    summary: "▶ 決めるのは地域です。NOU-SIDEは、決めるための材料を整えます。",
    accordionLabel: "NOU-SIDEの整理プロセスを詳しく見る",
    accordionItems: [
      {
        title: "本音と数字をそろえ、次の一歩へつなげる流れを見る",
        image: "/images/lp/section9-honne-numbers-bridge.webp",
        imageAlt: "地域の中にある見えにくい負担を、NOU-SIDEが本音を聞き数字をそろえることで橋渡しし、再生産条件や役割分担が見える「次の一歩へ進める状態」へつなげることを示す図",
      },
      {
        title: "地域が自ら動ける状態をつくる",
        image: "/images/lp/section7-hero-nouside-essence.webp",
        imageAlt: "NOU-SIDEの本質を示すイラスト",
      },
      {
        title: "三者が持ち込むもの・返るものを見る",
        image: "/images/lp/section6-accordion-input-return.webp",
        imageAlt: "農家・組合・自治体の三者がNOU-SIDEに持ち込むもの、返るものの関係図",
      },
    ],
    closingNote: "まずは、地域の本音・数字・役割を一緒に見立てるところから始めませんか。",
  },
];

// ── 入口カード（Section 7） ────────────────────────────────────────────────────

const entranceCards = [
  {
    href: "/farmers",
    label: "農家の方へ",
    description: "経営改善、相談整理、事業承継を通じて、続けられる農業への道筋を一緒に考えます。",
    cta: "農家として相談したい",
  },
  {
    href: "/support-organizations",
    label: "組合・支援機関の方へ",
    description: "相談の前捌き、論点整理、記録共有を通じて、本来の支援に集中できる体制づくりを支えます。",
    cta: "支援する立場で話を聞きたい",
  },
  {
    href: "/municipalities",
    label: "自治体の方へ",
    description: "地域課題の見える化、次世代対策、協議の場づくりを通じて、施策につながる判断材料を整えます。",
    cta: "自治体として検討を始めたい",
  },
  {
    href: "/outside-region",
    label: "地域外の方・お問い合わせ",
    description: "地域外からの参画、協業、移住希望、企業・金融機関・専門家からの相談、一般問い合わせはこちらから。",
    cta: "地域の外から関わりたい",
  },
];

// ── ヘッダーナビ用リンク ───────────────────────────────────────────────────────

const ctaLinks = [
  { href: "/farmers", label: "農家の方へ" },
  { href: "/support-organizations", label: "組合・支援機関の方へ" },
  { href: "/municipalities", label: "自治体の方へ" },
  { href: "/outside-region", label: "地域外の方・お問い合わせ" },
  { href: "/approach", label: "詳しく読む" },
];

// ── プレースホルダーページ ────────────────────────────────────────────────────

const placeholderPages: Record<
  string,
  { title: string; message: string; futureItems?: string[]; councilLink?: boolean; contactLink?: boolean }
> = {
  "/support-organizations": {
    title: "組合・支援機関の方へ",
    message: "このページは準備中です。",
    futureItems: ["負担軽減", "次世代対策", "前捌き支援"],
    contactLink: true,
  },
  "/municipalities": {
    title: "自治体の方へ",
    message: "このページは準備中です。",
    futureItems: ["地域診断", "次世代対策", "協議の場づくり"],
    contactLink: true,
  },
  "/outside-region": {
    title: "地域外の方・お問い合わせ",
    message: "地域外からの参画、協業、移住希望、企業・金融機関・専門家からの相談、一般問い合わせを受け付けています。\nまずはお問い合わせフォームよりご連絡ください。",
    contactLink: true,
  },
  "/council-consultation": {
    title: "協議会設置相談",
    message: "このページは準備中です。\nご相談は、お問い合わせフォームよりお聞かせください。",
  },
};

const heroCandidates: { src: string; label: string }[] = [
  { src: "/images/lp/section-01-hero-background.webp", label: "section-01-hero-background.png（現在使用中）" },
];

// ── 詳細ページ データ（NOU-SIDE導入後、地域の各論をどう動かしていくのか） ─────────

const detailSections: DetailSectionData[] = [
  {
    number: 1,
    id: "detail-01",
    title: "AI窓口と協議会で、地域の各論を動かす",
    body: [
      "AI相談窓口が、農家や次世代からの個別の声をオンラインで受け止め、地域のデータとして整理します。",
      "そのデータをもとに、協議会では関係者がオフラインで顔を合わせ、論点整理・方針共有・実行・改善の循環をつくります。",
    ],
    image: "/images/lp/detail01-ai-madoguchi-kyogikai.webp",
    imageAlt: "AI窓口と協議会で地域の各論を動かす図。オンラインで個別のやり取りを地域データに一本化し、オフラインで共通データをもとに協議会が方向をそろえる",
  },
  {
    number: 2,
    id: "detail-02",
    title: "相談の入口を一本化し、地域の声を取りこぼしにくくする",
    body: [
      "相談の入口が農家・組合・自治体に分かれていると、次世代は誰に聞けばいいか迷い、職員は情報を整理し直す手間が生まれます。",
      "入口を一本化すると、相談のしやすさ、前捌き、共有、施策への活用がしやすくなります。AIが担うのは、人の代わりではなく入口の整理と前捌きです。",
    ],
    image: "/images/lp/detail02-entry-consolidation.webp",
    imageAlt: "AI相談窓口への一本化がなぜ効くのかを示す図。入口が分かれている状態の課題と、一本化によって青年層・職員・組織運営にもたらされる効果",
  },
  {
    number: 3,
    id: "detail-03",
    title: "相談対応ロスを減らし、人が本来担う仕事に集中しやすくする",
    body: [
      "同じ説明の繰り返し、聞き直し、担当探し、引き継ぎ漏れ、記録の再入力、窓口のたらい回し。こうしたロスは、相談する側にもされる側にも重い負担です。",
      "AIがこの繰り返し作業を引き受けることで、人は対話・伴走・判断という本来の仕事に集中しやすくなります。",
    ],
    image: "/images/lp/detail03-compress-consultation.webp",
    imageAlt: "AIで相談対応そのものをどう圧縮するかを示す図。相談の入口一本化、AIによる前捌き、内部共有と振分の自動化、人が本来担う対応への集中という4ステップ",
  },
  {
    number: 4,
    id: "detail-04",
    title: "相談履歴を、検索できる引き継ぎ資産に変える",
    body: [
      "「担当者しか分からない」状態は、人が代わるたびに地域の経緯を失わせます。",
      "相談履歴を検索できる形で残すことで、初見の職員でも経緯にたどり着け、相談者も毎回最初から説明し直さずに済みます。記録を個人の記憶から、組織の資産に変えます。",
    ],
    image: "/images/lp/detail04-handover-asset.webp",
    imageAlt: "相談履歴を検索できる引き継ぎ資産に変える仕組みを示す図。相談者の手がかりからAIが履歴を検索し、過去の記録を要約・表示し、初見の職員でも対応につなげる",
  },
  {
    number: 5,
    id: "detail-05",
    title: "農家ごとの課題を、感覚論ではなく論点として整理する",
    body: [
      "事前のアプリ回答で情報を整理し、面談前に論点を仮整理します。トップランナーとの比較や差分分析を通じて、改善提案につなげます。",
      "これは査定ではなく、若手の学習支援と地域全体の出荷力向上のための整理です。",
    ],
    image: "/images/lp/detail05-pre-sorting-analysis.webp",
    imageAlt: "AIでつなぐ農家の前捌き・面談・差分分析を示す図。16問アプリでの事前整理から、面談、トップランナー比較、差分分析、改善提案までの流れ",
  },
  {
    number: 6,
    id: "detail-06",
    title: "トップ農家の知見を、地域全体の出荷力へつなげる",
    body: [
      "地域には、すでに優れた知見を持つ農家がいます。ただ、個人に留まっていると地域全体には広がりにくいのが実情です。",
      "聞き取り、標準化、横展開という流れに乗せることで、ソフトの共同インフラがハードの共同インフラ維持にもつながっていきます。",
    ],
    image: "/images/lp/detail06-knowhow-horizontal.webp",
    imageAlt: "トップ農家のノウハウを地域の出荷力に変える図。聞き取り・標準化・横展開によって、ソフトの共同インフラがハードの共同インフラ維持にもつながることを示す",
  },
  {
    number: 7,
    id: "detail-07",
    title: "就農前から継承まで、分断せずにつなぐ",
    body: [
      "就農前、修了〜一人前、独り立ち〜拡大、畳む時期。それぞれの時期に必要な情報を整理し、つなぎます。",
      "離農と就農を分断せずに扱うことで、継承の環境が整っていきます。",
    ],
    image: "/images/lp/section5-accordion-four-stages.webp",
    imageAlt: "NOU-SIDEボットがつなぐ、就農前・修了〜一人前・独り立ち〜拡大・畳む時期の4つのステージを示す図",
  },
  {
    number: 8,
    id: "detail-08",
    title: "担い手対策は、相談対応の余力があって初めて動き出す",
    body: [
      "担い手不足は、農家が減る問題だけではありません。農家が減ることで組合財源が縮小し、人員を減らさざるを得なくなり、相談対応・営農支援・地域調整・継承マッチングといった属人的な機能が弱っていきます。",
      "前捌き・共有・分析を仕組み化して余力を生むことで、地域はようやく担い手対策という重要な判断に向き合えるようになります。",
    ],
    image: "/images/lp/detail08-capacity-crisis-cycle.webp",
    imageAlt: "なぜ組合員対応余力の確保が死活問題なのかを示す図。担い手・農家が減る、組合財源が縮小する、人員を減らさざるを得ない、既存業務対応で手一杯になる、相談・伴走・調整機能が低下する、担い手不足対策に割けない、新規就農・継承・定着が進みにくいという悪循環",
  },
];

// ── ルーティング ──────────────────────────────────────────────────────────────

function App() {
  const path = window.location.pathname;

  if (path === "/contact") {
    return <ContactPage />;
  }

  if (path === "/hero-check") {
    return <HeroCheckPage />;
  }

  if (path === "/approach") {
    return <ApproachPage />;
  }

  if (path === "/farmers/check") {
    return <FarmersCheckPage />;
  }

  if (path === "/farmers/succession") {
    return <FarmersSuccessionPage />;
  }

  if (path === "/farmers") {
    return <FarmersPage />;
  }

  if (path === "/support-organizations/burden-reduction") {
    return <SupportBurdenPage />;
  }

  if (path === "/support-organizations/next-gen") {
    return <SupportNextGenPage />;
  }

  if (path === "/support-organizations") {
    return <SupportOrganizationsPage />;
  }

  if (path === "/municipalities/facility-check") {
    return <MuniRiskCheckerPage />;
  }

  if (path === "/municipalities") {
    return <MunicipalitiesPage />;
  }

  if (path === "/council-consultation") {
    return <CouncilConsultationPage />;
  }

  if (placeholderPages[path]) {
    return <PlaceholderPage {...placeholderPages[path]} />;
  }

  return <HomePage />;
}

// ── Header ────────────────────────────────────────────────────────────────────

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".site-header-nav")) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="/" className="site-header-logo">NOU-SIDE PROJECT</a>
        <div className="site-header-nav">
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={() => setMenuOpen((v) => !v)}
          >
            MENU <span className="menu-icon" aria-hidden="true">≡</span>
          </button>
          {menuOpen && (
            <nav className="menu-dropdown" aria-label="メインメニュー">
              {ctaLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────

function HomePage() {
  const [activeFigure, setActiveFigure] = useState<Figure | null>(null);
  const savedScrollY = useRef(0);

  const openFigure = (figure: Figure) => {
    savedScrollY.current = window.scrollY;
    setActiveFigure(figure);
  };

  const closeFigure = () => {
    setActiveFigure(null);
    requestAnimationFrame(() => window.scrollTo({ top: savedScrollY.current, behavior: "instant" }));
  };

  useEffect(() => {
    if (!activeFigure) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeFigure();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [activeFigure]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Header />
      <main>
        {/* Section 1: Hero */}
        <section className="hero-visual" aria-labelledby="hero-visual-title">
          <div className="hero-visual-inner">
            <div className="hero-visual-copy">
              <h1 id="hero-visual-title" className="hero-visual-title">
                次世代が、ここで暮らし、<br />農業を続けられる地域へ。
              </h1>
              <p className="hero-visual-subtitle">次の一歩を、動ける形に整える。</p>
              <p className="hero-visual-lead">
                次世代が農業を続けられる環境を、地域が力を失う前に整えます。
              </p>
            </div>
            <img
              className="hero-visual-img"
              src="/images/lp/section-01-hero-background.webp"
              alt=""
              aria-hidden="true"
            />
          </div>
        </section>

        {/* Hero直下の入口ボタン行 */}
        <div className="hero-cta-row" aria-label="入口を選ぶ">
          <div className="hero-cta-inner">
            {entranceCards.map((card) => (
              <a key={card.href} href={card.href} className="hero-cta-link">
                {card.label}
              </a>
            ))}
          </div>
        </div>

        {/* Section 2–3, 6–7 */}
        {lpSections.slice(0, 4).map((section) => (
          <ContentSection key={section.id} section={section} onOpenFigure={openFigure} />
        ))}

        {/* 簡易診断表（Section 4 直前） */}
        <DiagnosticTable />

        {/* Section 4 */}
        {lpSections.slice(4, 5).map((section) => (
          <ContentSection key={section.id} section={section} onOpenFigure={openFigure} />
        ))}

        {/* Section 9 */}
        {lpSections.slice(5).map((section) => (
          <ContentSection key={section.id} section={section} onOpenFigure={openFigure} />
        ))}

        {/* 詳細ページへの控えめな導線 */}
        <ApproachLinkBanner />

        {/* Section 7: 入口カード */}
        <EntranceSection />
      </main>

      {activeFigure && (
        <FigureModal figure={activeFigure} onClose={closeFigure} />
      )}
      <Footer />
    </>
  );
}

// ── ContentSection ────────────────────────────────────────────────────────────

function ContentSection({
  section,
  onOpenFigure,
}: {
  section: LPSection;
  onOpenFigure: (figure: Figure) => void;
}) {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const hasRightColumn = !!(section.image || section.steps);

  return (
    <section className="lp-section" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="section-header">
        <h2 id={`${section.id}-title`}>{jpWrap(section.title)}</h2>
      </div>
      <div className={`section-main${hasRightColumn ? "" : " section-main--text-only"}`}>
        <div className="section-body">
          {section.subtitle && (
            <p className="section-subtitle">{section.subtitle}</p>
          )}
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {section.image && (
          <div className="section-image-card">
            <button
              type="button"
              className="lp-figure-zoom"
              onClick={() => onOpenFigure({ src: section.image!, alt: section.imageAlt ?? "" })}
              aria-label="図を拡大する"
            >
              <img src={section.image} alt={section.imageAlt ?? ""} />
            </button>
          </div>
        )}
        {section.steps && <StepsDisplay steps={section.steps} />}
      </div>
      {(section.summary || section.accordionItems) && (
        <div className="section-footer">
          {section.summaryImage && (
            <button
              type="button"
              className="lp-figure-zoom"
              onClick={() => onOpenFigure({ src: section.summaryImage!, alt: section.summaryImageAlt ?? "" })}
              aria-label="図を拡大する"
            >
              <img
                src={section.summaryImage}
                alt={section.summaryImageAlt ?? ""}
                className="section-summary-image"
              />
            </button>
          )}
          {section.summary && <p className="section-summary">{section.summary}</p>}
          {section.accordionItems && (
            <div className="section-accordion">
              <button
                className="accordion-toggle"
                type="button"
                aria-expanded={accordionOpen}
                onClick={() => setAccordionOpen(!accordionOpen)}
              >
                <span className="accordion-toggle-inner">
                  {section.accordionLabel ?? "詳しく見る"}
                  <span className="accordion-toggle-icon" aria-hidden="true">
                    {accordionOpen ? "−" : "＋"}
                  </span>
                </span>
              </button>
              {accordionOpen && (
                <div className="accordion-panel">
                  {section.accordionItems.map((item) => (
                    <button
                      key={item.title}
                      className="diagram-link-card"
                      type="button"
                      onClick={() => onOpenFigure({ src: item.image, alt: item.imageAlt })}
                    >
                      <span className="diagram-link-title">{item.title}</span>
                      <span className="diagram-link-arrow" aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {section.closingNote && (
            <p className="section-closing-note">{section.closingNote}</p>
          )}
        </div>
      )}
    </section>
  );
}

// ── StepsDisplay (Section 06) ─────────────────────────────────────────────────

function StepsDisplay({ steps }: { steps: string[] }) {
  return (
    <div className="section-image-card section-steps-card">
      {steps.map((step) => (
        <div key={step} className="section-step-item">
          {step}
        </div>
      ))}
    </div>
  );
}

// ── DiagnosticTable ───────────────────────────────────────────────────────────

const diagnosticItems = [
  { question: "担い手や人口は維持できているか", check: "減少傾向が続いていないか" },
  { question: "補助金なしでも営農が成り立つか", check: "稼ぎの根拠があるか" },
  { question: "次世代が暮らせる条件は見えているか", check: "所得・住まい・生活インフラ" },
  { question: "若手や青壮年の声は届いているか", check: "協議の場に当事者がいるか" },
  { question: "残すものと変えるものを話し合えているか", check: "総論で止まっていないか" },
];

function DiagnosticTable() {
  return (
    <section className="diagnostic-section lp-section" aria-labelledby="diagnostic-title">
      <div className="section-header">
        <h2 id="diagnostic-title">セルフチェック</h2>
      </div>
      <div className="diagnostic-main">
        <table className="diagnostic-table" role="table">
          <thead>
            <tr>
              <th scope="col">■チェック項目</th>
              <th scope="col">押さえるポイント</th>
            </tr>
          </thead>
          <tbody>
            {diagnosticItems.map((item) => (
              <tr key={item.question}>
                <td><span className="diagnostic-check-icon" aria-hidden="true">✓</span>{item.question}</td>
                <td>{item.check}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="diagnostic-closing">
          ▶ 疑問符が多い地域ほど、力が残っているうちに整理が必要です。
        </p>
      </div>
    </section>
  );
}

// ── ApproachLinkBanner ────────────────────────────────────────────────────────

function ApproachLinkBanner() {
  return (
    <div className="approach-link-banner">
      <div className="approach-link-inner">
        <p className="approach-link-label">もっと詳しく知りたい方へ</p>
        <p className="approach-link-text">
          相談や記録、数字が整理されているほど、支援は早く動けます。<br />
          その具体的な進め方と、NOU-SIDEが何を整理し、何を地域に委ねるのかを、8章で整理しています。
        </p>
        <a href="/approach" className="approach-link-btn">
          考え方を8章で読む<span className="btn-arrow" aria-hidden="true">→</span>
        </a>
        <p className="approach-link-aside">
          まだ具体化していなくても、課題の整理から相談できます。
          <a href="/contact" className="approach-link-aside-link">相談の入口を見る</a>
        </p>
      </div>
    </div>
  );
}

// ── EntranceSection（Section 7） ──────────────────────────────────────────────

function EntranceSection() {
  return (
    <section className="entrance-section lp-section" id="entrance" aria-labelledby="entrance-title">
      <div className="section-header">
        <h2 id="entrance-title">{jpWrap("まず、あなたの入口から|始めてください。")}</h2>
      </div>
      <p className="entrance-lead">
        立場によって、見える課題も、できることも違います。<br />
        自分の立場に近い入口から、NOU-SIDEとの関わり方を確かめられます。
      </p>
      <div className="entrance-cards">
        {entranceCards.map((card) => (
          <a key={card.href} href={card.href} className="entrance-card">
            <span className="entrance-card-label">{card.label}</span>
            <span className="entrance-card-desc">{card.description}</span>
            <span className="entrance-card-cta">
              {card.cta}
              <span className="entrance-card-arrow" aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </div>
      <p className="entrance-footnote">
        どの入口から入っても、内容が合わなければ戻れます。まずは全体像から見たい方は、
        <a href="/approach">考え方の8章</a>へ。
      </p>
    </section>
  );
}

// ── FigureModal ───────────────────────────────────────────────────────────────

function FigureModal({ figure, onClose }: { figure: Figure; onClose: () => void }) {
  return (
    <div className="figure-modal" role="dialog" aria-modal="true" aria-label={figure.alt} onClick={onClose}>
      <div className="figure-modal-inner" onClick={(event) => event.stopPropagation()}>
        <img src={figure.src} alt={figure.alt} />
        <button className="modal-close-x" type="button" aria-label="閉じる" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

// ── ApproachPage（10章詳細ページ） ────────────────────────────────────────────

function MangaRecap() {
  const [open, setOpen] = useState(false);
  return (
    <div className="manga-recap">
      <button
        type="button"
        className="manga-recap-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="manga-recap-toggle-inner">
          ｜トップページの内容をマンガでおさらい｜
          <span className="manga-recap-toggle-icon" aria-hidden="true">{open ? "▲" : "▼"}</span>
        </span>
      </button>
      {open && (
        <div className="manga-recap-panel">
          <img
            src="/images/lp/approach-manga-summary.webp"
            alt="トップページの内容を10コマのマンガで整理した図解。人が減ると地域を支える力が弱くなるところから始まり、担い手につながる流れを示す"
          />
        </div>
      )}
    </div>
  );
}

function ApproachPage() {
  return (
    <PageShell>
      <div className="approach-page">
        <div className="approach-hero">
          <div className="container narrow">
            <p className="eyebrow">NOU-SIDE</p>
            <h1 className="approach-hero-title">NOU-SIDE導入後、地域の各論をどう動かしていくのか</h1>
            <p className="approach-hero-sub">
              この詳細ページでは、NOU-SIDEが進める「次世代に選ばれる農村づくり」について、全体像と導入後の進め方を、図解を中心に整理しています。
            </p>
            <p className="approach-hero-note">
              AI相談窓口で個別の声を集め、協議会で共通データをもとに議論し、担い手対策・営農支援・継承の各論をどう動かしていくのか。<br />
              その仕組みが必要になる理由も含めて、順を追って説明します。
            </p>
          </div>
        </div>

        <MangaRecap />

        <ApproachToc />

        <div className="approach-chapters">
          {detailSections.map((section, index) => (
            <DetailSection key={section.id} section={section} index={index} />
          ))}
        </div>

        <div className="approach-footer-cta">
          <div className="container narrow">
            <p className="approach-footer-cta-lead">
              NOU-SIDEの関わり方も、確かめてから選んでください。<br />
              まだ具体化していなくても、地域の状況を一緒に整理するところから始められます。
            </p>
            <div className="approach-footer-cta-buttons">
              <a href="/" className="secondary-button">⇦ トップに戻って入口を選ぶ</a>
              <a href="/contact" className="primary-button">
                地域の現在地を相談する<span className="btn-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

// ── ApproachToc ───────────────────────────────────────────────────────────────

const tocItems = [
  { id: "detail-01", eyebrow: "全体像", title: "AI窓口と協議会で各論を動かす" },
  { id: "detail-02", eyebrow: "入口", title: "相談窓口を一本化する" },
  { id: "detail-03", eyebrow: "省力化", title: "相談対応ロスを減らす" },
  { id: "detail-04", eyebrow: "資産化", title: "相談履歴を引き継ぎ資産にする" },
  { id: "detail-05", eyebrow: "分析", title: "農家の現状を整理・比較する" },
  { id: "detail-06", eyebrow: "標準化", title: "トップ農家の知見を地域に広げる" },
  { id: "detail-07", eyebrow: "継承", title: "4つのステージをつなぐ" },
  { id: "detail-08", eyebrow: "余力確保", title: "担い手対策に向き合う余力を残す" },
];

function ApproachToc() {
  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="approach-toc" aria-label="このページで分かること">
      <div className="approach-toc-inner">
        <p className="approach-toc-label">このページで分かること</p>
        <p className="approach-toc-lead">
          NOU-SIDE導入後、相談・記録・共有・分析・協議・継承がどう進むのか。
          <br />
          全8章の流れを先にご覧ください。
        </p>
        <div className="approach-toc-links">
          {tocItems.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="approach-toc-link"
              onClick={(event) => handleClick(event, item.id)}
            >
              <span className="approach-toc-link-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="approach-toc-link-text">
                <span className="approach-toc-link-eyebrow">{item.eyebrow}</span>
                <span className="approach-toc-link-title">{item.title}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── DetailSection ─────────────────────────────────────────────────────────────

function DetailSection({ section, index }: { section: DetailSectionData; index: number }) {
  const reverse = index % 2 === 1;
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <section
      className={`detail-section lp-section${reverse ? " detail-section--reverse" : ""}`}
      id={section.id}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="chapter-header">
        <span className="chapter-number" aria-label={`${section.number}`}>
          {String(section.number).padStart(2, "0")}
        </span>
        <h2 id={`${section.id}-title`} className="chapter-title">
          {section.title}
        </h2>
      </div>
      <div className="detail-section-main">
        <div className="detail-section-body">
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="detail-section-figure">
          {section.image ? (
            <>
              <button
                type="button"
                className="detail-figure-zoom"
                onClick={() => setLightboxOpen(true)}
                aria-label="図解を拡大する"
              >
                <img src={section.image} alt={section.imageAlt ?? ""} />
                <span className="detail-figure-zoom-label">拡大する</span>
              </button>
              {lightboxOpen && (
                <div
                  className="detail-figure-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-label={section.imageAlt ?? "図解の拡大表示"}
                  onClick={() => setLightboxOpen(false)}
                >
                  <button
                    type="button"
                    className="detail-figure-lightbox-close"
                    onClick={() => setLightboxOpen(false)}
                    aria-label="閉じる"
                  >
                    ×
                  </button>
                  <img
                    src={section.image}
                    alt={section.imageAlt ?? ""}
                    onClick={(event) => event.stopPropagation()}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="detail-placeholder" role="img" aria-label={section.placeholderLabel}>
              <p>{section.placeholderLabel}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ContactPage is imported from ./pages/ContactPage

// ── PlaceholderPage ───────────────────────────────────────────────────────────

function PlaceholderPage({
  title,
  message,
  futureItems,
  councilLink,
  contactLink,
}: {
  title: string;
  message: string;
  futureItems?: string[];
  councilLink?: boolean;
  contactLink?: boolean;
}) {
  const paragraphs = useMemo(() => message.split("\n"), [message]);

  return (
    <PageShell>
      <section className="compact-page" aria-labelledby="placeholder-title">
        <div className="container narrow">
          <h1 id="placeholder-title">{title}</h1>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {futureItems && (
            <ul className="future-list" aria-label="対応予定の内容">
              {futureItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {councilLink && (
            <a className="text-link" href="/council-consultation">
              協議会設置相談
            </a>
          )}
          {contactLink && (
            <>
              <p className="cta-lead-text">
                まだ具体化していなくても、課題の整理から相談できます。
              </p>
              <a className="primary-button" href="/contact">
                現在の状況を聞いてもらう<span className="btn-arrow" aria-hidden="true">→</span>
              </a>
            </>
          )}
          <div className="page-actions">
            <a href="/">← トップへ戻る</a>
            <a href="/approach">まず全体像を見る（8章）</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// ── HeroCheckPage ─────────────────────────────────────────────────────────────

function HeroCheckPage() {
  return (
    <PageShell>
      <section className="compact-page" aria-labelledby="hero-check-title">
        <div className="container">
          <h1 id="hero-check-title">Hero画像候補確認</h1>
          <p style={{ marginTop: "8px", fontSize: "0.9rem", color: "#415348" }}>
            候補を追加するには <code>/public/images/lp/candidates/</code> にファイルを置き、
            App.tsx の <code>heroCandidates</code> 配列にパスを追記してください。
          </p>
          <div className="hero-check-grid">
            {heroCandidates.map(({ src, label }) => (
              <div key={src} className="hero-check-card">
                <img src={src} alt={label} />
                <p className="hero-check-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// ── PageShell ─────────────────────────────────────────────────────────────────

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer>
      <div className="container footer-inner">
        <a href="/" aria-label="NOU-SIDE メインページ">HOME</a>
        <nav className="footer-nav" aria-label="フッターナビ">
          <a href="/approach">詳しく読む</a>
          <a href="/contact">お問い合わせ</a>
        </nav>
      </div>
    </footer>
  );
}

export default App;
