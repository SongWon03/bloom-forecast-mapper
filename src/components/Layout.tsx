import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Award, Info, BarChart3, MessageSquare, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { supabase } = await import("@/integrations/supabase/client");
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                🌸
              </div>
              <h1 className="logo text-2xl font-bold text-primary">꽃피다</h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
              }`}>
                <MapPin className="w-4 h-4" />
                <span>Bloom Map</span>
              </Link>
              
              <Link to="/board" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname.startsWith('/board') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
              }`}>
                <MessageSquare className="w-4 h-4" />
                <span>개화 게시판</span>
              </Link>
              
              <Link to="/hall-of-fame" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/hall-of-fame') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
              }`}>
                <Award className="w-4 h-4" />
                <span>명예의 전당</span>
              </Link>
              
              <Link to="/about" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/about') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
              }`}>
                <Users className="w-4 h-4" />
                <span>Who We Are</span>
              </Link>
              
              <Link to="/model" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/model') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
              }`}>
                <BarChart3 className="w-4 h-4" />
                 <span>Chill-Day Model</span>
               </Link>
               
               {isAdmin && (
                 <Link to="/admin" className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                   isActive('/admin') ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
                 }`}>
                   <Shield className="w-4 h-4" />
                   <span>관리자</span>
                 </Link>
               )}
            </nav>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  안녕하세요, {user.user_metadata?.nickname || '사용자'}님
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-1" />
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline">
                <Link to="/login">로그인</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 PhenoFACT Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}