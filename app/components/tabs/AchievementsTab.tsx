'use client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

interface AchievementsTabProps {
  // Future: achievements state can be passed here
}

export default function AchievementsTab({}: AchievementsTabProps) {
  const achievements: Achievement[] = [
    {
      id: 'first-patient',
      title: 'First Patient',
      description: 'Treat your first patient',
      icon: '🎯',
      completed: true,
    },
    {
      id: 'first-1000',
      title: 'First $1000',
      description: 'Earn your first $1000',
      icon: '💰',
      completed: false,
    },
    {
      id: 'expansion',
      title: 'Expansion',
      description: 'Buy your first extra chair',
      icon: '🪑',
      completed: false,
    },
    {
      id: 'reputation-builder',
      title: 'Reputation Builder',
      description: 'Reach 50 reputation points',
      icon: '⭐',
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border-2 border-yellow-200 p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">🏆 Achievements</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg p-4 shadow-sm border-2 ${
                achievement.completed ? 'border-yellow-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              </div>
              <div className={`text-xs font-medium ${
                achievement.completed ? 'text-green-600' : 'text-gray-500'
              }`}>
                {achievement.completed ? '✅ Completed' : '🔒 Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
