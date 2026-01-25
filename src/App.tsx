import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import { NetworkWarning } from "@/components/wallet/NetworkWarning";
import { ScryptoLanding } from "./pages/ScryptoLanding";
import { FindMatchesPage } from "./pages/FindMatchesPage";
import { SessionsPage } from "./pages/SessionsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SkillsPage } from "./pages/SkillsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Web3Provider>
          <NetworkWarning />
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<ScryptoLanding />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/matches" element={<FindMatchesPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Web3Provider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
