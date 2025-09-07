'use client';

import { useState } from 'react';
import { formatCurrency, getPatientEmotion, GAME_CONFIG } from './gameData';
import { useGameState } from './hooks/useGameState';

export default function Home() {
  const { gameState, buyUpgrade, cleanClinic, resetGame } = useGameState();
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dental Clinic Tycoon</h1>
            <p className="text-slate-600">Build your dental empire</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">Day {gameState.day}</div>
              <div className="text-sm text-gray-600">Current Day</div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={cleanClinic}
                disabled={gameState.cash < GAME_CONFIG.HYGIENE_CLEANING_COST}
                className="px-4 py-2 bg-green-200 text-green-900 rounded-lg hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧽 Clean ({formatCurrency(GAME_CONFIG.HYGIENE_CLEANING_COST)})
              </button>
              <button 
                onClick={() => setShowConfig(!showConfig)}
                className="px-4 py-2 bg-purple-200 text-purple-900 rounded-lg hover:bg-purple-300 transition-colors"
              >
                ⚙️ Config
              </button>
              <button 
                onClick={resetGame}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset Game
              </button>
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

        {/* KPI Cards - Only the 4 core metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-xl">
                💰
              </div>
              <div className="text-sm font-semibold text-green-700">Cash</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(gameState.cash)}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg border-2 border-blue-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-xl">
                ⭐
              </div>
              <div className="text-sm font-semibold text-blue-700">Reputation</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {gameState.reputation}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl shadow-lg border-2 border-purple-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-xl">
                🧽
              </div>
              <div className="text-sm font-semibold text-purple-700">Hygiene</div>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {gameState.hygiene}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg border-2 border-orange-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-xl">
                ⚡
              </div>
              <div className="text-sm font-semibold text-orange-700">Energy</div>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {gameState.energy}
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Patient Queue */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-200">
            <div className="px-6 py-4 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-800">🪑 Waiting Room</h3>
                <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {gameState.patients.length} waiting
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              {gameState.patients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🪑</div>
                  <div className="text-amber-600 font-medium">Waiting room is empty</div>
                  <div className="text-amber-500 text-sm">Patients will arrive soon!</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {gameState.patients.map((patient, index) => {
                    const timeWaiting = Math.floor((Date.now() - patient.createdAt) / 1000);
                    const patienceLeft = Math.max(0, patient.patience - timeWaiting);
                    const patiencePercent = (patienceLeft / patient.maxPatience) * 100;
                    const emotion = getPatientEmotion(patiencePercent);
                    
                    return (
                      <div
                        key={patient.id}
                        className="bg-white rounded-xl p-4 shadow-md border-2 border-amber-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Patient Avatar */}
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-3xl shadow-md">
                                {patient.humanEmoji}
                              </div>
                              {/* Service Type Badge */}
                              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-200">
                                <span className="text-sm">{patient.emoji}</span>
                              </div>
                            </div>
                            
                            {/* Patient Info */}
                            <div>
                              <div className="font-bold text-gray-800 text-lg">{patient.name}</div>
                              <div className="text-sm text-gray-600 capitalize">{patient.type}</div>
                            </div>
                          </div>
                          
                          {/* Revenue & Patience Bar */}
                          <div className="text-right">
                            <div className="font-bold text-green-600 text-xl mb-3">
                              {formatCurrency(patient.revenue)}
                            </div>
                            
                            {/* Patience with Emotion */}
                            <div className="flex items-center gap-2 justify-end">
                              <div className="text-2xl">{emotion}</div>
                              <div className="w-32">
                                <div className="text-xs text-gray-600 mb-1 text-center">Patience</div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      patiencePercent > 60 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                                      patiencePercent > 30 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                      'bg-gradient-to-r from-red-400 to-red-500'
                                    }`}
                                    style={{ width: `${patiencePercent}%` }}
                                  />
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-center">
                                  {patienceLeft}s left
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Treatment Chairs */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border-2 border-emerald-200">
            <div className="px-6 py-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-emerald-800">🦷 Treatment Room</h3>
                <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {gameState.treatments.length}/{gameState.chairs} active
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="grid gap-4">
                {Array.from({ length: gameState.chairs }, (_, index) => {
                  const treatment = gameState.treatments.find(t => t.chairId === index);
                  const progressPercent = treatment ? ((treatment.totalTime - treatment.remainingTime) / treatment.totalTime) * 100 : 0;
                  
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-4 shadow-md border-2 border-emerald-100 hover:shadow-lg transition-all duration-300"
                    >
                      {treatment ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              {/* Patient Avatar */}
                              <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center text-2xl shadow-md">
                                  {treatment.humanEmoji}
                                </div>
                                {/* Service Type Badge */}
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-emerald-200">
                                  <span className="text-xs">{treatment.emoji}</span>
                                </div>
                              </div>
                              
                              {/* Patient Info */}
                              <div>
                                <div className="font-bold text-gray-800">{treatment.patientName}</div>
                                <div className="text-sm text-gray-600 capitalize">{treatment.type}</div>
                                <div className="text-xs text-emerald-600 font-medium">
                                  {Math.ceil(treatment.remainingTime)}s left
                                </div>
                              </div>
                            </div>
                            
                            {/* Revenue */}
                            <div className="text-right">
                              <div className="font-bold text-green-600 text-lg">
                                {formatCurrency(treatment.revenue)}
                              </div>
                              <div className="text-xs text-gray-500">Payment</div>
                            </div>
                          </div>
                          
                          {/* Progress bar with animation */}
                          <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${progressPercent}%` }}
                              >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                              </div>
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-1">
                              <span className="font-medium">{Math.round(progressPercent)}% complete</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 shadow-md">
                            🪑
                          </div>
                          <div className="text-gray-500 font-medium">Chair {index + 1}</div>
                          <div className="text-gray-400 text-sm">Ready for patient</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Section */}
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
                      Current chairs: {gameState.chairs}
                    </div>
                  </div>
                </div>
                
                {/* Buy Button */}
                <div className="text-right">
                  <div className="font-bold text-green-600 text-xl mb-2">
                    {formatCurrency(800)}
                  </div>
                  <button 
                    onClick={() => buyUpgrade('chair', 800)}
                    disabled={gameState.cash < 800}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:transform-none"
                  >
                    {gameState.cash < 800 ? 'Need More Cash' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl shadow-lg border-2 border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100 rounded-t-xl">
            <h3 className="text-lg font-bold text-slate-800">📋 Clinic Activity</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {gameState.logs.map((log, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-sm">
                    {log.includes('arrived') ? '👋' : 
                     log.includes('assigned') ? '🪑' : 
                     log.includes('Treated') ? '✅' : 
                     log.includes('Purchased') ? '🛒' : '📝'}
                  </div>
                  <div className="text-sm text-gray-700 font-medium flex-1">
                    {log}
                  </div>
                  <div className="text-xs text-gray-400">
                    {index === 0 ? 'now' : `${index}s ago`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}