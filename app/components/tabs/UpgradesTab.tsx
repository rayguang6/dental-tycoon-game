'use client';

import { formatCurrency, UPGRADES } from '../../gameData';

interface UpgradesTabProps {
  cash: number;
  upgradeLevels: {
    chair: number;
    dentist: number;
    assistant: number;
    marketing: number;
    cleaning: number;
  };
  onBuyUpgrade: (type: string, cost: number) => void;
}

export default function UpgradesTab({ cash, upgradeLevels, onBuyUpgrade }: UpgradesTabProps) {
  const upgradeData = [
    {
      id: 'chair',
      icon: '🪑',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-100 to-blue-200',
    },
    {
      id: 'dentist',
      icon: '👨‍⚕️',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-100 to-green-200',
    },
    {
      id: 'assistant',
      icon: '👩‍⚕️',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-100 to-purple-200',
    },
    {
      id: 'marketing',
      icon: '📢',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-100 to-orange-200',
    },
    {
      id: 'cleaning',
      icon: '🧽',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-100 to-cyan-200',
    },
  ];

  const getUpgradeCost = (upgradeId: string, currentLevel: number) => {
    const baseCost = UPGRADES[upgradeId as keyof typeof UPGRADES]?.baseCost || 0;
    return Math.floor(baseCost * Math.pow(1.5, currentLevel)); // 50% cost increase per level
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border-2 border-purple-200">
        <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-xl">
          <h3 className="text-lg font-bold text-purple-800">🛠️ Clinic Upgrades</h3>
        </div>
        <div className="px-6 py-4 space-y-4">
          {upgradeData.map((upgrade) => {
            const upgradeInfo = UPGRADES[upgrade.id as keyof typeof UPGRADES];
            const currentLevel = upgradeLevels[upgrade.id as keyof typeof upgradeLevels];
            const cost = getUpgradeCost(upgrade.id, currentLevel);
            const isMaxLevel = currentLevel >= upgradeInfo.maxLevel;
            const canAfford = cash >= cost;

            return (
              <div key={upgrade.id} className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Upgrade Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${upgrade.bgColor} rounded-full flex items-center justify-center text-3xl shadow-md`}>
                      {upgrade.icon}
                    </div>
                    
                    {/* Upgrade Info */}
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{upgradeInfo.name}</div>
                      <div className="text-sm text-gray-600">{upgradeInfo.description}</div>
                      <div className="text-xs text-purple-600 font-medium mt-1">
                        Level: {currentLevel}/{upgradeInfo.maxLevel}
                      </div>
                    </div>
                  </div>
                  
                  {/* Buy Button */}
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-xl mb-2">
                      {isMaxLevel ? 'MAX LEVEL' : formatCurrency(cost)}
                    </div>
                    <button 
                      onClick={() => onBuyUpgrade(upgrade.id, cost)}
                      disabled={!canAfford || isMaxLevel}
                      className={`px-6 py-3 bg-gradient-to-r ${upgrade.color} text-white rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none`}
                    >
                      {isMaxLevel ? 'MAXED' : !canAfford ? 'Need More Cash' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
