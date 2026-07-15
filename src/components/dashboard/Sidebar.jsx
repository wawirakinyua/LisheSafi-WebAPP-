import { Link } from 'react-router-dom';

export default function Sidebar({ activeView, onNavigate, displayName }) {
  const initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';

  return (
    <aside className="rail">
      <div className="rail-logo" title="Lishe Bora">
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19" stroke="#D9A441" strokeWidth="1.5" />
          <path d="M20 8c-5 4-8 8-8 13a8 8 0 0016 0c0-5-3-9-8-13z" fill="#D9A441" />
          <path d="M20 14c-2.5 2.4-4 5-4 7.4a4 4 0 008 0c0-2.4-1.5-5-4-7.4z" fill="#1F4A3D" />
        </svg>
      </div>

      <nav className="rail-nav" aria-label="App sections">
        <button className={`rail-btn${activeView === 'overview' ? ' active' : ''}`} title="Home" onClick={() => onNavigate('overview')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11.5L12 4l8 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button className={`rail-btn${activeView === 'planner' ? ' active' : ''}`} title="Meal Planner" onClick={() => onNavigate('planner')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" /><path d="M12 3.5v3M12 17v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
        <button className={`rail-btn${activeView === 'progress' ? ' active' : ''}`} title="Historical Progress" onClick={() => onNavigate('progress')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 19V9M11 19V4M18 19v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </button>
        <button className={`rail-btn${activeView === 'vault' ? ' active' : ''}`} title="Account & privacy" onClick={() => onNavigate('vault')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.7" /></svg>
        </button>
      </nav>

      <div className="rail-bottom">
        <button className="rail-btn" id="settingsBtn" title="Lock vault" onClick={() => onNavigate('lock')}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M19.4 13.5a7.6 7.6 0 000-3l2-1.5-2-3.4-2.3.9a7.6 7.6 0 00-2.6-1.5L14 2.5h-4l-.5 2.5a7.6 7.6 0 00-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.6 7.6 0 000 3l-2 1.5 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5l.5 2.5h4l.5-2.5a7.6 7.6 0 002.6-1.5l2.3.9 2-3.4-2-1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
        </button>
        <Link className="rail-avatar rail-avatar-initial" to="/" title="Back to Lishe Bora site">
          {initial}
        </Link>
      </div>
    </aside>
  );
}
