import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t shadow-strong">
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-text-100 mb-2">
                  Cookies & Datenschutz
                </h3>
                <p className="text-sm text-text-200 leading-relaxed">
                  Wir verwenden Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. 
                  Notwendige Cookies sind für die Grundfunktionen der Website erforderlich. 
                  Statistik-Cookies helfen uns, unsere Website zu verbessern.
                </p>
                <div className="mt-2">
                  <a 
                    href="/datenschutz" 
                    className="text-primary hover:underline text-sm"
                  >
                    Mehr in unserer Datenschutzerklärung →
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={handleAcceptNecessary}
                className="text-sm"
              >
                Nur notwendige
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                className="text-sm"
              >
                Ablehnen
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
              >
                Alle akzeptieren
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner;