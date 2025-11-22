import { ArrowLeft, Heart, MessageCircle, UserPlus, Award, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const notifications = [
    { id: 1, type: 'like', user: 'Sarah Chen', avatar: '👩', message: 'liked your post', time: '5m ago', unread: true },
    { id: 2, type: 'comment', user: 'Mike Johnson', avatar: '👨', message: 'commented: "Great ride!"', time: '15m ago', unread: true },
    { id: 3, type: 'friend', user: 'Emma Wilson', avatar: '👧', message: 'started following you', time: '1h ago', unread: true },
    { id: 4, type: 'achievement', message: 'You unlocked "1000 KM Club" achievement!', time: '2h ago', unread: false },
    { id: 5, type: 'like', user: 'David Park', avatar: '👨‍💼', message: 'liked your post', time: '3h ago', unread: false },
    { id: 6, type: 'comment', user: 'Lisa Wang', avatar: '👩‍🦰', message: 'commented: "Where is this trail?"', time: '5h ago', unread: false },
    { id: 7, type: 'friend', user: 'Tom Anderson', avatar: '👨‍🦱', message: 'started following you', time: '1d ago', unread: false },
    { id: 8, type: 'achievement', message: 'You unlocked "Speed Demon" achievement!', time: '2d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-[#00ff88]" />;
      case 'friend': return <UserPlus className="w-4 h-4 text-[#00ff88]" />;
      case 'achievement': return <Award className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333] bg-black">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <h2 className="text-base text-white">Notifications</h2>
          <p className="text-xs text-gray-400 mt-0.5">{unreadCount} unread</p>
        </div>
        <Bell className="w-6 h-6 text-[#00ff88]" />
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-auto bg-black">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors ${
              notification.unread ? 'bg-[#1a1a1a]/50 border-l-2 border-l-[#00ff88]' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {notification.type === 'achievement' ? (
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#00ff88] flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#00ff88]" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-lg flex-shrink-0">
                  {notification.avatar}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {notification.user && (
                      <span className="text-sm text-white">{notification.user} </span>
                    )}
                    <span className="text-sm text-gray-400">{notification.message}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {notification.unread && (
                      <div className="w-2 h-2 bg-[#00ff88] rounded-full" />
                    )}
                    {getIcon(notification.type)}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mark All as Read */}
      <div className="p-4 border-t border-[#333] bg-black">
        <button className="w-full py-2.5 text-sm text-[#00ff88] hover:bg-[#1a1a1a] rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
  );
}
