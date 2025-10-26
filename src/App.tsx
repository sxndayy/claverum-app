import { BrowserRouter, Routes, Route, useRouteError } from "react-router-dom";
import Index from "./pages/Index";
import Evaluation from "./pages/Evaluation";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

// Route Error Component
const RouteError = () => {
  const error = useRouteError() as Error;
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 text-center">
        <div className="text-destructive text-4xl mb-4">🚨</div>
        <h2 className="text-xl font-semibold mb-2">Route-Fehler</h2>
        <p className="text-muted-foreground mb-4">
          Diese Seite konnte nicht geladen werden.
        </p>
        <button
          onClick={() => window.location.href = '/'}
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

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} errorElement={<RouteError />} />
      <Route path="/evaluation" element={<Evaluation />} errorElement={<RouteError />} />
      <Route path="/success" element={<Success />} errorElement={<RouteError />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
