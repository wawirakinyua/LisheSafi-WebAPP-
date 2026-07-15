import { useState } from 'react';
import { PLANNER_RULES } from '../../data/plannerRules';

export default function PlannerView() {
  const [goal, setGoal] = useState('highProtein');
  const [remaining, setRemaining] = useState(500);
  const [results, setResults] = useState(() => PLANNER_RULES.highProtein);

  function recommend() {
    const options = PLANNER_RULES[goal] ?? [];
    const fitting = options.filter((o) => o.kcal <= remaining || remaining === 0);
    setResults(fitting.length ? fitting : options);
  }

  return (
    <section className="view active" id="planner">
      <div className="view-head">
        <h2>Localized Meal Planner</h2>
        <p>Get personalized meal suggestions based on your goals and available ingredients.</p>
      </div>

      <div className="planner-controls">
        <label>
          Goal
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="highProtein">High protein</option>
            <option value="weightLoss">Weight loss</option>
            <option value="balanced">Balanced</option>
            <option value="budget">Budget-friendly</option>
          </select>
        </label>
        <label>
          Calories remaining today
          <input type="number" min="0" step="10" value={remaining} onChange={(e) => setRemaining(parseInt(e.target.value, 10) || 0)} />
        </label>
        <button className="btn-sync" onClick={recommend}>Get Suggestions</button>
      </div>

      <div className="reco-grid">
        {results.length === 0 && <p className="log-empty">No suggestions for this goal yet.</p>}
        {results.map((r) => (
          <div className="reco-card" key={r.title}>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <div className="reco-tags">
              {r.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
            <div className="reco-kcal">~{r.kcal} kcal</div>
          </div>
        ))}
      </div>
    </section>
  );
}
