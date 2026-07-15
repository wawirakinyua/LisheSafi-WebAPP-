import { HashRouter, Routes, Route } from 'react-router-dom';
import { VaultProvider } from './context/VaultContext.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <HashRouter>
      <VaultProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:view" element={<Dashboard />} />
        </Routes>
      </VaultProvider>
    </HashRouter>
  );
}
