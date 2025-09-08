'use client';

import { formatCurrency } from '../../gameData';

interface PnLPopupProps {
  pnlData: {
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
  };
  onClose: () => void;
}

export default function PnLPopup({ pnlData, onClose }: PnLPopupProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-2xl border-2 border-emerald-200 max-w-md w-full pointer-events-auto">
        {/* Header */}
        <div className="p-6 border-b border-emerald-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-emerald-800">💰 Day {pnlData.day} P&L Report</h2>
            <button onClick={onClose} className="text-emerald-500 hover:text-emerald-700 text-xl">
              &times;
            </button>
          </div>
        </div>

        {/* P&L Content */}
        <div className="p-6 space-y-4">
          {/* Revenue */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-green-700 mb-3">📈 Revenue</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Patient Treatments</span>
                <span className="font-semibold text-green-600">{formatCurrency(pnlData.breakdown.patientRevenue)}</span>
              </div>
              {pnlData.breakdown.eventIncome > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Income</span>
                  <span className="font-semibold text-green-600">{formatCurrency(pnlData.breakdown.eventIncome)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Revenue</span>
                  <span className="text-green-600">{formatCurrency(pnlData.revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-red-700 mb-3">📉 Expenses</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Rent</span>
                <span className="font-semibold text-red-600">{formatCurrency(pnlData.breakdown.rent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salaries</span>
                <span className="font-semibold text-red-600">{formatCurrency(pnlData.breakdown.salaries)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Utilities</span>
                <span className="font-semibold text-red-600">{formatCurrency(pnlData.breakdown.utilities)}</span>
              </div>
              {pnlData.breakdown.cleaning > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning</span>
                  <span className="font-semibold text-red-600">{formatCurrency(pnlData.breakdown.cleaning)}</span>
                </div>
              )}
              {pnlData.breakdown.eventExpenses > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Expenses</span>
                  <span className="font-semibold text-red-600">{formatCurrency(pnlData.breakdown.eventExpenses)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total Expenses</span>
                  <span className="text-red-600">{formatCurrency(pnlData.expenses)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Net Profit</h3>
              <div className={`text-2xl font-bold ${pnlData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(pnlData.netProfit)}
              </div>
            </div>
            {pnlData.netProfit >= 0 ? (
              <p className="text-sm text-green-600 mt-2">🎉 Great job! You made a profit!</p>
            ) : (
              <p className="text-sm text-red-600 mt-2">⚠️ You had a loss today. Consider reducing costs or increasing revenue.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
