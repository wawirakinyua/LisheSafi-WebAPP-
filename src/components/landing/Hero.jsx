import { Link } from 'react-router-dom';
import { formatSwahiliDate } from '../../utils/swahiliDate';

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <div>
          <div className="eyebrow"> Built in Kenya</div>
          <h1>Your health data, <em>encrypted before it ever leaves your phone.</em></h1>
          <p className="lede">Lishe Bora plans meals around local and available foods, not bagels and pretzels while keeping your data secure.</p>
          <div className="hero-cta">
            <Link className="btn btn-clay" to="/dashboard">Start Tracking Free</Link>
            <button className="btn btn-outline" onClick={() => jumpTo('story')}>Why Local Food Matters</button>
          </div>
          <div className="trust-row">
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 3v6c0 5-3.5 8.5-7 11-3.5-2.5-7-6-7-11V5l7-3z" stroke="#D9A441" strokeWidth="1.6" /></svg>
              AES-256 on-device encryption
            </div>
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#D9A441" strokeWidth="1.6" /><path d="M8 12l2.5 2.5L16 9" stroke="#D9A441" strokeWidth="1.6" strokeLinecap="round" /></svg>
              60+ Kenyan staple foods
            </div>
            <div className="trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12h16M4 6h16M4 18h10" stroke="#D9A441" strokeWidth="1.6" strokeLinecap="round" /></svg>
              DPA 2019 aligned
            </div>
          </div>
        </div>

        <div className="plate-stage">
          <div className="mat" aria-hidden="true"></div>
          <div className="plate-card">
            <h3>Today's Plate<span className="date">{formatSwahiliDate()}</span></h3>
            <div className="ring-row">
              <div className="ring-wrap">
                <svg width="112" height="112" viewBox="0 0 112 112">
                  <circle className="ring-bg" cx="56" cy="56" r="46" />
                  <circle className="ring-fg" cx="56" cy="56" r="46" strokeDasharray="289" strokeDashoffset="130" />
                </svg>
                <div className="ring-center">
                  <span className="num">1,240</span>
                  <span className="lbl">of 1,800 kcal</span>
                </div>
              </div>
              <div className="macro-list">
                <div className="macro-item"><span className="macro-dot" style={{ background: '#C1502E' }}></span>Ugali &amp; carbs <span className="val">142g</span></div>
                <div className="macro-item"><span className="macro-dot" style={{ background: '#1F4A3D' }}></span>Protein (omena) <span className="val">58g</span></div>
                <div className="macro-item"><span className="macro-dot" style={{ background: '#D9A441' }}></span>Greens &amp; fibre <span className="val">21g</span></div>
              </div>
            </div>
            <div className="plate-foot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 3v6c0 5-3.5 8.5-7 11-3.5-2.5-7-6-7-11V5l7-3z" stroke="#1F4A3D" strokeWidth="1.8" /></svg>
              Ulinzi thabiti kabisa
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
