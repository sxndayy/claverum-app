import { Metadata } from 'next';
import EvaluationClient from './EvaluationClient';

// SEO irrelevant - users should come from homepage CTA, not Google

export const metadata: Metadata = {
  title: "Bauschadensbewertung starten",
  description: "Starte jetzt deine professionelle Bauschadensbewertung. Lade Fotos hoch und erhalte innerhalb von 48 Stunden ein detailliertes Gutachten.",
  robots: 'noindex, follow',
};

export default function EvaluationPage() {
  return <EvaluationClient />;
}
