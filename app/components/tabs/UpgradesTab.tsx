'use client';

import { formatCurrency } from '../../gameData';

interface UpgradesTabProps {
  cash: number;
  chairs: number;
  onBuyUpgrade: (type: string, cost: number) => void;
}

export default function UpgradesTab({ cash, chairs, onBuyUpgrade }: UpgradesTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border-2 border-purple-200">
        <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-t-xl">
          <h3 className="text-lg font-bold text-purple-800">🛠️ Clinic Upgrades</h3>
        </div>
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Upgrade Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-3xl shadow-md">
                  🪑
                </div>
                
                {/* Upgrade Info */}
                <div>
                  <div className="font-bold text-gray-800 text-lg">Extra Treatment Chair</div>
                  <div className="text-sm text-gray-600">Increase your clinic capacity</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">
                    Current chairs: {chairs}
                  </div>
                </div>
              </div>
              
              {/* Buy Button */}
              <div className="text-right">
                <div className="font-bold text-green-600 text-xl mb-2">
                  {formatCurrency(800)}
                </div>
                <button 
                  onClick={() => onBuyUpgrade('chair', 800)}
                  disabled={cash < 800}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none"
                >
                  {cash < 800 ? 'Need More Cash' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
