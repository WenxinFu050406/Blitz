import { useState } from 'react';
import { MapPin, TrendingUp, UserPlus, Check, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FixedBackButton } from '../ui/FixedBackButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { UserAvatar } from '../UserAvatar';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';
import { friendRequestsDB } from '../../utils/storage';

interface AddFriendProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    distance: number;
    bio: string;
  };
  onBack: () => void;
}

export function AddFriend({ user, onBack }: AddFriendProps) {
  const { language } = useLanguage();
  const t = getTranslation(language);
  
  // Load request sent status from backend storage
  const [requestSent, setRequestSent] = useState(() => friendRequestsDB.isSent(user.id));

  const handleToggleRequest = () => {
    const newRequestStatus = friendRequestsDB.toggle(user.id);
    setRequestSent(newRequestStatus);
  };

  const texts = {
    en: {
      profile: 'Profile',
      sendRequest: 'Send Friend Request',
      requestSent: 'Request Sent',
      cancelRequest: 'Cancel Request',
      totalDistance: 'Total Distance',
      recentActivity: 'Recent Activity',
      weeklyRides: 'Weekly Rides',
      avgSpeed: 'Avg Speed',
      carbonSaved: 'CO₂ Saved',
      about: 'About',
      stats: 'Statistics',
      rides: 'rides',
      hours: 'hours',
    },
    'zh-CN': {
      profile: '个人资料',
      sendRequest: '发送好友请求',
      requestSent: '请求已发送',
      cancelRequest: '取消请求',
      totalDistance: '总里程',
      recentActivity: '近期活动',
      weeklyRides: '周骑行次数',
      avgSpeed: '平均速度',
      carbonSaved: '碳减排',
      about: '关于',
      stats: '统计数据',
      rides: '次',
      hours: '小时',
    },
  };

  const text = texts[language];

  // Mock user stats
  const userStats = {
    totalRides: 156,
    totalTime: 87.5,
    avgSpeed: 14.3,
    carbonSaved: 145.8,
    weeklyRides: 5,
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-auto">
      <FixedBackButton onClick={onBack} />

      {/* Header */}
      <div className="p-5 bg-black text-white pt-16 border-b border-[#333]">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-[#1a1a1a] backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden mb-3 border-2 border-[#00ff88]">
            <UserAvatar src={user.avatar} alt={user.name} className="text-5xl" />
          </div>
          <h1 className="text-2xl mb-1">{user.name}</h1>
          <div className="flex items-center gap-1.5 text-sm opacity-90 mb-3 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
          <Badge className="bg-[#1a1a1a] border-[#00ff88] text-[#00ff88]">
            <TrendingUp className="w-3 h-3 mr-1" />
            {user.distance} km
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Action Button */}
        <div>
          {!requestSent ? (
            <Button
              onClick={handleToggleRequest}
              className="w-full bg-[#00ff88] hover:bg-[#00cc66] text-black"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {text.sendRequest}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#00ff88] rounded-lg flex items-center justify-center gap-2 text-[#00ff88]">
                <Check className="w-5 h-5" />
                <span>{text.requestSent}</span>
              </div>
              <Button
                onClick={handleToggleRequest}
                variant="outline"
                className="w-full border-red-900 text-red-500 hover:bg-red-950/30 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                {text.cancelRequest}
              </Button>
            </div>
          )}
        </div>

        {/* About */}
        <Card className="p-4 border border-[#333] bg-[#1a1a1a]">
          <h3 className="text-base mb-2 text-white">{text.about}</h3>
          <p className="text-sm text-gray-400 bg-black p-3 rounded-lg border border-[#333]">
            {user.bio}
          </p>
        </Card>

        {/* Statistics */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.stats}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border border-[#333] bg-[#1a1a1a] text-center">
              <div className="text-2xl mb-1">🚴</div>
              <p className="text-2xl text-[#00ff88]">{userStats.totalRides}</p>
              <p className="text-xs text-gray-400 mt-1">{text.totalDistance}</p>
            </Card>
            <Card className="p-4 border border-[#333] bg-[#1a1a1a] text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-2xl text-[#00ff88]">{userStats.totalTime}</p>
              <p className="text-xs text-gray-400 mt-1">{text.hours}</p>
            </Card>
            <Card className="p-4 border border-[#333] bg-[#1a1a1a] text-center">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-2xl text-[#00ff88]">{userStats.avgSpeed}</p>
              <p className="text-xs text-gray-400 mt-1">{text.avgSpeed}</p>
            </Card>
            <Card className="p-4 border border-[#333] bg-[#1a1a1a] text-center">
              <div className="text-2xl mb-1">🌱</div>
              <p className="text-2xl text-[#00ff88]">{userStats.carbonSaved}</p>
              <p className="text-xs text-gray-400 mt-1">{text.carbonSaved}</p>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-4 border border-[#333] bg-[#1a1a1a]">
          <h3 className="text-base mb-3 text-white">{text.recentActivity}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#333]">
              <div className="w-10 h-10 bg-[#00ff88]/20 rounded-lg flex items-center justify-center text-xl">
                🚴
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{language === 'zh-CN' ? '周骑行' : 'Weekly Rides'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{userStats.weeklyRides} {text.rides}</p>
              </div>
              <Badge variant="outline" className="text-xs border-[#333] text-gray-400">
                {language === 'zh-CN' ? '本周' : 'This week'}
              </Badge>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-[#333]">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-xl">
                🏆
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{language === 'zh-CN' ? '完成100公里挑战' : 'Completed 100km Challenge'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{language === 'zh-CN' ? '2天前' : '2 days ago'}</p>
              </div>
              <Badge className="bg-yellow-900/30 text-yellow-500 text-xs border border-yellow-900">
                +500 {language === 'zh-CN' ? '点' : 'pts'}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00ff88]/20 rounded-lg flex items-center justify-center text-xl">
                🌳
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{language === 'zh-CN' ? '节省50公斤CO₂' : 'Saved 50kg CO₂'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{language === 'zh-CN' ? '本月' : 'This month'}</p>
              </div>
              <Badge className="bg-[#00ff88]/20 text-[#00ff88] text-xs border border-[#00ff88]/30">
                {language === 'zh-CN' ? '环保' : 'Eco'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}