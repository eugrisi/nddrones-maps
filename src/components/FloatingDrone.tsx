import { useEffect, useState } from 'react';

const FloatingDrone = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + (Math.random() - 0.5) * 2,
        y: prev.y + (Math.random() - 0.5) * 2
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-50 transition-all duration-1000 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative animate-bounce">
        <div className="w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
            🚁
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default FloatingDrone;