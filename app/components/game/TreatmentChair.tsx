'use client';

import { formatCurrency } from '../../gameData';
import { Treatment } from '../../gameData';

interface TreatmentChairProps {
  treatment: Treatment | null;
  chairIndex: number;
}

export default function TreatmentChair({ treatment, chairIndex }: TreatmentChairProps) {
  const progressPercent = treatment ? ((treatment.totalTime - treatment.remainingTime) / treatment.totalTime) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-emerald-200 hover:shadow-md transition-all duration-200">
      {treatment ? (
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2">
            {/* Compact Patient Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center text-lg shadow-sm">
                {treatment.humanEmoji}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-200">
                <span className="text-xs">{treatment.emoji}</span>
              </div>
            </div>
            
            {/* Compact Patient Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">{treatment.patientName}</div>
              <div className="text-xs text-gray-600 capitalize">{treatment.type}</div>
            </div>
            
            {/* Compact Revenue & Time */}
            <div className="text-right">
              <div className="font-bold text-green-600 text-sm">{formatCurrency(treatment.revenue)}</div>
              <div className="text-xs text-emerald-600 font-medium">
                {Math.ceil(treatment.remainingTime)}s left
              </div>
            </div>
          </div>
          
          {/* Compact Progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 shadow-sm">
            🪑
          </div>
          <div className="text-gray-500 font-medium text-sm">Chair {chairIndex + 1}</div>
          <div className="text-gray-400 text-xs">Ready</div>
        </div>
      )}
    </div>
  );
}
