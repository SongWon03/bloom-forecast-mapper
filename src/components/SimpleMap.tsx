import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp, Info } from "lucide-react";
import { Prediction, SPECIES_CONFIG } from "@/types";
import cherryBloomMap from "@/assets/2025 Cherry.png";
import forsythiaBloomMap from "@/assets/2025 Forsythia.png";
import azaleaBloomMap from "@/assets/2025 Rosebay.png";

interface SimpleMapProps {
  predictions: Prediction[];
  selectedSpecies: 'cherry' | 'forsythia' | 'azalea';
  onLocationSelect: (prediction: Prediction) => void;
}

export default function SimpleMap({ predictions, selectedSpecies, onLocationSelect }: SimpleMapProps) {
  const filteredPredictions = predictions.filter(p => p.species === selectedSpecies);
  
  // 중복 제거를 위한 고유 키 확인
  const uniquePredictions = filteredPredictions.filter((prediction, index, self) => 
    index === self.findIndex(p => 
      p.region_code === prediction.region_code && 
      p.species === prediction.species
    )
  );

  const getMapImage = () => {
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

  const getStatusColor = (days: number) => {
    if (days < 0) return 'bg-gray-500';
    if (days < 7) return 'bg-red-500';
    if (days < 14) return 'bg-yellow-500';
    if (days < 30) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusText = (days: number) => {
    if (days < 0) return '개화 완료';
    if (days < 7) return '개화 임박';
    if (days < 14) return '곧 개화';
    if (days < 30) return '개화 예정';
    return '개화 준비';
  };

  // 예측일 기준 3일 전/5일 후 날짜 계산 함수 추가
  const getBestEarlyDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 3);
    return formatDate(date.toISOString());
  };
  const getBestLateDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 5);
    return formatDate(date.toISOString());
  };

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto p-2">
      {/* 지도 이미지 */}
      <div className="w-full flex justify-center mb-6">
        <img
          src={`https://raw.githubusercontent.com/SongWon03/bloom-forecast-mapper/main/src/assets/2025%20${selectedSpecies === 'cherry' ? 'Cherry' : selectedSpecies === 'forsythia' ? 'Forsythia' : 'Rosebay'}.png`}
          alt={`${SPECIES_CONFIG[selectedSpecies].name} 개화 예측 지도`}
          className="max-w-2xl w-full h-auto rounded-xl shadow-lg border object-contain bg-white"
          style={{ background: '#fff', maxHeight: '70vh' }}
          onError={(e) => {
            // 이미지 로드 실패시 로컬 이미지로 fallback
            e.currentTarget.src = getMapImage();
          }}
        />
      </div>

      {/* 지역별 카드 그리드 */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-w-7xl mx-auto mb-8">
        {uniquePredictions.slice(0, 20).map((prediction) => {
          const daysUntilBloom = getDaysUntilBloom(prediction.predicted_date);
          const statusColor = getStatusColor(daysUntilBloom);
          const statusText = getStatusText(daysUntilBloom);

          return (
            <Card
              key={`${prediction.region_code}-${prediction.species}-${prediction.lat}-${prediction.lon}`}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover-scale border-l-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
              style={{ borderLeftColor: statusColor.replace('bg-', '#') }}
              onClick={() => onLocationSelect(prediction)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <span className="text-lg mr-2">{SPECIES_CONFIG[selectedSpecies].icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{prediction.region_name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {prediction.region_code}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* 예측 날짜 */}
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <div className="flex items-center text-xs mb-1">
                      <Calendar className="w-3 h-3 mr-1 text-primary" />
                      <span className="font-medium">예상 개화일</span>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatDate(prediction.predicted_date)}
                    </div>
                  </div>

                  {/* D-Day */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColor} text-white border-0`}
                    >
                      {daysUntilBloom > 0
                        ? `D-${daysUntilBloom}`
                        : '개화 완료'
                      }
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {statusText}
                    </Badge>
                  </div>

                  {/* 신뢰구간 - 최고 빠름/최고 늦음 */}
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center mb-1">
                      <Info className="w-3 h-3 mr-1" />
                      <span>신뢰구간</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">최고 빠름</span> {getBestEarlyDate(prediction.predicted_date)}<br />
                      <span className="font-medium">최고 늦음</span> {getBestLateDate(prediction.predicted_date)}
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" className="w-full h-7 text-xs">
                    상세 정보 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 통계 정보 */}
      <div className="mt-6 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg backdrop-blur-sm max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {uniquePredictions.filter(p => getDaysUntilBloom(p.predicted_date) < 7).length}
            </div>
            <div className="text-xs text-muted-foreground">개화 임박</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {uniquePredictions.filter(p => {
                const days = getDaysUntilBloom(p.predicted_date);
                return days >= 7 && days < 14;
              }).length}
            </div>
            <div className="text-xs text-muted-foreground">곧 개화</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {uniquePredictions.filter(p => {
                const days = getDaysUntilBloom(p.predicted_date);
                return days >= 14 && days < 30;
              }).length}
            </div>
            <div className="text-xs text-muted-foreground">개화 예정</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {uniquePredictions.filter(p => getDaysUntilBloom(p.predicted_date) >= 30).length}
            </div>
            <div className="text-xs text-muted-foreground">개화 준비</div>
          </div>
        </div>
      </div>
    </div>
  );
}