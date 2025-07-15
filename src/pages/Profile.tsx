import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // 프로필 정보 불러오기
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("user_id", user.id)
        .single();
      if (!error && data) {
        setNickname(data.nickname);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast({ title: "닉네임 입력", description: "닉네임을 입력해주세요.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nickname })
      .eq("user_id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "오류", description: "닉네임 변경에 실패했습니다.", variant: "destructive" });
    } else {
      toast({ title: "닉네임 변경 완료", description: "닉네임이 성공적으로 변경되었습니다." });
      // 새 닉네임을 user context에 반영하려면 새로고침 또는 context 업데이트 필요
      window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    setLoading(true);
    // 1. 프로필 삭제
    await supabase.from("profiles").delete().eq("user_id", user.id);
    // 2. auth 계정 삭제
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    setLoading(false);
    if (error) {
      toast({ title: "오류", description: "계정 삭제에 실패했습니다.", variant: "destructive" });
    } else {
      toast({ title: "탈퇴 완료", description: "계정이 삭제되었습니다." });
      await signOut();
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>내 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">닉네임</label>
            <Input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              maxLength={20}
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "저장 중..." : "닉네임 저장"}
          </Button>
          <Button variant="outline" onClick={signOut} className="w-full">
            로그아웃
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
            회원 탈퇴
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 