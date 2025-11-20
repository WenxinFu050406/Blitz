import { TrendingUp, Clock, Zap, Leaf, Flame, Mountain, X } from 'lucide-react';
import { userStats } from '../data/mockData';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TimePeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

// Mock data for charts
const generateChartData = (period: TimePeriod) => {
  const labels = {
    weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    quarterly: ['Month 1', 'Month 2', 'Month 3'],
    yearly: ['Q1', 'Q2', 'Q3', 'Q4'],
  };

  return labels[period].map((label, index) => ({
    name: label,
    distance: Math.floor(Math.random() * 50) + 20,
    rides: Math.floor(Math.random() * 10) + 3,
  }));
};

export function StatisticsPage() {
  const { language } = useLanguage();
  const t = getTranslation(language).statistics;
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [chartData, setChartData] = useState(generateChartData('weekly'));

  const handlePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    setChartData(generateChartData(period));
  };

  const stats = [
    {
      id: 'total-rides',
      icon: TrendingUp,
      label: t.totalRides,
      value: userStats.totalRides,
      unit: t.rides,
      color: 'from-cyan-500 to-teal-500',
      textColor: 'text-cyan-500',
      progress: 78,
      details: language === 'zh-CN' ? '本月已完成45次骑行，比上月增长12%' : '45 rides this month, up 12% from last month',
    },
    {
      id: 'total-time',
      icon: Clock,
      label: t.totalTime,
      value: userStats.totalTime,
      unit: t.hours,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-500',
      progress: 65,
      details: language === 'zh-CN' ? '累计骑行78小时，平均每次30分钟' : '78 hours total, averaging 30 minutes per ride',
    },
    {
      id: 'avg-speed',
      icon: Zap,
      label: t.avgSpeed,
      value: userStats.avgSpeed,
      unit: 'km/h',
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-500',
      progress: 72,
      details: language === 'zh-CN' ? '您的平均速度超过75%的骑手' : 'Your average speed exceeds 75% of riders',
    },
    {
      id: 'carbon-saved',
      icon: Leaf,
      label: t.carbonSaved,
      value: userStats.carbonSaved,
      unit: 'kg CO₂',
      color: 'from-green-500 to-teal-500',
      textColor: 'text-green-500',
      progress: 88,
      details: language === 'zh-CN' ? '相当于种植15棵树的碳减排量' : 'Equivalent to planting 15 trees',
    },
    {
      id: 'calories',
      icon: Flame,
      label: t.caloriesBurned,
      value: userStats.calories.toLocaleString(),
      unit: t.kcal,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-500',
      progress: 82,
      details: language === 'zh-CN' ? '消耗卡路里相当于45次健身课程' : 'Calories burned equals 45 fitness classes',
    },
    {
      id: 'elevation',
      icon: Mountain,
      label: t.elevationGain,
      value: userStats.elevation.toLocaleString(),
      unit: t.meters,
      color: 'from-slate-500 to-cyan-500',
      textColor: 'text-slate-500',
      progress: 56,
      details: language === 'zh-CN' ? '累计爬升高度超过3座东方明珠' : 'Total elevation exceeds 3 times the height of landmarks',
    },
  ];

  const periods = [
    { id: 'weekly', label: t.weekly },
    { id: 'monthly', label: t.monthly },
    { id: 'quarterly', label: t.quarterly },
    { id: 'yearly', label: t.yearly },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 overflow-auto">
      {/* Header */}
      <div className="p-5 bg-zinc-900 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-primary">{t.title}</h1>
        <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
      </div>

      {/* Main Stats */}
      <div className="p-4 space-y-3">
        {/* Distance Card - Clickable */}
        <Card 
          onClick={() => setSelectedStat('distance')}
          className="p-4 bg-zinc-900 border-primary/20 cursor-pointer hover:border-primary/40 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-primary font-bold">{t.totalDistance}</p>
              <h1 className="text-2xl mt-1 text-white font-bold">{userStats.totalDistance}</h1>
              <p className="text-sm text-primary/70 mt-0.5">{t.kilometers}</p>
            </div>
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div className="bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-3/4 rounded-full" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">75% {t.nextMilestone} (1500 km)</p>
        </Card>

        {/* Energy Points - Clickable */}
        <Card 
          onClick={() => setSelectedStat('energy')}
          className="p-4 bg-zinc-900 border-primary/20 cursor-pointer hover:border-primary/40 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary font-bold">{t.energyPoints}</p>
              <h1 className="text-xl mt-1 text-white font-bold">{userStats.energyPoints.toLocaleString()}</h1>
              <p className="text-sm text-primary/70 mt-0.5">{t.availableForExchange}</p>
            </div>
            <Zap className="w-9 h-9 text-primary" />
          </div>
        </Card>

        {/* Stats Grid - All Clickable */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.id}
                onClick={() => setSelectedStat(stat.id)}
                className="p-3 bg-zinc-900 border-primary/20 cursor-pointer hover:border-primary/40 transition-all active:scale-98"
              >
                <Icon className="w-5 h-5 mb-2 text-primary" />
                <p className="mb-1 font-bold text-white">{stat.label}</p>
                <p className="text-lg font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.unit}</p>
              </Card>
            );
          })}
        </div>

        {/* Time Period Selector */}
        <div>
          <h3 className="text-base mb-3 px-1 text-white">{t.weeklyProgress}</h3>
          <div className="flex gap-2 mb-4">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => handlePeriodChange(period.id as TimePeriod)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                  timePeriod === period.id
                    ? 'bg-primary text-black shadow-lg'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          <Card className="p-4 bg-zinc-900 border-primary/20">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                <YAxis tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid rgba(209,243,73,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="distance" stroke="#D1F349" strokeWidth={3} dot={{ fill: '#D1F349', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Achievements */}
        <div>
          <h3 className="text-base mb-3 px-1 text-white">{t.recentAchievements}</h3>
          <div className="space-y-2">
            <Card className="p-4 bg-zinc-900 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                  🏆
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-white">{t.milestone1000km}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.unlocked3Days}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-zinc-900 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-white">{t.speedDemon}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.reached30kmh}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-zinc-900 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl">
                  🌱
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-white">{t.ecoWarrior}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{t.saved100kg}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedStat && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStat(null)}>
          <Card className="w-full max-w-md p-6 bg-zinc-900 border-primary/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base text-white">{t.viewDetails}</h3>
              <button
                onClick={() => setSelectedStat(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-300">
                  {stats.find(s => s.id === selectedStat)?.details || (language === 'zh-CN' ? '暂无详细信息' : 'No details available')}
                </p>
              </div>
              <button
                onClick={() => setSelectedStat(null)}
                className="w-full py-2 bg-primary text-black rounded-lg hover:bg-primary/90 font-medium"
              >
                {t.close}
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}