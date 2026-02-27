import { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessClient from './SuccessClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Auftrag erfolgreich übermittelt",
  description: "Ihr Auftrag wurde erfolgreich übermittelt. Wir beginnen sofort mit der Analyse Ihres Objekts.",
  alternates: {
    canonical: `${SITE_URL}/success`,
  },
  robots: 'noindex, follow',
};

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-200">Lade...</p>
        </div>
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
