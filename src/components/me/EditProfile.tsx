import { useState } from 'react';
import { ArrowLeft, Camera, Save, Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';
import { toast } from 'sonner@2.0.3';

interface EditProfileProps {
  onBack: () => void;
}

// Predefined avatar options
const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
];

export function EditProfile({ onBack }: EditProfileProps) {
  const { currentUser, updateProfile } = useAuth();
  const { language } = useLanguage();
  const t = getTranslation(language).me;
  
  const [name, setName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || avatarOptions[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    // Update profile in AuthContext
    updateProfile({
      name,
      username,
      location,
      bio,
      avatar,
    });
    
    // Show success message
    setShowSuccess(true);
    toast.success(t.profileUpdated);
    
    // Go back after a short delay
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h2 className="text-base text-slate-800">{t.editProfile}</h2>
        </div>
        <Button
          onClick={handleSave}
          disabled={!name || !username}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white h-9 px-4"
        >
          {showSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {t.save}
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6 pb-8">
        {/* Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-cyan-500">
              <Camera className="w-4 h-4 text-cyan-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">{t.changeAvatar}</p>
          
          {/* Avatar Picker */}
          <div className="grid grid-cols-6 gap-3 mt-4 max-w-lg mx-auto">
            {avatarOptions.map((av, index) => (
              <button
                key={index}
                onClick={() => setAvatar(av)}
                className={`aspect-square rounded-full overflow-hidden transition-all border-3 ${
                  avatar === av
                    ? 'border-cyan-500 ring-2 ring-cyan-200 scale-110 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:scale-105'
                }`}
              >
                <img src={av} alt={`Avatar ${index + 1}`} className="w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <Card className="p-4 space-y-4 border border-slate-100 shadow-sm">
          <div>
            <label className="text-sm text-slate-700 mb-2 block">{t.username}</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={language === 'zh-CN' ? '输入用户名' : 'Enter username'}
              className="h-11"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 mb-2 block">{t.displayName}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'zh-CN' ? '输入显示名称' : 'Enter display name'}
              className="h-11"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 mb-2 block">{t.location}</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={language === 'zh-CN' ? '城市，省份' : 'City, State'}
              className="h-11"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 mb-2 block">{t.bio}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={language === 'zh-CN' ? '介绍一下自己...' : 'Tell us about yourself...'}
              className="w-full min-h-[100px] text-sm resize-none focus:outline-none border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              maxLength={150}
            />
            <p className="text-xs text-slate-400 mt-1">{bio.length}/150 {language === 'zh-CN' ? '字符' : 'characters'}</p>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="p-4 space-y-4 border border-slate-100 shadow-sm">
          <h3 className="text-sm text-slate-800">{t.yourBesvBike}</h3>
          
          <div>
            <label className="text-sm text-slate-700 mb-2 block">{t.model}</label>
            <Input
              defaultValue="BESV TRS1 AM"
              placeholder={language === 'zh-CN' ? '您的自行车型号' : 'Your bike model'}
              className="h-11"
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">{t.totalDistance}</label>
              <div className="text-base text-slate-800">{currentUser?.totalDistance || 0} km</div>
            </div>
            <div>
              <label className="text-sm text-slate-600 mb-1 block">{t.totalRides}</label>
              <div className="text-base text-slate-800">{currentUser?.totalDistance ? Math.floor(currentUser.totalDistance / 15) : 0}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
