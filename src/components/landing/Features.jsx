import { Link } from 'react-router-dom';

export default function Features() {
  return (
    <section className="features">
      <div className="wrap">
        <div className="feature-grid">
          <Link className="feature-card" to="/dashboard/planner">
            <svg className="ficon" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v3H4z" stroke="#F6EFE0" strokeWidth="1.6" /><path d="M6 10h12l-1 10H7z" stroke="#F6EFE0" strokeWidth="1.6" /></svg>
            <h3>Log a Meal</h3>
            <p>Search Kenyan staples like ugali, sukuma wiki and nyama choma — calories and macros calculated instantly from the Kenya Food Composition Tables.</p>
            <span className="go">Open meal planner →</span>
          </Link>
          <Link className="feature-card" to="/dashboard/progress">
            <svg className="ficon" viewBox="0 0 24 24" fill="none"><path d="M4 17l5-5 4 4 7-9" stroke="#F6EFE0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <h3>Track Water &amp; Fitness</h3>
            <p>Tap through eight glasses a day, log a workout, and watch your streak build — all rendered from data that stays right on your device.</p>
            <span className="go">Open progress →</span>
          </Link>
          <Link className="feature-card" to="/dashboard/vault">
            <svg className="ficon" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="#F6EFE0" strokeWidth="1.6" /><path d="M8 10V7a4 4 0 018 0v3" stroke="#F6EFE0" strokeWidth="1.6" /></svg>
            <h3>Open Your Vault</h3>
            <p>See exactly what "zero-knowledge" means: your entries encrypted, key-derived and locked with a password only you know.</p>
            <span className="go">See the vault →</span>
          </Link>
        </div>
        <div className="section-cta">
          <Link className="btn btn-gold" to="/dashboard">See Full Dashboard</Link>
        </div>
      </div>
    </section>
  );
}
