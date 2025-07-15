import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { Prediction, SPECIES_CONFIG } from "@/types";
import cherryBloomMap from "@/assets/cherry-bloom-map.png";
import forsythiaBloomMap from "@/assets/forsythia-bloom-map.png";
import azaleaBloomMap from "@/assets/azalea-bloom-map.png";

interface SimpleMapProps {
  predictions: Prediction[];
  selectedSpecies: 'cherry' | 'forsythia' | 'azalea';
  onLocationSelect: (prediction: Prediction) => void;
}

export default function SimpleMap({ predictions, selectedSpecies, onLocationSelect }: SimpleMapProps) {
  const filteredPredictions = predictions.filter(p => p.species === selectedSpecies);
  
  const getBackgroundImage = () => {
    switch (selectedSpecies) {
      case 'cherry':
        return cherryBloomMap;
      case 'forsythia':
        return forsythiaBloomMap;
      case 'azalea':
        return azaleaBloomMap;
      default:
        return cherryBloomMap;
    }
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
    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg relative overflow-hidden">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${getBackgroundImage()})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60" />
      
      <div className="relative h-full overflow-auto p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🗺️</div>
          <h3 className="text-lg font-semibold">
            {SPECIES_CONFIG[selectedSpecies].name} 예측 지역
          </h3>
          <p className="text-sm text-muted-foreground">
            {filteredPredictions.length}개 지역 예측 데이터
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto">
          {filteredPredictions.slice(0, 20).map((prediction) => (
            <Card 
              key={`${prediction.region_code}-${prediction.species}`}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover-scale"
              onClick={() => onLocationSelect(prediction)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <span className="text-lg mr-2">{SPECIES_CONFIG[prediction.species].icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{prediction.region_name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {prediction.region_code}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <Calendar className="w-3 h-3 mr-1 text-primary" />
                    <span>예상: {formatDate(prediction.predicted_date)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {getDaysUntilBloom(prediction.predicted_date) > 0 
                        ? `D-${getDaysUntilBloom(prediction.predicted_date)}`
                        : '개화 완료'
                      }
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-6 text-xs">
                      상세보기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPredictions.length > 20 && (
          <div className="text-center mt-4">
            <Badge variant="secondary">
              +{filteredPredictions.length - 20}개 지역 더 있음
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}