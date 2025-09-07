'use client';

interface EventLogProps {
  logs: string[];
}

export default function EventLog({ logs }: EventLogProps) {
  const getLogIcon = (log: string) => {
    if (log.includes('arrived')) return '👋';
    if (log.includes('assigned')) return '🪑';
    if (log.includes('Treated')) return '✅';
    if (log.includes('Purchased')) return '🛒';
    return '📝';
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl shadow-lg border-2 border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-100 to-gray-100 rounded-t-xl">
        <h3 className="text-lg font-bold text-slate-800">📋 Clinic Activity</h3>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-sm">
                {getLogIcon(log)}
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
  );
}
