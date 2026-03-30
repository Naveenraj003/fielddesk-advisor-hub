import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useMemo, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import NotFound from "./pages/NotFound.tsx";
import PortfolioDashboard from "./pages/PortfolioDashboard.tsx";
import FarmerDetailPage from "./pages/FarmerDetailPage.tsx";
import SoilIntelligencePage from "./pages/SoilIntelligencePage.tsx";
import AdvisorInsightsPage from "./pages/AdvisorInsightsPage";
import FPOCommandCenter from "./pages/FPOCommandCenter";
import LaunchIntroPage from "./pages/LaunchIntroPage";
import { DataModeProvider, useDataMode } from "./contexts/DataModeContext";

const queryClient = new QueryClient();

function HomeRoute() {
  return <LaunchIntroPage />;
}

function EntryIntroGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [introShown, setIntroShown] = useState(false);

  const targetPath = useMemo(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    return path === "/" ? "/portfolio" : path;
    // Capture the first entry target only for this app load.
  }, [location.pathname, location.search, location.hash]);

  if (!introShown) {
    return (
      <LaunchIntroPage
        onDone={() => {
          setIntroShown(true);
          navigate(targetPath, { replace: true });
        }}
      />
    );
  }

  return <>{children}</>;
}

function AppHeader() {
  const { mode, setMode } = useDataMode();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold text-slate-900">
            FieldDesk
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900">
              Command Center
            </Link>
            <Link to="/portfolio-live" className="hover:text-slate-900">
              Portfolio Live
            </Link>
            <Link to="/insights" className="hover:text-slate-900">
              Advisor Intelligence
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={mode === 'demo' ? 'default' : 'outline'} size="sm" onClick={() => setMode('demo')}>
            Demo Data
          </Button>
          <Button variant={mode === 'live' ? 'default' : 'outline'} size="sm" onClick={() => setMode('live')}>
            Live Data
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Replay Intro</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <EntryIntroGate>
            <AppHeader />
            <Routes>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/portfolio" element={<FPOCommandCenter />} />
              <Route path="/portfolio-live" element={<PortfolioDashboard />} />
              <Route path="/insights" element={<AdvisorInsightsPage />} />
              <Route path="/farmer/:id" element={<FarmerDetailPage />} />
              <Route path="/farmer/:id/soil" element={<SoilIntelligencePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </EntryIntroGate>
        </BrowserRouter>
      </TooltipProvider>
    </DataModeProvider>
  </QueryClientProvider>
);

export default App;
