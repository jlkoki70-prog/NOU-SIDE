import { PageShell } from "../App";
import "./farmers.css";

const points = [
  {
    title: "書類・申請の手間を減らす",
    body: "補助金申請、経営記録、報告書など、繰り返し発生する書類作業を整理して、農作業に集中できる時間を増やします。",
  },
  {
    title: "相談・手続きをスムーズにする",
    body: "農業委員会・JA・行政への相談が何度も同じ説明からにならないよう、必要な情報をあらかじめまとめておきます。",
  },
  {
    title: "データを使いやすい形に整える",
    body: "売上・経費・作付けの記録を、次の判断に使える形で持てるよう整理します。",
  },
];

export default function FarmersBurdenPage() {
  return (
    <PageShell>
      <div className="fc-entry-wrap">
        <header className="fc-entry-head">
          <p className="fc-entry-eyebrow">農家の方へ ／ 負担軽減</p>
          <h1>農業以外の手間を、できるだけ減らす</h1>
          <p>
            書類・申請・記録・相談の準備など、農業以外の作業に時間が取られているなら、
            その構造を整えることができます。
          </p>
        </header>

        <div className="subpage-points">
          {points.map((pt) => (
            <div key={pt.title} className="subpage-point">
              <p className="subpage-point-title">{pt.title}</p>
              <p className="subpage-point-text">{pt.body}</p>
            </div>
          ))}
        </div>

        <div className="fc-entry-cta">
          <p className="fc-entry-cta-note">
            どの部分から手をつけるか、一緒に整理します。
          </p>
          <a href="/contact?source=farmers-burden" className="fc-primary-btn">
            負担軽減について相談する
          </a>
        </div>

        <div className="fc-entry-back">
          <a href="/farmers">← 農家の方のページへ戻る</a>
        </div>
      </div>
    </PageShell>
  );
}
