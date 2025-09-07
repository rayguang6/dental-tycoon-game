'use client';

import { formatCurrency } from '../../gameData';

interface KPICardsProps {
  cash: number;
  reputation: number;
  hygiene: number;
  energy: number;
}

export default function KPICards({ cash, reputation, hygiene, energy }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-xl">
            💰
          </div>
          <div className="text-sm text-green-600 font-medium">Cash</div>
        </div>
        <div className="text-2xl font-bold text-green-700">{formatCurrency(cash)}</div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-xl">
            ⭐
          </div>
          <div className="text-sm text-blue-600 font-medium">Reputation</div>
        </div>
        <div className="text-2xl font-bold text-blue-700">{reputation}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-xl">
            🧽
          </div>
          <div className="text-sm text-purple-600 font-medium">Hygiene</div>
        </div>
        <div className="text-2xl font-bold text-purple-700">{hygiene}%</div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg border-2 border-orange-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-xl">
            ⚡
          </div>
          <div className="text-sm text-orange-600 font-medium">Energy</div>
        </div>
        <div className="text-2xl font-bold text-orange-700">{energy}%</div>
      </div>
    </div>
  );
}
