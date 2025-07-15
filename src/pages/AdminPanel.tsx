import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Trash2, Shield, ShieldCheck, Eye, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  user_id: string;
  nickname: string;
  role: 'admin' | 'user';
  points: number;
  reports: number;
  last_report: string | null;
  created_at: string;
}

interface Sighting {
  id: string;
  user_id: string;
  region_name: string;
  species: string;
  stage: string;
  date: string;
  created_at: string;
  profiles: { nickname: string; role: string };
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndFetchData();
  }, [user]);

  const checkAdminAndFetchData = async () => {
    if (!user) return;

    try {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "접근 권한 없음",
          description: "관리자만 접근할 수 있습니다.",
          variant: "destructive",
        });
        return;
      }

      await Promise.all([fetchUsers(), fetchSightings()]);
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) {
      setUsers(data as User[]);
    }
  };

  const fetchSightings = async () => {
    const { data, error } = await supabase
      .from('sightings')
      .select(`
        *,
        profiles(nickname, role)
      `)
      .order('created_at', { ascending: false });

    if (!error) {
      setSightings(data as any[]);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "오류",
        description: "권한 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "권한 변경 완료",
        description: `사용자가 ${newRole === 'admin' ? '관리자' : '일반 사용자'}로 변경되었습니다.`,
      });
      fetchUsers();
    }
  };

  const deleteSighting = async (sightingId: string) => {
    if (!window.confirm('정말로 이 제보를 삭제하시겠습니까?')) {
      return;
    }

    const { error } = await supabase
      .from('sightings')
      .delete()
      .eq('id', sightingId);

    if (error) {
      toast({
        title: "오류",
        description: "제보 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "삭제 완료",
        description: "제보가 성공적으로 삭제되었습니다.",
      });
      fetchSightings();
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === "all" || u.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-2" />
            관리자 패널
          </h1>
          <p className="text-muted-foreground">
            사용자 및 게시물 관리
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            사용자 관리
          </TabsTrigger>
          <TabsTrigger value="sightings" className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            제보 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* User filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="닉네임 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="권한 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 사용자</SelectItem>
                <SelectItem value="admin">관리자</SelectItem>
                <SelectItem value="user">일반 사용자</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users list */}
          <div className="grid gap-4">
            {filteredUsers.map((u) => (
              <Card key={u.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-semibold flex items-center">
                          {u.nickname}
                          {u.role === 'admin' && (
                            <Badge variant="default" className="ml-2">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              관리자
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          제보 수: {u.reports} | 포인트: {u.points}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          가입: {new Date(u.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={u.role === 'admin' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => toggleUserRole(u.user_id, u.role)}
                      >
                        {u.role === 'admin' ? '관리자 해제' : '관리자 지정'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sightings" className="space-y-6">
          <div className="grid gap-4">
            {sightings.slice(0, 50).map((sighting) => (
              <Card key={sighting.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        {sighting.region_name} - {sighting.species}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        작성자: {sighting.profiles?.nickname || '알 수 없음'}
                        {sighting.profiles?.role === 'admin' && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            관리자
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(sighting.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSighting(sighting.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}