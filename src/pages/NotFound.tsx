import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from '@/components/SEO';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log error only if not prerendering
    if (typeof window !== 'undefined' && !(window as any).__PRERENDER__) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  // During prerendering, don't render 404 content - let React Router handle it
  // This prevents 404 pages from being prerendered for valid routes
  if (typeof window !== 'undefined' && (window as any).__PRERENDER__ === true) {
    return null;
  }

  return (
    <>
      {/* Only set noindex for the explicit /404 route to avoid poisoning other routes during prerender */}
      {location.pathname === '/404' && (
        <SEO 
          title="Seite nicht gefunden - 404" 
          description="Die angeforderte Seite konnte nicht gefunden werden."
          canonical="/404"
          noindex={true}
        />
      )}
      <div data-testid="not-found" className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Seite nicht gefunden</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Zur Startseite
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
