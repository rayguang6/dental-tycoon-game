'use client';

import { formatCurrency, getPatientEmotion } from '../../gameData';
import { Patient } from '../../gameData';

interface PatientCardProps {
  patient: Patient;
  timeWaiting: number;
}

export default function PatientCard({ patient, timeWaiting }: PatientCardProps) {
  const patienceLeft = Math.max(0, patient.patience - timeWaiting);
  const patiencePercent = (patienceLeft / patient.maxPatience) * 100;
  const emotion = getPatientEmotion(patiencePercent);

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-amber-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        {/* Compact Patient Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-lg shadow-sm">
            {patient.humanEmoji}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-200">
            <span className="text-xs">{patient.emoji}</span>
          </div>
        </div>
        
        {/* Compact Patient Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 text-sm truncate">{patient.name}</div>
          <div className="text-xs text-gray-600 capitalize">{patient.type}</div>
        </div>
        
        {/* Compact Revenue & Patience */}
        <div className="text-right">
          <div className="font-bold text-green-600 text-sm">{formatCurrency(patient.revenue)}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm">{emotion}</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  patiencePercent > 60 ? 'bg-green-500' : 
                  patiencePercent > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${patiencePercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{patienceLeft}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
