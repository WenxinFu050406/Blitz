import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Square, MapPin, TrendingUp, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface StartRideProps {
  onBack: () => void;
}

export function StartRide({ onBack }: StartRideProps) {
  const [isRiding, setIsRiding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRiding && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        // Simulate distance increase (random between 0.1-0.3 km per second)
        setDistance(prev => prev + (Math.random() * 0.002 + 0.003));
        // Simulate speed (10-18 km/h)
        setSpeed(Math.random() * 8 + 10);
        // Simulate calories (roughly 8-12 per minute)
        setCalories(prev => prev + (Math.random() * 0.2 + 0.15));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRiding, isPaused]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRiding(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (confirm('End this ride? Your stats will be saved.')) {
      // Save ride data here
      alert(`Ride completed!\nDistance: ${distance.toFixed(2)} km\nDuration: ${formatTime(duration)}\nCalories: ${Math.round(calories)}`);
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="p-4 bg-background/80 backdrop-blur-sm border-b border-border absolute top-0 w-full z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-medium">Ride Session</h2>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-secondary relative">
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
            {/* Simulate Dark Mode Map */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                     backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                 }} 
            />
          <div className="text-center relative z-10">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Live map tracking</p>
            <p className="text-xs text-muted-foreground mt-1">GPS location enabled</p>
          </div>
        </div>

        {/* Status Badge */}
        {isRiding && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
            <div className={`px-4 py-2 rounded-full backdrop-blur-md ${
              isPaused 
                ? 'bg-yellow-500/90 text-black' 
                : 'bg-primary/90 text-black'
            }`}>
              <p className="text-xs font-bold">
                {isPaused ? '⏸ Paused' : '🚴 Riding'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Panel */}
      <div className="bg-card border-t border-border p-4 space-y-4 z-20">
        {/* Main Timer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="text-4xl font-mono tracking-wider font-bold">{formatTime(duration)}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-secondary border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <p className="text-lg font-bold">{distance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">km</p>
          </Card>

          <Card className="p-3 bg-secondary border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <p className="text-xs text-muted-foreground">Speed</p>
            </div>
            <p className="text-lg font-bold">{speed.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">km/h</p>
          </Card>

          <Card className="p-3 bg-secondary border-border text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-xs">🔥</span>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <p className="text-lg font-bold">{Math.round(calories)}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </Card>
        </div>

        {/* Control Buttons */}
        {!isRiding ? (
          <Button
            onClick={handleStart}
            className="w-full h-14 bg-primary text-black hover:bg-primary/90 text-base font-bold rounded-xl"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Ride
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handlePause}
              className={`flex-1 h-14 ${
                isPaused
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
              } text-base font-bold rounded-xl`}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              className="h-14 px-6 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white text-base font-bold rounded-xl"
            >
              <Square className="w-5 h-5 mr-2" />
              End
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}