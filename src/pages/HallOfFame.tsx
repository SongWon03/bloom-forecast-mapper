import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";
import { User } from "@/types";

export default function HallOfFame() {
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  useEffect(() => {
    // Generate mock leaderboard data
    const mockUsers: User[] = [
      { id: "1", nickname: "꽃사랑이", points: 250, reports: 25, last_report: "2025-04-10" },
      { id: "2", nickname: "봄소식", points: 220, reports: 22, last_report: "2025-04-09" },
      { id: "3", nickname: "벚꽃지기", points: 190, reports: 19, last_report: "2025-04-08" },
      { id: "4", nickname: "개나리헌터", points: 180, reports: 18, last_report: "2025-04-07" },
      { id: "5", nickname: "진달래요정", points: 170, reports: 17, last_report: "2025-04-06" },
      { id: "6", nickname: "꽃구경러", points: 150, reports: 15, last_report: "2025-04-05" },
      { id: "7", nickname: "봄맞이", points: 140, reports: 14, last_report: "2025-04-04" },
      { id: "8", nickname: "꽃소식통", points: 130, reports: 13, last_report: "2025-04-03" },
      { id: "9", nickname: "자연관찰자", points: 120, reports: 12, last_report: "2025-04-02" },
      { id: "10", nickname: "꽃피는마을", points: 110, reports: 11, last_report: "2025-04-01" }
    ];

    // Add current user points from localStorage if exists
    const userPoints = parseInt(localStorage.getItem("user-points") || "0");
    if (userPoints > 0) {
      mockUsers.push({
        id: "current",
        nickname: "나",
        points: userPoints,
        reports: Math.floor(userPoints / 10),
        last_report: new Date().toISOString().split('T')[0]
      });
    }

    // Sort by points
    mockUsers.sort((a, b) => b.points - a.points);
    setLeaderboard(mockUsers);
  }, []);

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

  const getPointsBadge = (points: number) => {
    if (points >= 200) return { emoji: "🌟", title: "개화 전문가", color: "bg-yellow-500" };
    if (points >= 100) return { emoji: "🌸", title: "개화 탐험가", color: "bg-pink-500" };
    if (points >= 50) return { emoji: "🌱", title: "새싹 관찰자", color: "bg-green-500" };
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
                <Badge className="mt-2 bg-yellow-500">🌟 개화 전문가</Badge>
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
              제보 1회당 10점이 적립됩니다. 더 많은 제보로 랭킹을 올려보세요!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user, index) => {
                const rank = index + 1;
                const badge = getPointsBadge(user.points);
                const isCurrentUser = user.id === "current";
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      isCurrentUser 
                        ? 'bg-primary/10 border-primary' 
                        : rank <= 3 
                        ? 'bg-muted/50' 
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(rank)}
                        {getRankBadge(rank)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${isCurrentUser ? 'text-primary font-bold' : ''}`}>
                            {user.nickname}
                            {isCurrentUser && <Badge variant="secondary" className="ml-2">나</Badge>}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          마지막 제보: {new Date(user.last_report || '').toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">{user.points}점</div>
                      <div className="text-sm text-muted-foreground">{user.reports}회 제보</div>
                      <Badge className={`mt-1 text-white ${badge.color}`}>
                        {badge.emoji} {badge.title}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <Badge variant="outline" className="mt-2">0-49점</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold mb-1">새싹 관찰자</h3>
              <p className="text-sm text-muted-foreground">꾸준한 참여</p>
              <Badge variant="outline" className="mt-2">50-99점</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🌸</div>
              <h3 className="font-semibold mb-1">개화 탐험가</h3>
              <p className="text-sm text-muted-foreground">활발한 기여</p>
              <Badge variant="outline" className="mt-2">100-199점</Badge>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🌟</div>
              <h3 className="font-semibold mb-1">개화 전문가</h3>
              <p className="text-sm text-muted-foreground">최고 수준의 기여</p>
              <Badge variant="outline" className="mt-2">200점+</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}