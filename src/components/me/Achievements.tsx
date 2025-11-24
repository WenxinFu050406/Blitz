import { ArrowLeft, Trophy, Target, Zap, Award } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';

interface AchievementsProps {
  onBack: () => void;
}

export function Achievements({ onBack }: AchievementsProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).achievements;

  const achievements = [
    { id: 1, icon: '🏆', name: '1000 KM Club', description: 'Ride 1000 kilometers', progress: 100, unlocked: true, date: 'Nov 1, 2024' },
    { id: 2, icon: '⚡', name: 'Speed Demon', description: 'Reach 40 km/h', progress: 100, unlocked: true, date: 'Oct 15, 2024' },
    { id: 3, icon: '🌱', name: 'Eco Warrior', description: 'Save 100kg CO₂', progress: 100, unlocked: true, date: 'Oct 20, 2024' },
    { id: 4, icon: '⭐', name: 'Platinum Rider', description: 'Ride for 100 hours', progress: 87, unlocked: false },
    { id: 5, icon: '🎯', name: 'Explorer', description: 'Visit 20 different locations', progress: 75, unlocked: false },
    { id: 6, icon: '🔥', name: 'Streak Master', description: '30-day riding streak', progress: 60, unlocked: false },
    { id: 7, icon: '🌟', name: 'Night Rider', description: 'Complete 10 night rides', progress: 40, unlocked: false },
    { id: 8, icon: '🏔️', name: 'Mountain Climber', description: 'Climb 5000m elevation', progress: 30, unlocked: false },
    { id: 9, icon: '👥', name: 'Social Butterfly', description: 'Ride with 50 friends', progress: 84, unlocked: false },
    { id: 10, icon: '💪', name: 'Endurance King', description: 'Single ride over 100km', progress: 0, unlocked: false },
    { id: 11, icon: '🎨', name: 'Content Creator', description: 'Post 50 ride photos', progress: 56, unlocked: false },
    { id: 12, icon: '🌍', name: 'World Traveler', description: 'Ride in 10 cities', progress: 50, unlocked: false },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333] bg-black text-white">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-base">{t.title}</h2>
          <p className="text-xs opacity-90 mt-0.5 text-gray-400">{unlockedCount}/{achievements.length} {t.unlocked}</p>
        </div>
        <Trophy className="w-8 h-8 text-[#00ff88]" />
      </div>

      {/* Progress Stats */}
      <div className="p-4 bg-[#1a1a1a] border-b border-[#333]">
        <div className="grid grid-cols-3 gap-3 text-center text-white">
          <div>
            <p className="text-2xl text-[#00ff88]">{unlockedCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t.unlocked}</p>
          </div>
          <div>
            <p className="text-2xl text-[#00ff88]">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
            <p className="text-xs text-gray-400 mt-0.5">{t.complete}</p>
          </div>
          <div>
            <p className="text-2xl text-white">{achievements.length - unlockedCount}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t.inProgress}</p>
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-black">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 border transition-all ${
              achievement.unlocked
                ? 'border-[#00ff88] bg-[#1a1a1a] shadow-[0_0_10px_rgba(0,255,136,0.1)]'
                : 'border-[#333] bg-[#111] opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                  achievement.unlocked
                    ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]'
                    : 'bg-[#2a2a2a] grayscale border border-[#333]'
                }`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm text-white">{achievement.name}</h3>
                  {achievement.unlocked && (
                    <Badge className="bg-[#00ff88] text-black text-xs px-2 flex-shrink-0">
                      <Award className="w-3 h-3 mr-1" />
                      {t.unlocked}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                
                {achievement.unlocked ? (
                  <p className="text-xs text-[#00ff88]">{t.unlocked} {language === 'zh-CN' ? '' : 'on'} {achievement.date}</p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{t.progress}</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00ff88] transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
