'use client';

import { ACHIEVEMENTS } from '../../gameData';

interface AchievementsTabProps {
  completedAchievements: string[];
  patientsServed: number;
  totalRevenue: number;
  reputation: number;
  upgradeLevels: {
    chair: number;
    dentist: number;
    assistant: number;
    marketing: number;
    cleaning: number;
  };
}

export default function AchievementsTab({ 
  completedAchievements, 
  patientsServed, 
  totalRevenue, 
  reputation, 
  upgradeLevels 
}: AchievementsTabProps) {
  const achievements = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
    const isCompleted = completedAchievements.includes(id);
    
    // Calculate progress for incomplete achievements
    let progress = 0;
    let progressText = '';
    
    if (!isCompleted) {
      switch (achievement.condition.type) {
        case 'patients_served':
          progress = Math.min(100, (patientsServed / achievement.condition.value) * 100);
          progressText = `${patientsServed}/${achievement.condition.value} patients`;
          break;
        case 'total_revenue':
          progress = Math.min(100, (totalRevenue / achievement.condition.value) * 100);
          progressText = `$${totalRevenue}/$${achievement.condition.value}`;
          break;
        case 'reputation':
          progress = Math.min(100, (reputation / achievement.condition.value) * 100);
          progressText = `${reputation}/${achievement.condition.value} reputation`;
          break;
        case 'upgrade_level':
          const currentLevel = upgradeLevels[achievement.condition.upgrade as keyof typeof upgradeLevels];
          progress = Math.min(100, (currentLevel / achievement.condition.value) * 100);
          progressText = `Level ${currentLevel}/${achievement.condition.value}`;
          break;
      }
    }
    
    return {
      id,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      reward: achievement.reward,
      completed: isCompleted,
      progress,
      progressText,
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg border-2 border-yellow-200 p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">🏆 Achievements</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-lg p-4 shadow-sm border-2 ${
                achievement.completed ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">+${achievement.reward}</div>
                </div>
              </div>
              
              {achievement.completed ? (
                <div className="text-sm font-medium text-green-600 flex items-center gap-1">
                  ✅ Completed
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">{achievement.progressText}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">🔒 In Progress</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
