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
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
        ">
          ${species.icon}
        </div>
      `,
      className: 'custom-bloom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
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
        className="w-full h-full rounded-lg"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            <Popup>
              <Card className="border-0 shadow-none">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <span className="text-lg mr-2">{SPECIES_CONFIG[prediction.species].icon}</span>
                    {SPECIES_CONFIG[prediction.species].name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {prediction.region_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      예상 개화: {formatDate(prediction.predicted_date)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {getDaysUntilBloom(prediction.predicted_date) > 0 
                        ? `D-${getDaysUntilBloom(prediction.predicted_date)}`
                        : '개화 예상 완료'
                      }
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full text-xs h-7"
                      onClick={() => onLocationSelect(prediction)}
                    >
                      자세히 보기
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