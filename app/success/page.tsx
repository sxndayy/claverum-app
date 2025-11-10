import { Metadata } from 'next';
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
  return <SuccessClient />;
}
