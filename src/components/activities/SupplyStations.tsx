import { Coffee, Wrench, Zap, MapPin, Star, Navigation2, Phone, ArrowLeft } from 'lucide-react';
import { supplyStations } from '../../data/mockData';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';
import { StationDetail } from './StationDetail';
import { useState } from 'react';

const stationTypeConfig = {
  cafe: { icon: Coffee, color: 'from-orange-400 to-amber-500', label: 'Café' },
  repair: { icon: Wrench, color: 'from-slate-400 to-slate-500', label: 'Repair' },
  charging: { icon: Zap, color: 'from-yellow-400 to-orange-500', label: 'Charging' },
  rest: { icon: MapPin, color: 'from-cyan-400 to-teal-500', label: 'Rest Area' },
};

interface SupplyStationsProps {
  onBack?: () => void;
}

export function SupplyStations({ onBack }: SupplyStationsProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).supplyStations;
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('all');

  if (selectedStation) {
    return <StationDetail station={selectedStation} onBack={() => setSelectedStation(null)} />;
  }

  const filteredStations = filterType === 'all' 
    ? supplyStations 
    : supplyStations.filter(s => s.type === filterType);

  return (
    <div className="flex flex-col h-full bg-white overflow-auto">
      {onBack && <FixedBackButton onClick={onBack} />}
      
      {/* Sponsor Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="text-xl">🎉</div>
            <span className="text-sm">{t.ourSponsors}</span>
          </div>
          <button className="text-xs underline hover:no-underline">
            {t.viewDetails}
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Sponsor logos */}
          <div className="flex-shrink-0 w-20 h-12 bg-white/90 rounded flex items-center justify-center">
            <span className="text-xs text-slate-800">☕ Cafe</span>
          </div>
          <div className="flex-shrink-0 w-20 h-12 bg-white/90 rounded flex items-center justify-center">
            <span className="text-xs text-slate-800">🔧 Repair</span>
          </div>
          <div className="flex-shrink-0 w-20 h-12 bg-white/90 rounded flex items-center justify-center">
            <span className="text-xs text-slate-800">⚡ Power</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <h1 className="text-xl">{t.title}</h1>
            <p className="text-xs opacity-80 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{filteredStations.length} {t.stationsNearby}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Badge 
            onClick={() => setFilterType('all')}
            className={`cursor-pointer whitespace-nowrap ${
              filterType === 'all' 
                ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.allStations}
          </Badge>
          <Badge 
            onClick={() => setFilterType('cafe')}
            variant="outline" 
            className={`cursor-pointer whitespace-nowrap ${
              filterType === 'cafe' ? 'bg-orange-100 border-orange-500 text-orange-700' : ''
            }`}
          >
            <Coffee className="w-3 h-3 mr-1" />
            {t.cafes}
          </Badge>
          <Badge 
            onClick={() => setFilterType('repair')}
            variant="outline" 
            className={`cursor-pointer whitespace-nowrap ${
              filterType === 'repair' ? 'bg-slate-100 border-slate-500 text-slate-700' : ''
            }`}
          >
            <Wrench className="w-3 h-3 mr-1" />
            {t.repairs}
          </Badge>
          <Badge 
            onClick={() => setFilterType('charging')}
            variant="outline" 
            className={`cursor-pointer whitespace-nowrap ${
              filterType === 'charging' ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : ''
            }`}
          >
            <Zap className="w-3 h-3 mr-1" />
            {t.charging}
          </Badge>
        </div>
      </div>

      {/* Stations List */}
      <div className="p-4 space-y-4">
        {filteredStations.map((station) => {
          const typeConfig = stationTypeConfig[station.type];
          const Icon = typeConfig.icon;

          return (
            <Card 
              key={station.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedStation(station)}
            >
              {/* Image */}
              <div className="relative h-48">
                <ImageWithFallback
                  src={station.image}
                  alt={station.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${typeConfig.color} text-white flex items-center gap-2 shadow-md`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{t[station.type] || typeConfig.label}</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-1 shadow-md">
                    <MapPin className="w-3 h-3 text-cyan-600" />
                    <span className="text-sm">{station.distance}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3>{t[station.id] || station.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{station.address}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{station.rating}</span>
                  </div>
                </div>

                {/* Supplies */}
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">{t.availableSupplies}</p>
                  <div className="flex flex-wrap gap-2">
                    {station.supplies.slice(0, 3).map((supply) => (
                      <Badge key={supply} variant="outline" className="bg-slate-50">
                        {t[supply.toLowerCase().replace(/\s+/g, '')] || supply}
                      </Badge>
                    ))}
                    {station.supplies.length > 3 && (
                      <Badge variant="outline" className="bg-slate-50">
                        +{station.supplies.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-600 hover:to-teal-600 flex items-center justify-center gap-2">
                    <Navigation2 className="w-4 h-4" />
                    {t.navigate}
                  </button>
                  <button className="px-4 py-2 border-2 border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {t.call}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="p-4 pb-8">
        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
          <h3 className="mb-3">{t.besvPartnerNetwork}</h3>
          <p className="text-sm text-slate-600 mb-4">
            {t.partnerDesc}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <span>{t.discount10}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <span>{t.freeCheckup}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <span>{t.priorityCharging}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}