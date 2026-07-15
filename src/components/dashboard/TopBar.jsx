import { useEffect, useRef, useState } from 'react';
import foods from '../../data/kenyaFoodComposition.json';

export default function TopBar({ appState, onAddFood, onSync }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [syncLabel, setSyncLabel] = useState('Add Meal / Sync');
  const [syncing, setSyncing] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowResults(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = q
    ? foods.filter((f) => f.food_name_en.toLowerCase().includes(q) || f.food_name_sw.toLowerCase().includes(q)).slice(0, 8)
    : [];

  function pick(food) {
    onAddFood(food);
    setQuery('');
    setShowResults(false);
  }

  async function handleSync() {
    setSyncing(true);
    setSyncLabel('Encrypting & syncing…');
    try {
      await onSync();
      setSyncLabel('Synced ✓ (AES-256-GCM)');
    } catch {
      setSyncLabel('Sync failed');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncLabel('Add Meal / Sync'), 1600);
    }
  }

  return (
    <header className="topbar">
      <div>
        <h1>Hi, {appState?.profile?.displayName ?? 'there'}!</h1>
        <p>{appState?.today?.dateLabel ?? 'Today'} · let's take a look at your day.</p>
      </div>

      <div className="search-wrap" ref={wrapRef}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#8a8074" strokeWidth="1.7" /><path d="M20 20l-3.5-3.5" stroke="#8a8074" strokeWidth="1.7" strokeLinecap="round" /></svg>
        <input
          type="text"
          placeholder="Search Kenyan foods — try 'sukuma' or 'omena'"
          autoComplete="off"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
        />
        {showResults && q && (
          <div className="search-results">
            {matches.length === 0 && <div className="sr-empty">No local foods match  try "ugali" or "omena"</div>}
            {matches.map((f) => (
              <div className="sr-item" key={f.food_id} onClick={() => pick(f)}>
                <span className="sr-emoji">{f.emoji}</span>
                <span>{f.food_name_en}</span>
                <span className="sr-kcal">{f.calories_per_serving} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={`btn-sync${syncing ? ' syncing' : ''}`} onClick={handleSync}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 4v6h6M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.5 15a7 7 0 0012.4 2.5M18.5 9A7 7 0 006.1 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        <span>{syncLabel}</span>
      </button>
    </header>
  );
}
