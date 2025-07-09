import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Reseller } from '@/data/mockData';
import { useEffect, useState } from 'react';

interface DroneMapProps {
  resellers: Reseller[];
  center: [number, number];
  zoom: number;
  darkMode?: boolean;
  mapType?: 'traditional' | 'satellite';
  showCoverageCircles?: boolean;
}

const createDroneIcon = (isHeadquarters: boolean) => {
  const color = isHeadquarters ? '#1B2A1A' : '#F2994A';
  return L.divIcon({
    className: 'custom-drone-icon',
    html: `
      <div style="
        width: 36px; 
        height: 36px; 
        background: ${color}; 
        border-radius: 8px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: white; 
        border: 2px solid white; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        position: relative;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L13,8L12,14L11,8L12,2M12,2C13.66,2 15,3.34 15,5C15,6.66 13.66,8 12,8C10.34,8 9,6.66 9,5C9,3.34 10.34,2 12,2M6,8C7.66,8 9,9.34 9,11C9,12.66 7.66,14 6,14C4.34,14 3,12.66 3,11C3,9.34 4.34,8 6,8M18,8C19.66,8 21,9.34 21,11C21,12.66 19.66,14 18,14C16.34,14 15,12.66 15,11C15,9.34 16.34,8 18,8M12,16C13.66,16 15,17.34 15,19C15,20.66 13.66,22 12,22C10.34,22 9,20.66 9,19C9,17.34 10.34,16 12,16Z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const DroneMap = ({ resellers, center, zoom, darkMode = false, mapType = 'traditional', showCoverageCircles = false }: DroneMapProps) => {
  const [showCoverageCirclesState, setShowCoverageCirclesState] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nddrones_custom');
    if (saved) {
      const custom = JSON.parse(saved);
      setShowCoverageCirclesState(custom.showCoverageCircles || false);
    }
  }, []);

  const getTileLayer = () => {
    if (mapType === 'satellite') {
      return {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: '© Esri © DigitalGlobe © GeoEye'
      };
    }
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '© OpenStreetMap contributors'
    };
  };

    const tileLayer = getTileLayer();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-drone-icon { 
        background: none !important; 
        border: none !important; 
      }
      .leaflet-popup-content-wrapper {
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        font-family: 'Nunito', sans-serif;
        border: none;
        padding: 0;
        overflow: hidden;
      }
      .leaflet-popup-content {
        margin: 0;
        padding: 0;
        width: 280px !important;
      }
      .leaflet-popup-tip {
        background: white;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .leaflet-popup-close-button {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => { 
      if (document.head.contains(style)) {
        document.head.removeChild(style); 
      }
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        key={`${center[0]}-${center[1]}-${zoom}`}
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }} 
        scrollWheelZoom={true}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url={tileLayer.url}
          attribution={tileLayer.attribution}
          maxZoom={18}
          minZoom={3}
        />
        
                {/* Círculos de Cobertura */}
        {showCoverageCircles && resellers.map((reseller) => (
          reseller.coverageRadius && (
            <Circle
              key={`coverage-${reseller.id}`}
              center={reseller.position}
              radius={reseller.coverageRadius * 1000} // Converter km para metros
              pathOptions={{
                color: reseller.type === 'Sede Principal' ? '#1B2A1A' : '#F2994A',
                fillColor: reseller.type === 'Sede Principal' ? '#1B2A1A' : '#F2994A',
                fillOpacity: 0.1,
                weight: 2,
                opacity: 0.6,
                dashArray: reseller.type === 'Sede Principal' ? undefined : '5, 5'
              }}
            />
          )
        ))}

        {/* Marcadores das Unidades */}
        {resellers.map((reseller) => (
          <Marker
            key={reseller.id}
            position={reseller.position}
            icon={createDroneIcon(reseller.type === 'Sede Principal')}
          >
            <Popup closeButton={false} autoPan={true} className="custom-popup">
              <div className="w-full">
                {/* Header compacto */}
                <div className={`p-4 text-white ${
                  reseller.type === 'Sede Principal' 
                    ? 'bg-gradient-to-br from-green-600 to-green-800' 
                    : 'bg-gradient-to-br from-orange-500 to-orange-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-base leading-tight">{reseller.name}</h3>
                      <span className="text-xs opacity-90">{reseller.type}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reseller.type === 'Sede Principal' ? 'bg-white/20' : 'bg-white/20'
                    }`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conteúdo compacto */}
                <div className="p-4 bg-white">
                  <div className="space-y-3">
                    {/* Informações em linha */}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                        </svg>
                        <span className="flex-1">{reseller.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                        </svg>
                        <span className="flex-1">{reseller.phone}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
                        </svg>
                        <span className="flex-1 text-xs">{reseller.email}</span>
                      </div>
                    </div>

                    {/* Descrição compacta */}
                    {reseller.description && (
                      <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 italic">
                        {reseller.description}
                      </div>
                    )}

                    {/* Informações de cobertura */}
                    {reseller.coverageRadius && (
                      <div className="p-2 bg-blue-50 rounded text-xs">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                          </svg>
                          <div>
                            <div className="font-semibold text-blue-800">Raio de Cobertura</div>
                            <div className="text-blue-600">{reseller.coverageRadius} km de raio</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cidades Cobertas */}
                    {reseller.coveredCities && reseller.coveredCities.length > 0 && (
                      <div className="p-2 bg-green-50 rounded text-xs">
                        <div className="flex items-start space-x-2">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
                          </svg>
                          <div className="flex-1">
                            <div className="font-semibold text-green-800 mb-1">
                              Cidades Atendidas ({reseller.coveredCities.length})
                            </div>
                            <div className="max-h-20 overflow-y-auto">
                              <div className="grid grid-cols-1 gap-0.5">
                                {reseller.coveredCities.slice(0, 8).map((city, index) => (
                                  <div key={index} className="text-green-700 text-[10px] leading-tight">
                                    • {city}
                                  </div>
                                ))}
                                {reseller.coveredCities.length > 8 && (
                                  <div className="text-green-600 text-[10px] font-medium mt-1">
                                    +{reseller.coveredCities.length - 8} outras cidades
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Foto compacta */}
                    {reseller.photo && (
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={reseller.photo} 
                          alt={`Foto de ${reseller.name}`}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    )}

                    {/* Botões redesenhados */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <a 
                        href={`tel:${reseller.phone}`} 
                        className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
                        </svg>
                        <span>Ligar</span>
                      </a>
                      <a 
                        href={`https://wa.me/55${reseller.phone.replace(/\D/g, '')}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DroneMap;