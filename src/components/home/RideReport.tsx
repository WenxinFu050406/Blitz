import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, Flame, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RideReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RideReport({ isOpen, onClose }: RideReportProps) {
  const { language } = useLanguage();
  
  // Generate last 7 days mock data
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      date: date,
      km: Math.floor(Math.random() * 30) + 5,
      time: Math.floor(Math.random() * 60) + 20,
      calories: Math.floor(Math.random() * 400) + 100,
    };
  });

  const totalKm = last7Days.reduce((acc, curr) => acc + curr.km, 0);
  const totalCalories = last7Days.reduce((acc, curr) => acc + curr.calories, 0);
  const totalTime = last7Days.reduce((acc, curr) => acc + curr.time, 0);

  const formatDate = (date: Date) => {
    const days = language === 'zh-CN' 
      ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === 'zh-CN' ? '近日骑行报告' : 'Recent Ride Report'}</DialogTitle>
          <DialogDescription>
            {language === 'zh-CN' ? '过去7天的骑行数据统计' : 'Statistics for the last 7 days'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary/10 p-3 rounded-xl flex flex-col items-center justify-center text-center">
              <MapPin className="w-5 h-5 text-primary mb-1" />
              <span className="text-xl font-bold text-primary">{totalKm}</span>
              <span className="text-xs text-muted-foreground">km</span>
            </div>
            <div className="bg-primary/10 p-3 rounded-xl flex flex-col items-center justify-center text-center">
              <Clock className="w-5 h-5 text-primary mb-1" />
              <span className="text-xl font-bold text-primary">{Math.floor(totalTime / 60)}h {totalTime % 60}m</span>
              <span className="text-xs text-muted-foreground">Time</span>
            </div>
            <div className="bg-primary/10 p-3 rounded-xl flex flex-col items-center justify-center text-center">
              <Flame className="w-5 h-5 text-primary mb-1" />
              <span className="text-xl font-bold text-primary">{totalCalories}</span>
              <span className="text-xs text-muted-foreground">kcal</span>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground px-1">
              {language === 'zh-CN' ? '每日详情' : 'Daily Breakdown'}
            </h3>
            {last7Days.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 6 ? 'bg-primary text-black' : 'bg-muted text-muted-foreground'
                  }`}>
                    {formatDate(day.date)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{day.km} km</span>
                    <span className="text-xs text-muted-foreground">{day.date.getDate()} {language === 'zh-CN' ? '日' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{day.time}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{day.calories}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold" onClick={onClose}>
            {language === 'zh-CN' ? '关闭' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
