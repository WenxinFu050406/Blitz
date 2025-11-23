import { Battery, Zap, Lock, Unlock, Lightbulb, Bell, Bluetooth, Leaf, Mountain, Activity, Cpu, Brain, Route } from 'lucide-react';
import { bikeDevice } from '../data/mockData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
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
  const [eBikeMode, setEBikeMode] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [currentMode, setCurrentMode] = useState(language === 'zh-CN' ? '智能模式' : 'Smart Mode');
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>({
    id: 'BESV-001',
    name: 'BESV JF1',
    model: 'JF1 Carbon',
    battery: 87,
    signal: 95,
    connected: true,
  });

  const handleEBikeModeChange = (checked: boolean) => {
    if (checked) {
      setShowModeSelect(true);
    } else {
      setEBikeMode(false);
    }
  };

  const selectMode = (mode: string) => {
    setCurrentMode(mode);
    setEBikeMode(true);
    setShowModeSelect(false);
  };

  const handleBluetoothChange = (checked: boolean) => {
    if (checked) {
      setShowBluetooth(true);
    } else {
      setConnectedDevice(null);
    }
  };

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

      {/* Lock & Battery Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Lock Card */}
        <Card 
          className={`p-3 border-border flex items-center justify-center h-20 cursor-pointer transition-colors ${
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

        {/* Battery Status */}
        <Card className="p-3 bg-card border-border flex items-center justify-center h-20 relative overflow-hidden">
          {/* Battery Fill Background */}
          <div 
            className="absolute inset-0 bg-primary/20 transition-all duration-300" 
            style={{ width: `${bikeDevice.battery}%` }}
          />
          
          <div className="z-10 flex items-center gap-3">
            <Battery className="w-6 h-6 text-primary" />
            <span className="text-base font-medium">{t.battery}</span>
            <span className="text-base font-bold">{bikeDevice.battery}%</span>
          </div>
        </Card>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Bike Lamp */}
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

        {/* Bike Alarm */}
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

        {/* Bluetooth */}
        <Card className="p-4 bg-card border-border flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Bluetooth className={`w-6 h-6 ${connectedDevice ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch 
              checked={!!connectedDevice} 
              onCheckedChange={handleBluetoothChange} 
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted" 
            />
          </div>
          <div>
            <p className="font-medium">{t.bluetooth}</p>
            <p className="text-xs text-muted-foreground">{connectedDevice ? t.connected : 'Disconnected'}</p>
          </div>
        </Card>

        {/* E-bike Mode */}
        <Card className="p-4 bg-card border-border flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <Zap className={`w-6 h-6 ${eBikeMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch 
              checked={eBikeMode} 
              onCheckedChange={handleEBikeModeChange} 
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted" 
            />
          </div>
          <div>
            <p className="font-medium">E-bike mode</p>
            <p className="text-xs text-muted-foreground">{eBikeMode ? currentMode : t.off}</p>
          </div>
        </Card>
      </div>

      {/* Start Ride Button (Bottom) */}
      <div>
        <Button 
          className="w-full h-14 bg-primary text-black hover:bg-primary/90 rounded-xl text-lg font-bold shadow-[0_0_20px_rgba(209,243,73,0.3)]"
          onClick={() => setShowStartRide(true)}
        >
          {t.startRide}
        </Button>
      </div>

      {/* Mode Selection Dialog */}
      <Dialog open={showModeSelect} onOpenChange={(open) => {
        if (!open && !eBikeMode) {
          setShowModeSelect(false);
        } else if (!open) {
           setShowModeSelect(false);
        }
      }}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Select E-bike Mode</DialogTitle>
            <DialogDescription>
              Choose a riding mode that suits your journey.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
              onClick={() => selectMode(language === 'zh-CN' ? '智能模式' : 'Smart Mode')}
            >
              <Brain className="w-8 h-8" />
              <span>{language === 'zh-CN' ? '智能模式' : 'Smart Mode'}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
              onClick={() => selectMode(language === 'zh-CN' ? '节能模式' : 'Eco Mode')}
            >
              <Leaf className="w-8 h-8" />
              <span>{language === 'zh-CN' ? '节能模式' : 'Eco Mode'}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
              onClick={() => selectMode(language === 'zh-CN' ? '旅行模式' : 'Tour Mode')}
            >
              <Route className="w-8 h-8" />
              <span>{language === 'zh-CN' ? '旅行模式' : 'Tour Mode'}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex flex-col gap-2 border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
              onClick={() => selectMode(language === 'zh-CN' ? '运动模式' : 'Sport Mode')}
            >
              <Mountain className="w-8 h-8" />
              <span>{language === 'zh-CN' ? '运动模式' : 'Sport Mode'}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}