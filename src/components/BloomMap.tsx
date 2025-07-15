import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, MapPin } from "lucide-react";
import { Prediction, SPECIES_CONFIG } from "@/types";

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNGRkM3REUiLz4KPHBhdGggZD0iTTEyLjUgOEMxNS4yNjE0IDggMTcuNSAxMC4yMzg2IDE3LjUgMTNDMTcuNSAxNS43NjE0IDE1LjI2MTQgMTggMTIuNSAxOEM5LjczODU4IDE4IDcuNSAxNS43NjE0IDcuNSAxM0M3LjUgMTAuMjM4NiA5LjczODU4IDggMTIuNSA4WiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNGRkM3REUiLz4KPHBhdGggZD0iTTEyLjUgOEMxNS4yNjE0IDggMTcuNSAxMC4yMzg2IDE3LjUgMTNDMTcuNSAxNS43NjE0IDE1LjI2MTQgMTggMTIuNSAxOEM5LjczODU4IDE4IDcuNSAxNS43NjE0IDcuNSAxM0M3LjUgMTAuMjM4NiA5LjczODU4IDggMTIuNSA4WiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIzNy41IiByeD0iMTIuNSIgcnk9IjMuNSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+Cjwvc3ZnPgo=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface BloomMapProps {
  predictions: Prediction[];
  selectedSpecies: 'cherry' | 'forsythia' | 'azalea';
  onLocationSelect: (prediction: Prediction) => void;
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 7);
  }, [map, center]);
  
  return null;
}

export default function BloomMap({ predictions, selectedSpecies, onLocationSelect }: BloomMapProps) {
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const filtered = predictions.filter(p => p.species === selectedSpecies);
    setFilteredPredictions(filtered);
  }, [predictions, selectedSpecies]);

  const getMarkerColor = (prediction: Prediction) => {
    const date = new Date(prediction.predicted_date);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return '#888888'; // Past
    if (days < 7) return '#FF6B6B'; // Very soon (red)
    if (days < 14) return '#FFE66D'; // Soon (yellow)
    if (days < 30) return '#4ECDC4'; // Medium (teal)
    return '#45B7D1'; // Far (blue)
  };

  const createCustomIcon = (prediction: Prediction) => {
    const color = getMarkerColor(prediction);
    const species = SPECIES_CONFIG[prediction.species];
    
    return L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, ${color} 0%, ${color}cc 100%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        " 
        onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)'"
        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
        >
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          "></div>
          ${species.icon}
        </div>
      `,
      className: 'custom-bloom-marker-modern',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilBloom = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[36.5, 127.5]}
        zoom={7}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        
        <MapController center={[36.5, 127.5]} />
        
        {filteredPredictions.map((prediction) => (
          <Marker
            key={`${prediction.region_code}-${prediction.species}`}
            position={[prediction.lat, prediction.lon]}
            icon={createCustomIcon(prediction)}
            eventHandlers={{
              click: () => onLocationSelect(prediction)
            }}
          >
            <Popup className="custom-popup" maxWidth={280}>
              <Card className="border-0 shadow-lg overflow-hidden bg-white/95 backdrop-blur-sm">
                <CardHeader className="p-4 pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="text-base flex items-center font-semibold">
                    <span className="text-xl mr-3">{SPECIES_CONFIG[prediction.species].icon}</span>
                    <div>
                      <div>{SPECIES_CONFIG[prediction.species].name}</div>
                      <div className="text-xs font-normal text-muted-foreground mt-1">
                        {prediction.region_name}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <div className="space-y-3">
                    <div className="bg-primary/5 p-3 rounded-lg">
                      <div className="flex items-center text-sm font-medium mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        예상 개화일
                      </div>
                      <div className="text-base font-semibold">
                        {formatDate(prediction.predicted_date)}
                      </div>
                      <div className="text-sm text-primary font-medium mt-1">
                        {getDaysUntilBloom(prediction.predicted_date) > 0 
                          ? `D-${getDaysUntilBloom(prediction.predicted_date)}`
                          : '개화 완료'
                        }
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full text-sm h-9 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                      onClick={() => onLocationSelect(prediction)}
                    >
                      상세 정보 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}