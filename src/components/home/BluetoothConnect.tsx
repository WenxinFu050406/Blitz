import { useState, useEffect } from 'react';
import { Bluetooth, Check, X, RefreshCw, Battery, Signal } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { Progress } from '../ui/progress';

export interface BluetoothDevice {
  id: string;
  name: string;
  model: string;
  battery: number;
  signal: number;
  connected: boolean;
}

interface BluetoothConnectProps {
  onBack: () => void;
  connectedDevice: BluetoothDevice | null;
  setConnectedDevice: (device: BluetoothDevice | null) => void;
}

export function BluetoothConnect({ onBack, connectedDevice, setConnectedDevice }: BluetoothConnectProps) {
  const { language } = useLanguage();
  const [scanning, setScanning] = useState(false);
  // const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null); // Moved to parent
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);

  const t = {
    en: {
      title: 'Bluetooth Devices',
      subtitle: 'Connect your BESV bike',
      scanning: 'Scanning for devices...',
      scan: 'Scan for Devices',
      stopScan: 'Stop Scanning',
      connectedDevice: 'Connected Device',
      availableDevices: 'Available Devices',
      connect: 'Connect',
      disconnect: 'Disconnect',
      connected: 'Connected',
      battery: 'Battery',
      signal: 'Signal',
      noDevices: 'No devices found',
      scanToFind: 'Tap scan to find nearby BESV bikes',
      deviceInfo: 'Device Information',
      model: 'Model',
      serialNumber: 'Serial Number',
      firmwareVersion: 'Firmware',
      lastSync: 'Last Synced',
      syncNow: 'Sync Now',
    },
    'zh-CN': {
      title: '蓝牙设备',
      subtitle: '连接您的BESV自行车',
      scanning: '正在扫描设备...',
      scan: '扫描设备',
      stopScan: '停止扫描',
      connectedDevice: '已连接设备',
      availableDevices: '可用设备',
      connect: '连接',
      disconnect: '断开',
      connected: '已连接',
      battery: '电池',
      signal: '信号',
      noDevices: '未找到设备',
      scanToFind: '点击扫描以查找附近的BESV自行车',
      deviceInfo: '设备信息',
      model: '型号',
      serialNumber: '序列号',
      firmwareVersion: '固件版本',
      lastSync: '上次同步',
      syncNow: '立即同步',
    },
  };

  const text = t[language];

  // useEffect removed - connection state managed by parent

  const handleScan = () => {
    setScanning(true);
    setAvailableDevices([]);

    // Simulate device discovery
    setTimeout(() => {
      setAvailableDevices([
        {
          id: 'BESV-002',
          name: 'BESV TRS1',
          model: 'TRS1 AM',
          battery: 92,
          signal: 78,
          connected: false,
        },
        {
          id: 'BESV-003',
          name: 'BESV PSA1',
          model: 'PSA1',
          battery: 65,
          signal: 85,
          connected: false,
        },
      ]);
      setScanning(false);
    }, 2000);
  };

  const handleConnect = (device: BluetoothDevice) => {
    // Disconnect current device
    if (connectedDevice) {
      setConnectedDevice(null);
    }

    // Connect new device
    setTimeout(() => {
      setConnectedDevice({ ...device, connected: true });
      setAvailableDevices(prev => prev.filter(d => d.id !== device.id));
    }, 500);
  };

  const handleDisconnect = () => {
    if (connectedDevice) {
      setAvailableDevices(prev => [...prev, { ...connectedDevice, connected: false }]);
      setConnectedDevice(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <FixedBackButton onClick={onBack} />
      
      {/* Header */}
      <div className="p-5 pt-0 bg-black text-white">
        <div className="flex items-center gap-3 mb-2">
          <Bluetooth className="w-6 h-6" />
          <div>
            <h1 className="text-xl font-bold">{text.title}</h1>
            <p className="text-xs opacity-80 mt-0.5">{text.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Connected Device */}
        {connectedDevice && (
          <div>
            <h3 className="text-sm text-zinc-400 mb-3">{text.connectedDevice}</h3>
            <Card className="p-4 border border-green-500/50 bg-zinc-900/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                    <Bluetooth className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base text-white font-medium">{connectedDevice.name}</h4>
                    <p className="text-xs text-zinc-400">{connectedDevice.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">{text.connected}</span>
                </div>
              </div>

              {/* Device Stats */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-400">{text.battery}</span>
                    </div>
                    <span className="text-white font-medium">{connectedDevice.battery}%</span>
                  </div>
                  <Progress value={connectedDevice.battery} className="h-1.5 bg-zinc-800" indicatorClassName="bg-green-500" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-zinc-400" />
                      <span className="text-zinc-400">{text.signal}</span>
                    </div>
                    <span className="text-white font-medium">{connectedDevice.signal}%</span>
                  </div>
                  <Progress value={connectedDevice.signal} className="h-1.5 bg-zinc-800" indicatorClassName="bg-green-500" />
                </div>
              </div>

              {/* Device Info */}
              <div className="bg-black rounded-lg p-3 space-y-2 mb-3 border border-zinc-800">
                <h4 className="text-sm text-zinc-400 mb-2">{text.deviceInfo}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{text.model}</span>
                  <span className="text-zinc-300">{connectedDevice.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{text.serialNumber}</span>
                  <span className="text-zinc-300">{connectedDevice.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{text.firmwareVersion}</span>
                  <span className="text-zinc-300">v2.4.1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{text.lastSync}</span>
                  <span className="text-zinc-300">{language === 'zh-CN' ? '2分钟前' : '2 min ago'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-green-600/50 text-green-500 hover:bg-green-950/30 hover:text-green-400 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {text.syncNow}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-950/30 hover:text-red-400 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  {text.disconnect}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Scan Button */}
        <div>
          <Button
            onClick={scanning ? () => setScanning(false) : handleScan}
            disabled={scanning}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-none"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {text.scanning}
              </>
            ) : (
              <>
                <Bluetooth className="w-4 h-4 mr-2" />
                {text.scan}
              </>
            )}
          </Button>
        </div>

        {/* Available Devices */}
        {availableDevices.length > 0 && (
          <div>
            <h3 className="text-sm text-zinc-400 mb-3">{text.availableDevices}</h3>
            <div className="space-y-2">
              {availableDevices.map((device) => (
                <Card key={device.id} className="p-4 border border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Bluetooth className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="text-sm text-white font-medium">{device.name}</h4>
                        <p className="text-xs text-zinc-500">{device.model}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnect(device)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white border-none"
                    >
                      {text.connect}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Devices */}
        {!scanning && availableDevices.length === 0 && !connectedDevice && (
          <Card className="p-8 text-center border border-zinc-800 bg-zinc-900/30">
            <Bluetooth className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-400 mb-1">{text.noDevices}</p>
            <p className="text-xs text-zinc-600">{text.scanToFind}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
