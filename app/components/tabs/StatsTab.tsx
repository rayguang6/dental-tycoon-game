'use client';

import { formatCurrency } from '../../gameData';

interface StatsTabProps {
  patientsServed: number;
  patientsLost: number;
  totalRevenue: number;
  day: number;
  chairs: number;
  dentists: number;
  assistants: number;
  reputation: number;
  hygiene: number;
}

export default function StatsTab({ 
  patientsServed, 
  patientsLost, 
  totalRevenue, 
  day, 
  chairs, 
  dentists, 
  assistants, 
  reputation, 
  hygiene 
}: StatsTabProps) {
  // Calculate real statistics
  const totalPatients = patientsServed + patientsLost;
  const successRate = totalPatients > 0 ? Math.round((patientsServed / totalPatients) * 100) : 0;
  const averageRevenuePerPatient = patientsServed > 0 ? Math.round(totalRevenue / patientsServed) : 0;
  const dailyRevenue = Math.round(totalRevenue / Math.max(1, day - 1)); // Revenue per day
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">📊 Clinic Statistics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Patients Served</div>
            <div className="text-2xl font-bold text-green-600">{patientsServed}</div>
            <div className="text-xs text-gray-500">{patientsLost} lost</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <div className="text-xs text-gray-500">{formatCurrency(dailyRevenue)}/day</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
            <div className="text-xs text-gray-500">{totalPatients} total patients</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Avg Revenue/Patient</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(averageRevenuePerPatient)}</div>
            <div className="text-xs text-gray-500">per treatment</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Clinic Capacity</div>
            <div className="text-2xl font-bold text-orange-600">{chairs} chairs</div>
            <div className="text-xs text-gray-500">{dentists} dentists, {assistants} assistants</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">Clinic Rating</div>
            <div className="text-2xl font-bold text-indigo-600">{reputation}</div>
            <div className="text-xs text-gray-500">{hygiene}% hygiene</div>
          </div>
        </div>
      </div>
    </div>
  );
}
