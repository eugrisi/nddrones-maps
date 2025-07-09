import { useEffect, useState } from 'react';

const FloatingDrone = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: Math.max(10, Math.min(90, prev.x + (Math.random() - 0.5) * 10)),
        y: Math.max(10, Math.min(90, prev.y + (Math.random() - 0.5) * 10))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-50 transition-all duration-3000 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative animate-float">
        <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse flex items-center justify-center backdrop-blur-sm border border-primary/30">
          <div className="text-2xl animate-bounce">
            🛸
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring"></div>
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default FloatingDrone;
