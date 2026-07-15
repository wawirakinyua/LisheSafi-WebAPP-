import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="wrap">
          <div className="brand">
            <svg className="brand-mark" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#D9A441" strokeWidth="1.5" />
              <path d="M20 8c-5 4-8 8-8 13a8 8 0 0016 0c0-5-3-9-8-13z" fill="#D9A441" />
              <path d="M20 14c-2.5 2.4-4 5-4 7.4a4 4 0 008 0c0-2.4-1.5-5-4-7.4z" fill="#1F4A3D" />
            </svg>
            <div>
              <span className="brand-name">Lishe Bora</span>
              <span className="brand-tag">Nutrition · Privately Yours</span>
            </div>
          </div>
          <ul className={`nav-links${open ? ' nav-links-open' : ''}`}>
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#preview">Inside the App</a></li>
            <li><a href="#story">Why Local Food</a></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
          <div className="nav-right">
            <div className="flag-chip">
              <svg className="flag" width="20" height="14" viewBox="0 0 60 40"><use href="#kenya-flag" /></svg>
              Made for Kenya
            </div>
            <Link className="btn btn-clay" to="/dashboard">Open App</Link>
            <button className="hamburger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="kenya-flag" viewBox="0 0 60 40">
            <rect width="60" height="40" fill="#fff" />
            <rect width="60" height="12" fill="#171512" />
            <rect y="14" width="60" height="12" fill="#C23A32" />
            <rect y="28" width="60" height="12" fill="#0D5B3A" />
            <rect y="12" width="60" height="2" fill="#fff" />
            <rect y="26" width="60" height="2" fill="#fff" />
            <g transform="translate(30,20)">
              <circle r="8" fill="#fff" stroke="#171512" strokeWidth="1" />
              <path d="M-4 -6 L4 -6 L3 6 L-3 6 Z" fill="#C23A32" stroke="#171512" strokeWidth="0.6" />
              <line x1="-9" y1="-9" x2="9" y2="9" stroke="#171512" strokeWidth="1.4" />
              <line x1="9" y1="-9" x2="-9" y2="9" stroke="#171512" strokeWidth="1.4" />
            </g>
          </symbol>
        </defs>
      </svg>
    </>
  );
}
