import { Metadata } from "next";
import AuftragClient from "../AuftragClient";

export const metadata: Metadata = {
  title: "Kostenlose Ersteinschätzung – Schritt 3 | Bauklar",
  robots: "noindex, follow",
};

export default function AuftragStep3() {
  return <AuftragClient initialStep={3} />;
}
