import { PageShell } from "../App";
import "./farmers.css";

const steps = [
  {
    num: "01",
    title: "農家の承継状況を把握する",
    body: "地域内の農家ごとに、後継者の有無・農地規模・経営状況を整理し、優先して支援すべき案件を見える化します。",
  },
  {
    num: "02",
    title: "選択肢を一緒に整理する",
    body: "家族内承継・新規就農者への引き継ぎ・農地集積など、農家が選べる選択肢を並べて比較できる形にします。",
  },
  {
    num: "03",
    title: "判断材料をそろえる",
    body: "後継者が「やっていける」と判断するために必要な収支・暮らし・備えの見通しを、支援機関側が提示できる形で整えます。",
  },
  {
    num: "04",
    title: "関係機関と連携して進める",
    body: "農業委員会・行政・金融機関など、承継に関わる機関との調整を整理し、手続きが滞らない体制をつくります。",
  },
];

export default function SupportSuccessionPage() {
  return (
    <PageShell>
      <div className="fc-entry-wrap">
        <header className="fc-entry-head">
          <p className="fc-entry-eyebrow">組合・支援機関の方へ ／ 事業承継支援</p>
          <h1>地域の農業承継を、支援機関として支える</h1>
          <p>
            農家一軒ずつの承継状況を把握し、選択肢を整理し、判断できる材料を提示する。
            その体制を組合・支援機関として持てる状態にします。
          </p>
        </header>

        <div className="succession-steps">
          {steps.map((step) => (
            <div key={step.num} className="succession-step">
              <span className="succession-step-num">{step.num}</span>
              <div className="succession-step-body">
                <p className="succession-step-title">{step.title}</p>
                <p className="succession-step-text">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fc-entry-cta">
          <p className="fc-entry-cta-note">
            地域の承継状況の整理から始めます。
          </p>
          <a href="/contact?source=support-succession" className="fc-primary-btn">
            事業承継支援について相談する
          </a>
        </div>

        <div className="fc-entry-back">
          <a href="/support-organizations">← 組合・支援機関の方のページへ戻る</a>
        </div>
      </div>
    </PageShell>
  );
}
