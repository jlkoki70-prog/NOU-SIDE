import { PageShell } from "../App";
import "./farmers.css";

const supportCards = [
  {
    href: "/support-organizations/burden-reduction",
    title: "業務効率化・負担軽減について知りたい",
    sub: "AIによる前捌きと、職員が本来の支援に集中できる体制づくり",
    note: null,
  },
  {
    href: "/council-consultation",
    title: "協議の場づくりについて知りたい",
    sub: "組織の枠を超えた、地域全体での議論の場をつくる",
    note: null,
  },
];

export default function SupportOrganizationsPage() {
  return (
    <PageShell>
      <section aria-labelledby="support-title">
        <div className="fc-entry-wrap">
          <header className="fc-entry-head">
            <p className="fc-entry-eyebrow">組合・支援機関の方へ</p>
            <h1 id="support-title">ご相談の内容をお選びください</h1>
            <p>いまお考えのことに、いちばん近いものをお選びください。</p>
          </header>

          <div className="fc-entry-grid">
            {supportCards.map((card) => (
              <a key={card.title} href={card.href} className="fc-entry-card">
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
