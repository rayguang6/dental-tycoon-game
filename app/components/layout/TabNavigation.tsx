'use client';

type TabType = 'operations' | 'upgrades' | 'pnl' | 'stats' | 'achievements';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'operations' as TabType, label: '🏥 Operations', color: 'from-blue-500 to-blue-600' },
    { id: 'upgrades' as TabType, label: '⚡ Upgrades', color: 'from-purple-500 to-purple-600' },
    { id: 'pnl' as TabType, label: '💰 P&L', color: 'from-emerald-500 to-emerald-600' },
    { id: 'stats' as TabType, label: '📊 Stats', color: 'from-green-500 to-green-600' },
    { id: 'achievements' as TabType, label: '🏆 Achievements', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-4 text-center font-semibold transition-all duration-300 text-sm ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
