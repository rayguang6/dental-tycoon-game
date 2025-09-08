'use client';

import { useState } from 'react';
import { formatCurrency, GAME_CONFIG } from '../../gameData';
import DayProgress from '../game/DayProgress';

interface HeaderProps {
  day: number;
  currentGameTime: number;
  cash: number;
  isPaused: boolean;
  onClean: () => void;
  onReset: () => void;
}

export default function Header({ day, currentGameTime, cash, isPaused, onClean, onReset }: HeaderProps) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dental Clinic Tycoon</h1>
            <p className="text-blue-100 mt-1">Build your dental empire!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="min-w-[300px]">
              <DayProgress day={day} currentGameTime={currentGameTime} />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClean}
                disabled={isPaused || cash < GAME_CONFIG.HYGIENE_CLEANING_COST}
                className="px-4 py-2 bg-green-200 text-green-900 rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧽 Clean ({formatCurrency(GAME_CONFIG.HYGIENE_CLEANING_COST)})
              </button>
              <button 
                onClick={() => setShowConfig(!showConfig)}
                disabled={isPaused}
                className="px-4 py-2 bg-purple-200 text-purple-900 rounded-lg hover:bg-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚙️ Config
              </button>
              <button 
                onClick={onReset}
                disabled={isPaused}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⚙️ Game Configuration</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-2">Patient Flow</h4>
              <div className="space-y-2 text-sm">
                <div>Arrival Rate: {GAME_CONFIG.BASE_ARRIVAL_RATE * 100}% per second</div>
                <div>Base Patience: 20-35 seconds</div>
                <div>Treatment Time: 8-18 seconds</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-2">Business Costs</h4>
              <div className="space-y-2 text-sm">
                <div>Daily Rent: {formatCurrency(GAME_CONFIG.DAILY_RENT)}</div>
                <div>Daily Salaries: {formatCurrency(GAME_CONFIG.DAILY_SALARIES)} per staff</div>
                <div>Utilities: {formatCurrency(GAME_CONFIG.DAILY_UTILITIES)}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-2">Hygiene System</h4>
              <div className="space-y-2 text-sm">
                <div>Loss per Treatment: {GAME_CONFIG.HYGIENE_LOSS_PER_TREATMENT} points</div>
                <div>Cleaning Cost: {formatCurrency(GAME_CONFIG.HYGIENE_CLEANING_COST)}</div>
                <div>Cleaning Gain: {GAME_CONFIG.HYGIENE_CLEANING_GAIN} points</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Business Tip:</strong> This game simulates real dental practice challenges. 
              Manage your cash flow carefully - you need to balance patient satisfaction, hygiene standards, 
              and operational costs to succeed!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
