import { Settings, ChevronRight, Award, History, Bell, HelpCircle, Shield, LogOut, Edit } from 'lucide-react';
import { userStats } from '../data/mockData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { useState } from 'react';
import { EditProfile } from './me/EditProfile';
import { Achievements } from './me/Achievements';
import { RideHistory } from './me/RideHistory';
import { Notifications } from './me/Notifications';
import { Settings as SettingsPage } from './me/Settings';
import { HelpSupport } from './me/HelpSupport';
import { PrivacySecurity } from './me/PrivacySecurity';

type MeView = 'main' | 'edit-profile' | 'achievements' | 'ride-history' | 'notifications' | 'settings' | 'help' | 'privacy';

export function MePage() {
  const { logout, currentUser } = useAuth();
  const { language } = useLanguage();
  const t = getTranslation(language).me;
  const [view, setView] = useState<MeView>('main');
  
  const menuItems = [
    { id: 'edit-profile', icon: Edit, label: t.editProfile, color: 'text-cyan-600' },
    { id: 'achievements', icon: Award, label: t.achievements, badge: '12', color: 'text-yellow-600' },
    { id: 'ride-history', icon: History, label: t.rideHistory, color: 'text-blue-600' },
    { id: 'notifications', icon: Bell, label: t.notifications, badge: '3', color: 'text-orange-600' },
    { id: 'settings', icon: Settings, label: t.settings, color: 'text-slate-600' },
    { id: 'help', icon: HelpCircle, label: t.helpSupport, color: 'text-green-600' },
    { id: 'privacy', icon: Shield, label: t.privacySecurity, color: 'text-purple-600' },
  ];

  // Handle menu item clicks
  const handleMenuClick = (itemId: string) => {
    setView(itemId as MeView);
  };

  // Render different views
  if (view === 'edit-profile') {
    return <EditProfile onBack={() => setView('main')} />;
  }
  if (view === 'achievements') {
    return <Achievements onBack={() => setView('main')} />;
  }
  if (view === 'ride-history') {
    return <RideHistory onBack={() => setView('main')} />;
  }
  if (view === 'notifications') {
    return <Notifications onBack={() => setView('main')} />;
  }
  if (view === 'settings') {
    return <SettingsPage onBack={() => setView('main')} />;
  }
  if (view === 'help') {
    return <HelpSupport onBack={() => setView('main')} />;
  }
  if (view === 'privacy') {
    return <PrivacySecurity onBack={() => setView('main')} />;
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-auto">
      {/* Header */}
      <div className="p-5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-primary/20 rounded-full overflow-hidden backdrop-blur-sm border-2 border-primary/30 shadow-lg">
            <img 
              src={currentUser?.avatar} 
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-primary">{currentUser?.name}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">@{currentUser?.username}</p>
          </div>
        </div>
        <p className="text-xs mt-3 text-zinc-300">{currentUser?.bio}</p>
      </div>

      {/* Stats Grid */}
      <div className="p-4 -mt-5 relative z-10">
        <Card className="p-4 bg-zinc-900 border-primary/20 shadow-lg">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xl text-primary">{currentUser?.totalDistance || 0}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{t.totalKm}</p>
            </div>
            <div className="border-l border-r border-zinc-700">
              <p className="text-xl text-primary">{currentUser?.friendsCount || 0}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{language === 'zh-CN' ? '好友' : 'Friends'}</p>
            </div>
            <div>
              <p className="text-xl text-primary">{currentUser?.posts || 0}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{language === 'zh-CN' ? '帖子' : 'Posts'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="p-4 space-y-3">
        <h3 className="text-base text-white">{t.yourPerformance}</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-zinc-900 border-primary/20">
            <p className="text-primary font-bold">{t.energyPoints}</p>
            <p className="text-lg mt-1 text-white font-bold">{userStats.energyPoints.toLocaleString()}</p>
          </Card>
          <Card className="p-3 bg-zinc-900 border-primary/20">
            <p className="text-primary font-bold">{t.carbonSaved}</p>
            <p className="text-lg mt-1 text-white font-bold">{userStats.carbonSaved} kg</p>
          </Card>
          <Card className="p-3 bg-zinc-900 border-primary/20">
            <p className="text-primary font-bold">{t.avgSpeed}</p>
            <p className="text-lg mt-1 text-white font-bold">{userStats.avgSpeed} km/h</p>
          </Card>
          <Card className="p-3 bg-zinc-900 border-primary/20">
            <p className="text-primary font-bold">{t.calories}</p>
            <p className="text-lg mt-1 text-white font-bold">{(userStats.calories / 1000).toFixed(1)}k</p>
          </Card>
        </div>
      </div>

      {/* Badges */}
      <div className="p-4">
        <h3 className="mb-3 text-base text-white">{t.recentBadges}</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="flex-shrink-0 w-16 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
              🏆
            </div>
            <p className="text-xs mt-1.5 text-zinc-400">1000km</p>
          </div>
          <div className="flex-shrink-0 w-16 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
              ⚡
            </div>
            <p className="text-xs mt-1.5 text-zinc-400">{t.speed}</p>
          </div>
          <div className="flex-shrink-0 w-16 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
              🌱
            </div>
            <p className="text-xs mt-1.5 text-zinc-400">{t.eco}</p>
          </div>
          <div className="flex-shrink-0 w-16 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
              ⭐
            </div>
            <p className="text-xs mt-1.5 text-zinc-400">{language === 'zh-CN' ? '白金' : 'Platinum'}</p>
          </div>
          <div className="flex-shrink-0 w-16 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
              🎯
            </div>
            <p className="text-xs mt-1.5 text-zinc-400">{t.explorer}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              onClick={() => handleMenuClick(item.id)}
              className="p-4 hover:border-primary/40 transition-all cursor-pointer bg-zinc-900 border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="flex-1 text-sm text-white">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-primary text-black text-xs h-5 px-1.5 font-medium">{item.badge}</Badge>
                )}
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Bike Info */}
      <div className="p-4">
        <h3 className="mb-3 text-base text-white">{t.yourBesvBike}</h3>
        <Card className="p-4 bg-zinc-900 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-zinc-400">{t.model}</p>
              <p className="text-base mt-1 text-white">BESV TRS1 AM</p>
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
              🚴
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-zinc-400">{t.totalDistance}</p>
              <p className="mt-0.5 text-white">{currentUser?.totalDistance || 0} km</p>
            </div>
            <div>
              <p className="text-zinc-400">{t.totalRides}</p>
              <p className="mt-0.5 text-white">{currentUser?.totalDistance ? Math.floor(currentUser.totalDistance / 15) : 0} {language === 'zh-CN' ? '次' : 'rides'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logout */}
      <div className="p-4 pb-6">
        <button
          onClick={logout}
          className="w-full p-3.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Version */}
      <div className="px-4 pb-6 text-center">
        <p className="text-xs text-zinc-600">Blitz for BESV v1.0.0</p>
      </div>
    </div>
  );
}