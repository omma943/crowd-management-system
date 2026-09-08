import React, { useState } from 'react';
import { CrowdProvider } from './context/CrowdContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlaceProvider } from './context/PlaceContext';
import { Header } from './components/layout/Header';
import { Sidebar, type NavItem } from './components/layout/Sidebar';
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
import { Menu } from 'lucide-react';

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
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <div className="relative">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-cyan-500 text-white shadow-xl shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Header
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onNavigateHome={() => setCurrentTab('home')}
          />
        </div>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

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
