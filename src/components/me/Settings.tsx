import { ArrowLeft, Globe, Moon, Volume2, Smartphone, Download, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslation } from '../../locales/translations';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).settings;
  const tMain = getTranslation(language).mainPage; // For on/off

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333] bg-black sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-base text-white">{t.title}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-black">
        {/* General Settings */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">{t.general}</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">{t.language}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{language === 'en' ? 'English' : '简体中文'}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">{t.darkMode}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{tMain.on}</p>
                </div>
              </div>
              <Switch
                checked={true}
                onCheckedChange={() => {}}
                disabled
              />
            </div>
          </Card>
        </div>

        {/* Notifications Settings */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">{t.notifications}</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">{t.pushNotifications}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.pushDesc}</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">{t.soundEffects}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.soundDesc}</p>
                </div>
              </div>
              <Switch
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            </div>
          </Card>
        </div>

        {/* Data & Storage */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">{t.dataStorage}</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">{t.autoSync}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.syncDesc}</p>
                </div>
              </div>
              <Switch
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="text-left">
                <p className="text-sm text-white">{t.clearCache}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.clearCacheDesc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="text-left">
                <p className="text-sm text-white">{t.downloadData}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.downloadDesc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </Card>
        </div>

        {/* About */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">{t.about}</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <div className="p-4">
              <p className="text-sm text-gray-500">{t.appVersion}</p>
              <p className="text-sm mt-1 text-white">1.0.0</p>
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <p className="text-sm text-white">{t.termsOfService}</p>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <p className="text-sm text-white">{t.privacyPolicy}</p>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <p className="text-sm text-white">{t.openSourceLicenses}</p>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
