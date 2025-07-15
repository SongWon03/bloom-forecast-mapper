import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import About from "./pages/About";
import Model from "./pages/Model";
import Board from "./pages/Board";
import BoardNew from "./pages/BoardNew";
import BoardDetail from "./pages/BoardDetail";
import HallOfFame from "./pages/HallOfFame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/model" element={<Model />} />
            <Route path="/board" element={<Board />} />
            <Route path="/board/new" element={<BoardNew />} />
            <Route path="/board/:id" element={<BoardDetail />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
