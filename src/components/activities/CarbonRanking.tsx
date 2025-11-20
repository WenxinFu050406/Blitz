import { Trophy, TrendingUp, Award, Leaf, ArrowLeft } from 'lucide-react';
import { carbonRankings } from '../../data/mockData';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';

const badgeConfig = {
  diamond: { color: 'from-cyan-400 to-blue-400', emoji: '💎', name: 'Diamond' },
  platinum: { color: 'from-slate-300 to-slate-400', emoji: '⭐', name: 'Platinum' },
  gold: { color: 'from-yellow-400 to-yellow-500', emoji: '🥇', name: 'Gold' },
  silver: { color: 'from-slate-200 to-slate-300', emoji: '🥈', name: 'Silver' },
  bronze: { color: 'from-orange-300 to-orange-400', emoji: '🥉', name: 'Bronze' },
};

interface CarbonRankingProps {
  onBack?: () => void;
}

export function CarbonRanking({ onBack }: CarbonRankingProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).carbonRanking;
  const currentUser = carbonRankings[0];
  const badgeInfo = badgeConfig[currentUser.badge];

  return (
    <div className="flex flex-col h-full bg-black overflow-auto">
      {onBack && <FixedBackButton onClick={onBack} />}
      
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#00ff88] to-[#00cc66] text-black">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-xl">{t.title}</h1>
            <p className="text-xs opacity-80 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Your Rank */}
      <div className="p-4">
        <Card className="p-6 bg-gradient-to-br from-[#00ff88] to-[#00cc66] text-black border-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Your Rank</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h1 className="text-5xl">#{currentUser.rank}</h1>
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${badgeInfo.color} flex items-center justify-center shadow-lg text-3xl border-4 border-black`}>
              {badgeInfo.emoji}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs opacity-80">CO₂ Saved</p>
              <p className="text-xl mt-1">{currentUser.carbonSaved} kg</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs opacity-80">Distance</p>
              <p className="text-xl mt-1">{currentUser.distance} km</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Badge Collection */}
      <div className="p-4">
        <h3 className="mb-3 text-white">Your Badges</h3>
        <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a]">
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(badgeConfig).map(([key, config]) => {
              const isUnlocked = key === currentUser.badge || 
                (key === 'gold' && currentUser.rank <= 3) ||
                (key === 'silver' && currentUser.rank <= 5);
              return (
                <div key={key} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md ${
                      isUnlocked
                        ? `bg-gradient-to-br ${config.color}`
                        : 'bg-zinc-800 grayscale opacity-40'
                    }`}
                  >
                    {config.emoji}
                  </div>
                  <p className={`text-xs mt-1 text-center ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {config.name}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Leaderboard */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white">Leaderboard</h3>
          <Badge variant="outline" className="gap-1">
            <Leaf className="w-3 h-3" />
            Top 100
          </Badge>
        </div>
        <div className="space-y-2">
          {carbonRankings.map((user, index) => {
            const badge = badgeConfig[user.badge];
            const isCurrentUser = user.userId === '1';
            return (
              <Card
                key={user.userId}
                className={`p-4 bg-[#1a1a1a] border-[#2a2a2a] ${
                  isCurrentUser
                    ? 'border-2 border-[#00ff88]'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-10 text-center">
                    {index < 3 ? (
                      <div className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    ) : (
                      <span className="text-lg text-gray-400">#{user.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <p className={isCurrentUser ? 'text-[#00ff88]' : 'text-white'}>
                      {user.userName}
                      {isCurrentUser && (
                        <Badge className="ml-2 bg-[#00ff88] text-black">You</Badge>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">{user.distance} km ridden</p>
                  </div>

                  {/* Badge & Carbon */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-lg">{badge.emoji}</span>
                      <span className="text-sm text-gray-400">{badge.name}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Leaf className="w-3 h-3 text-[#00ff88]" />
                      <span className="text-sm text-[#00ff88]">{user.carbonSaved} kg</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Impact Stats */}
      <div className="p-4 pb-8">
        <h3 className="mb-3 text-white">Your Environmental Impact</h3>
        <Card className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#2a2a2a]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00ff88] rounded-full flex items-center justify-center">
                🌳
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Equivalent to planting</p>
                <p className="text-xl text-[#00ff88]">12 trees</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                ⚡
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Energy saved</p>
                <p className="text-xl text-yellow-400">584 kWh</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#00ff88] rounded-full flex items-center justify-center">
                🚗
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400">Car miles avoided</p>
                <p className="text-xl text-[#00ff88]">775 miles</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}