import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom drone icon
const droneIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2343/2343468.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

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

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const DroneMap = ({ resellers, center, zoom }: DroneMapProps) => {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} zoom={zoom} />
        
        {resellers.map((reseller) => (
          <Marker
            key={reseller.id}
            position={reseller.position}
            icon={droneIcon}
          >
            <Popup className="font-sans">
              <div className="p-2">
                <h3 className="font-bold text-lg text-foreground">{reseller.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{reseller.type}</p>
                <p className="text-sm text-foreground mb-1">📍 {reseller.address}</p>
                <p className="text-sm text-foreground mb-1">📞 {reseller.phone}</p>
                <p className="text-sm text-foreground">✉️ {reseller.email}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DroneMap;