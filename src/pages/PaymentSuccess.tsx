import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, Home, Mail } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    paid: boolean;
    paymentStatus: string;
    paymentAmount: number;
    paidAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Keine Session-ID gefunden');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await apiClient.verifyPayment(sessionId);
        if (response.success) {
          setPaymentData({
            paid: response.paid || false,
            paymentStatus: response.paymentStatus || 'unknown',
            paymentAmount: response.paymentAmount || 0,
            paidAt: response.paidAt || ''
          });
        } else {
          setError(response.error || 'Zahlung konnte nicht verifiziert werden');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Fehler beim Verifizieren der Zahlung');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Zahlung wird verifiziert...</h2>
            <p className="text-gray-600">Bitte warten Sie einen Moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">Fehler</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentData?.paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Zahlung noch nicht abgeschlossen</h2>
            <p className="text-gray-600 mb-6">
              Ihre Zahlung ist noch nicht vollständig verarbeitet. Bitte versuchen Sie es erneut oder kontaktieren Sie uns.
            </p>
            <Button onClick={() => navigate('/evaluation?step=8')} className="w-full mb-2">
              Zurück zur Zahlung
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Zahlung erfolgreich!</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Vielen Dank für Ihren Einkauf!</h3>
            <p className="text-green-700 text-sm">
              Ihre Bauschadensbewertung wurde erfolgreich bezahlt. Wir melden uns per E-Mail mit weiteren Details.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Zahlungsdetails</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Produkt:</span>
                <span className="font-medium">Bauschadensbewertung</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Betrag:</span>
                <span className="font-medium">{formatAmount(paymentData.paymentAmount)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Datum:</span>
                <span className="font-medium">{formatDate(paymentData.paidAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600 capitalize">{paymentData.paymentStatus}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Nächste Schritte</h4>
                <p className="text-blue-700 text-sm">
                  Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen Details zu Ihrer Bauschadensbewertung. 
                  Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => navigate('/')} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
            <Button onClick={() => navigate('/evaluation')} variant="outline" className="flex-1">
              Neue Bewertung
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
