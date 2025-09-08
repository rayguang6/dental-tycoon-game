'use client';

import { GAME_CONFIG, isBusinessHours } from '../../gameData';

interface DayProgressProps {
  day: number;
  currentGameTime: number;
}

export default function DayProgress({ day, currentGameTime }: DayProgressProps) {
  // Calculate day progress (0-1)
  const dayProgress = (currentGameTime % GAME_CONFIG.DAY_DURATION) / GAME_CONFIG.DAY_DURATION;
  
  // Calculate time remaining in current day (in seconds)
  const timeRemainingInDay = GAME_CONFIG.DAY_DURATION - (currentGameTime % GAME_CONFIG.DAY_DURATION);
  
  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.ceil(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  // Check if clinic is open
  const isOpen = isBusinessHours(currentGameTime);
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
      {/* Main Info Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold">Day {day}</div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isOpen 
              ? 'bg-green-500/20 text-green-200' 
              : 'bg-red-500/20 text-red-200'
          }`}>
            {isOpen ? 'Open' : 'Closed'}
          </div>
        </div>
        <div className="text-sm text-blue-200">
          {formatTimeRemaining(timeRemainingInDay)}
        </div>
      </div>

      {/* Single Progress Bar */}
      <div className="w-full bg-blue-900/30 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
            isOpen 
              ? 'bg-gradient-to-r from-green-400 to-green-300' 
              : 'bg-gradient-to-r from-blue-400 to-blue-300'
          }`}
          style={{ width: `${dayProgress * 100}%` }}
        />
      </div>
    </div>
  );
}
