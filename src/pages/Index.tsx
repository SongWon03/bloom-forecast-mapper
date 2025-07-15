import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, MapPin, TrendingUp, Clock } from "lucide-react";
import { Prediction, SPECIES_CONFIG } from "@/types";
import predictionsData from "@/data/predictions.json";
import BloomMap from "@/components/BloomMap";

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedSpecies, setSelectedSpecies] = useState<'cherry' | 'forsythia' | 'azalea'>('cherry');
  const [selectedLocation, setSelectedLocation] = useState<Prediction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    setPredictions(predictionsData as Prediction[]);
  }, []);

  const getSpeciesStats = (species: 'cherry' | 'forsythia' | 'azalea') => {
    const filtered = predictions.filter(p => p.species === species);
    const now = new Date();
    const blooming = filtered.filter(p => {
      const diff = new Date(p.predicted_date).getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 14;
    }).length;
    return { total: filtered.length, blooming };
  };

  const handleLocationSelect = (prediction: Prediction) => {
    setSelectedLocation(prediction);
    setIsDetailOpen(true);
  };

  const formatDetailDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getDaysUntilBloom = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <span className="logo">꽃피다</span> <span className="text-3xl">🌸</span>
            </h1>
            <h2 className="text-3xl font-bold mb-4">2025 Bloom Map</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              PhenoFACT AI로 예측한 전국 봄꽃 개화 지도
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {Object.values(SPECIES_CONFIG).map((config, index) => {
              const stats = getSpeciesStats(config.key);
              return (
                <Card key={config.key} className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-0 shadow-lg hover-scale animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-3">{config.icon}</div>
                    <div className="font-semibold text-lg">{config.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.total}곳 예측
                    </div>
                    <div className="text-xs text-primary font-medium mt-1">
                      {stats.blooming}곳 곧 개화
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32 border-2 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="년도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025년</SelectItem>
                <SelectItem value="2024">2024년</SelectItem>
                <SelectItem value="2023">2023년</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="secondary" className="text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              PhenoFACT v0.0.15 AI 예측
            </Badge>
          </div>
          
          <Badge variant="outline" className="text-sm border-primary/30 bg-primary/5">
            <MapPin className="w-4 h-4 mr-1" />
            지역 클릭으로 상세 정보 확인
          </Badge>
        </div>

        {/* Species Tabs */}
        <Tabs value={selectedSpecies} onValueChange={(value: any) => setSelectedSpecies(value)} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-muted/50 backdrop-blur-sm">
            {Object.values(SPECIES_CONFIG).map((config) => (
              <TabsTrigger 
                key={config.key} 
                value={config.key} 
                className="flex items-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"
              >
                <span className="text-lg">{config.icon}</span>
                <span className="font-medium">{config.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Interactive Map Section */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="h-[700px] overflow-hidden border-2 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-background to-muted/30 border-b">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{SPECIES_CONFIG[selectedSpecies].icon}</span>
                <div>
                  <div className="text-xl font-bold">{SPECIES_CONFIG[selectedSpecies].name} 개화 예측 지도</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {predictions.filter(p => p.species === selectedSpecies).length}개 지역 AI 예측 데이터
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 border-primary/30">
                <Calendar className="w-4 h-4 mr-1" />
                실시간 업데이트
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div className="h-full">
              {predictions.length > 0 ? (
                <BloomMap
                  predictions={predictions}
                  selectedSpecies={selectedSpecies}
                  onLocationSelect={handleLocationSelect}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🌸</div>
                    <div className="text-lg font-medium">지도 로딩 중...</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <span className="text-2xl mr-2">{selectedLocation && SPECIES_CONFIG[selectedLocation.species].icon}</span>
              {selectedLocation && SPECIES_CONFIG[selectedLocation.species].name} 개화 예측
            </DialogTitle>
            <DialogDescription className="flex items-center text-base">
              <MapPin className="w-4 h-4 mr-1" />
              {selectedLocation?.region_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLocation && (
            <div className="space-y-6 mt-4">
              {/* 예측 날짜 */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">예상 개화일</div>
                    <div className="text-lg font-semibold">{formatDetailDate(selectedLocation.predicted_date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">D-Day</div>
                    <div className="text-2xl font-bold text-primary">
                      {getDaysUntilBloom(selectedLocation.predicted_date) > 0 
                        ? `D-${getDaysUntilBloom(selectedLocation.predicted_date)}`
                        : '개화 완료'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* 신뢰도 구간 */}
              <div className="space-y-3">
                <div className="text-sm font-medium">예측 신뢰 구간</div>
                <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">최빠름</span>
                    <span className="font-medium">{formatDetailDate(selectedLocation.confidence_low)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">최늦음</span>
                    <span className="font-medium">{formatDetailDate(selectedLocation.confidence_high)}</span>
                  </div>
                </div>
              </div>

              {/* 모델 정보 */}
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI 모델</span>
                  <Badge variant="secondary" className="text-xs">
                    {selectedLocation.model_version}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
