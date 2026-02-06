import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
const Ideas = lazy(() => import("./pages/Ideas"));
const ToDo = lazy(() => import("./pages/ToDo"));
const VillarsRetreat = lazy(() => import("./pages/VillarsRetreat"));
const RoadJourney = lazy(() => import("./pages/RoadJourney"));
const Journals = lazy(() => import("./pages/Journals"));
const Success = lazy(() => import("./pages/Success"));
const AdminGallery = lazy(() => import("./pages/AdminGallery"));
const CinematicMemories = lazy(() => import("./pages/CinematicMemories"));
const JournalPost = lazy(() => import("./pages/JournalPost"));
const AlexProposal = lazy(() => import("./pages/private/AlexProposal"));
const RequestAccess = lazy(() => import("./pages/RequestAccess"));
const ActivateMembership = lazy(() => import("./pages/ActivateMembership"));
const ActivateMembershipCallback = lazy(() => import("./pages/ActivateMembershipCallback"));
const Members = lazy(() => import("./pages/Members"));
const Admin = lazy(() => import("./pages/Admin"));
const PendingApproval = lazy(() => import("./pages/PendingApproval"));
const AuthGuard = lazy(() => import("./components/AuthGuard"));

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
                <Route path="/ideas" element={<LanguageWrapper><Ideas /></LanguageWrapper>} />
                <Route path="/todo" element={<LanguageWrapper><ToDo /></LanguageWrapper>} />
                <Route path="/villars-retreat" element={<LanguageWrapper><VillarsRetreat /></LanguageWrapper>} />
                <Route path="/road-journey" element={<LanguageWrapper><RoadJourney /></LanguageWrapper>} />
                <Route path="/cinematic-memories" element={<LanguageWrapper><CinematicMemories /></LanguageWrapper>} />
                <Route path="/journals" element={<LanguageWrapper><Journals /></LanguageWrapper>} />
                <Route path="/journals/:slug" element={<LanguageWrapper><JournalPost /></LanguageWrapper>} />
                <Route path="/success" element={<LanguageWrapper><Success /></LanguageWrapper>} />
                <Route path="/" element={<LanguageWrapper><Index /></LanguageWrapper>} />
                <Route path="/privacy" element={<LanguageWrapper><Privacy /></LanguageWrapper>} />
                <Route path="/terms" element={<LanguageWrapper><Terms /></LanguageWrapper>} />
                <Route path="/for-teams" element={<LanguageWrapper><ForTeams /></LanguageWrapper>} />
                <Route path="/secure-deposit" element={<LanguageWrapper><SecureDeposit /></LanguageWrapper>} />
                <Route path="/private/alex-proposal" element={<AlexProposal />} />
                <Route path="/admin" element={<AuthGuard requireAdmin><Admin /></AuthGuard>} />
                <Route path="/admin/gallery" element={<AuthGuard requireAdmin><AdminGallery /></AuthGuard>} />
                <Route path="/request-access" element={<RequestAccess />} />
                <Route path="/apply" element={<RequestAccess />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/activate-membership" element={<ActivateMembership />} />
                <Route path="/activate-membership/callback" element={<ActivateMembershipCallback />} />
                <Route path="/members" element={<AuthGuard><Members /></AuthGuard>} />

                {/* Standardized language prefixed routes */}
                <Route path="/:lang" element={<LanguageWrapper><Index /></LanguageWrapper>} />
                <Route path="/:lang/ideas" element={<LanguageWrapper><Ideas /></LanguageWrapper>} />
                <Route path="/:lang/todo" element={<LanguageWrapper><ToDo /></LanguageWrapper>} />
                <Route path="/:lang/villars-retreat" element={<LanguageWrapper><VillarsRetreat /></LanguageWrapper>} />
                <Route path="/:lang/road-journey" element={<LanguageWrapper><RoadJourney /></LanguageWrapper>} />
                <Route path="/:lang/cinematic-memories" element={<LanguageWrapper><CinematicMemories /></LanguageWrapper>} />
                <Route path="/:lang/journals" element={<LanguageWrapper><Journals /></LanguageWrapper>} />
                <Route path="/:lang/journals/:slug" element={<LanguageWrapper><JournalPost /></LanguageWrapper>} />
                <Route path="/:lang/success" element={<LanguageWrapper><Success /></LanguageWrapper>} />
                <Route path="/:lang/privacy" element={<LanguageWrapper><Privacy /></LanguageWrapper>} />
                <Route path="/:lang/terms" element={<LanguageWrapper><Terms /></LanguageWrapper>} />
                <Route path="/:lang/for-teams" element={<LanguageWrapper><ForTeams /></LanguageWrapper>} />
                <Route path="/:lang/secure-deposit" element={<LanguageWrapper><SecureDeposit /></LanguageWrapper>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </I18nextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
