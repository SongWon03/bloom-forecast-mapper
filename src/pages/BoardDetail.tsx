import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, User, Clock } from "lucide-react";
import { Sighting, SPECIES_CONFIG } from "@/types";

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sighting, setSighting] = useState<Sighting | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const stored = localStorage.getItem("bloom-sightings");
    if (stored) {
      const sightings: Sighting[] = JSON.parse(stored);
      const found = sightings.find(s => s.id === id);
      setSighting(found || null);
    }
  }, [id]);

  if (!sighting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-6xl mb-4">🤔</div>
            <CardTitle className="mb-2">제보를 찾을 수 없습니다</CardTitle>
            <CardDescription className="mb-6">
              요청하신 제보가 존재하지 않거나 삭제되었습니다.
            </CardDescription>
            <Button asChild>
              <Link to="/board">
                <ArrowLeft className="w-4 h-4 mr-2" />
                게시판으로 돌아가기
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const speciesConfig = SPECIES_CONFIG[sighting.species];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/board')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          게시판으로 돌아가기
        </Button>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{speciesConfig.icon}</div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {speciesConfig.name} {sighting.stage === 'bloom' ? '개화' : '발아'} 제보
              </h1>
              <p className="text-muted-foreground">{sighting.region_name}</p>
            </div>
          </div>
          
          <Badge variant={sighting.stage === 'bloom' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
            {sighting.stage === 'bloom' ? '🌸 개화' : '🌱 발아'}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo */}
          {sighting.photo_url ? (
            <Card>
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-muted-foreground">업로드된 사진</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">{speciesConfig.icon}</div>
                <p className="text-muted-foreground">사진이 첨부되지 않았습니다</p>
              </CardContent>
            </Card>
          )}

          {/* Memo */}
          {sighting.memo && (
            <Card>
              <CardHeader>
                <CardTitle>제보자 메모</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{sighting.memo}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>제보 상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{sighting.nickname}</p>
                  <p className="text-sm text-muted-foreground">제보자</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDate(sighting.date)}</p>
                  <p className="text-sm text-muted-foreground">관측일</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{sighting.region_name}</p>
                  <p className="text-sm text-muted-foreground">위치</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{formatDateTime(sighting.created_at)}</p>
                  <p className="text-sm text-muted-foreground">제보 등록일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>관련 기능</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link to="/board/new">
                  새로운 제보 작성
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  예측 지도에서 확인
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full">
                이 지역 알림 설정
              </Button>
            </CardContent>
          </Card>

          {/* Species Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                {speciesConfig.icon} {speciesConfig.name} 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {sighting.species === 'cherry' && (
                  <>
                    <p>• 개화 시기: 3월 말 ~ 4월 중순</p>
                    <p>• 저온 요구도: 높음</p>
                    <p>• 개화 기간: 약 7-10일</p>
                  </>
                )}
                {sighting.species === 'forsythia' && (
                  <>
                    <p>• 개화 시기: 3월 초 ~ 3월 말</p>
                    <p>• 저온 요구도: 중간</p>
                    <p>• 개화 기간: 약 14일</p>
                  </>
                )}
                {sighting.species === 'azalea' && (
                  <>
                    <p>• 개화 시기: 4월 초 ~ 5월 초</p>
                    <p>• 저온 요구도: 높음</p>
                    <p>• 개화 기간: 약 10-14일</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}