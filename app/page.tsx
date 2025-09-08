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
import EventPopup from './components/game/EventPopup';
import PnLPopup from './components/game/PnLPopup';

type TabType = 'operations' | 'upgrades' | 'pnl' | 'stats' | 'achievements';

export default function Home() {
  const { gameState, buyUpgrade, cleanClinic, resetGame, handleEventChoice, closePnLPopup } = useGameState();
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
          isPaused={gameState.isPaused}
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

        {/* Game Over Screen */}
        {gameState.isGameOver && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl pointer-events-auto">
              <div className="text-6xl mb-4">💸</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
              <p className="text-gray-600 mb-6">
                Your dental clinic went bankrupt on Day {gameState.day}.<br/>
                You served {gameState.stats.patientsServed} patients and earned ${gameState.stats.totalRevenue}.
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState.isGameWon && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl pointer-events-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Victory!</h2>
              <p className="text-gray-600 mb-6">
                Congratulations! You earned $100,000 and built a successful dental empire!<br/>
                You served {gameState.stats.patientsServed} patients and earned ${gameState.stats.totalRevenue}.
              </p>
              <button
                onClick={resetGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}


        {/* Event Popup */}
        {gameState.activeEvent && (
          <EventPopup
            event={gameState.activeEvent}
            onChoice={handleEventChoice}
          />
        )}

        {/* P&L Popup */}
        {gameState.showPnLPopup && gameState.dailyPnL.length > 0 && (
          <PnLPopup
            pnlData={gameState.dailyPnL[gameState.dailyPnL.length - 1]}
            onClose={closePnLPopup}
          />
        )}

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
              upgradeLevels={gameState.upgradeLevels}
              onBuyUpgrade={handleBuyUpgrade}
            />
          )}

          {activeTab === 'pnl' && (
            <PNLTab
              dailyPnL={gameState.dailyPnL}
              currentDay={gameState.day}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab
              patientsServed={gameState.stats.patientsServed}
              patientsLost={gameState.stats.patientsLost}
              totalRevenue={gameState.stats.totalRevenue}
              day={gameState.day}
              chairs={gameState.chairs}
              dentists={gameState.dentists}
              assistants={gameState.assistants}
              reputation={gameState.reputation}
              hygiene={gameState.hygiene}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsTab
              completedAchievements={gameState.completedAchievements}
              patientsServed={gameState.stats.patientsServed}
              totalRevenue={gameState.stats.totalRevenue}
              reputation={gameState.reputation}
              upgradeLevels={gameState.upgradeLevels}
            />
          )}
        </div>
      </div>
    </div>
  );
}