'use client';

import { formatCurrency } from '../../gameData';

interface PNLTabProps {
  dailyPnL: Array<{
    day: number;
    revenue: number;
    expenses: number;
    netProfit: number;
    breakdown: {
      patientRevenue: number;
      eventIncome: number;
      rent: number;
      salaries: number;
      utilities: number;
      cleaning: number;
      eventExpenses: number;
    };
  }>;
  currentDay: number;
}

export default function PNLTab({ dailyPnL, currentDay }: PNLTabProps) {
  const latestPnL = dailyPnL[dailyPnL.length - 1];
  const totalRevenue = dailyPnL.reduce((sum, pnl) => sum + pnl.revenue, 0);
  const totalExpenses = dailyPnL.reduce((sum, pnl) => sum + pnl.expenses, 0);
  const totalNetProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border-2 border-emerald-200 p-6">
        <h3 className="text-lg font-bold text-emerald-800 mb-4">💰 Overall P&L Summary</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className={`text-2xl font-bold ${totalNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalNetProfit)}
            </div>
            <div className="text-sm text-gray-600">Net Profit</div>
          </div>
        </div>
      </div>

      {/* Latest Day P&L */}
      {latestPnL && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200 p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-4">📊 Day {latestPnL.day} P&L Breakdown</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-green-700 mb-4">📈 Revenue</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient Treatments</span>
                  <span className="font-semibold text-green-600">{formatCurrency(latestPnL.breakdown.patientRevenue)}</span>
                </div>
                {latestPnL.breakdown.eventIncome > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event Income</span>
                    <span className="font-semibold text-green-600">{formatCurrency(latestPnL.breakdown.eventIncome)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Revenue</span>
                    <span className="text-green-600">{formatCurrency(latestPnL.revenue)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expenses Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-red-700 mb-4">📉 Expenses</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rent</span>
                  <span className="font-semibold text-red-600">{formatCurrency(latestPnL.breakdown.rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salaries</span>
                  <span className="font-semibold text-red-600">{formatCurrency(latestPnL.breakdown.salaries)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Utilities</span>
                  <span className="font-semibold text-red-600">{formatCurrency(latestPnL.breakdown.utilities)}</span>
                </div>
                {latestPnL.breakdown.cleaning > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning</span>
                    <span className="font-semibold text-red-600">{formatCurrency(latestPnL.breakdown.cleaning)}</span>
                  </div>
                )}
                {latestPnL.breakdown.eventExpenses > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event Expenses</span>
                    <span className="font-semibold text-red-600">{formatCurrency(latestPnL.breakdown.eventExpenses)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Expenses</span>
                    <span className="text-red-600">{formatCurrency(latestPnL.expenses)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-bold text-gray-800">Net Profit (Day {latestPnL.day})</h4>
              <div className={`text-2xl font-bold ${latestPnL.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(latestPnL.netProfit)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical P&L */}
      {dailyPnL.length > 1 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border-2 border-purple-200 p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-4">📈 Historical P&L</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dailyPnL.slice(-10).reverse().map((pnl) => (
              <div key={pnl.day} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">Day {pnl.day}</div>
                    <div className="text-sm text-gray-600">
                      Revenue: {formatCurrency(pnl.revenue)} | Expenses: {formatCurrency(pnl.expenses)}
                    </div>
                  </div>
                  <div className={`font-bold ${pnl.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(pnl.netProfit)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
