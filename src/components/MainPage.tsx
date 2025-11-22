import { Battery, Zap, Lock, Unlock, Lightbulb, Bell, Bluetooth } from 'lucide-react';
import { bikeDevice } from '../data/mockData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { StartRide } from './home/StartRide';
import { BluetoothConnect, BluetoothDevice } from './home/BluetoothConnect';
import { useState } from 'react';
import bikeImage from "figma:asset/2fae20d0297abd3f926f1875abdf0f95b397a398.png";

interface MainPageProps {
  onNavigateToMe?: () => void;
}

export function MainPage({ onNavigateToMe }: MainPageProps) {
  const { language } = useLanguage();
  const t = getTranslation(language).mainPage;
  const [showStartRide, setShowStartRide] = useState(false);
  const [showBluetooth, setShowBluetooth] = useState(false);
  const [bikeLocked, setBikeLocked] = useState(true);
  const [lampOn, setLampOn] = useState(true);
  const [alarmOn, setAlarmOn] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>({
    id: 'BESV-001',
    name: 'BESV JF1',
    model: 'JF1 Carbon',
    battery: 87,
    signal: 95,
    connected: true,
  });

  if (showStartRide) {
    return <StartRide onBack={() => setShowStartRide(false)} />;
  }

  if (showBluetooth) {
    return (
      <BluetoothConnect 
        onBack={() => setShowBluetooth(false)} 
        connectedDevice={connectedDevice}
        setConnectedDevice={setConnectedDevice}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold">Smart Electric Bike</h1>
          {connectedDevice && (
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary font-medium">{t.connected}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <div 
            className="w-8 h-8 rounded-full bg-card border border-border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onNavigateToMe}
          >
             {/* User Avatar Placeholder */}
             <div className="w-full h-full bg-muted flex items-center justify-center text-xs">ME</div>
          </div>
        </div>
      </div>

      {/* Bike Image */}
      <div className="relative h-64 w-full flex items-center justify-center my-4">
        <ImageWithFallback 
          src={bikeImage} 
          alt="Smart Bike" 
          className="h-full object-contain drop-shadow-2xl"
        />
      </div>

      {/* Lock Card */}
      <Card 
        className={`mb-4 p-3 border-border flex items-center justify-center h-20 cursor-pointer transition-colors ${
          !bikeLocked ? 'bg-primary/20 border-primary/50' : 'bg-card'
        }`}
        onClick={() => setBikeLocked(!bikeLocked)}
      >
        <div className="flex items-center gap-3">
          {bikeLocked ? (
            <Lock className="w-6 h-6 text-primary" />
          ) : (
            <Unlock className="w-6 h-6 text-primary" />
          )}
          <span className="text-base font-medium">{t.smartLock}</span>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-3 bg-card border-border flex flex-col items-center justify-center text-center h-24">
          <span className="text-xs text-muted-foreground mb-1">{t.usageTime}</span>
          <span className="text-lg font-bold">64h 13m</span>
        </Card>
        <Card className="p-3 bg-card border-border flex flex-col items-center justify-center text-center h-24">
          <span className="text-xs text-muted-foreground mb-1">{t.calories}</span>
          <span className="text-lg font-bold">535 KCal</span>
        </Card>
        <Card className="p-3 bg-card border-border flex flex-col items-center justify-center text-center h-24">
          <span className="text-xs text-muted-foreground mb-1">{t.distance}</span>
          <span className="text-lg font-bold">{bikeDevice.totalDistance} {language === 'zh-CN' ? '公里' : 'Km'}</span>
        </Card>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4 bg-card border-border flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Lightbulb className={`w-6 h-6 ${lampOn ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch checked={lampOn} onCheckedChange={setLampOn} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted" />
          </div>
          <div>
            <p className="font-medium">{t.bikeLamp}</p>
            <p className="text-xs text-muted-foreground">{lampOn ? t.on : t.off}</p>
          </div>
        </Card>
        <Card className="p-4 bg-card border-border flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Bell className={`w-6 h-6 ${alarmOn ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch checked={alarmOn} onCheckedChange={setAlarmOn} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted" />
          </div>
          <div>
            <p className="font-medium">{t.bikeAlarm}</p>
            <p className="text-xs text-muted-foreground">{alarmOn ? t.on : t.off}</p>
          </div>
        </Card>
      </div>

      {/* Battery & Bluetooth */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-card border-border flex items-center h-[60px] relative overflow-hidden">
          {/* Battery Fill Background */}
          <div 
            className="absolute inset-0 bg-primary/20 transition-all duration-300" 
            style={{ width: `${bikeDevice.battery}%` }}
          />
          
          <div className="z-10 flex items-center justify-center w-full px-1 gap-2">
            <Battery className="w-6 h-6 text-primary" />
            <span className="text-base font-medium">{t.battery}</span>
            <span className="text-base font-bold">{bikeDevice.battery}%</span>
          </div>
        </Card>
        
        <Card 
          className="p-3 bg-card border-border flex items-center h-[60px] cursor-pointer hover:bg-primary/5 transition-colors"
          onClick={() => setShowBluetooth(true)}
        >
          <div className="flex items-center justify-center w-full px-1 gap-2">
            <Bluetooth className={`w-6 h-6 ${connectedDevice ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-base font-medium">{t.bluetooth}</span>
          </div>
        </Card>
      </div>

      {/* Start Ride Button (Bottom) */}
      <div className="mt-6">
        <Button 
          className="w-full h-14 bg-primary text-black hover:bg-primary/90 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(209,243,73,0.3)]"
          onClick={() => setShowStartRide(true)}
        >
          {t.startRide}
        </Button>
      </div>
    </div>
  );
}