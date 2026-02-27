"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ServiceInfoSection {
  title: string;
  items: string[];
}

export interface ServiceInfoContent {
  tagline: string;
  sections: ServiceInfoSection[];
  note?: string;
}

export interface ServiceDetailWithInfo {
  title: string;
  description: string;
  info: ServiceInfoContent;
}

interface ServiceInfoOverlayProps {
  service: ServiceDetailWithInfo;
  initialRect: DOMRect | null;
  getLatestRect: () => DOMRect | null;
  triggerElement?: HTMLElement | null;
  onCloseComplete: () => void;
}

const TARGET_RATIO = 0.7;
const MAX_WIDTH = 1024;
const MIN_WIDTH = 720;

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function calculateModalDimensions() {
  if (typeof window === 'undefined') {
    const width = 600;
    return { width, height: Math.round(width * TARGET_RATIO) };
  }

  const viewWidth = window.innerWidth * 0.92;
  const viewHeight = window.innerHeight * 0.85;

  let width = Math.min(MAX_WIDTH, viewWidth);
  if (viewWidth >= MIN_WIDTH) {
    width = Math.max(MIN_WIDTH, width);
  }
  let height = width * TARGET_RATIO;

  if (height > viewHeight) {
    height = viewHeight;
    width = height / TARGET_RATIO;
  }

  return { width, height };
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
}

function isRectVisible(rect: DOMRect) {
  const { innerHeight, innerWidth } = window;
  return (
    rect.bottom >= 0 &&
    rect.top <= innerHeight &&
    rect.right >= 0 &&
    rect.left <= innerWidth
  );
}

interface RectTransform {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
}

function calculateRectTransform(
  origin: DOMRect,
  target: DOMRect,
): RectTransform {
  const translateX = origin.left - target.left;
  const translateY = origin.top - target.top;
  const scaleX = origin.width / target.width;
  const scaleY = origin.height / target.height;

  return {
    translateX,
    translateY,
    scaleX: Number.isFinite(scaleX) ? scaleX : 1,
    scaleY: Number.isFinite(scaleY) ? scaleY : 1,
  };
}

