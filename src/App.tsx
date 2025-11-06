import { BrowserRouter, Routes, Route, useRouteError, useNavigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import Evaluation from "./pages/Evaluation";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Impressum from "./pages/Impressum";
import AGB from "./pages/AGB";
import Datenschutz from "./pages/Datenschutz";
import Widerruf from "./pages/Widerruf";
import CityRoute from "./components/CityRoute";

// Lazy load heavy components and city pages
const Admin = lazy(() => import("./pages/Admin"));
const Berlin = lazy(() => import("./pages/Berlin"));
const Hamburg = lazy(() => import("./pages/Hamburg"));
const Muenchen = lazy(() => import("./pages/Muenchen"));

// Route Error Component
const RouteError = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 text-center">
        <div className="text-destructive text-4xl mb-4">🚨</div>
        <h2 className="text-xl font-semibold mb-2">Route-Fehler</h2>
        <p className="text-muted-foreground mb-4">
          Diese Seite konnte nicht geladen werden.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Zur Startseite
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Fehlerdetails (Development)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error?.message || 'Unbekannter Fehler'}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-text-200">Lade Seite...</p>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} errorElement={<RouteError />} />
        <Route path="/evaluation" element={<Evaluation />} errorElement={<RouteError />} />
        <Route path="/success" element={<Success />} errorElement={<RouteError />} />
        <Route path="/admin/login" element={<AdminLogin />} errorElement={<RouteError />} />
        <Route path="/admin" element={<Admin />} errorElement={<RouteError />} />
        <Route path="/impressum" element={<Impressum />} errorElement={<RouteError />} />
        <Route path="/agb" element={<AGB />} errorElement={<RouteError />} />
        <Route path="/datenschutz" element={<Datenschutz />} errorElement={<RouteError />} />
        <Route path="/widerruf" element={<Widerruf />} errorElement={<RouteError />} />
        <Route path="/berlin" element={<Berlin />} errorElement={<RouteError />} />
        <Route path="/hamburg" element={<Hamburg />} errorElement={<RouteError />} />
        <Route path="/muenchen" element={<Muenchen />} errorElement={<RouteError />} />
        {/* Dynamic city routes - must come after specific city routes */}
        <Route path="/:slug" element={<CityRoute />} errorElement={<RouteError />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
