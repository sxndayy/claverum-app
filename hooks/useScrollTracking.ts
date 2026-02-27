"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks which section is currently visible in the viewport
 * and updates the URL hash accordingly (e.g. /start#leistungen).
 *
 * Uses IntersectionObserver — no performance impact for the user.
 * The hash is updated silently via replaceState (no history entries).
 */
export function useScrollTracking(sectionIds: string[]) {
  const activeRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let bestEntry: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)
          ) {
            bestEntry = entry;
          }
        }

        if (bestEntry && bestEntry.target.id) {
          const newId = bestEntry.target.id;

          if (newId !== activeRef.current) {
            activeRef.current = newId;

            // Update URL hash silently (no scroll jump, no history entry)
            const newHash = newId === "hero" ? "" : `#${newId}`;
            const newUrl =
              window.location.pathname + (newHash ? newHash : "");

            window.history.replaceState(null, "", newUrl);
          }
        }
      },
      {
        // Trigger when 30% of a section is visible
        threshold: [0, 0.3, 0.6],
        rootMargin: "-80px 0px -20% 0px", // account for sticky header
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);
}
