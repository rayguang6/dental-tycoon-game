'use client';

import { formatCurrency, GAME_CONFIG } from '../../gameData';

interface PNLTabProps {
  totalRevenue: number;
  dentists: number;
}

export default function PNLTab({ totalRevenue, dentists }: PNLTabProps) {
  const totalExpenses = GAME_CONFIG.DAILY_RENT + (GAME_CONFIG.DAILY_SALARIES * dentists) + GAME_CONFIG.DAILY_UTILITIES;
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border-2 border-emerald-200 p-6">
        <h3 className="text-lg font-bold text-emerald-800 mb-4">💰 Profit & Loss Statement</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-green-700 mb-4">📈 Revenue</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient Treatments</span>
                <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Income</span>
                <span className="font-semibold text-green-600">$0</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Revenue</span>
                  <span className="text-green-600">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-red-700 mb-4">📉 Expenses</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rent</span>
                <span className="font-semibold text-red-600">{formatCurrency(GAME_CONFIG.DAILY_RENT)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Staff Salaries</span>
                <span className="font-semibold text-red-600">{formatCurrency(GAME_CONFIG.DAILY_SALARIES * dentists)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilities</span>
                <span className="font-semibold text-red-600">{formatCurrency(GAME_CONFIG.DAILY_UTILITIES)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Expenses</span>
                  <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-gray-800">Net Profit (Today)</h4>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(netProfit)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
