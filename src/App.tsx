import React, { useState } from 'react';
import { FitTrackerProvider, useFitTracker } from './context/FitTrackerContext';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { TemplatesView } from './views/TemplatesView';
import { StatsView } from './views/StatsView';
import { LayoutDashboard, FileText, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { cn } from './lib/utils';
import { ToastProvider } from './context/ToastContext';

function MainWindow() {
  const { state, updateSettings } = useFitTracker();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'templates' | 'stats' | 'settings'>('dashboard');

  if (!state.userSettings.hasOnboarded) {
    return <Onboarding onComplete={() => setCurrentTab('dashboard')} />;
  }

  const renderTab = () => {
    switch(currentTab) {
      case 'dashboard': return <Dashboard />;
      case 'templates': return <TemplatesView />;
      case 'stats': return <StatsView />;
      case 'settings': 
        return (
          <div className="max-w-md mx-auto bg-surface border border-border-main p-6 rounded-[16px] shadow-sm mt-6">
            <h2 className="text-[12px] uppercase tracking-[1px] text-text-dim font-bold mb-5">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-dim">Update Daily Calorie Goal</label>
                <input 
                  type="number" 
                  value={state.userSettings.dailyGoal} 
                  onChange={e => updateSettings({ dailyGoal: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg bg-surface-light border border-border-main text-text-main p-2 outline-none focus:border-accent" 
                />
              </div>
              <button 
                onClick={() => updateSettings({ hasOnboarded: false })}
                className="w-full p-2 bg-surface-light border border-border-main hover:border-text-dim text-text-main rounded-lg font-bold transition-colors"
              >
                Recalculate TDEE (Run Setup Again)
              </button>
            </div>
          </div>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Log' },
    { id: 'templates', icon: FileText, label: 'Templates' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ] as const;

  return (
    <div className="min-h-screen bg-bg-main text-text-main">
      <header className="bg-surface border-b border-border-main sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <div className="text-xl font-extrabold text-accent flex items-center gap-2 tracking-tight">
            <div className="w-6 h-6 border-4 border-accent rounded-md"></div>
            FitTracker
          </div>
          <div className="text-sm font-medium bg-surface-light text-text-dim px-3 py-1 rounded-full border border-border-main">
            Goal: <span className="text-text-main font-semibold">{state.userSettings.dailyGoal}</span> kcal
          </div>
        </div>
      </header>
      
      <main className="p-4 md:p-6">
        {renderTab()}
      </main>

      {/* Bottom Nav for mobile / floating for desktop */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-main pb-safe z-10 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:rounded-[16px] md:border md:px-2 md:py-2 md:shadow-2xl">
        <ul className="flex justify-around md:justify-center p-2 md:p-0 gap-1 md:gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <li key={item.id} className="flex-1 md:flex-none">
                <button
                  onClick={() => setCurrentTab(item.id)}
                  className={cn(
                    "w-full flex flex-col items-center p-2 rounded-lg md:flex-row md:px-4 md:py-2 transition-all duration-200",
                    isActive ? "bg-surface-light text-text-main border-t-2 md:border-t-0 md:border-l-2 md:rounded-l-none md:rounded-r-lg border-accent" : "text-text-dim hover:text-text-main hover:bg-surface-light"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "md:mr-2")} />
                  <span className={cn("text-[10px] mt-1 md:text-sm md:mt-0 font-medium", !isActive && "md:hidden")}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <FitTrackerProvider>
      <ToastProvider>
        <MainWindow />
      </ToastProvider>
    </FitTrackerProvider>
  );
}
