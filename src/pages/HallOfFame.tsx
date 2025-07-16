import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardUser {
  id: string;
  nickname: string;
  points: number;
  reports: number;
  last_report?: string;
}

export default function HallOfFame() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nickname, points, reports, last_report')
      .order('reports', { ascending: false })  // 제보수 기준으로 정렬
      .limit(20);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to mock data on error
      const mockUsers: LeaderboardUser[] = [
        { id: "1", nickname: "꽃사랑이", points: 250, reports: 25, last_report: "2025-04-10" },
        { id: "2", nickname: "봄소식", points: 220, reports: 22, last_report: "2025-04-09" },
        { id: "3", nickname: "벚꽃지기", points: 190, reports: 19, last_report: "2025-04-08" },
        { id: "4", nickname: "개나리헌터", points: 180, reports: 18, last_report: "2025-04-07" },
        { id: "5", nickname: "진달래요정", points: 170, reports: 17, last_report: "2025-04-06" },
      ];
      setLeaderboard(mockUsers);
    } else {
      setLeaderboard(data || []);
    }
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">👑 1위</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">🥈 2위</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">🥉 3위</Badge>;
    return <Badge variant="outline">{rank}위</Badge>;
  };

  const getPointsBadge = (reports: number) => {
    if (reports >= 20) return { emoji: "🌟", title: "개화 전문가", color: "bg-yellow-500" };
    if (reports >= 10) return { emoji: "🌸", title: "개화 탐험가", color: "bg-pink-500" };
    if (reports >= 5) return { emoji: "🌱", title: "새싹 관찰자", color: "bg-green-500" };
    return { emoji: "🔍", title: "초보 탐험가", color: "bg-blue-500" };
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-4xl font-bold mb-4">명예의 전당</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          꽃피다 커뮤니티의 최고 기여자들을 소개합니다.
          여러분의 제보가 더 정확한 개화 예측을 만들어갑니다!
        </p>
      </div>

      {/* Top 3 Podium */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl">
                  🥈
                </div>
                <CardTitle className="text-xl">{leaderboard[1].nickname}</CardTitle>
                <CardDescription>
                  <Badge className="bg-gray-400">2위</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-gray-600 mb-2">{leaderboard[1].points}점</div>
                <div className="text-sm text-muted-foreground">{leaderboard[1].reports}회 제보</div>
              </CardContent>
            </Card>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 transform scale-105">
              <CardHeader className="text-center pb-2">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-yellow-500 flex items-center justify-center text-white text-3xl">
                  👑
                </div>
                <CardTitle className="text-2xl">{leaderboard[0].nickname}</CardTitle>
                <CardDescription>
                  <Badge className="bg-yellow-500">1위</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{leaderboard[0].points}점</div>
                <div className="text-sm text-muted-foreground">{leaderboard[0].reports}회 제보</div>
                <div className="mt-2">
                  {(() => {
                    const badge = getPointsBadge(leaderboard[0].reports);
                    return (
                      <Badge className={`text-white ${badge.color}`}>
                        {badge.emoji} {badge.title}
                      </Badge>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl">
                  🥉
                </div>
                <CardTitle className="text-xl">{leaderboard[2].nickname}</CardTitle>
                <CardDescription>
                  <Badge className="bg-amber-600">3위</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-amber-600 mb-2">{leaderboard[2].points}점</div>
                <div className="text-sm text-muted-foreground">{leaderboard[2].reports}회 제보</div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Full Leaderboard */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">전체 랭킹</h2>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>기여자 순위</CardTitle>
            <CardDescription>
              제보수 기준으로 순위가 매겨지며, 제보 1회당 10점이 적립됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-32"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 bg-muted rounded w-16 mb-1"></div>
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((user, index) => {
                  const rank = index + 1;
                  const badge = getPointsBadge(user.reports);
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      rank <= 3 ? 'bg-muted/50' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(rank)}
                        {getRankBadge(rank)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {user.nickname}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          마지막 제보: {user.last_report ? new Date(user.last_report).toLocaleDateString('ko-KR') : '없음'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">{user.points}점</div>
                      <div className="text-sm text-muted-foreground">{user.reports}회 제보</div>
                      <div className="mt-1">
                        <Badge className={`text-white ${badge.color}`}>
                          {badge.emoji} {badge.title}
                        </Badge>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Achievement Badges */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">달성 가능한 뱃지</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">초보 탐험가</h3>
              <p className="text-sm text-muted-foreground">첫 제보 완료</p>
              <Badge variant="outline" className="mt-2">1-4회 제보</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold mb-1">새싹 관찰자</h3>
              <p className="text-sm text-muted-foreground">꾸준한 참여</p>
              <Badge variant="outline" className="mt-2">5-9회 제보</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🌸</div>
              <h3 className="font-semibold mb-1">개화 탐험가</h3>
              <p className="text-sm text-muted-foreground">활발한 기여</p>
              <Badge variant="outline" className="mt-2">10-19회 제보</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🌟</div>
              <h3 className="font-semibold mb-1">개화 전문가</h3>
              <p className="text-sm text-muted-foreground">최고 수준의 기여</p>
              <Badge variant="outline" className="mt-2">20회+ 제보</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}