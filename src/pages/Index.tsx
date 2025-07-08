import { useState } from 'react';
import DroneMap from '@/components/Map/DroneMap';
import SearchBar from '@/components/SearchBar';
import FloatingDrone from '@/components/FloatingDrone';
import { mockResellers } from '@/data/mockData';

const Index = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-14.2350, -51.9253]); // Brazil center
  const [mapZoom, setMapZoom] = useState(5);
  const [filteredResellers, setFilteredResellers] = useState(mockResellers);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredResellers(mockResellers);
      return;
    }

    const filtered = mockResellers.filter(reseller =>
      reseller.name.toLowerCase().includes(query.toLowerCase()) ||
      reseller.address.toLowerCase().includes(query.toLowerCase()) ||
      reseller.type.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredResellers(filtered);
    
    if (filtered.length > 0) {
      setMapCenter(filtered[0].position);
      setMapZoom(12);
    }
  };

  const handleLocationSearch = (coordinates: [number, number]) => {
    setMapCenter(coordinates);
    setMapZoom(10);
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingDrone />
      
      {/* Header */}
      <div className="relative z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Sistema de Revenda ND Drones
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Encontre revendedores autorizados próximos a você
            </p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[calc(100vh-200px)] w-full">
        <DroneMap
          resellers={filteredResellers}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      {/* Results Counter */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
        <p className="text-sm text-muted-foreground">
          {filteredResellers.length} revendedor(es) encontrado(s)
        </p>
      </div>
    </div>
  );
};

export default Index;
