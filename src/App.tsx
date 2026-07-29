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
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsAppButton from "./components/WhatsAppButton";

// Lazy load routes for code splitting
import Index from "./pages/Index";
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
import ForTeams from "./pages/ForTeams";
const SecureDeposit = lazy(() => import("./pages/SecureDeposit"));
const Ideas = lazy(() => import("./pages/Ideas"));
const ToDo = lazy(() => import("./pages/ToDo"));
import VillarsRetreat from "./pages/VillarsRetreat";
const RoadJourney = lazy(() => import("./pages/RoadJourney"));
import Journals from "./pages/Journals";
const Success = lazy(() => import("./pages/Success"));
const AdminGallery = lazy(() => import("./pages/AdminGallery"));
const CinematicMemories = lazy(() => import("./pages/CinematicMemories"));
import JournalPost from "./pages/JournalPost";
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationPage = lazy(() => import("./pages/DestinationPage"));
const AlexProposal = lazy(() => import("./pages/private/AlexProposal"));
const InvitePage = lazy(() => import("./pages/private/InvitePage"));
import RequestAccess from "./pages/RequestAccess";
const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Members = lazy(() => import("./pages/MembersDashboard"));
// const Admin = lazy(() => import("./pages/Admin")); // Deprecated: redirects to /admin/gallery
const PendingApproval = lazy(() => import("./pages/PendingApproval"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthGuard = lazy(() => import("./components/AuthGuard"));

// New pages
import About from "./pages/About";
const Contact = lazy(() => import("./pages/Contact"));
import Sanctuaries from "./pages/Sanctuaries";
import Experiences from "./pages/Experiences";
const PrivateChef = lazy(() => import("./pages/PrivateChef"));
const GuidedHikes = lazy(() => import("./pages/GuidedHikes"));
const MountainCoaster = lazy(() => import("./pages/MountainCoaster"));
const MembersBook = lazy(() => import("./pages/MembersBook"));
const MembersProfile = lazy(() => import("./pages/MembersProfileNew"));
const MembersExplore = lazy(() => import("./pages/MembersExplore"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
const GuestEnhance = lazy(() => import("./pages/GuestEnhance"));
const LinkGenerator = lazy(() => import("./pages/LinkGenerator"));
import Packages from "./pages/Packages";
const ListYourExperience = lazy(() => import("./pages/ListYourExperience"));
const Discovery = lazy(() => import("./pages/Discovery"));
import InsiderGuide from "./pages/InsiderGuide";
const DiscoveryDrafts = lazy(() => import("./pages/admin/DiscoveryDrafts"));

const queryClient = new QueryClient();

// Loading fallback — skeleton with nav bar so the page doesn't flash pure black
const PageLoader = () => (
  <div className="min-h-screen bg-[#060606]">
    {/* Nav skeleton */}
    <div className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between border-b border-white/5 bg-[#060606]/90 backdrop-blur-sm">
      <div className="w-32 h-3 bg-white/10 rounded-sm animate-pulse" />
      <div className="hidden md:flex gap-6">
        {[80, 64, 72, 56, 48].map((w, i) => (
          <div key={i} className="h-2.5 bg-white/8 rounded-sm animate-pulse" style={{ width: w }} />
        ))}
      </div>
      <div className="w-16 h-3 bg-white/10 rounded-sm animate-pulse" />
    </div>
    {/* Content skeleton */}
    <div className="pt-40 px-8 md:px-16 max-w-4xl mx-auto">
      <div className="w-24 h-2 bg-white/8 rounded-sm animate-pulse mb-8" />
      <div className="w-3/4 h-10 bg-white/10 rounded-sm animate-pulse mb-4" />
      <div className="w-1/2 h-10 bg-white/8 rounded-sm animate-pulse mb-8" />
      <div className="w-2/3 h-4 bg-white/6 rounded-sm animate-pulse mb-3" />
      <div className="w-1/2 h-4 bg-white/5 rounded-sm animate-pulse" />
    </div>
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
    // Keep <html lang> attribute in sync — fixes accessibility (#8 audit)
    if (typeof document !== 'undefined' && document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
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
          <Sonner duration={4000} position="top-right" />
          <BrowserRouter>
            <ErrorBoundary>
            <ScrollToTop />
            <WhatsAppButton />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Direct routes without language prefix */}
                <Route path="/ideas" element={<AuthGuard requireAdmin><Ideas /></AuthGuard>} />
                <Route path="/todo" element={<AuthGuard requireAdmin><ToDo /></AuthGuard>} />

                {/* Sanctuaries */}
                <Route path="/sanctuaries" element={<LanguageWrapper><Sanctuaries /></LanguageWrapper>} />
                <Route path="/sanctuaries/villars" element={<LanguageWrapper><VillarsRetreat /></LanguageWrapper>} />
                {/* Legacy redirect support */}
                <Route path="/villars-retreat" element={<LanguageWrapper><VillarsRetreat /></LanguageWrapper>} />

                {/* Experiences */}
                <Route path="/experiences" element={<LanguageWrapper><Experiences /></LanguageWrapper>} />
                <Route path="/experiences/road-journey" element={<LanguageWrapper><RoadJourney /></LanguageWrapper>} />
                <Route path="/experiences/cinematic-memories" element={<LanguageWrapper><CinematicMemories /></LanguageWrapper>} />
                <Route path="/experiences/private-chef" element={<LanguageWrapper><PrivateChef /></LanguageWrapper>} />
                <Route path="/experiences/guided-hikes" element={<LanguageWrapper><GuidedHikes /></LanguageWrapper>} />
                <Route path="/experiences/mountain-coaster" element={<LanguageWrapper><MountainCoaster /></LanguageWrapper>} />
                {/* Legacy redirect support */}
                <Route path="/road-journey" element={<LanguageWrapper><RoadJourney /></LanguageWrapper>} />
                <Route path="/cinematic-memories" element={<LanguageWrapper><CinematicMemories /></LanguageWrapper>} />

                {/* Packages */}
                <Route path="/packages" element={<LanguageWrapper><Packages /></LanguageWrapper>} />

                {/* Discovery */}
                <Route path="/discovery" element={<LanguageWrapper><Discovery /></LanguageWrapper>} />
                <Route path="/discovery/:slug" element={<LanguageWrapper><Discovery /></LanguageWrapper>} />

                {/* Content */}
                <Route path="/journals" element={<LanguageWrapper><Journals /></LanguageWrapper>} />
                <Route path="/journals/:slug" element={<LanguageWrapper><JournalPost /></LanguageWrapper>} />
                <Route path="/destinations" element={<LanguageWrapper><Destinations /></LanguageWrapper>} />
                <Route path="/destinations/:slug" element={<LanguageWrapper><DestinationPage /></LanguageWrapper>} />
                <Route path="/about" element={<LanguageWrapper><About /></LanguageWrapper>} />
                <Route path="/contact" element={<LanguageWrapper><Contact /></LanguageWrapper>} />

                {/* Utility */}
                <Route path="/success" element={<LanguageWrapper><Success /></LanguageWrapper>} />
                <Route path="/" element={<LanguageWrapper><Index /></LanguageWrapper>} />
                <Route path="/privacy" element={<LanguageWrapper><Privacy /></LanguageWrapper>} />
                <Route path="/terms" element={<LanguageWrapper><Terms /></LanguageWrapper>} />
                <Route path="/for-teams" element={<LanguageWrapper><ForTeams /></LanguageWrapper>} />
                <Route path="/partnerships" element={<LanguageWrapper><Partnerships /></LanguageWrapper>} />
                <Route path="/list-your-experience" element={<LanguageWrapper><ListYourExperience /></LanguageWrapper>} />
                <Route path="/sustainability" element={<LanguageWrapper><Sustainability /></LanguageWrapper>} />
                <Route path="/secure-deposit" element={<LanguageWrapper><SecureDeposit /></LanguageWrapper>} />
                <Route path="/insider-guide" element={<InsiderGuide />} />
                <Route path="/enhance" element={<GuestEnhance />} />
                <Route path="/private/alex-proposal" element={<AuthGuard requireAdmin><AlexProposal /></AuthGuard>} />
                <Route path="/invite/:code" element={<InvitePage />} />
                <Route path="/admin" element={<Navigate to="/admin/gallery" replace />} />
                <Route path="/admin/gallery" element={<AuthGuard requireAdmin><AdminGallery /></AuthGuard>} />
                <Route path="/admin/discovery" element={<AuthGuard requireAdmin><DiscoveryDrafts /></AuthGuard>} />
                {/* TODO: add centralized admin nav */}
                <Route path="/request-access" element={<RequestAccess />} />
                <Route path="/apply" element={<RequestAccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                <Route path="/members/book" element={<AuthGuard><MembersBook /></AuthGuard>} />
                {/* Host operations, not a member surface — it generates guest links for
                    Airbnb stays. The old path is kept as a redirect because it is
                    bookmarked. */}
                <Route path="/admin/guest-links" element={<AuthGuard requireAdmin><LinkGenerator /></AuthGuard>} />
                <Route path="/members/links" element={<Navigate to="/admin/guest-links" replace />} />
                <Route path="/members/explore" element={<AuthGuard><MembersExplore /></AuthGuard>} />
                <Route path="/members/profile" element={<AuthGuard><MembersProfile /></AuthGuard>} />
                <Route path="/members" element={<AuthGuard><Members /></AuthGuard>} />

                {/* Standardized language prefixed routes */}
                <Route path="/:lang" element={<LanguageWrapper><Index /></LanguageWrapper>} />
                <Route path="/:lang/ideas" element={<AuthGuard requireAdmin><Ideas /></AuthGuard>} />
                <Route path="/:lang/todo" element={<AuthGuard requireAdmin><ToDo /></AuthGuard>} />
                <Route path="/:lang/sanctuaries" element={<LanguageWrapper><Sanctuaries /></LanguageWrapper>} />
                <Route path="/:lang/sanctuaries/villars" element={<LanguageWrapper><VillarsRetreat /></LanguageWrapper>} />
                <Route path="/:lang/experiences" element={<LanguageWrapper><Experiences /></LanguageWrapper>} />
                <Route path="/:lang/experiences/road-journey" element={<LanguageWrapper><RoadJourney /></LanguageWrapper>} />
                <Route path="/:lang/experiences/cinematic-memories" element={<LanguageWrapper><CinematicMemories /></LanguageWrapper>} />
                <Route path="/:lang/experiences/private-chef" element={<LanguageWrapper><PrivateChef /></LanguageWrapper>} />
                <Route path="/:lang/experiences/guided-hikes" element={<LanguageWrapper><GuidedHikes /></LanguageWrapper>} />
                <Route path="/:lang/experiences/mountain-coaster" element={<LanguageWrapper><MountainCoaster /></LanguageWrapper>} />
                <Route path="/:lang/packages" element={<LanguageWrapper><Packages /></LanguageWrapper>} />
                <Route path="/:lang/discovery" element={<LanguageWrapper><Discovery /></LanguageWrapper>} />
                <Route path="/:lang/discovery/:slug" element={<LanguageWrapper><Discovery /></LanguageWrapper>} />
                <Route path="/:lang/journals" element={<LanguageWrapper><Journals /></LanguageWrapper>} />
                <Route path="/:lang/journals/:slug" element={<LanguageWrapper><JournalPost /></LanguageWrapper>} />
                <Route path="/:lang/destinations" element={<LanguageWrapper><Destinations /></LanguageWrapper>} />
                <Route path="/:lang/destinations/:slug" element={<LanguageWrapper><DestinationPage /></LanguageWrapper>} />
                <Route path="/:lang/about" element={<LanguageWrapper><About /></LanguageWrapper>} />
                <Route path="/:lang/contact" element={<LanguageWrapper><Contact /></LanguageWrapper>} />
                <Route path="/:lang/success" element={<LanguageWrapper><Success /></LanguageWrapper>} />
                <Route path="/:lang/privacy" element={<LanguageWrapper><Privacy /></LanguageWrapper>} />
                <Route path="/:lang/terms" element={<LanguageWrapper><Terms /></LanguageWrapper>} />
                <Route path="/:lang/for-teams" element={<LanguageWrapper><ForTeams /></LanguageWrapper>} />
                <Route path="/:lang/partnerships" element={<LanguageWrapper><Partnerships /></LanguageWrapper>} />
                <Route path="/:lang/list-your-experience" element={<LanguageWrapper><ListYourExperience /></LanguageWrapper>} />
                <Route path="/:lang/sustainability" element={<LanguageWrapper><Sustainability /></LanguageWrapper>} />
                <Route path="/:lang/secure-deposit" element={<LanguageWrapper><SecureDeposit /></LanguageWrapper>} />
                <Route path="/:lang/insider-guide" element={<LanguageWrapper><InsiderGuide /></LanguageWrapper>} />
                <Route path="/:lang/enhance" element={<LanguageWrapper><GuestEnhance /></LanguageWrapper>} />
                <Route path="/:lang/members/book" element={<AuthGuard><LanguageWrapper><MembersBook /></LanguageWrapper></AuthGuard>} />
                <Route path="/:lang/members/explore" element={<AuthGuard><LanguageWrapper><MembersExplore /></LanguageWrapper></AuthGuard>} />
                <Route path="/:lang/members/profile" element={<AuthGuard><LanguageWrapper><MembersProfile /></LanguageWrapper></AuthGuard>} />
                <Route path="/:lang/members" element={<AuthGuard><LanguageWrapper><Members /></LanguageWrapper></AuthGuard>} />
                <Route path="/:lang/request-access" element={<LanguageWrapper><RequestAccess /></LanguageWrapper>} />
                <Route path="/:lang/login" element={<LanguageWrapper><Login /></LanguageWrapper>} />

                {/* 404 catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </I18nextProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
