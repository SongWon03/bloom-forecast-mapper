import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, MapPin, User } from "lucide-react";
import { Sighting, SPECIES_CONFIG } from "@/types";

export default function Board() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [filteredSightings, setFilteredSightings] = useState<Sighting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    // Load sightings from localStorage
    const stored = localStorage.getItem("bloom-sightings");
    if (stored) {
      const data = JSON.parse(stored);
      setSightings(data);
      setFilteredSightings(data);
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = sightings;

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.region_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nickname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (speciesFilter !== "all") {
      filtered = filtered.filter(s => s.species === speciesFilter);
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter(s => s.stage === stageFilter);
    }

    setFilteredSightings(filtered);
  }, [sightings, searchTerm, speciesFilter, stageFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">지역 개화 게시판</h1>
          <p className="text-muted-foreground">
            전국의 개화 현황을 공유하고 확인해보세요
          </p>
        </div>
        <Button asChild className="btn-bloom">
          <Link to="/board/new">
            <Plus className="w-4 h-4 mr-2" />
            제보하기
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="지역 또는 닉네임 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
          <SelectTrigger>
            <SelectValue placeholder="꽃 종류" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 꽃</SelectItem>
            <SelectItem value="cherry">🌸 벚꽃</SelectItem>
            <SelectItem value="forsythia">🌼 개나리</SelectItem>
            <SelectItem value="azalea">🌺 진달래</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger>
            <SelectValue placeholder="개화 단계" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 단계</SelectItem>
            <SelectItem value="bud">발아</SelectItem>
            <SelectItem value="bloom">개화</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="text-sm text-muted-foreground flex items-center">
          총 {filteredSightings.length}개의 제보
        </div>
      </div>

      {/* Sightings Grid */}
      {filteredSightings.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-4">🌸</div>
            <CardTitle className="mb-2">
              {sightings.length === 0 ? "첫 번째 제보를 남겨주세요!" : "검색 결과가 없습니다"}
            </CardTitle>
            <CardDescription className="mb-6">
              {sightings.length === 0 
                ? "아직 등록된 개화 제보가 없습니다. 첫 번째 제보자가 되어보세요!"
                : "다른 검색 조건을 시도해보세요."
              }
            </CardDescription>
            {sightings.length === 0 && (
              <Button asChild className="btn-bloom">
                <Link to="/board/new">
                  <Plus className="w-4 h-4 mr-2" />
                  제보하기
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSightings.map((sighting) => (
            <Card key={sighting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {SPECIES_CONFIG[sighting.species].icon}
                    </span>
                    <Badge variant={sighting.stage === 'bloom' ? 'default' : 'secondary'}>
                      {sighting.stage === 'bloom' ? '개화' : '발아'}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {SPECIES_CONFIG[sighting.species].name}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {sighting.photo_url && (
                  <div className="aspect-[4/3] bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{sighting.region_name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(sighting.date)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    <span>{sighting.nickname}</span>
                  </div>
                  
                  {sighting.memo && (
                    <p className="text-sm mt-3 p-2 bg-muted/50 rounded">
                      {sighting.memo}
                    </p>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                  <Link to={`/board/${sighting.id}`}>
                    자세히 보기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}