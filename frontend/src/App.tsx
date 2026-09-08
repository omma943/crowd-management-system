import React, { useState } from 'react';
import { CrowdProvider } from './context/CrowdContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlaceProvider } from './context/PlaceContext';
import { Header } from './components/layout/Header';
import { Sidebar, type NavItem } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { SimulateEventModal } from './components/events/SimulateEventModal';
import { useCrowdData } from './context/CrowdContext';

// Pages
import { HomeExplorePlaces } from './pages/HomeExplorePlaces';
import { Dashboard } from './pages/Dashboard';
import { CapacityView } from './pages/CapacityView';
import { HelpFacilitiesView } from './pages/HelpFacilitiesView';
import { Analytics } from './pages/Analytics';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavItem>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const { dispatchSimulatedEvent } = useCrowdData();

  const handleSelectPlaceToDashboard = (_placeId: string) => {
    setCurrentTab('live-crowd');
  };

  const renderActivePage = () => {
    switch (currentTab) {
      case 'home':
        return <HomeExplorePlaces onSelectPlaceToDashboard={handleSelectPlaceToDashboard} />;
      case 'live-crowd':
        return <Dashboard />;
      case 'capacity':
        return <CapacityView />;
      case 'help':
        return <HelpFacilitiesView />;
      case 'analytics':
        return <Analytics />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <HomeExplorePlaces onSelectPlaceToDashboard={handleSelectPlaceToDashboard} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar navigation for desktop and mobile drawer */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          onNavigateHome={() => setCurrentTab('home')}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Page Content View */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Real-Time Event Simulation Modal */}
      <SimulateEventModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSubmit={dispatchSimulatedEvent}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <CrowdProvider>
          <PlaceProvider>
            <AppContent />
          </PlaceProvider>
        </CrowdProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
