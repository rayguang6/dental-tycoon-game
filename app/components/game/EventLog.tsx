'use client';

import { GameLog } from '../../gameData';

interface EventLogProps {
  logs: GameLog[];
}

export default function EventLog({ logs }: EventLogProps) {
  const getLogIcon = (log: GameLog) => {
    switch (log.type) {
      case 'treatment': return '👤';
      case 'event': return '📢';
      case 'upgrade': return '🛒';
      case 'cost': return '💸';
      case 'achievement': return '🏆';
      case 'system': return 'ℹ️';
      default: return '📝';
    }
  };

  const getLogTypeColor = (log: GameLog) => {
    switch (log.type) {
      case 'treatment': return 'from-green-100 to-green-200';
      case 'event': return 'from-blue-100 to-blue-200';
      case 'upgrade': return 'from-purple-100 to-purple-200';
      case 'cost': return 'from-red-100 to-red-200';
      case 'achievement': return 'from-yellow-100 to-yellow-200';
      case 'system': return 'from-gray-100 to-gray-200';
      default: return 'from-blue-100 to-blue-200';
    }
  };

  const formatEffects = (effects?: GameLog['effects']) => {
    if (!effects) return null;
    
    const parts: string[] = [];
    
    if (effects.cash && effects.cash > 0) {
      parts.push(`+$${effects.cash}`);
    } else if (effects.cash && effects.cash < 0) {
      parts.push(`-$${Math.abs(effects.cash)}`);
    }
    
    if (effects.reputation && effects.reputation > 0) {
      parts.push(`+${effects.reputation} rep`);
    } else if (effects.reputation && effects.reputation < 0) {
      parts.push(`${effects.reputation} rep`);
    }
    
    if (effects.hygiene && effects.hygiene > 0) {
      parts.push(`+${effects.hygiene} hygiene`);
    } else if (effects.hygiene && effects.hygiene < 0) {
      parts.push(`${effects.hygiene} hygiene`);
    }
    
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const getEffectsColor = (effects?: GameLog['effects']) => {
    if (!effects) return 'text-gray-500';
    
    const hasPositive = (effects.cash && effects.cash > 0) || 
                       (effects.reputation && effects.reputation > 0) || 
                       (effects.hygiene && effects.hygiene > 0);
    
    const hasNegative = (effects.cash && effects.cash < 0) || 
                       (effects.reputation && effects.reputation < 0) || 
                       (effects.hygiene && effects.hygiene < 0);
    
    if (hasPositive && !hasNegative) return 'text-green-600';
    if (hasNegative && !hasPositive) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl shadow-lg border-2 border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100 rounded-t-xl">
        <h3 className="text-lg font-bold text-slate-800">📋 Clinic Activity</h3>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log, index) => {
            const effects = formatEffects(log.effects);
            const effectsColor = getEffectsColor(log.effects);
            
            return (
              <div 
                key={log.id} 
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${getLogTypeColor(log)} rounded-full flex items-center justify-center text-sm`}>
                  {getLogIcon(log)}
                </div>
                <div className="text-sm text-gray-700 font-medium flex-1">
                  {log.type === 'event' ? (
                    <>
                      <span className="font-bold">{log.message.split(':')[0]}:</span>
                      {log.message.split(':').slice(1).join(':')}
                    </>
                  ) : (
                    log.message
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {effects && (
                    <div className={`text-xs font-semibold ${effectsColor}`}>
                      {effects}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    {index === 0 ? 'now' : `${index}s ago`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
