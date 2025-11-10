import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SEO } from '@/components/SEO';

const NotFound = () => {
  const location = useLocation();
  const [isPrerendering, setIsPrerendering] = useState(false);

  useEffect(() => {
    // Check if we're in prerendering mode
    // During prerendering, React Router might temporarily render NotFound
    // before lazy-loaded components are loaded. We should not render 404 content in this case.
    if (typeof window !== 'undefined') {
      // Check if we're being prerendered (Puppeteer sets user agent)
      const isPuppeteer = navigator.userAgent.includes('HeadlessChrome') || 
                         navigator.userAgent.includes('Puppeteer');
      
      // Also check if window.__PRERENDER__ flag is set (if we set it in prerender script)
      const hasPrerenderFlag = (window as any).__PRERENDER__ === true;
      
      setIsPrerendering(isPuppeteer || hasPrerenderFlag);
    }

    if (!isPrerendering) {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname, isPrerendering]);

  // During prerendering, don't render 404 content - let React Router handle it
  // This prevents 404 pages from being prerendered for valid routes
  if (isPrerendering) {
    return (
      <>
        {/* Don't set SEO tags during prerendering for NotFound */}
        <div style={{ display: 'none' }}>Prerendering...</div>
      </>
    );
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
