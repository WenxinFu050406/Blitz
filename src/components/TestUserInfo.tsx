import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { seedUsers } from '../data/seedUsers';

interface TestUserInfoProps {
  onQuickLogin?: (email: string, password: string) => void;
}

export function TestUserInfo({ onQuickLogin }: TestUserInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-700';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-200 text-orange-900';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="shadow-lg bg-[#00D9B5] hover:bg-[#00C4A3] text-white gap-2"
        >
          <User className="w-4 h-4" />
          Test Users
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-auto">
      <Card className="p-4 shadow-2xl border-2 border-[#00D9B5] bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#00D9B5]" />
            <h3 className="font-bold text-gray-900">Test User Accounts</h3>
          </div>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {seedUsers.map((user, index) => (
            <Card key={user.email} className="p-3 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{user.avatar}</span>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.language === 'en' ? 'English' : '中文'}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${getBadgeColor(user.badge)}`}>
                    #{user.carbonRank} {user.badge.toUpperCase()}
                  </div>
                </div>

                {/* Credentials */}
                <div className="space-y-1.5 bg-white p-2 rounded border border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm text-gray-900 truncate">{user.email}</div>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(user.email, `email-${index}`)}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      {copiedField === `email-${index}` ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500">Password</div>
                      <div className="text-sm text-gray-900 font-mono">{user.password}</div>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(user.password, `password-${index}`)}
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                    >
                      {copiedField === `password-${index}` ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-1.5 rounded">
                    <div className="text-blue-600">Bike</div>
                    <div className="text-gray-900 font-medium">{user.bikeModel}</div>
                  </div>
                  <div className="bg-green-50 p-1.5 rounded">
                    <div className="text-green-600">Distance</div>
                    <div className="text-gray-900 font-medium">{user.totalDistance} km</div>
                  </div>
                  <div className="bg-purple-50 p-1.5 rounded">
                    <div className="text-purple-600">Rides</div>
                    <div className="text-gray-900 font-medium">{user.totalRides}</div>
                  </div>
                  <div className="bg-orange-50 p-1.5 rounded">
                    <div className="text-orange-600">Carbon</div>
                    <div className="text-gray-900 font-medium">{user.carbonSaved} kg</div>
                  </div>
                </div>

                {/* Quick Login Button */}
                {onQuickLogin && (
                  <Button
                    onClick={() => onQuickLogin(user.email, user.password)}
                    className="w-full bg-gradient-to-r from-[#00D9B5] to-[#00B89C] hover:from-[#00C4A3] hover:to-[#00A88A] text-white"
                    size="sm"
                  >
                    Quick Login as {user.username}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 Click copy buttons or use Quick Login
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            These accounts are for testing only
          </p>
        </div>
      </Card>
    </div>
  );
}
