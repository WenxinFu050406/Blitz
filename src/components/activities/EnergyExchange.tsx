import { Zap, Battery, Users, TrendingUp, ArrowLeft, Check, X } from 'lucide-react';
import { energyProjects, userStats } from '../../data/mockData';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';
import { useState } from 'react';
import { Button } from '../ui/button';

interface EnergyExchangeProps {
  onBack?: () => void;
}

export function EnergyExchange({ onBack }: EnergyExchangeProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).energyExchange;
  const [energyPoints, setEnergyPoints] = useState(userStats.energyPoints);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const batteryPacks = [
    {
      id: 'small',
      name: t.smallBattery,
      description: language === 'zh-CN' ? '+20% 自行车电量' : '+20% bike battery',
      points: 500,
      color: 'from-green-400 to-teal-500',
      buttonColor: 'from-cyan-500 to-teal-500',
    },
    {
      id: 'medium',
      name: t.mediumBattery,
      description: language === 'zh-CN' ? '+50% 自行车电量' : '+50% bike battery',
      points: 1000,
      color: 'from-cyan-400 to-blue-500',
      buttonColor: 'from-cyan-500 to-teal-500',
    },
    {
      id: 'full',
      name: t.fullCharge,
      description: language === 'zh-CN' ? '100% 自行车电量' : '100% bike battery',
      points: 2000,
      color: 'from-orange-400 to-red-500',
      buttonColor: 'from-orange-500 to-red-500',
      bestValue: true,
    },
  ];

  const handleExchange = (pack: any) => {
    setSelectedPack(pack);
    setShowExchangeModal(true);
  };

  const confirmExchange = () => {
    if (selectedPack && energyPoints >= selectedPack.points) {
      setEnergyPoints(prev => prev - selectedPack.points);
      setShowExchangeModal(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPack(null);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-auto">
      {onBack && <FixedBackButton onClick={onBack} />}
      
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-xl">{t.title}</h1>
            <p className="text-xs opacity-80 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Energy Balance */}
      <div className="p-4">
        <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-black border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t.yourEnergyPoints}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h1 className="text-4xl">{energyPoints.toLocaleString()}</h1>
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-sm opacity-75 mt-2">
                {t.earnedFrom} {userStats.totalDistance} km {t.ofRiding}
              </p>
            </div>
            <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
        </Card>
      </div>

      {/* Battery Exchange */}
      <div className="p-4">
        <h3 className="mb-3 text-white">{t.exchangeForBatteries}</h3>
        <div className="space-y-3">
          {batteryPacks.map((pack) => (
            <Card key={pack.id} className={`p-4 bg-[#1a1a1a] border-[#2a2a2a] hover:shadow-md transition-shadow ${pack.bestValue ? 'border-2 border-orange-300' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${pack.color} rounded-xl flex items-center justify-center`}>
                  <Battery className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white">{pack.name}</p>
                  <p className="text-sm text-gray-400">{pack.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{pack.points.toLocaleString()} {t.points}</span>
                    {pack.bestValue && (
                      <Badge className="bg-orange-100 text-orange-700 ml-2">
                        {t.bestValue}
                      </Badge>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleExchange(pack)}
                  disabled={energyPoints < pack.points}
                  className={`px-4 py-2 bg-gradient-to-r ${pack.buttonColor} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity`}
                >
                  {t.exchange}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Public Welfare Projects */}
      <div className="p-4">
        <h3 className="mb-3 text-white">{t.publicWelfareProjects}</h3>
        <p className="text-sm text-gray-400 mb-4">
          {t.donateEnergy}
        </p>
        <div className="space-y-4">
          {energyProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] hover:shadow-lg transition-shadow">
              <div className="relative h-32">
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-500 text-white">
                    {project.status === 'active' ? `🌱 ${t.active}` : `✓ ${language === 'zh-CN' ? '已完成' : 'Completed'}`}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1 text-white">{t[project.id] || project.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{t[`${project.id}Desc`] || project.description}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">{t.progress}</span>
                    <span className="text-[#00ff88]">
                      {Math.round((project.participants * 50) / project.energyRequired * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(project.participants * 50) / project.energyRequired * 100} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{(project.participants * 50).toLocaleString()} {t.pointsCollected}</span>
                    <span>{project.energyRequired.toLocaleString()} {t.goal}</span>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{project.participants} {t.participants}</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#00ff88] to-[#00cc66] text-black rounded-lg hover:opacity-90">
                    {t.donate}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How to Earn */}
      <div className="p-4 pb-8">
        <h3 className="mb-3 text-white">{t.howToEarn}</h3>
        <Card className="p-4 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#2a2a2a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00ff88] rounded-full flex items-center justify-center text-black">
                🚴
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{t.distanceRiding}</p>
                <p className="text-xs text-gray-400">2 {t.perKm}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00ff88] rounded-full flex items-center justify-center text-black">
                ⛰️
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{t.elevationClimbing}</p>
                <p className="text-xs text-gray-400">1 {t.per10m}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black">
                ⭐
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{t.dailyChallengesBonus}</p>
                <p className="text-xs text-gray-400">{t.bonusPoints}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Exchange Confirmation Modal */}
      {showExchangeModal && selectedPack && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowExchangeModal(false)}>
          <Card className="w-full max-w-md p-6 bg-[#1a1a1a] border-[#2a2a2a]" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${selectedPack.color} rounded-full flex items-center justify-center`}>
                <Battery className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-base mb-2 text-white">{language === 'zh-CN' ? '确认兑换' : 'Confirm Exchange'}</h3>
              <p className="text-sm text-gray-400 mb-1">{selectedPack.name}</p>
              <p className="text-sm text-gray-400 mb-4">{selectedPack.description}</p>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{language === 'zh-CN' ? '当前点数' : 'Current Points'}</span>
                  <span className="text-sm text-white">{energyPoints.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{language === 'zh-CN' ? '兑换消耗' : 'Exchange Cost'}</span>
                  <span className="text-sm text-red-600">-{selectedPack.points.toLocaleString()}</span>
                </div>
                <div className="border-t border-[#3a3a3a] pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{language === 'zh-CN' ? '剩余点数' : 'Remaining Points'}</span>
                    <span className="text-base text-white">{(energyPoints - selectedPack.points).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowExchangeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {language === 'zh-CN' ? '取消' : 'Cancel'}
                </Button>
                <Button
                  onClick={confirmExchange}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                >
                  {language === 'zh-CN' ? '确认兑换' : 'Confirm'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-8 bg-[#1a1a1a] border-[#2a2a2a] text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-base mb-2 text-white">{t.exchangeSuccess}</h3>
            <p className="text-sm text-gray-400">
              {language === 'zh-CN' ? '电池包将在24小时内送达' : 'Battery pack will be delivered within 24 hours'}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}