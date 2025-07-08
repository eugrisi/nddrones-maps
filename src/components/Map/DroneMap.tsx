import { useEffect, useRef } from 'react';

// Mock data for testing without external dependencies
interface Reseller {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  position: [number, number];
  type: string;
}

interface DroneMapProps {
  resellers: Reseller[];
  center: [number, number];
  zoom: number;
}

const DroneMap = ({ resellers, center, zoom }: DroneMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full relative bg-muted/20 rounded-lg border border-border">
      <div ref={mapRef} className="h-full w-full relative overflow-hidden">
        {/* Placeholder map interface */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950">
          {/* Grid pattern to simulate map */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Center marker */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg animate-pulse">
              🎯
            </div>
          </div>
          
          {/* Reseller markers scattered around */}
          {resellers.map((reseller, index) => (
            <div
              key={reseller.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${30 + (index * 15) % 40}%`,
                top: `${25 + (index * 12) % 50}%`
              }}
            >
              <div className="bg-destructive text-destructive-foreground rounded-full p-2 shadow-md hover:scale-110 transition-transform">
                🚁
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background border border-border rounded-lg p-3 shadow-lg min-w-48">
                  <h3 className="font-bold text-sm text-foreground">{reseller.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{reseller.type}</p>
                  <p className="text-xs text-foreground">{reseller.address}</p>
                  <p className="text-xs text-foreground">{reseller.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Map controls */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button className="bg-background border border-border rounded p-2 shadow-sm hover:bg-accent">
            ➕
          </button>
          <button className="bg-background border border-border rounded p-2 shadow-sm hover:bg-accent">
            ➖
          </button>
        </div>
        
        {/* Map info */}
        <div className="absolute bottom-4 right-4 z-20 bg-background/90 backdrop-blur border border-border rounded-lg p-2">
          <p className="text-xs text-muted-foreground">
            Mapa Interativo
          </p>
        </div>
      </div>
    </div>
  );
};

export default DroneMap;