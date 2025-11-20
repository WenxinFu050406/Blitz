import { useState, useEffect } from 'react';
import { MapPin, Navigation, Users, Clock, Award, ChevronRight, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { Progress } from '../ui/progress';
import { landmarkJoinsDB } from '../../utils/storage';

interface LandmarkDetailProps {
  landmark: {
    id: string;
    name: string;
    description: string;
    distance: string;
    points: number;
    visited: boolean;
  };
  onBack: () => void;
}

export function LandmarkDetail({ landmark, onBack }: LandmarkDetailProps) {
  const { language } = useLanguage();
  
  // Load joined state from backend storage
  const [joined, setJoined] = useState(() => landmarkJoinsDB.isJoined(landmark.id));

  // Handle join/leave
  const handleToggleJoin = () => {
    const newJoinedState = landmarkJoinsDB.toggle(landmark.id);
    setJoined(newJoinedState);
  };

  const t = {
    en: {
      viewRoute: 'View Route',
      navigate: 'Navigate',
      groupEvent: 'Group Event Available',
      participants: 'Participants',
      spotsLeft: 'spots left',
      join: 'Join Group Event',
      joined: 'Joined!',
      waitingForMore: 'Waiting for more riders',
      minParticipants: 'Minimum 5 participants to start',
      eventDetails: 'Event Details',
      meetingPoint: 'Meeting Point',
      startTime: 'Start Time',
      difficulty: 'Difficulty',
      distance: 'Distance',
      estimatedTime: 'Estimated Time',
      rewards: 'Rewards',
      pointsReward: 'Points Reward',
      badge: 'Special Badge',
      easy: 'Easy',
      route: 'Route Map',
      currentParticipants: 'Current Participants',
      routeHighlights: 'Route Highlights',
      highlight1: 'Scenic river views',
      highlight2: 'Photo opportunities at landmarks',
      highlight3: 'Coffee break at bike-friendly café',
    },
    'zh-CN': {
      viewRoute: '查看路线',
      navigate: '导航',
      groupEvent: '成团活动可用',
      participants: '参与者',
      spotsLeft: '个空位',
      join: '加入成团活动',
      joined: '已加入！',
      waitingForMore: '等待更多骑手',
      minParticipants: '最少需要5人成团',
      eventDetails: '活动详情',
      meetingPoint: '集合地点',
      startTime: '出发时间',
      difficulty: '难度',
      distance: '距离',
      estimatedTime: '预计时长',
      rewards: '奖励',
      pointsReward: '点数奖励',
      badge: '特殊徽章',
      easy: '简单',
      route: '路线地图',
      currentParticipants: '当前参与者',
      routeHighlights: '路线亮点',
      highlight1: '河畔风景优美',
      highlight2: '地标拍照机会',
      highlight3: '友好咖啡馆休息',
    },
  };

  const text = t[language];

  // Mock group event data
  const groupEvent = {
    participants: 3,
    maxParticipants: 8,
    meetingPoint: language === 'zh-CN' ? '中央公园北门' : 'Central Park North Gate',
    startTime: language === 'zh-CN' ? '今天 15:00' : 'Today 3:00 PM',
    difficulty: text.easy,
    estimatedTime: language === 'zh-CN' ? '2小时' : '2 hours',
    pointsReward: 500,
  };

  const currentParticipants = [
    { id: 1, name: 'Sarah L.', avatar: '👩' },
    { id: 2, name: 'Mike T.', avatar: '👨' },
    { id: 3, name: 'Alex K.', avatar: '🧑' },
  ];

  return (
    <div className="flex flex-col h-full bg-black overflow-auto">
      <FixedBackButton onClick={onBack} />

      {/* Header with Map Preview */}
      <div className="h-48 bg-gradient-to-br from-[#00ff88] to-[#00cc66] relative overflow-hidden">
        {/* Simulated map */}
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.77%2C-122.41%2C37.80&layer=mapnik`}
          className="w-full h-full opacity-70"
          title="Route Map"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl text-white mb-1">{landmark.name}</h1>
          <p className="text-xs text-white/90">{landmark.description}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-to-r from-[#00ff88] to-[#00cc66] hover:opacity-90 text-black">
            <Navigation className="w-4 h-4 mr-2" />
            {text.navigate}
          </Button>
          <Button variant="outline" className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/10">
            <MapPin className="w-4 h-4 mr-2" />
            {text.viewRoute}
          </Button>
        </div>

        {/* Group Event Section */}
        <Card className="p-4 border-2 border-orange-500 bg-gradient-to-br from-orange-500/10 to-yellow-500/10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm text-orange-400">{text.groupEvent}</h3>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">{text.participants}</span>
              <span className="text-orange-400">
                {joined ? groupEvent.participants + 1 : groupEvent.participants}/{groupEvent.maxParticipants}
              </span>
            </div>
            <Progress 
              value={((joined ? groupEvent.participants + 1 : groupEvent.participants) / groupEvent.maxParticipants) * 100} 
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {groupEvent.maxParticipants - (joined ? groupEvent.participants + 1 : groupEvent.participants)} {text.spotsLeft}
            </p>
          </div>

          {/* Current Participants */}
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">{text.currentParticipants}</p>
            <div className="flex items-center gap-2">
              {currentParticipants.map((participant) => (
                <div key={participant.id} className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#2a2a2a] rounded-full flex items-center justify-center text-xl border-2 border-orange-500">
                    {participant.avatar}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{participant.name}</span>
                </div>
              ))}
              {joined && (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc66] rounded-full flex items-center justify-center text-xl border-2 border-orange-500">
                    👤
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{language === 'zh-CN' ? '你' : 'You'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Join Button */}
          <Button
            onClick={handleToggleJoin}
            className={`w-full ${
              joined
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90'
            } text-white`}
          >
            {joined ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {text.joined}
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                {text.join}
              </>
            )}
          </Button>

          {(joined ? groupEvent.participants + 1 : groupEvent.participants) < 5 && (
            <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg">
              <p className="text-xs text-yellow-400">
                ⏳ {text.waitingForMore}
              </p>
              <p className="text-xs text-yellow-500 mt-0.5">
                {text.minParticipants}
              </p>
            </div>
          )}
        </Card>

        {/* Event Details */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.eventDetails}</h3>
          <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{text.meetingPoint}</span>
              </div>
              <span className="text-sm text-white">{groupEvent.meetingPoint}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{text.startTime}</span>
              </div>
              <span className="text-sm text-white">{groupEvent.startTime}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="w-4 h-4" />
                <span className="text-sm">{text.difficulty}</span>
              </div>
              <span className="text-sm text-green-400">{groupEvent.difficulty}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Navigation className="w-4 h-4" />
                <span className="text-sm">{text.distance}</span>
              </div>
              <span className="text-sm text-white">{landmark.distance}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{text.estimatedTime}</span>
              </div>
              <span className="text-sm text-white">{groupEvent.estimatedTime}</span>
            </div>
          </Card>
        </div>

        {/* Rewards */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.rewards}</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-xs text-gray-400 mb-1">{text.pointsReward}</p>
              <p className="text-base text-[#00ff88]">+{groupEvent.pointsReward}</p>
            </Card>
            <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] text-center">
              <div className="text-2xl mb-2">🏅</div>
              <p className="text-xs text-gray-400 mb-1">{text.badge}</p>
              <p className="text-base text-orange-400">{language === 'zh-CN' ? '探索者' : 'Explorer'}</p>
            </Card>
          </div>
        </div>

        {/* Route Highlights */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.routeHighlights}</h3>
          <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] space-y-2">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-[#00ff88] mt-0.5" />
              <p className="text-sm text-gray-300">{text.highlight1}</p>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-[#00ff88] mt-0.5" />
              <p className="text-sm text-gray-300">{text.highlight2}</p>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-[#00ff88] mt-0.5" />
              <p className="text-sm text-gray-300">{text.highlight3}</p>
            </div>
          </Card>
        </div>

        {/* Full Route Map */}
        <div>
          <h3 className="text-base mb-3 text-white">{text.route}</h3>
          <Card className="overflow-hidden bg-[#1a1a1a] border-[#2a2a2a]">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.77%2C-122.41%2C37.80&layer=mapnik`}
              className="w-full h-64 border-0"
              title="Full Route Map"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
