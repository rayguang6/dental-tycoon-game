'use client';

import { Event } from '../../gameData';

interface EventPopupProps {
  event: Event;
  onChoice: (choiceId: string) => void;
}

export default function EventPopup({ event, onChoice }: EventPopupProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'risk':
        return 'from-red-50 to-rose-50 border-red-200';
      case 'neutral':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return '🎯';
      case 'risk':
        return '⚠️';
      case 'neutral':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
      <div className={`bg-gradient-to-br ${getEventTypeColor(event.type)} rounded-xl shadow-2xl border-2 max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{event.emoji}</div>
            <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
          <p className="text-gray-600 text-sm">{event.description}</p>
        </div>

        {/* Choices */}
        <div className="p-6 space-y-3">
          <h3 className="font-semibold text-gray-700 mb-3">Choose your action:</h3>
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice.id)}
              className="w-full p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{choice.text}</span>
                {choice.cost && choice.cost > 0 && (
                  <span className="text-sm font-bold text-red-600">-${choice.cost}</span>
                )}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
