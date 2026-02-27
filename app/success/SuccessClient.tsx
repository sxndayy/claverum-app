"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import StartHeader from '@/components/start/layout/StartHeader';
import StartFooter from '@/components/start/layout/StartFooter';
import CookieBanner from '@/components/layout/CookieBanner';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, CreditCard, Loader2, FileText, Video, Clock } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

// Derive product type from Stripe session data
function getProductType(paymentData: any): 'analyse' | 'intensiv' | null {
  // Prefer explicit metadata
  if (paymentData?.metadata?.product_type) {
    return paymentData.metadata.product_type as 'analyse' | 'intensiv';
  }
  // Fallback: derive from amount (35000 cents = Analyse, 79000 cents = Intensiv)
  if (paymentData?.amount_total) {
    if (paymentData.amount_total >= 79000) return 'intensiv';
    if (paymentData.amount_total >= 35000) return 'analyse';
  }
  return null;
}

function getProductLabel(type: 'analyse' | 'intensiv' | null): string {
  if (type === 'intensiv') return 'Bauklar Intensiv';
  if (type === 'analyse') return 'Bauklar Analyse';
  return 'Bauklar';
}

function SuccessClientInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const loadData = async () => {
      // Load payment data from Stripe session
      if (sessionId) {
        try {
          const response = await apiClient.getStripeSession(sessionId);
          if (response.success && response.session) {
            setPaymentData(response.session);
          }
        } catch (error) {
          console.error('Error loading payment data:', error);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [sessionId]);

  const productType = getProductType(paymentData);
  const productLabel = getProductLabel(productType);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-200">
        <StartHeader />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-accent-200 mx-auto mb-4" />
            <p className="text-text-200">Zahlungsdaten werden geladen...</p>
          </div>
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Zahlung erfolgreich', url: '/success' }
        ]}
      />
      <div className="min-h-screen bg-bg-200">
        <StartHeader />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
            <div className="max-w-2xl w-full">
              <Card className="shadow-strong border-0">
                <CardContent className="space-y-6 p-6 md:p-8">
                  {/* Success Icon + Message */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-xl font-bold text-text-100 mb-2">
                      Zahlung erfolgreich!
                    </h1>
                    {productType && (
                      <Badge
                        className={`mb-3 ${
                          productType === 'intensiv'
                            ? 'bg-accent-200 hover:bg-accent-200 text-white'
                            : 'bg-text-200 hover:bg-text-200 text-white'
                        }`}
                      >
                        {productLabel}
                      </Badge>
                    )}
                    <p className="text-text-200">
                      Vielen Dank für Ihre Bestellung! Wir haben Ihre Zahlung erhalten und melden
                      uns per E-Mail bei Ihnen, sobald Ihre Bewertung fertiggestellt ist.
                    </p>
                  </div>

                  {/* Payment Details */}
                  {paymentData && (
                    <div className="bg-bg-200 rounded-lg p-4 text-left">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-text-100">
                        <CreditCard className="w-4 h-4" />
                        Zahlungsdetails
                      </h4>

                      <div className="space-y-2 text-sm">
                        {productType && (
                          <div className="flex justify-between">
                            <span className="text-text-300">Produkt:</span>
                            <span className="font-medium text-text-100">{productLabel}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-text-300">Betrag:</span>
                          <span className="font-medium text-text-100">
                            {paymentData.amount_total
                              ? (paymentData.amount_total / 100).toFixed(2) + ' €'
                              : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-300">Status:</span>
                          <span className="font-medium text-success-100">
                            {paymentData.payment_status === 'paid' ? 'Bezahlt' : (paymentData.payment_status || 'Erfolgreich')}
                          </span>
                        </div>
                        {paymentData.customer_email && (
                          <div className="flex justify-between">
                            <span className="text-text-300">E-Mail:</span>
                            <span className="font-medium text-text-100">{paymentData.customer_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="bg-bg-300 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-accent-200">
                      <Mail className="w-4 h-4" />
                      Was passiert als Nächstes?
                    </h4>
                    <ul className="space-y-3 text-sm text-text-200">
                      <li className="flex items-start gap-2.5">
                        <FileText className="w-4 h-4 text-accent-200 mt-0.5 flex-shrink-0" />
                        <span>Wir prüfen Ihre hochgeladenen Unterlagen und Fotos</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-accent-200 mt-0.5 flex-shrink-0" />
                        <span>
                          {productType === 'intensiv'
                            ? 'Unsere Experten erstellen Ihren detaillierten Bericht (i.d.R. innerhalb von 48 Stunden)'
                            : 'Unsere Experten erstellen Ihren strukturierten PDF-Bericht (i.d.R. innerhalb von 48 Stunden)'}
                        </span>
                      </li>
                      {productType === 'intensiv' && (
                        <li className="flex items-start gap-2.5">
                          <Video className="w-4 h-4 text-accent-200 mt-0.5 flex-shrink-0" />
                          <span>Wir kontaktieren Sie zur Terminvereinbarung für Ihr persönliches Video-Gespräch</span>
                        </li>
                      )}
                      <li className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-accent-200 mt-0.5 flex-shrink-0" />
                        <span>Sie erhalten das Ergebnis per E-Mail</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="text-center">
                    <Button
                      onClick={() => router.push('/')}
                      className="w-full bg-accent-200 hover:bg-accent-300 text-white"
                      size="lg"
                    >
                      Zur Startseite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
      </div>
    </>
  );
}

export default function SuccessClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-200" />
        </div>
      }
    >
      <SuccessClientInner />
    </Suspense>
  );
}
