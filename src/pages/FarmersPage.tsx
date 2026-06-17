import { PageShell } from "../App";
import "./farmers.css";

const farmerCards = [
  {
    href: "/farmers/check",
    title: "農業所得を増やしたい",
    sub: "経営の現在地を整理して、改善の入口を探す",
    note: null,
  },
  {
    href: "/farmers/succession",
    title: "事業承継を確実にしたい",
    sub: "農地・設備・技術を次世代へ引き継ぐための相談をする",
    note: null,
  },
  {
    href: "/council-consultation",
    title: "営農環境をより良くしたい",
    sub: "農家・組合・自治体が一緒に考える場づくりをする",
    note: null,
  },
  {
    href: "/contact",
    title: "その他のご相談",
    sub: "上記に当てはまらないご相談",
    note: null,
  },
];

export default function FarmersPage() {
  return (
    <PageShell>
      <section aria-labelledby="farmers-title">
        <div className="fc-entry-wrap">
          <header className="fc-entry-head">
            <h1 id="farmers-title">ご相談の内容をお選びください</h1>
            <p>いまお考えのことに、いちばん近いものをお選びください。</p>
          </header>

          <div className="fc-entry-grid">
            {farmerCards.map((card) => (
              <a key={card.href + card.title} href={card.href} className="fc-entry-card">
                <span className="fc-entry-card-text">
                  <span className="fc-entry-card-title">{card.title}</span>
                  <span className="fc-entry-card-sub">{card.sub}</span>
                  {card.note && (
                    <span className="fc-entry-card-sub fc-entry-card-sub--note">{card.note}</span>
                  )}
                </span>
                <span className="fc-entry-card-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>

          <div className="fc-entry-back">
            <a href="/">← トップへ戻る</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
