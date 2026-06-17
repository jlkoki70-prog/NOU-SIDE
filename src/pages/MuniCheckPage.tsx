import { PageShell } from "../App";
import "./farmers.css";

const diagnosticItems = [
  { question: "担い手や人口は維持できているか", check: "減少傾向・年齢構成を確認" },
  { question: "補助金なしでも農業が成り立つ経営体はあるか", check: "稼ぎの根拠が見えているか" },
  { question: "次世代が暮らせる条件は整っているか", check: "住まい・教育・医療・収入" },
  { question: "農地や技術を引き継げる仕組みはあるか", check: "承継の見通しが立っているか" },
  { question: "残すものと変えるものを話し合えているか", check: "総論で止まっていないか" },
];

export default function MuniCheckPage() {
  return (
    <PageShell>
      <div className="fc-entry-wrap">
        <header className="fc-entry-head">
          <p className="fc-entry-eyebrow">自治体の方へ ／ 簡易診断</p>
          <h1>地域の現状を5つの問いで確かめる</h1>
          <p>
            「対策は打っているが、本当に機能しているか」を確かめる入口として使ってください。
            疑問符が多い地域ほど、力が残っているうちに整理が必要です。
          </p>
        </header>

        <table className="diagnostic-table" style={{ margin: "0 0 32px" }}>
          <thead>
            <tr>
              <th scope="col">問い</th>
              <th scope="col">見るべきこと</th>
            </tr>
          </thead>
          <tbody>
            {diagnosticItems.map((item) => (
              <tr key={item.question}>
                <td>{item.question}</td>
                <td>{item.check}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="fc-entry-cta">
          <p className="fc-entry-cta-note">
            疑問符が多かった場合は、一緒に整理しましょう。
          </p>
          <a href="/contact?source=muni-check" className="fc-primary-btn">
            地域の状況を相談する
          </a>
        </div>

        <div className="fc-entry-back">
          <a href="/municipalities">← 自治体の方のページへ戻る</a>
        </div>
      </div>
    </PageShell>
  );
}
