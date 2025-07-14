import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BloomMap from "@/components/BloomMap";
import SidePanel from "@/components/SidePanel";
import { Prediction, SPECIES_CONFIG } from "@/types";
import predictionsData from "@/data/predictions.json";

const Index = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedSpecies, setSelectedSpecies] = useState<'cherry' | 'forsythia' | 'azalea'>('cherry');
  const [selectedLocation, setSelectedLocation] = useState<Prediction | null>(null);

  useEffect(() => {
    // Load predictions data
    setPredictions(predictionsData as Prediction[]);
  }, []);

  const handleLocationSelect = (prediction: Prediction) => {
    setSelectedLocation(prediction);
  };

  const handleCloseSidePanel = () => {
    setSelectedLocation(null);
  };

  const getSpeciesStats = (species: 'cherry' | 'forsythia' | 'azalea') => {
    const filtered = predictions.filter(p => p.species === species);
    const now = new Date();
    const blooming = filtered.filter(p => {
      const date = new Date(p.predicted_date);
      const diff = Math.abs(date.getTime() - now.getTime());
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days <= 7;
    });
    return { total: filtered.length, blooming: blooming.length };
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

      {/* Map Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="relative">
          <Card className="h-[600px] overflow-hidden">
            <CardContent className="p-0 h-full">
              <BloomMap
                predictions={predictions}
                selectedSpecies={selectedSpecies}
                onLocationSelect={handleLocationSelect}
              />
            </CardContent>
          </Card>
          
          {/* Legend */}
          <Card className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">개화 임박도</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>7일 이내</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>2주 이내</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                  <span>1달 이내</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>1달 이후</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel 
        prediction={selectedLocation} 
        onClose={handleCloseSidePanel}
      />
      
      {/* Overlay when side panel is open */}
      {selectedLocation && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={handleCloseSidePanel}
        />
      )}
    </div>
  );
};

export default Index;
