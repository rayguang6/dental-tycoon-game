'use client';

import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Header from './components/layout/Header';
import KPICards from './components/ui/KPICards';
import TabNavigation from './components/layout/TabNavigation';
import OperationsTab from './components/tabs/OperationsTab';
import UpgradesTab from './components/tabs/UpgradesTab';
import PNLTab from './components/tabs/PNLTab';
import StatsTab from './components/tabs/StatsTab';
import AchievementsTab from './components/tabs/AchievementsTab';

type TabType = 'operations' | 'upgrades' | 'pnl' | 'stats' | 'achievements';

export default function Home() {
  const { gameState, buyUpgrade, cleanClinic, resetGame } = useGameState();
  const [activeTab, setActiveTab] = useState<TabType>('operations');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleBuyUpgrade = (type: string, cost: number) => {
    buyUpgrade(type, cost);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <Header
          day={gameState.day}
          currentGameTime={gameState.currentGameTime}
          gameStartDate={gameState.gameStartDate}
          cash={gameState.cash}
          onClean={cleanClinic}
          onReset={resetGame}
        />

        {/* KPI Cards */}
        <KPICards
          cash={gameState.cash}
          reputation={gameState.reputation}
          hygiene={gameState.hygiene}
          energy={gameState.energy}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'operations' && (
            <OperationsTab
              patients={gameState.patients}
              treatments={gameState.treatments}
              chairs={gameState.chairs}
              logs={gameState.logs}
            />
          )}

          {activeTab === 'upgrades' && (
            <UpgradesTab
              cash={gameState.cash}
              chairs={gameState.chairs}
              onBuyUpgrade={handleBuyUpgrade}
            />
          )}

          {activeTab === 'pnl' && (
            <PNLTab
              totalRevenue={gameState.stats.totalRevenue}
              dentists={gameState.dentists}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab
              patientsServed={gameState.stats.patientsServed}
              totalRevenue={gameState.stats.totalRevenue}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsTab />
          )}
        </div>
      </div>
    </div>
  );
}