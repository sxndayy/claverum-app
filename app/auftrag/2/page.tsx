import { Metadata } from "next";
import AuftragClient from "../AuftragClient";

export const metadata: Metadata = {
  title: "Kostenlose Ersteinschätzung – Schritt 2 | Bauklar",
  robots: "noindex, follow",
};

export default function AuftragStep2() {
  return <AuftragClient initialStep={2} />;
}
