import { PageShell } from "../App";
import "./farmers.css";

const checkItems = [
  { label: "担い手の年齢構成", question: "10年後、誰が農業を担っているか見えているか" },
  { label: "施設・インフラの維持", question: "人口が減ったとき、どの施設から維持できなくなるか" },
  { label: "移住・就農の受入れ態勢", question: "次世代が「来たい」と思える条件をそろえられているか" },
  { label: "地域内の合意形成", question: "残すものと変えるものを、地域で話し合えているか" },
];

export default function MuniNextGenPage() {
  return (
    <PageShell>
      <div className="fc-entry-wrap">
        <header className="fc-entry-head">
          <p className="fc-entry-eyebrow">自治体の方へ ／ 次世代対策</p>
          <h1>地域の将来像を、数字と対話で整える</h1>
          <p>
            人口・担い手・施設の現状を見える化し、
            「このまま続けると何が起きるか」「どこから手をつけるか」を整理します。
            答えを出すのではなく、地域が選べる状態をつくります。
          </p>
        </header>

        <div className="muni-check-list">
          {checkItems.map((item) => (
            <div key={item.label} className="muni-check-item">
              <p className="muni-check-label">{item.label}</p>
              <p className="muni-check-question">{item.question}</p>
            </div>
          ))}
        </div>

        <div className="fc-entry-cta">
          <p className="fc-entry-cta-note">
            地域の状況を一緒に整理するところから始めます。
          </p>
          <a href="/contact?source=muni-nextgen" className="fc-primary-btn">
            次世代対策について相談する
          </a>
        </div>

        <div className="fc-entry-back">
          <a href="/municipalities">← 自治体の方のページへ戻る</a>
        </div>
      </div>
    </PageShell>
  );
}