const ServiceInfoOverlay: React.FC<ServiceInfoOverlayProps> = ({
  service,
  initialRect,
  getLatestRect,
  triggerElement,
  onCloseComplete,
}) => {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(triggerElement ?? null);
  const closingRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const [dimensions, setDimensions] = useState(() =>
    calculateModalDimensions(),
  );
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const node = document.createElement('div');
    node.setAttribute('data-service-overlay-root', 'true');
    document.body.appendChild(node);
    setPortalNode(node);
    return () => {
      if (document.body.contains(node)) {
        document.body.removeChild(node);
      }
      setPortalNode(null);
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions(calculateModalDimensions());
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useLayoutEffect(() => {
    if (!portalNode) {
      return;
    }

    const previousDocOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.documentElement.style.overflow = previousDocOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [portalNode]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }

    const originRect = getLatestRect() ?? initialRect;

    const backdrop = backdropRef.current;
    if (backdrop) {
      backdrop.style.opacity = '0';
      backdrop.style.transition = 'opacity 220ms ease';
      requestAnimationFrame(() => {
        backdrop.style.opacity = '1';
      });
    }

    if (!originRect) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 180ms ease';
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });
      return;
    }

    if (prefersReducedMotion) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 180ms ease';
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });
      return;
    }

    overlay.style.transition = 'none';
    overlay.style.transformOrigin = 'top left';
    overlay.style.opacity = '0';

    const targetRect = overlay.getBoundingClientRect();
    const { translateX, translateY, scaleX, scaleY } = calculateRectTransform(
      originRect,
      targetRect,
    );

    overlay.style.transformOrigin = 'top left';
    overlay.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

    requestAnimationFrame(() => {
      overlay.style.transition =
        'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease';
      overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
      overlay.style.opacity = '1';
    });
  }, [getLatestRect, initialRect, prefersReducedMotion]);

  const finishClose = useCallback(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    closingRef.current = false;
    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    onCloseComplete();
    if (pendingAction) {
      pendingAction();
    }
  }, [onCloseComplete]);

  const startClose = useCallback(() => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;

    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    if (backdrop) {
      backdrop.style.transition = 'opacity 180ms ease';
      backdrop.style.opacity = '0';
    }

    if (!overlay) {
      finishClose();
      return;
    }

    const complete = () => finishClose();

    const reduced = prefersReducedMotion;

    const runFadeOut = () => {
      overlay.style.transition = 'opacity 180ms ease';
      overlay.style.opacity = '0';
      transitionTimeoutRef.current = window.setTimeout(complete, 200);
    };

    if (reduced) {
      runFadeOut();
      return;
    }

    const latestRect = getLatestRect();
    const targetRect = overlay.getBoundingClientRect();
    if (!latestRect || !isRectVisible(latestRect)) {
      runFadeOut();
      return;
    }

    overlay.style.transition =
      'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 200ms ease';
    const { translateX, translateY, scaleX, scaleY } = calculateRectTransform(
      latestRect,
      targetRect,
    );

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === overlay && event.propertyName === 'transform') {
        overlay.removeEventListener('transitionend', handleTransitionEnd);
        complete();
      }
    };

    overlay.addEventListener('transitionend', handleTransitionEnd);

    overlay.style.transformOrigin = 'top left';

    requestAnimationFrame(() => {
      overlay.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      overlay.style.opacity = '0';
    });

    transitionTimeoutRef.current = window.setTimeout(() => {
      overlay.removeEventListener('transitionend', handleTransitionEnd);
      complete();
    }, 320);
  }, [finishClose, getLatestRect, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        startClose();
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }
      const overlay = overlayRef.current;
      if (!overlay) {
        return;
      }
      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(focusableSelectors),
      ).filter((element) => !element.hasAttribute('data-focus-guard'));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !focusable.includes(active!)) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [startClose]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const overlay = overlayRef.current;
      if (!overlay) {
        return;
      }
      if (!overlay.contains(event.target as Node)) {
        startClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [startClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const closeButton = closeButtonRef.current;
    if (closeButton) {
      closeButton.focus({ preventScroll: true });
    } else if (overlay) {
      overlay.focus({ preventScroll: true });
    }

    const backdrop = backdropRef.current;
    const preventTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };
    if (backdrop) {
      backdrop.addEventListener('touchmove', preventTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (backdrop) {
        backdrop.removeEventListener('touchmove', preventTouchMove);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

  const containerStyle = useMemo(() => {
    const clampedWidth = Math.round(dimensions.width);
    const clampedHeight = Math.round(dimensions.height);
    return {
      width: `${clampedWidth}px`,
      height: `${clampedHeight}px`,
      maxHeight: `${clampedHeight}px`,
    };
  }, [dimensions.height, dimensions.width]);

  if (!portalNode) {
    return null;
  }

  const titleId = 'service-info-title';

  const handleNavigateToEvaluation = () => {
    pendingActionRef.current = () => router.push('/auftrag');
    startClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={startClose}
      />
      <div className="relative z-10 flex h-full w-full items-end md:items-center justify-center px-0 py-0 md:px-6 md:py-8">
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            'pointer-events-auto flex w-full flex-col overflow-hidden bg-background shadow-strong border border-border',
            'rounded-t-3xl h-[85vh] md:rounded-3xl',
            'md:h-full md:w-full md:max-w-[92vw] md:max-w-[1024px]'
          )}
          style={isMobile ? undefined : containerStyle}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative flex-shrink-0 border-b border-border/70 px-6 py-4 md:px-8 md:py-8">
            <h2
              id={titleId}
              className="text-2xl font-semibold text-text-100 md:text-3xl"
            >
              {service.title}
            </h2>
            <p className="mt-2 md:mt-3 max-w-2xl text-sm text-text-200 md:text-base">
              {service.info.tagline}
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={startClose}
              className="absolute right-4 top-4 md:right-8 md:top-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-background/80 text-text-200 shadow-soft transition-smooth hover:text-text-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Overlay schließen</span>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-6 py-6 md:px-10 md:py-10">
              <div className="space-y-8">
                {service.info.sections.map((section) => (
                  <section key={section.title}>
                    <h3 className="text-lg font-semibold text-text-100 md:text-xl">
                      {section.title}
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-text-200 md:text-base">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                {service.info.note && (
                  <div className="rounded-xl border border-border/80 bg-bg-200/80 px-4 py-4 text-sm text-text-200 md:text-base">
                    {service.info.note}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 px-6 py-4 md:py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <span className="text-sm font-medium text-text-200 md:text-base">
              Fragen? Unser Team begleitet Sie von der Analyse bis zur Entscheidung.
            </span>
            <Button
              onClick={handleNavigateToEvaluation}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 md:w-auto"
            >
              Bewertung starten
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>,
    portalNode,
  );
};

export default ServiceInfoOverlay;




