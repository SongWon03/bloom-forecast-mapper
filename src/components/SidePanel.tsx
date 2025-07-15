import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, TrendingUp, AlertCircle, MessageSquare, X } from "lucide-react";
import { Prediction, SPECIES_CONFIG } from "@/types";

interface SidePanelProps {
  prediction: Prediction | null;
  onClose: () => void;
}

export default function SidePanel({ prediction, onClose }: SidePanelProps) {
  if (!prediction) return null;

  const formatDate = (dateString: string) => {
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

  const getStatusColor = (days: number) => {
    if (days < 0) return 'destructive';
    if (days < 7) return 'default';
    if (days < 14) return 'secondary';
    return 'outline';
  };

  const getStatusText = (days: number) => {
    if (days < 0) return '개화 예상 완료';
    if (days < 7) return '개화 임박';
    if (days < 14) return '곧 개화 예정';
    return '개화 예정';
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

  const speciesConfig = SPECIES_CONFIG[prediction.species];
  const daysUntilBloom = getDaysUntilBloom(prediction.predicted_date);

  // Mock historical data for sparkline
  const mockHistoricalData = [
    { year: 2022, date: '2022-04-15' },
    { year: 2023, date: '2022-04-12' },
    { year: 2024, date: '2022-04-10' }
  ];

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-lg z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{speciesConfig.icon}</div>
            <div>
              <h2 className="text-xl font-bold">{speciesConfig.name}</h2>
              <p className="text-sm text-muted-foreground">{prediction.region_name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <Badge variant={getStatusColor(daysUntilBloom)} className="text-sm px-3 py-1">
            {daysUntilBloom > 0 ? `D-${daysUntilBloom}` : ''} {getStatusText(daysUntilBloom)}
          </Badge>
        </div>

        {/* Prediction Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              개화 예측
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">예상 개화일</span>
                <span className="font-semibold">{formatDate(prediction.predicted_date)}</span>
              </div>
              {/* 최고 빠름/최고 늦음 구간 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">최고 빠름</span>
                <span className="text-sm">{getBestEarlyDate(prediction.predicted_date)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">최고 늦음</span>
                <span className="text-sm">{getBestLateDate(prediction.predicted_date)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">95% 신뢰구간</span>
                <span className="text-sm">
                  {new Date(prediction.confidence_low).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - {' '}
                  {new Date(prediction.confidence_high).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">모델 버전</span>
                <Badge variant="outline" className="text-xs">{prediction.model_version}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historical Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              최근 3년 개화일
            </CardTitle>
            <CardDescription>실제 관측된 개화일 기록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockHistoricalData.map((data) => (
                <div key={data.year} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{data.year}년</span>
                  <span className="text-sm font-medium">
                    {new Date(data.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Simple sparkline representation */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>3월</span>
                <span>4월</span>
                <span>5월</span>
              </div>
              <div className="h-2 bg-muted rounded-full relative">
                <div className="absolute left-1/3 w-2 h-2 bg-primary rounded-full transform -translate-y-0"></div>
                <div className="absolute left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-y-0"></div>
                <div className="absolute left-2/3 w-2 h-2 bg-primary rounded-full transform -translate-y-0"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">기상 정보</p>
                <p className="text-blue-700">
                  이번 주 기온이 평년보다 높아 예상 개화일이 앞당겨질 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full btn-bloom">
            <Link to="/board/new">
              <MessageSquare className="w-4 h-4 mr-2" />
              이 지역 개화 제보하기
            </Link>
          </Button>
          
          <Button variant="outline" className="w-full">
            <MapPin className="w-4 h-4 mr-2" />
            이 지역 알림 설정
          </Button>
          
          <Button variant="outline" className="w-full" asChild>
            <Link to="/board">
              다른 제보 보기
            </Link>
          </Button>
        </div>

        {/* Species Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {speciesConfig.icon} {speciesConfig.name} 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {prediction.species === 'cherry' && (
                <>
                  <p>• 개화 시기: 3월 말 ~ 4월 중순</p>
                  <p>• 개화 기간: 약 7-10일</p>
                  <p>• 최적 관찰 시간: 오전 10시 ~ 오후 2시</p>
                </>
              )}
              {prediction.species === 'forsythia' && (
                <>
                  <p>• 개화 시기: 3월 초 ~ 3월 말</p>
                  <p>• 개화 기간: 약 14일</p>
                  <p>• 특징: 가장 먼저 봄을 알리는 꽃</p>
                </>
              )}
              {prediction.species === 'azalea' && (
                <>
                  <p>• 개화 시기: 4월 초 ~ 5월 초</p>
                  <p>• 개화 기간: 약 10-14일</p>
                  <p>• 특징: 산지에서 주로 관찰</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}