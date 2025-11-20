import { useState, useEffect } from 'react';
import { Bluetooth, Check, X, RefreshCw, Battery, Signal } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { FixedBackButton } from '../ui/FixedBackButton';
import { useLanguage } from '../../context/LanguageContext';
import { Progress } from '../ui/progress';

interface BluetoothDevice {
  id: string;
  name: string;
  model: string;
  battery: number;
  signal: number;
  connected: boolean;
}

interface BluetoothConnectProps {
  onBack: () => void;
}

export function BluetoothConnect({ onBack }: BluetoothConnectProps) {
  const { language } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
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

  useEffect(() => {
    // Simulate already connected device
    setConnectedDevice({
      id: 'BESV-001',
      name: 'BESV JF1',
      model: 'JF1 Carbon',
      battery: 87,
      signal: 95,
      connected: true,
    });
  }, []);

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
    <div className="flex flex-col h-full bg-white">
      <FixedBackButton onClick={onBack} />
      
      {/* Header */}
      <div className="p-5 pt-0 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Bluetooth className="w-6 h-6" />
          <div>
            <h1 className="text-xl">{text.title}</h1>
            <p className="text-xs opacity-80 mt-0.5">{text.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Connected Device */}
        {connectedDevice && (
          <div>
            <h3 className="text-sm text-slate-600 mb-3">{text.connectedDevice}</h3>
            <Card className="p-4 border-2 border-green-500 bg-green-50/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Bluetooth className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base text-slate-800">{connectedDevice.name}</h4>
                    <p className="text-xs text-slate-500">{connectedDevice.model}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-xs">{text.connected}</span>
                </div>
              </div>

              {/* Device Stats */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-600">{text.battery}</span>
                    </div>
                    <span className="text-slate-800">{connectedDevice.battery}%</span>
                  </div>
                  <Progress value={connectedDevice.battery} className="h-1.5" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-600">{text.signal}</span>
                    </div>
                    <span className="text-slate-800">{connectedDevice.signal}%</span>
                  </div>
                  <Progress value={connectedDevice.signal} className="h-1.5" />
                </div>
              </div>

              {/* Device Info */}
              <div className="bg-white rounded-lg p-3 space-y-2 mb-3">
                <h4 className="text-sm text-slate-600 mb-2">{text.deviceInfo}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{text.model}</span>
                  <span className="text-slate-800">{connectedDevice.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{text.serialNumber}</span>
                  <span className="text-slate-800">{connectedDevice.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{text.firmwareVersion}</span>
                  <span className="text-slate-800">v2.4.1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{text.lastSync}</span>
                  <span className="text-slate-800">{language === 'zh-CN' ? '2分钟前' : '2 min ago'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {text.syncNow}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
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
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
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
            <h3 className="text-sm text-slate-600 mb-3">{text.availableDevices}</h3>
            <div className="space-y-2">
              {availableDevices.map((device) => (
                <Card key={device.id} className="p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Bluetooth className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="text-sm text-slate-800">{device.name}</h4>
                        <p className="text-xs text-slate-500">{device.model}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleConnect(device)}
                      size="sm"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
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
          <Card className="p-8 text-center border border-slate-200">
            <Bluetooth className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-600 mb-1">{text.noDevices}</p>
            <p className="text-xs text-slate-400">{text.scanToFind}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
