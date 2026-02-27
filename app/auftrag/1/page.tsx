import { Metadata } from "next";
import AuftragClient from "../AuftragClient";

export const metadata: Metadata = {
  title: "Kostenlose Ersteinschätzung – Schritt 1 | Bauklar",
  robots: "noindex, follow",
};

export default function AuftragStep1() {
  return <AuftragClient initialStep={1} />;
}
