import { useState } from 'react';
import { MapPin, Award, Zap, Coffee, ArrowLeft } from 'lucide-react';
import { Card } from './ui/card';
import { CityCheckIn } from './activities/CityCheckIn';
import { CarbonRanking } from './activities/CarbonRanking';
import { EnergyExchange } from './activities/EnergyExchange';
import { SupplyStations } from './activities/SupplyStations';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';

type ActivityType = 'hub' | 'checkin' | 'carbon' | 'energy' | 'stations';

export function ActivitiesPage() {
  const { language } = useLanguage();
  const t = getTranslation(language).activities;
  const [currentView, setCurrentView] = useState<ActivityType>('hub');

  const activities = [
    {
      id: 'checkin',
      name: t.cityCheckIn,
      description: t.cityCheckInDesc,
      icon: MapPin,
      color: 'from-cyan-500 to-teal-500',
      emoji: '🗺️',
    },
    {
      id: 'carbon',
      name: t.carbonRanking,
      description: t.carbonRankingDesc,
      icon: Award,
      color: 'from-green-500 to-teal-500',
      emoji: '🏆',
    },
    {
      id: 'energy',
      name: t.energyExchange,
      description: t.energyExchangeDesc,
      icon: Zap,
      color: 'from-yellow-400 to-orange-500',
      emoji: '⚡',
    },
    {
      id: 'stations',
      name: t.supplyStations,
      description: t.supplyStationsDesc,
      icon: Coffee,
      color: 'from-orange-400 to-red-500',
      emoji: '☕',
    },
  ];

  if (currentView === 'checkin') {
    return (
      <div className="flex flex-col h-full">
        <CityCheckIn onBack={() => setCurrentView('hub')} />
      </div>
    );
  }

  if (currentView === 'carbon') {
    return (
      <div className="flex flex-col h-full">
        <CarbonRanking onBack={() => setCurrentView('hub')} />
      </div>
    );
  }

  if (currentView === 'energy') {
    return (
      <div className="flex flex-col h-full">
        <EnergyExchange onBack={() => setCurrentView('hub')} />
      </div>
    );
  }

  if (currentView === 'stations') {
    return (
      <div className="flex flex-col h-full">
        <SupplyStations onBack={() => setCurrentView('hub')} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-auto">
      {/* Header */}
      <div className="p-5 bg-zinc-900 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-primary">{t.title}</h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Activity Cards */}
      <div className="p-4 space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <Card
              key={activity.id}
              className="p-5 hover:border-primary/40 transition-all cursor-pointer bg-zinc-900 border-primary/20"
              onClick={() => setCurrentView(activity.id as ActivityType)}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">{activity.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-0.5 text-base text-white">{activity.name}</h3>
                  <p className="text-xs text-zinc-400">{activity.description}</p>
                </div>
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="px-4 pb-3">
        <h3 className="mb-2.5 text-base text-white">{t.todayProgress}</h3>
        <Card className="p-4 bg-zinc-900 border-primary/20">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-400">{t.landmarksVisited}</p>
              <p className="text-xl text-primary mt-0.5">3</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">{language === 'zh-CN' ? '能量点数' : 'Energy Points'}</p>
              <p className="text-xl text-primary mt-0.5">+240</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">{t.carbonSaved}</p>
              <p className="text-xl text-primary mt-0.5">2.8 kg</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">{t.stationsUsed}</p>
              <p className="text-xl text-primary mt-0.5">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Challenges */}
      <div className="px-4 pb-6">
        <h3 className="mb-2.5 text-base text-white">{t.dailyChallenges}</h3>
        <div className="space-y-2.5">
          <Card className="p-4 bg-zinc-900 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary/20 rounded-lg flex items-center justify-center text-lg">
                🎯
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{t.ride15km}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
                  </div>
                  <span className="text-xs text-zinc-400">12.3/15</span>
                </div>
              </div>
              <span className="text-xs text-primary">+200</span>
            </div>
          </Card>

          <Card className="p-4 bg-zinc-900 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary/20 rounded-lg flex items-center justify-center text-lg">
                🗺️
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{t.visit1Landmark}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{t.exploreCity}</p>
              </div>
              <span className="text-xs text-primary">+150</span>
            </div>
          </Card>

          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-primary/30 rounded-lg flex items-center justify-center text-lg">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{t.save2kg}</p>
                <p className="text-xs text-primary mt-0.5">{t.completed}</p>
              </div>
              <span className="text-xs text-primary">+100</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}