import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, TrendingUp, UserPlus, MessageCircle, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';

interface UserProfileProps {
  user: any;
  onBack: () => void;
  onFollow?: (userId: string) => void;
}

export function UserProfile({ user, onBack, onFollow }: UserProfileProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).me; // Reuse 'Me' translations
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(!!user.isFriend);
  }, [user]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    if (onFollow) onFollow(user.id);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-base text-foreground">{user.name}</h2>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Cover & Avatar */}
        <div className="relative">
          <div 
            className={`h-32 bg-gradient-to-r from-primary/20 to-blue-500/20 bg-cover bg-center`}
            style={{
              backgroundImage: user.backgroundImage ? `url(${user.backgroundImage})` : undefined
            }}
          >
            {user.backgroundImage && <div className="absolute inset-0 bg-black/20" />}
          </div>
          <div className="absolute -bottom-10 left-4">
            <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-secondary">
              {user.avatar?.startsWith('http') || user.avatar?.startsWith('/') ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">{user.avatar || '👤'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 px-4 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">@{user.username || user.id}</p>
            </div>
            <Button 
              onClick={handleFollow}
              className={`rounded-full px-6 ${isFollowing ? 'bg-secondary text-foreground hover:bg-secondary/80' : 'bg-primary text-black hover:bg-primary/90'}`}
            >
              {isFollowing ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {language === 'zh-CN' ? '已关注' : 'Following'}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {language === 'zh-CN' ? '关注' : 'Follow'}
                </>
              )}
            </Button>
          </div>

          {user.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}

          {user.bio && (
            <p className="mt-3 text-sm text-foreground/80">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 border-y border-border py-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{user.totalDistance || 0}</p>
              <p className="text-xs text-muted-foreground">km {t.totalDistance}</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-lg font-bold text-foreground">{user.posts || 0}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{user.friendsCount || 12}</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </div>
          </div>
        </div>

        {/* Recent Activity / Badges placeholder */}
        <div className="px-4 py-2">
            <h3 className="text-sm font-medium mb-3">{language === 'zh-CN' ? '最近徽章' : 'Recent Badges'}</h3>
            <div className="flex gap-2">
                <Badge variant="outline" className="py-1 px-2 border-primary/30 bg-primary/5">
                    <TrendingUp className="w-3 h-3 mr-1 text-primary" />
                    Rider
                </Badge>
                 <Badge variant="outline" className="py-1 px-2 border-blue-500/30 bg-blue-500/5">
                    <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                    Explorer
                </Badge>
            </div>
        </div>
      </div>
    </div>
  );
}