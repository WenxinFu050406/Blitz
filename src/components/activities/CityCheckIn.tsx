import { MapPin, Gift, CheckCircle2, Navigation2, ArrowLeft } from 'lucide-react';
import { landmarks } from '../../data/mockData';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';
import { LandmarkDetail } from './LandmarkDetail';
import { useState } from 'react';

interface CityCheckInProps {
  onBack?: () => void;
}

export function CityCheckIn({ onBack }: CityCheckInProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).cityCheckIn;
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);

  if (selectedLandmark) {
    return <LandmarkDetail landmark={selectedLandmark} onBack={() => setSelectedLandmark(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-black overflow-auto">
      {onBack && <FixedBackButton onClick={onBack} />}
      
      {/* Header */}
      <div className="p-5 bg-black border-b border-[#333]">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <h1 className="text-xl text-white">{t.title}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#00ff88]">
          <Gift className="w-4 h-4" />
          <span>3 {t.landmarksVisited} • 100 {t.pointsEarned}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4">
        <Card className="p-4 bg-[#1a1a1a] border border-[#00ff88] text-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t.totalPoints}</p>
              <h2 className="text-3xl mt-1 text-[#00ff88]">100</h2>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">{t.nextReward}</p>
              <p className="text-sm mt-1 text-[#00ff88]">50 {t.pointsToGo}</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-black rounded-full overflow-hidden">
            <div className="h-full bg-[#00ff88] rounded-full" style={{ width: '67%' }} />
          </div>
        </Card>
      </div>

      {/* Landmarks */}
      <div className="p-4 space-y-4">
        <h3 className="text-white">{t.nearbyLandmarks}</h3>
        {landmarks.map((landmark) => (
          <Card 
            key={landmark.id} 
            className="overflow-hidden bg-[#1a1a1a] border-[#2a2a2a] hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedLandmark(landmark)}
          >
            <div className="relative h-40">
              <ImageWithFallback
                src={landmark.image}
                alt={landmark.name}
                className="w-full h-full object-cover"
              />
              {landmark.visited && (
                <div className="absolute top-3 right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{landmark.distance}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-white">{t[landmark.id as keyof typeof t] || landmark.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{t[`${landmark.id}Desc` as keyof typeof t] || landmark.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-[#00ff88] text-black hover:bg-[#00cc66]">
                    +{landmark.points} {language === 'zh-CN' ? '点数' : 'points'}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/20">{landmark.reward}</Badge>
                </div>
                {!landmark.visited ? (
                  <button className="px-3 py-1.5 text-sm bg-[#00ff88] text-black rounded-lg hover:opacity-90 flex items-center gap-2">
                    <Navigation2 className="w-4 h-4" />
                    {t.viewRoute}
                  </button>
                ) : (
                  <Badge className="bg-[#1a1a1a] text-[#00ff88] border border-[#00ff88]">
                    ✓ {t.visited}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Available Rewards */}
      <div className="p-4 pb-8">
        <h3 className="mb-4 text-white">{t.availableRewards}</h3>
        <div className="space-y-3">
          <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00ff88]/20 rounded-lg flex items-center justify-center text-2xl text-[#00ff88]">
              🎁
            </div>
            <div className="flex-1">
              <p className="text-white">{t.freeCoffee}</p>
              <p className="text-sm text-gray-400">150 {t.pointsRequired}</p>
            </div>
            <button className="px-4 py-2 border-2 border-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a] text-white">
              {t.claim}
            </button>
          </Card>
          <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] flex items-center gap-4">
            <div className="w-12 h-12 bg-[#00ff88]/20 rounded-lg flex items-center justify-center text-2xl text-[#00ff88]">
              🏅
            </div>
            <div className="flex-1">
              <p className="text-white">{t.cityExplorerBadge}</p>
              <p className="text-sm text-gray-400">{t.visitAllLandmarks}</p>
            </div>
            <Badge variant="outline" className="text-white border-white/20">{t.inProgress}</Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}