import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-brand">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="19" stroke="#D9A441" strokeWidth="1.5" />
                <path d="M20 8c-5 4-8 8-8 13a8 8 0 0016 0c0-5-3-9-8-13z" fill="#D9A441" />
              </svg>
              <span className="brand-name">Lishe Bora</span>
            </div>
            <p className="tagline">A zero-knowledge nutrition and fitness planner built around Kenyan staples, from farm to plate to encrypted log.</p>
            <div className="foot-flag-block">
              <svg className="flag" width="34" height="24" viewBox="0 0 60 40"><use href="#kenya-flag" /></svg>
              <span style={{ fontSize: '12px', color: 'rgba(246,239,224,0.6)' }}>Designed &amp; built in Kenya</span>
            </div>
          </div>
          <div className="foot-col">
            <h4>Product</h4>
            <ul>
              <li><Link to="/dashboard/planner">Meal Planner</Link></li>
              <li><Link to="/dashboard/progress">Progress &amp; Fitness</Link></li>
              <li><Link to="/dashboard/vault">Privacy Vault</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Privacy</h4>
            <ul>
              <li><a href="#story">Data Protection Act, 2019</a></li>
              <li><Link to="/dashboard/vault">How encryption works</Link></li>
              <li><Link to="/dashboard/vault">Delete your vault</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Follow</h4>
            <div className="socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="Facebook">f</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© 2026 Lishe Bora. A student project for privacy-first, locally-grounded wellness in Kenya.</p>
          <p>Built with the Kenya Food Composition Tables (FAO &amp; Ministry of Health)</p>
        </div>
      </div>
    </footer>
  );
}
