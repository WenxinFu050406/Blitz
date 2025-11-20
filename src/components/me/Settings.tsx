import { ArrowLeft, Globe, Moon, Volume2, Smartphone, Download, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { useState } from 'react';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base">Settings</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* General Settings */}
        <div>
          <h3 className="text-sm text-slate-600 mb-3">General</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm">Language</p>
                  <p className="text-xs text-slate-500 mt-0.5">English</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm">Dark Mode</p>
                  <p className="text-xs text-slate-500 mt-0.5">Coming soon</p>
                </div>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                disabled
              />
            </div>
          </Card>
        </div>

        {/* Notifications Settings */}
        <div>
          <h3 className="text-sm text-slate-600 mb-3">Notifications</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm">Push Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive updates and alerts</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm">Sound Effects</p>
                  <p className="text-xs text-slate-500 mt-0.5">Play sounds for actions</p>
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
          <h3 className="text-sm text-slate-600 mb-3">Data & Storage</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm">Auto Sync</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sync rides automatically</p>
                </div>
              </div>
              <Switch
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="text-sm">Clear Cache</p>
                <p className="text-xs text-slate-500 mt-0.5">Free up 125 MB</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="text-sm">Download Data</p>
                <p className="text-xs text-slate-500 mt-0.5">Export your riding data</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </Card>
        </div>

        {/* About */}
        <div>
          <h3 className="text-sm text-slate-600 mb-3">About</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <div className="p-4">
              <p className="text-sm text-slate-500">App Version</p>
              <p className="text-sm mt-1">1.0.0</p>
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <p className="text-sm">Terms of Service</p>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <p className="text-sm">Privacy Policy</p>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <p className="text-sm">Open Source Licenses</p>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
