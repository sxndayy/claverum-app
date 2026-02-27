"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

const TRUST_LOGOS = [
  { src: "/logos/trust-logo-1.png", alt: "Trust Partner 1" },
  { src: "/logos/trust-logo-2.png", alt: "Trust Partner 2" },
  { src: "/logos/trust-logo-3.png", alt: "Trust Partner 3" },
];

// Duplicate logos for seamless infinite loop
const LOGOS = [...TRUST_LOGOS, ...TRUST_LOGOS, ...TRUST_LOGOS];

const LOGO_WIDTH = 240; // px per logo slot
const LOGO_GAP = 6; // gap between logos
const ITEM_WIDTH = LOGO_WIDTH + LOGO_GAP;
const TOTAL_SET_WIDTH = TRUST_LOGOS.length * ITEM_WIDTH;
const SPEED = 0.55; // px per frame - slightly faster

export default function TrustLogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const lastTime = useRef(0);
  const [, forceRender] = useState(0);

  const animate = useCallback((time: number) => {
    if (!isDragging.current) {
      const delta = lastTime.current ? time - lastTime.current : 16;
      offsetRef.current -= SPEED * (delta / 16);

      // Reset seamlessly when one full set has scrolled
      if (Math.abs(offsetRef.current) >= TOTAL_SET_WIDTH) {
        offsetRef.current += TOTAL_SET_WIDTH;
      }
    }
    lastTime.current = time;

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
    }

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragOffset.current = offsetRef.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - dragStartX.current;
    offsetRef.current = dragOffset.current + diff;

    // Wrap around
    if (offsetRef.current > 0) {
      offsetRef.current -= TOTAL_SET_WIDTH;
    } else if (Math.abs(offsetRef.current) >= TOTAL_SET_WIDTH * 2) {
      offsetRef.current += TOTAL_SET_WIDTH;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] mx-auto overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{
        height: 108,
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        ref={trackRef}
        className="flex items-center will-change-transform"
        style={{ gap: LOGO_GAP }}
      >
        {LOGOS.map((logo, i) => (
          <div
            key={`${logo.src}-${i}`}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: LOGO_WIDTH, height: 108 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={LOGO_WIDTH}
              height={108}
              className="h-[108px] w-auto object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
