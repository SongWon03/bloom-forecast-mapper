import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, MapPin, User, Trash2 } from "lucide-react";
import { SPECIES_CONFIG } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SimpleSighting {
  id: string;
  user_id: string;
  region_name: string;
  lat: number;
  lon: number;
  species: 'cherry' | 'forsythia' | 'azalea';
  stage: 'bud' | 'bloom';
  date: string;
  photo_url?: string;
  memo?: string;
  created_at: string;
  nickname: string;
  isAdmin?: boolean;
}

export default function Board() {
  const [sightings, setSightings] = useState<SimpleSighting[]>([]);
  const [filteredSightings, setFilteredSightings] = useState<SimpleSighting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSightings();
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchSightings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sightings')
        .select(`
          id,
          user_id,
          region_name,
          lat,
          lon,
          species,
          stage,
          date,
          photo_url,
          memo,
          created_at,
          profiles!inner(nickname, role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sightings:', error);
      } else {
        // Transform data to match our interface
        const transformedData: SimpleSighting[] = (data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          region_name: item.region_name,
          lat: item.lat,
          lon: item.lon,
          species: item.species as 'cherry' | 'forsythia' | 'azalea',
          stage: item.stage as 'bud' | 'bloom',
          date: item.date,
          photo_url: item.photo_url,
          memo: item.memo,
          created_at: item.created_at,
          nickname: (item.profiles as any)?.nickname || '익명',
          isAdmin: (item.profiles as any)?.role === 'admin'
        }));
        setSightings(transformedData);
        setFilteredSightings(transformedData);
      }
    } catch (error) {
      console.error('Error fetching sightings:', error);
    }
    setLoading(false);
  };

  const handleDeleteSighting = async (sightingId: string) => {
    if (!window.confirm('정말로 이 제보를 삭제하시겠습니까?')) {
      return;
    }

    const { error } = await supabase
      .from('sightings')
      .delete()
      .eq('id', sightingId);

    if (error) {
      console.error('Error deleting sighting:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } else {
      // Remove from local state
      setSightings(prev => prev.filter(s => s.id !== sightingId));
      setFilteredSightings(prev => prev.filter(s => s.id !== sightingId));
      alert('성공적으로 삭제되었습니다.');
    }
  };

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
        {user && (
          <Button asChild className="btn-bloom">
            <Link to="/board/new">
              <Plus className="w-4 h-4 mr-2" />
              제보하기
            </Link>
          </Button>
        )}
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] bg-muted rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSightings.length === 0 ? (
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
            {sightings.length === 0 && user && (
              <Button asChild className="btn-bloom">
                <Link to="/board/new">
                  <Plus className="w-4 h-4 mr-2" />
                  제보하기
                </Link>
              </Button>
            )}
            {!user && (
              <Button asChild variant="outline">
                <Link to="/login">
                  로그인 후 제보하기
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
                    {sighting.isAdmin && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        관리자
                      </Badge>
                    )}
                  </div>
                  
                  {sighting.memo && (
                    <p className="text-sm mt-3 p-2 bg-muted/50 rounded">
                      {sighting.memo}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/board/${sighting.id}`}>
                      자세히 보기
                    </Link>
                  </Button>
                  {user && (user.id === sighting.user_id || isAdmin) && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteSighting(sighting.id)}
                      className="px-3"
                    >
                      삭제
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}