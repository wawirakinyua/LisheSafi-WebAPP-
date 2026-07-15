function TrendChart({ values, color }) {
  const W = 560, H = 220, PAD = 24;
  if (!values || !values.length) return <svg viewBox={`0 0 ${W} ${H}`} className="trend-svg" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (W - PAD * 2) / (values.length - 1 || 1);
  const points = values.map((v, i) => {
    const x = PAD + i * step;
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return [x, y];
  });
  const pointsAttr = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="trend-svg">
      <polyline points={pointsAttr} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={color} />
      ))}
    </svg>
  );
}

export default function ProgressView({ appState }) {
  const progress = appState?.progressHistory ?? {};

  return (
    <section className="view active" id="progress">
      <div className="view-head">
        <h2>Historical Progress</h2>
        <p>History of your weight and calorie trends over time.</p>
      </div>

      <div className="row-top">
        <div className="card card-chart">
          <h2>Calories in the last 7 days</h2>
          <TrendChart values={progress.calories7day} color="#C1502E" />
        </div>
        <div className="card card-chart">
          <h2>Weight in the last 7 days</h2>
          <TrendChart values={progress.weight7day} color="#1F4A3D" />
        </div>
      </div>

      <div className="row-bottom row-bottom-3">
        <div className="card stat-mini"><span className="n">{progress.streakDays ?? 0}</span><span className="l">day logging streak</span></div>
        <div className="card stat-mini"><span className="n">{progress.onTargetDaysThisMonth ?? 0}</span><span className="l">days on target this month</span></div>
        <div className="card stat-mini"><span className="n">{progress.avgWaterLitres ?? 0} L</span><span className="l">avg. water intake</span></div>
      </div>
    </section>
  );
}
