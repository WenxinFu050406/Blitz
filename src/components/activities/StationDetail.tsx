import { MapPin, Phone, Clock, Navigation, Star, Wifi, Coffee, Wrench, Battery } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';

interface StationDetailProps {
  station: {
    id: string;
    name: string;
    type: 'cafe' | 'repair' | 'charging';
    distance: string;
    rating: number;
    address: string;
    phone: string;
    hours: string;
    services: string[];
  };
  onBack: () => void;
}

export function StationDetail({ station, onBack }: StationDetailProps) {
  const { language } = useLanguage();

  const t = {
    en: {
      navigate: 'Navigate',
      call: 'Call',
      rating: 'Rating',
      reviews: 'reviews',
      address: 'Address',
      phone: 'Phone',
      hours: 'Opening Hours',
      services: 'Available Services',
      gallery: 'Photos',
      aboutStation: 'About This Station',
      verified: 'BESV Verified Partner',
      benefits: 'Member Benefits',
      benefit1: '10% discount for BESV members',
      benefit2: 'Free basic bike check-up',
      benefit3: 'Priority service during peak hours',
      specialOffer: 'Special Offer',
      offerDesc: 'Show your BESV app for a free coffee with any service!',
      validUntil: 'Valid until',
    },
    'zh-CN': {
      navigate: '导航',
      call: '呼叫',
      rating: '评分',
      reviews: '条评价',
      address: '地址',
      phone: '电话',
      hours: '营业时间',
      services: '可用服务',
      gallery: '照片',
      aboutStation: '关于本站',
      verified: 'BESV认证合作伙伴',
      benefits: '会员福利',
      benefit1: 'BESV会员享受10%折扣',
      benefit2: '免费基础自行车检查',
      benefit3: '高峰时段优先服务',
      specialOffer: '特别优惠',
      offerDesc: '出示BESV应用即可免费获得咖啡！',
      validUntil: '有效期至',
    },
  };

  const text = t[language];

  const stationDescriptions = {
    en: {
      cafe: 'A cozy bike-friendly café with excellent coffee and snacks. Perfect rest stop for riders.',
      repair: 'Professional bike repair service with experienced mechanics. All parts guaranteed.',
      charging: 'Fast charging station with comfortable lounge area. Get fully charged in 1 hour.',
    },
    'zh-CN': {
      cafe: '舒适的自行车友好咖啡馆，提供优质咖啡和小吃。骑行者的完美休息站。',
      repair: '专业自行车维修服务，经验丰富的技师。所有零件保修。',
      charging: '快速充电站配有舒适的休息区。1小时内充满电。',
    },
  };

  const serviceIcons = {
    Coffee: Coffee,
    'Water': Coffee,
    'Snacks': Coffee,
    'Bike Parking': MapPin,
    'Tools': Wrench,
    'Air Pump': Wrench,
    'Spare Parts': Wrench,
    'Mechanic': Wrench,
    'Fast Charging': Battery,
    'Lounge Area': Coffee,
    'WiFi': Wifi,
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-auto">
      <FixedBackButton onClick={onBack} />

      {/* Header Image */}
      <div className="h-48 bg-[#1a1a1a] relative border-b border-[#00ff88]">
        <div className="absolute inset-0 flex items-center justify-center text-6xl text-[#00ff88]">
          {station.type === 'cafe' ? '☕' : station.type === 'repair' ? '🔧' : '⚡'}
        </div>
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 border border-[#00ff88]">
          <Star className="w-4 h-4 text-[#00ff88] fill-[#00ff88]" />
          <span className="text-sm text-white">{station.rating}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Station Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-xl text-white">{station.name}</h1>
              <p className="text-sm text-gray-400 mt-1">{station.distance} {language === 'zh-CN' ? '外' : 'away'}</p>
            </div>
            <div className="bg-[#1a1a1a] text-[#00ff88] px-3 py-1 rounded-full text-xs border border-[#00ff88]">
              ✓ {text.verified}
            </div>
          </div>
          <p className="text-sm text-gray-400">{stationDescriptions[language][station.type]}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-[#00ff88] text-black hover:bg-[#00cc66]">
            <Navigation className="w-4 h-4 mr-2" />
            {text.navigate}
          </Button>
          <Button variant="outline" className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10 bg-black">
            <Phone className="w-4 h-4 mr-2" />
            {text.call}
          </Button>
        </div>

        {/* Station Details */}
        <Card className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#00ff88] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">{text.address}</p>
              <p className="text-sm text-white">{station.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#00ff88] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">{text.phone}</p>
              <p className="text-sm text-white">{station.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#00ff88] mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">{text.hours}</p>
              <p className="text-sm text-white">{station.hours}</p>
            </div>
          </div>
        </Card>

        {/* Services */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.services}</h3>
          <div className="grid grid-cols-3 gap-2">
            {(station.services || []).map((service) => {
              const Icon = serviceIcons[service] || Coffee;
              return (
                <div key={service} className="flex flex-col items-center gap-2 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                  <Icon className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-xs text-center text-gray-300">{service}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Offer */}
        <Card className="p-4 bg-[#1a1a1a] border border-[#00ff88]">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🎁</div>
            <div className="flex-1">
              <h3 className="text-base text-[#00ff88] mb-2">{text.specialOffer}</h3>
              <p className="text-sm text-white mb-2">{text.offerDesc}</p>
              <p className="text-xs text-gray-400">
                {text.validUntil}: {language === 'zh-CN' ? '2025年12月31日' : 'Dec 31, 2025'}
              </p>
            </div>
          </div>
        </Card>

        {/* Member Benefits */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.benefits}</h3>
          <Card className="p-4 border border-[#2a2a2a] bg-[#1a1a1a] space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00ff88]/20 rounded-full flex items-center justify-center text-[#00ff88] text-sm">✓</div>
              <p className="text-sm text-white flex-1">{text.benefit1}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00ff88]/20 rounded-full flex items-center justify-center text-[#00ff88] text-sm">✓</div>
              <p className="text-sm text-white flex-1">{text.benefit2}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00ff88]/20 rounded-full flex items-center justify-center text-[#00ff88] text-sm">✓</div>
              <p className="text-sm text-white flex-1">{text.benefit3}</p>
            </div>
          </Card>
        </div>

        {/* Gallery */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.gallery}</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center">
                <span className="text-3xl">
                  {station.type === 'cafe' ? '☕' : station.type === 'repair' ? '🔧' : '⚡'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <h3 className="text-base mb-3 text-white">{language === 'zh-CN' ? '位置' : 'Location'}</h3>
          <Card className="overflow-hidden border border-[#2a2a2a]">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.42%2C37.78%2C-122.40%2C37.79&layer=mapnik`}
              className="w-full h-48 border-0 opacity-80 hover:opacity-100 transition-opacity"
              title="Station Location"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
