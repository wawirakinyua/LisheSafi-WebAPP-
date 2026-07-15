const ARC_LENGTH = 188;

export default function OverviewView({ appState, onRemoveFood, onAddWater }) {
  const today = appState?.today ?? {};
  const profile = appState?.profile ?? {};
  const calendarDays = appState?.calendarDays ?? [];
  const todayIndex = appState?.todayIndex ?? -1;
  const foodLog = appState?.foodLog ?? [];

  const proteinPct = Math.max(0, Math.min(1, (today.proteinGramsToday ?? 0) / (today.proteinGoalGrams || 1)));
  const weightSpan = Math.abs((profile.weightStartKg ?? 0) - (profile.weightTargetKg ?? 0)) || 1;
  const weightProgressed = Math.abs((profile.weightStartKg ?? 0) - (profile.weightCurrentKg ?? profile.weightStartKg ?? 0));
  const weightPct = Math.max(0, Math.min(100, Math.round((weightProgressed / weightSpan) * 100)));

  return (
    <section className="view active" id="overview">
      <div className="row-top">
        <div className="card card-balance">
          <div className="card-head">
            <h2>Daily Calorie &amp; Macro Balance</h2>
            <span className="lock-chip" title="Encrypted locally before sync">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" /></svg>
            </span>
          </div>

          <div className="bubble-field">
            <div className="bubble bubble-yellow">
              <span className="bubble-num">{(today.caloriesConsumed ?? 0).toLocaleString()}</span>
              <span className="bubble-lbl">kcal</span>
            </div>
            <div className="bubble bubble-red">
              <span className="bubble-num">{(today.caloriesTarget ?? 0).toLocaleString()}</span>
              <span className="bubble-lbl">kcal</span>
            </div>
            <div className="bubble bubble-dark">
              <span className="bubble-num">{today.waterLitres ?? 0} L</span>
            </div>
          </div>

          <div className="legend">
            <span><i className="dot yellow"></i>Calories intake</span>
            <span><i className="dot red"></i>Target calories</span>
            <span><i className="dot dark"></i>Water intake</span>
          </div>

          <div className="water-controls">
            <span className="water-controls-label">Log water</span>
            <button className="btn-sm" onClick={() => onAddWater(0.25)}>+250 ml</button>
            <button className="btn-sm" onClick={() => onAddWater(0.5)}>+500 ml</button>
            <button className="btn-sm" onClick={() => onAddWater(1)}>+1 L</button>
            <button className="btn-sm" onClick={() => onAddWater(-(today.waterLitres ?? 0))} title="Reset today's water to 0">Reset</button>
          </div>
        </div>

        <div className="card card-calendar">
          <div className="card-head">
            <h2>Meal Log Calendar</h2>
            <span className="month-chip">{new Date().toLocaleDateString('en-KE', { month: 'long' })}</span>
          </div>
          <div className="cal-grid">
            {calendarDays.map((val, i) => (
              <div
                key={i}
                className={`cal-cell${val === true ? ' on' : val === false ? ' off' : ''}${i === todayIndex ? ' today' : ''}`}
              >
                {val === null ? '' : (i % 31) + 1}
              </div>
            ))}
          </div>
          <div className="cal-key">
            <span><i className="dot gold"></i>On target</span>
            <span><i className="dot dim"></i>Logged, off target</span>
          </div>
        </div>
      </div>

      <div className="row-bottom">
        <div className="card card-gauge">
          <h2>Protein Target</h2>
          <p className="card-sub">From protein intake logged today</p>
          <div className="gauge-wrap">
            <svg viewBox="0 0 140 80" className="gauge-svg">
              <path d="M10 75 A60 60 0 0 1 130 75" stroke="var(--line-strong)" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path
                d="M10 75 A60 60 0 0 1 130 75"
                stroke="var(--clay)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={ARC_LENGTH}
                strokeDashoffset={ARC_LENGTH * (1 - proteinPct)}
                style={{ transition: 'stroke-dashoffset .5s ease' }}
              />
            </svg>
            <div className="gauge-readout">
              <span className="num">{today.proteinGramsToday ?? 0}g</span>
              <span className="lbl">goal {today.proteinGoalGrams ?? 0}g</span>
            </div>
          </div>
        </div>

        <div className="card card-weight">
          <div className="card-head">
            <h2>Weight Tracking Goal</h2>
            <span className="pct-chip">{weightPct}%</span>
          </div>
          <p className="card-sub">Progress from starting weight to target weight</p>
          <div className="weight-bar-wrap">
            <div className="weight-bar"><div className="weight-bar-fill" style={{ width: `${weightPct}%` }}></div></div>
            <div className="weight-labels">
              <span>{profile.weightStartKg ?? '—'} kg</span>
              <span>{profile.weightTargetKg ?? '—'} kg</span>
            </div>
          </div>
        </div>

        <div className="card card-log">
          <div className="card-head">
            <h2>Today's Food Log</h2>
          </div>
          <div className="log-list">
            {foodLog.length === 0 && (
              <p className="log-empty">No meals logged yet. Search a food above to add your first plate.</p>
            )}
            {foodLog.map((item, i) => (
              <div className="log-item" key={i}>
                <div className="log-emoji">{item.emoji ?? '🍽️'}</div>
                <div>
                  <div className="log-name">{item.name ?? 'Logged item'}</div>
                  <div className="log-meta">{item.meta ?? ''}</div>
                </div>
                <div className="log-cal">{(item.kcal ?? 0).toLocaleString()} kcal</div>
                <button className="log-remove" aria-label="Remove entry" onClick={() => onRemoveFood(i)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
