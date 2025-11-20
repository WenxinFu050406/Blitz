import { useState } from 'react';
import { MapPin, TrendingUp, UserPlus, Check, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FixedBackButton } from '../ui/FixedBackButton';
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
    <div className="flex flex-col h-full bg-white overflow-auto">
      <FixedBackButton onClick={onBack} />

      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white pt-16">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl mb-3 border-4 border-white/30">
            {user.avatar}
          </div>
          <h1 className="text-2xl mb-1">{user.name}</h1>
          <div className="flex items-center gap-1.5 text-sm opacity-90 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{user.location}</span>
          </div>
          <Badge className="bg-white/20 hover:bg-white/30 border-white/30 text-white">
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
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {text.sendRequest}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="w-full px-4 py-3 bg-green-50 border-2 border-green-500 rounded-lg flex items-center justify-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span>{text.requestSent}</span>
              </div>
              <Button
                onClick={handleToggleRequest}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                {text.cancelRequest}
              </Button>
            </div>
          )}
        </div>

        {/* About */}
        <Card className="p-4 border border-slate-200">
          <h3 className="text-base mb-2">{text.about}</h3>
          <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
            {user.bio}
          </p>
        </Card>

        {/* Statistics */}
        <div>
          <h3 className="text-base mb-3">{text.stats}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 border border-slate-200 text-center">
              <div className="text-2xl mb-1">🚴</div>
              <p className="text-2xl text-cyan-600">{userStats.totalRides}</p>
              <p className="text-xs text-slate-500 mt-1">{text.totalDistance}</p>
            </Card>
            <Card className="p-4 border border-slate-200 text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-2xl text-cyan-600">{userStats.totalTime}</p>
              <p className="text-xs text-slate-500 mt-1">{text.hours}</p>
            </Card>
            <Card className="p-4 border border-slate-200 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-2xl text-cyan-600">{userStats.avgSpeed}</p>
              <p className="text-xs text-slate-500 mt-1">{text.avgSpeed}</p>
            </Card>
            <Card className="p-4 border border-slate-200 text-center">
              <div className="text-2xl mb-1">🌱</div>
              <p className="text-2xl text-green-600">{userStats.carbonSaved}</p>
              <p className="text-xs text-slate-500 mt-1">{text.carbonSaved}</p>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-4 border border-slate-200">
          <h3 className="text-base mb-3">{text.recentActivity}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-xl">
                🚴
              </div>
              <div className="flex-1">
                <p className="text-sm">{language === 'zh-CN' ? '周骑行' : 'Weekly Rides'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{userStats.weeklyRides} {text.rides}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {language === 'zh-CN' ? '本周' : 'This week'}
              </Badge>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl">
                🏆
              </div>
              <div className="flex-1">
                <p className="text-sm">{language === 'zh-CN' ? '完成100公里挑战' : 'Completed 100km Challenge'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{language === 'zh-CN' ? '2天前' : '2 days ago'}</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                +500 {language === 'zh-CN' ? '点' : 'pts'}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center text-xl">
                🌳
              </div>
              <div className="flex-1">
                <p className="text-sm">{language === 'zh-CN' ? '节省50公斤CO₂' : 'Saved 50kg CO₂'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{language === 'zh-CN' ? '本月' : 'This month'}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 text-xs">
                {language === 'zh-CN' ? '环保' : 'Eco'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}