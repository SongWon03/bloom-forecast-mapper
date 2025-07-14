import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prediction, SPECIES_CONFIG } from "@/types";
import predictionsData from "@/data/predictions.json";

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedSpecies, setSelectedSpecies] = useState<'cherry' | 'forsythia' | 'azalea'>('cherry');

  useEffect(() => {
    setPredictions(predictionsData as Prediction[]);
  }, []);

  const getSpeciesStats = (species: 'cherry' | 'forsythia' | 'azalea') => {
    const filtered = predictions.filter(p => p.species === species);
    return { total: filtered.length, blooming: Math.floor(filtered.length / 2) };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="logo">꽃피다</span> <span className="text-3xl">🌸</span>
          </h1>
          <h2 className="text-3xl font-bold mb-4">2025 Bloom Map</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            PhenoFACT 모델로 예측하는 전국 봄꽃 개화 지도
          </p>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {Object.values(SPECIES_CONFIG).map((config) => {
              const stats = getSpeciesStats(config.key);
              return (
                <Card key={config.key} className="bg-white/70 backdrop-blur-sm">
                  <CardContent className="pt-4">
                    <div className="text-2xl mb-2">{config.icon}</div>
                    <div className="font-semibold">{config.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.blooming}곳 개화 임박
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="년도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025년</SelectItem>
                <SelectItem value="2024">2024년</SelectItem>
                <SelectItem value="2023">2023년</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              PhenoFACT v{predictions[0]?.model_version || '0.9.3'} 기반 예측
            </div>
          </div>
          
          <Badge variant="outline" className="text-sm">
            📍 지역 클릭 시 상세 정보 확인
          </Badge>
        </div>

        {/* Species Tabs */}
        <Tabs value={selectedSpecies} onValueChange={(value: any) => setSelectedSpecies(value)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            {Object.values(SPECIES_CONFIG).map((config) => (
              <TabsTrigger key={config.key} value={config.key} className="flex items-center space-x-2">
                <span>{config.icon}</span>
                <span>{config.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Map Section - Temporarily simplified */}
      <div className="container mx-auto px-4 pb-8">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="text-2xl mr-2">🗺️</span>
              {SPECIES_CONFIG[selectedSpecies].name} 개화 예측 지도
            </CardTitle>
            <CardDescription>
              지역을 클릭하여 상세 정보를 확인하세요 (지도 기능 준비 중)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">{SPECIES_CONFIG[selectedSpecies].icon}</div>
              <h3 className="text-xl font-semibold mb-2">
                {SPECIES_CONFIG[selectedSpecies].name} 예측 데이터 로드됨
              </h3>
              <p className="text-muted-foreground mb-4">
                {predictions.filter(p => p.species === selectedSpecies).length}개 지역 예측 데이터
              </p>
              <Button className="btn-bloom">
                상호작용 지도 곧 업데이트
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
