import { Link } from 'react-router-dom';

export default function Preview() {
  return (
    <section className="app-shell" id="preview">
      <div className="wrap">
        <div className="app-head">
          <div className="eyebrow">Inside the app</div>
          <h2>Your day, at a glance — every number encrypted</h2>
          <p>The dashboard below is a preview. Open the real app to see your caloric balance, meal log calendar and privacy vault, wired up and ready for your data.</p>
        </div>

        <div className="preview-frame">
          <div className="preview-card">
            <div className="preview-row">
              <div className="preview-tag">Today's balance</div>
              <div className="preview-bubbles" aria-hidden="true">
                <span className="pb pb-yellow"></span>
                <span className="pb pb-red"></span>
                <span className="pb pb-dark"></span>
              </div>
              <p>Calories consumed, target, and water — all three tracked live and locked to your device.</p>
            </div>
            <div className="preview-row">
              <div className="preview-tag">Meal log calendar</div>
              <div className="preview-dots" aria-hidden="true">
                <span className="pd on"></span><span className="pd on"></span><span className="pd"></span><span className="pd on"></span><span className="pd"></span><span className="pd on"></span><span className="pd"></span>
              </div>
              <p>See which days you hit your localized target at a glance.</p>
            </div>
            <div className="preview-row">
              <div className="preview-tag">Privacy vault</div>
              <div className="preview-lock" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="var(--forest)" strokeWidth="1.6" /><path d="M8 10V7a4 4 0 018 0v3" stroke="var(--forest)" strokeWidth="1.6" /></svg>
              </div>
              <p>Export, inspect or shred your encrypted data whenever you like.</p>
            </div>
          </div>
          <Link className="btn btn-clay preview-cta" to="/dashboard">Open the Full App →</Link>
        </div>
      </div>
    </section>
  );
}
