import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { CrowdProvider, useCrowdData } from './context/CrowdContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import type { NavTab } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { Analytics } from './pages/Analytics';
import { Events } from './pages/Events';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { SimulateEventModal } from './components/events/SimulateEventModal';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const { dispatchSimulatedEvent } = useCrowdData();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'live':
        return <LiveMonitoring />;
      case 'analytics':
        return <Analytics />;
      case 'events':
        return <Events onOpenSimulator={() => setIsSimulatorOpen(true)} />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenSimulator={() => setIsSimulatorOpen(true)}
    >
      {renderActivePage()}

      {/* Simulator Modal for Operator Manual Testing */}
      <SimulateEventModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSubmit={dispatchSimulatedEvent}
      />
    </DashboardLayout>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <CrowdProvider>
          <MainContent />
        </CrowdProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
