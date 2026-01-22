import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load routes for code splitting
const Index = lazy(() => import("./pages/Index"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ForTeams = lazy(() => import("./pages/ForTeams"));
const SecureDeposit = lazy(() => import("./pages/SecureDeposit"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-white/60 text-sm">Loading...</div>
  </div>
);

// Language wrapper component to sync i18n with URL
function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const params = useParams<{ lang: string }>();

  useEffect(() => {
    const lang = params.lang || 'en';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [params.lang]);

  return <>{children}</>;
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nextProvider i18n={i18n}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Direct routes without language prefix */}
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/for-teams" element={<ForTeams />} />
                <Route path="/secure-deposit" element={<SecureDeposit />} />

                {/* Legacy language routes (keep temporarily for existing links, but can be removed later) */}
                <Route path="/:lang" element={<LanguageWrapper><Index /></LanguageWrapper>} />
                <Route path="/:lang/privacy" element={<LanguageWrapper><Privacy /></LanguageWrapper>} />
                <Route path="/:lang/terms" element={<LanguageWrapper><Terms /></LanguageWrapper>} />
                <Route path="/:lang/for-teams" element={<LanguageWrapper><ForTeams /></LanguageWrapper>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </I18nextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
