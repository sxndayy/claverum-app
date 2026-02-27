"use client";

import { useScrollTracking } from "@/hooks/useScrollTracking";

const SECTION_IDS = [
  "hero",
  "warum-vorab-pruefung",
  "preise",
  "mustergutachten",
  "so-funktioniert",
  "leistungen",
  "referenzen",
  "ueber-uns",
  "faq",
  "cta",
  "kontakt",
];

export default function ScrollTracker() {
  useScrollTracking(SECTION_IDS);
  return null;
}
