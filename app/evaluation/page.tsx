import { Metadata } from 'next';
import EvaluationClient from './EvaluationClient';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Bauschadensbewertung starten",
  description: "Starte jetzt deine professionelle Bauschadensbewertung. Lade Fotos hoch und erhalte innerhalb von 48 Stunden ein detailliertes Gutachten.",
  alternates: {
    canonical: `${SITE_URL}/evaluation`,
  },
};

export default function EvaluationPage() {
  return <EvaluationClient />;
}
