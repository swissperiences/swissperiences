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
const Destinations = lazy(() => import("./pages/Destinations"));
const DestinationPage = lazy(() => import("./pages/DestinationPage"));
const AlexProposal = lazy(() => import("./pages/private/AlexProposal"));
const InvitePage = lazy(() => import("./pages/private/InvitePage"));
const RequestAccess = lazy(() => import("./pages/RequestAccess"));
const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Members = lazy(() => import("./pages/MembersDashboard"));
// const Admin = lazy(() => import("./pages/Admin")); // Deprecated: redirects to /admin/gallery
const PendingApproval = lazy(() => import("./pages/PendingApproval"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthGuard = lazy(() => import("./components/AuthGuard"));

// New pages
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Sanctuaries = lazy(() => import("./pages/Sanctuaries"));
const Experiences = lazy(() => import("./pages/Experiences"));
const PrivateChef = lazy(() => import("./pages/PrivateChef"));
const GuidedHikes = lazy(() => import("./pages/GuidedHikes"));
const MembersBook = lazy(() => import("./pages/MembersBook"));
const MembersProfile = lazy(() => import("./pages/MembersProfileNew"));
const MembersExplore = lazy(() => import("./pages/MembersExplore"));
const Partnerships = lazy(() => import("./pages/Partnerships"));
const Sustainability = lazy(() => import("./pages/Sustainability"));
const GuestEnhance = lazy(() => import("./pages/GuestEnhance"));
const LinkGenerator = lazy(() => import("./pages/LinkGenerator"));
const Packages = lazy(() => import("./pages/Packages"));
const ListYourExperience = lazy(() => import("./pages/ListYourExperience"));
const Discovery = lazy(() => import("./pages/Discovery"));
const InsiderGuide = lazy(() => import("./pages/InsiderGuide"));
const DiscoveryDrafts = lazy(() => import("./pages/admin/DiscoveryDrafts"));

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
                <Route path="/private/alex-proposal" element={<AlexProposal />} />
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
                <Route path="/members/links" element={<AuthGuard requireAdmin><LinkGenerator /></AuthGuard>} />
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
