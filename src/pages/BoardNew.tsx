import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Sighting, SPECIES_CONFIG } from "@/types";

export default function BoardNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [species, setSpecies] = useState<'cherry' | 'forsythia' | 'azalea'>('cherry');
  const [stage, setStage] = useState<'bud' | 'bloom'>('bloom');
  const [regionName, setRegionName] = useState("");
  const [date, setDate] = useState<Date>();
  const [memo, setMemo] = useState("");
  const [nickname, setNickname] = useState("익명사용자");

  const handleSubmit = () => {
    if (!regionName || !date) {
      toast({
        title: "입력 오류",
        description: "위치와 날짜는 필수 입력사항입니다.",
        variant: "destructive",
      });
      return;
    }

    const newSighting: Sighting = {
      id: Date.now().toString(),
      user_id: "user-1",
      nickname,
      region_name: regionName,
      lat: 37.5665 + (Math.random() - 0.5) * 0.1, // Random coordinates around Seoul
      lon: 126.9780 + (Math.random() - 0.5) * 0.1,
      species,
      stage,
      date: format(date, 'yyyy-MM-dd'),
      memo: memo || undefined,
      created_at: new Date().toISOString()
    };

    // Save to localStorage
    const existing = localStorage.getItem("bloom-sightings");
    const sightings = existing ? JSON.parse(existing) : [];
    sightings.unshift(newSighting);
    localStorage.setItem("bloom-sightings", JSON.stringify(sightings));

    // Simulate points update
    const currentPoints = parseInt(localStorage.getItem("user-points") || "0");
    localStorage.setItem("user-points", String(currentPoints + 10));

    toast({
      title: "제보 완료!",
      description: `개화 정보가 등록되었습니다. +10 포인트 획득!`,
    });

    navigate('/board');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">새로운 개화 제보</h1>
        <p className="text-muted-foreground">
          발견한 개화 현황을 공유해주세요. 제보 시 10 포인트를 획득합니다!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>개화 정보 입력</CardTitle>
          <CardDescription>
            정확한 정보를 입력해주시면 더 나은 예측 모델 구축에 도움이 됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="익명사용자"
            />
          </div>

          {/* Species Selection */}
          <div className="space-y-3">
            <Label>꽃 종류</Label>
            <RadioGroup value={species} onValueChange={(value: any) => setSpecies(value)}>
              {Object.values(SPECIES_CONFIG).map((config) => (
                <div key={config.key} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                  <RadioGroupItem value={config.key} id={config.key} />
                  <Label htmlFor={config.key} className="flex items-center space-x-2 cursor-pointer flex-1">
                    <span className="text-xl">{config.icon}</span>
                    <span>{config.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Stage Selection */}
          <div className="space-y-3">
            <Label>개화 단계</Label>
            <RadioGroup value={stage} onValueChange={(value: any) => setStage(value)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                <RadioGroupItem value="bud" id="bud" />
                <Label htmlFor="bud" className="cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">발아 (새싹)</div>
                    <div className="text-sm text-muted-foreground">꽃봉오리가 보이기 시작</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50">
                <RadioGroupItem value="bloom" id="bloom" />
                <Label htmlFor="bloom" className="cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">개화</div>
                    <div className="text-sm text-muted-foreground">꽃이 활짝 핀 상태</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">위치 *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                placeholder="예: 서울특별시 종로구 청운효자동"
                className="pl-9"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>촬영일 *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>사진 업로드</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                사진을 드래그하거나 클릭하여 업로드
              </p>
              <Button variant="outline" size="sm">
                파일 선택
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                최대 1MB, JPG/PNG 형식
              </p>
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label htmlFor="memo">메모 (선택사항)</Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="개화 상태나 특이사항을 자유롭게 기록해주세요..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => navigate('/board')} className="flex-1">
              취소
            </Button>
            <Button onClick={handleSubmit} className="btn-bloom flex-1">
              제보하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}