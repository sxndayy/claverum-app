import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Clock, CreditCard } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { useToast } from '@/hooks/use-toast';

const Receipt = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setError('Keine Session-ID gefunden');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.getStripeSession(sessionId);
        
        if (response.success && response.session) {
          setSessionData(response.session);
        } else {
          setError(response.error || 'Fehler beim Laden der Zahlungsdaten');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Fehler beim Laden der Zahlungsdaten');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lade Zahlungsdaten...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-destructive text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Fehler</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleBackToHome} className="w-full">
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          {/* Success Icon */}
          <div className="text-green-500 text-6xl mb-6">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Zahlung erfolgreich!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Vielen Dank für deinen Einkauf! Wir haben deine Zahlung erhalten und werden uns 
            per E-Mail bei dir melden, sobald wir deine Bauschadensbewertung erstellt haben.
          </p>

          {/* Payment Details */}
          {sessionData && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Zahlungsdetails
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Betrag:</span>
                  <span className="font-medium">
                    {(sessionData.amount_total / 100).toFixed(2)}€
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {sessionData.payment_status}
                  </span>
                </div>
                
                {sessionData.customer_email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">E-Mail:</span>
                    <span className="font-medium">{sessionData.customer_email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Mail className="w-4 h-4" />
              Was passiert als nächstes?
            </h3>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 text-left">
              <li>• Wir prüfen deine hochgeladenen Unterlagen</li>
              <li>• Unsere Experten erstellen deine Bauschadensbewertung</li>
              <li>• Du erhältst das Ergebnis per E-Mail (1-3 Werktage)</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button onClick={handleBackToHome} className="w-full" size="lg">
            Zur Startseite
          </Button>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground mt-4">
            Bei Fragen kannst du uns jederzeit kontaktieren.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;
