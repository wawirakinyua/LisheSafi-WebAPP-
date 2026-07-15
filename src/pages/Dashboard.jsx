import { useNavigate, useParams } from 'react-router-dom';
import { useVault } from '../context/VaultContext.jsx';
import AuthGate from '../components/dashboard/AuthGate.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import TopBar from '../components/dashboard/TopBar.jsx';
import OverviewView from '../components/dashboard/OverviewView.jsx';
import PlannerView from '../components/dashboard/PlannerView.jsx';
import ProgressView from '../components/dashboard/ProgressView.jsx';
import VaultView from '../components/dashboard/VaultView.jsx';

const VALID_VIEWS = ['overview', 'planner', 'progress', 'vault'];

export default function Dashboard() {
  const { status, appState, updateAndSync, forceSync, lock } = useVault();
  const { view } = useParams();
  const navigate = useNavigate();
  const activeView = VALID_VIEWS.includes(view) ? view : 'overview';

  if (status === 'checking') {
    return <div className="crypto-loading">Checking this device's secure enclave…</div>;
  }
  if (status === 'noVault' || status === 'locked') {
    return <AuthGate />;
  }
  if (!appState) {
    return <div className="crypto-loading">Decrypting your vault…</div>;
  }

  function handleNavigate(target) {
    if (target === 'lock') {
      lock();
      return;
    }
    navigate(`/dashboard/${target}`);
  }

  function addFood(food) {
    updateAndSync((prev) => ({
      ...prev,
      foodLog: [...prev.foodLog, { emoji: food.emoji, name: food.food_name_en, meta: 'Added just now', kcal: food.calories_per_serving }],
      today: {
        ...prev.today,
        caloriesConsumed: (prev.today.caloriesConsumed ?? 0) + food.calories_per_serving,
        proteinGramsToday: Math.round(((prev.today.proteinGramsToday ?? 0) + (food.protein_g_per_serving ?? 0)) * 10) / 10,
      },
    }));
  }

  function removeFood(index) {
    updateAndSync((prev) => {
      const removed = prev.foodLog[index];
      const foodLog = prev.foodLog.filter((_, i) => i !== index);
      return {
        ...prev,
        foodLog,
        today: {
          ...prev.today,
          caloriesConsumed: Math.max(0, (prev.today.caloriesConsumed ?? 0) - (removed?.kcal ?? 0)),
        },
      };
    });
  }

  function addWater(deltaLitres) {
    updateAndSync((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        waterLitres: Math.max(0, Math.round(((prev.today.waterLitres ?? 0) + deltaLitres) * 100) / 100),
      },
    }));
  }

  return (
    <div className="app">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} displayName={appState?.profile?.displayName} />
      <div className="main">
        <TopBar appState={appState} onAddFood={addFood} onSync={forceSync} />
        {activeView === 'overview' && <OverviewView appState={appState} onRemoveFood={removeFood} onAddWater={addWater} />}
        {activeView === 'planner' && <PlannerView />}
        {activeView === 'progress' && <ProgressView appState={appState} />}
        {activeView === 'vault' && <VaultView />}
      </div>
    </div>
  );
}
