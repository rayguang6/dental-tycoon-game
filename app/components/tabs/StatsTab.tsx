'use client';

import { formatCurrency } from '../../gameData';

interface StatsTabProps {
  patientsServed: number;
  totalRevenue: number;
}

export default function StatsTab({ patientsServed, totalRevenue }: StatsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">📊 Clinic Statistics</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Patients Served Today</div>
            <div className="text-2xl font-bold text-green-600">{patientsServed}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Average Treatment Time</div>
            <div className="text-2xl font-bold text-blue-600">12s</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Clinic Efficiency</div>
            <div className="text-2xl font-bold text-purple-600">85%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
