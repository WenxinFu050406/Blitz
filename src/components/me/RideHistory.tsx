import { ArrowLeft, Calendar, MapPin, Clock, Zap } from 'lucide-react';
import { Card } from '../ui/card';

interface RideHistoryProps {
  onBack: () => void;
}

export function RideHistory({ onBack }: RideHistoryProps) {
  const rides = [
    { id: 1, date: 'Nov 12, 2024', time: '14:30', distance: 25.5, duration: '1h 45m', avgSpeed: 14.5, calories: 420, route: 'Golden Gate Park Loop' },
    { id: 2, date: 'Nov 11, 2024', time: '09:15', distance: 18.2, duration: '1h 20m', avgSpeed: 13.7, calories: 310, route: 'Embarcadero Trail' },
    { id: 3, date: 'Nov 10, 2024', time: '17:00', distance: 32.1, duration: '2h 15m', avgSpeed: 14.2, calories: 540, route: 'Sausalito Round Trip' },
    { id: 4, date: 'Nov 9, 2024', time: '08:00', distance: 15.8, duration: '1h 10m', avgSpeed: 13.5, calories: 280, route: 'Morning Commute' },
    { id: 5, date: 'Nov 8, 2024', time: '16:30', distance: 22.4, duration: '1h 35m', avgSpeed: 14.1, calories: 390, route: 'Bay Trail Explorer' },
    { id: 6, date: 'Nov 7, 2024', time: '10:45', distance: 28.9, duration: '2h 00m', avgSpeed: 14.4, calories: 480, route: 'Presidio Hills' },
  ];

  const totalDistance = rides.reduce((sum, ride) => sum + ride.distance, 0);
  const totalRides = rides.length;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333] bg-black text-white">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-base">Ride History</h2>
          <p className="text-xs opacity-90 mt-0.5 text-gray-400">{totalRides} rides • {totalDistance.toFixed(1)} km</p>
        </div>
        <Calendar className="w-6 h-6 text-[#00ff88]" />
      </div>

      {/* Rides List */}
      <div className="flex-1 overflow-auto p-4 space-y-3 bg-black">
        {rides.map((ride) => (
          <Card key={ride.id} className="p-4 border border-[#333] bg-[#1a1a1a] hover:border-[#00ff88] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm text-white">{ride.route}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{ride.date} • {ride.time}</p>
              </div>
              <div className="text-right">
                <p className="text-lg text-[#00ff88]">{ride.distance} km</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#333]">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="text-sm text-white">{ride.duration}</p>
              </div>
              <div className="text-center border-l border-r border-[#333]">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs">Avg Speed</span>
                </div>
                <p className="text-sm text-white">{ride.avgSpeed} km/h</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                  <span className="text-xs">🔥 Calories</span>
                </div>
                <p className="text-sm text-white">{ride.calories}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
