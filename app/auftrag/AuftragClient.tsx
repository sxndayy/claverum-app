"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  CheckCircle,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import {
  AUFTRAG_ORDER_ID_KEY,
  AUFTRAG_SESSION_TOKEN_KEY,
  AUFTRAG_FORM_DATA_KEY,
} from "@/lib/orderManager";
import StartHeader from "@/components/start/layout/StartHeader";
import StartFooter from "@/components/start/layout/StartFooter";
import CookieBanner from "@/components/layout/CookieBanner";
import { Toaster } from "@/components/ui/toaster";
import YearSlider from "@/components/YearSlider";
import AuftragProcessSidebar from "@/components/auftrag/AuftragProcessSidebar";
import AuftragTrustSidebar from "@/components/auftrag/AuftragTrustSidebar";
import { ShieldCheck } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const PROPERTY_TYPES = [
  { id: "Einfamilienhaus", label: "Ein- oder Zweifamilienhaus", icon: "/Objekte/Einfamilienhaus-2.png" },
  { id: "Eigentumswohnung", label: "Eigentumswohnung", icon: "/Objekte/Eigentumswohnung-2.png" },
  { id: "Reihenhaus", label: "Reihenhaus", icon: "/Objekte/Reihenhaus-2.png" },
  { id: "Mehrfamilienhaus", label: "Mehrfamilienhaus", icon: "/Objekte/Mehrfamilienhaus-2.png" },
];

const DEFAULT_BUILD_YEAR = "1976";

const clampYear = (value: number) =>
  Math.min(2024, Math.max(1900, Number.isNaN(value) ? 1900 : value));

const getYearInfo = (year: number) => {
  if (year < 1950) {
    return {
      icon: "\u{1F3DB}\u{FE0F}",
      title: "Altbau-Immobilie",
      points: [
        "Häufig Setzungsrisse und Feuchtigkeitsprobleme",
        "Oft fehlende Wärmedämmung",
        "Prüfung auf Denkmalschutz empfohlen",
      ],
    };
  }
  if (year >= 1950 && year <= 1992) {
    return {
      icon: "\u{26A0}\u{FE0F}",
      title: "Wichtiger Hinweis",
      points: [
        "Mögliches Asbest-Risiko bei Baujahr vor 1993",
        "Oft veraltete Elektrik und Heizung",
        "Energetische Sanierung empfehlenswert",
      ],
    };
  }
  if (year >= 1993 && year <= 2000) {
    return {
      icon: "\u{1F3D7}\u{FE0F}",
      title: "Solide Bausubstanz",
      points: [
        "Meist guter Zustand",
        "Energetische Standards bereits höher",
        "Moderate Sanierungskosten zu erwarten",
      ],
    };
  }
  return {
    icon: "\u{2728}",
    title: "Moderne Bauweise",
    points: [
      "Gute Dämmung und Energieeffizienz",
      "Zeitgemäße Technik",
      "Geringerer Instandhaltungsbedarf",
    ],
  };
};

// ─── Form Data ───────────────────────────────────────────────────────────────

interface AuftragFormData {
  propertyType: string;
  buildYear: string;
  customerName: string;
  customerEmail: string;
  street: string;
  postalCode: string;
  city: string;
}

const createEmptyFormData = (): AuftragFormData => ({
  propertyType: "",
  buildYear: DEFAULT_BUILD_YEAR,
  customerName: "",
  customerEmail: "",
  street: "",
  postalCode: "",
  city: "",
});

// ─── Session Storage Helpers ─────────────────────────────────────────────────

function getAuftragOrderId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(AUFTRAG_ORDER_ID_KEY);
  } catch {
    return null;
  }
}

function getAuftragSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(AUFTRAG_SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAuftragOrder(orderId: string, sessionToken: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AUFTRAG_ORDER_ID_KEY, orderId);
    sessionStorage.setItem(AUFTRAG_SESSION_TOKEN_KEY, sessionToken);
  } catch (error) {
    console.error("Error writing auftrag session:", error);
  }
}

function loadStoredFormData(): AuftragFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUFTRAG_FORM_DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveFormDataToStorage(data: AuftragFormData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AUFTRAG_FORM_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving auftrag form data:", error);
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AuftragClientProps {
  initialStep: 1 | 2 | 3;
}

export default function AuftragClient({ initialStep }: AuftragClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Core state
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AuftragFormData>(createEmptyFormData());
  const [year, setYear] = useState<number>(() => clampYear(parseInt(DEFAULT_BUILD_YEAR, 10)));
  const [yearInput, setYearInput] = useState<string>(DEFAULT_BUILD_YEAR);
  const [unsureYear, setUnsureYear] = useState(false);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);

  // Progress
  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Helper to update form data
  const updateFormData = useCallback(
    (field: keyof AuftragFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field
      setErrors((prev) => prev.filter((e) => e !== field));
    },
    []
  );

  // Sync year state with formData.buildYear
  useEffect(() => {
    setYearInput(formData.buildYear || "");
    const raw = (formData.buildYear || "").trim();
    if (raw.length !== 4) return;
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    setYear(clampYear(parsed));
  }, [formData.buildYear]);

  // Save form data to storage on change
  useEffect(() => {
    if (isInitialized) {
      saveFormDataToStorage(formData);
    }
  }, [formData, isInitialized]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Restore form data from storage
      const stored = loadStoredFormData();
      if (stored) {
        const merged: AuftragFormData = {
          ...createEmptyFormData(),
          ...stored,
          buildYear: stored.buildYear?.trim() ? stored.buildYear : DEFAULT_BUILD_YEAR,
        };
        setFormData(merged);
      }

      // Check for existing order
      const existingOrderId = getAuftragOrderId();
      const existingToken = getAuftragSessionToken();

      if (existingOrderId && existingToken) {
        setOrderId(existingOrderId);
        setIsInitialized(true);
      } else {
        // Deep-link guard: if no session and step > 1, redirect to step 1
        if (initialStep > 1) {
          router.replace("/auftrag/1");
          return;
        }

        // Create new order
        try {
          const response = await apiClient.createOrder({ orderType: "auftrag" } as any);
          if (response.success) {
            setOrderId(response.orderId);
            setAuftragOrder(response.orderId, response.sessionToken);
          } else {
            toast({
              title: "Fehler",
              description: "Verbindungsfehler. Bitte laden Sie die Seite neu.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error creating auftrag order:", error);
          toast({
            title: "Fehler",
            description: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
            variant: "destructive",
          });
        }
        setIsInitialized(true);
      }
    };

    init();
  }, [initialStep, router, toast]);

  // Scroll to top on step change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // ─── Navigation ──────────────────────────────────────────────────────────

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!formData.propertyType) {
        toast({
          title: "Bitte Objekttyp auswählen",
          description: "Wählen Sie einen Gebäude-Typ aus, um fortzufahren.",
          variant: "destructive",
        });
        return;
      }
      // Save step 1 data to backend
      const token = getAuftragSessionToken();
      if (orderId && token) {
        try {
          await apiClient.updateOrderWithToken(orderId, { propertyType: formData.propertyType }, token);
        } catch (error) {
          console.error("Error saving step 1:", error);
        }
      }
      setCurrentStep(2);
      window.history.replaceState(null, "", "/auftrag/2");
    } else if (currentStep === 2) {
      if (!formData.buildYear && !unsureYear) {
        toast({
          title: "Bitte Baujahr angeben",
          description: "Geben Sie das Baujahr ein oder markieren Sie 'Baujahr nicht sicher'.",
          variant: "destructive",
        });
        return;
      }
      // Save step 2 data to backend
      const token = getAuftragSessionToken();
      if (orderId && token) {
        try {
          await apiClient.updateOrderWithToken(
            orderId,
            { buildYear: unsureYear ? undefined : formData.buildYear },
            token
          );
        } catch (error) {
          console.error("Error saving step 2:", error);
        }
      }
      setCurrentStep(3);
      window.history.replaceState(null, "", "/auftrag/3");
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      window.history.replaceState(null, "", "/auftrag/1");
    } else if (currentStep === 3) {
      setCurrentStep(2);
      window.history.replaceState(null, "", "/auftrag/2");
    }
  };

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    // Validate step 3 fields
    const newErrors: string[] = [];
    if (!formData.customerName.trim()) newErrors.push("customerName");
    if (!formData.customerEmail.trim()) newErrors.push("customerEmail");
    if (!formData.street.trim()) newErrors.push("street");
    if (!formData.postalCode.trim()) newErrors.push("postalCode");
    if (!formData.city.trim()) newErrors.push("city");

    // Basic email validation
    if (formData.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      newErrors.push("customerEmail");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      toast({
        title: "Bitte alle Felder ausfüllen",
        description: "Alle Felder sind erforderlich.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuftragSessionToken();
      if (!orderId || !token) {
        throw new Error("Keine aktive Sitzung");
      }

      const result = await apiClient.submitAuftrag(
        orderId,
        {
          propertyType: formData.propertyType,
          buildYear: unsureYear ? undefined : formData.buildYear,
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim(),
          street: formData.street.trim(),
          postalCode: formData.postalCode.trim(),
          city: formData.city.trim(),
        },
        token
      );

      if (result.success) {
        setShowThankYou(true);
        // Clear session after successful submit
        if (typeof window !== "undefined") {
          sessionStorage.removeItem(AUFTRAG_ORDER_ID_KEY);
          sessionStorage.removeItem(AUFTRAG_SESSION_TOKEN_KEY);
          sessionStorage.removeItem(AUFTRAG_FORM_DATA_KEY);
        }
      } else {
        toast({
          title: "Fehler",
          description: result.error || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting auftrag:", error);
      toast({
        title: "Netzwerkfehler",
        description: "Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-bg-200">
        <StartHeader />
        <main className="pt-24 pb-16">
          <div className="w-full p-4 md:p-6">
            {/* Mobile Trust Strip */}
            <div className="xl:hidden mb-4 max-w-[950px] mx-auto">
              <div className="bg-white border border-primary-200/60 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 rounded-full border-2 border-primary-200 overflow-hidden flex-shrink-0">
                    <Image
                      src="/Johannes.png"
                      alt="Dr. Stankiewicz"
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-100 truncate">Diplom-Sachverständiger</p>
                    <p className="text-[10px] text-text-300 truncate">DIA-zertifiziert · 15+ Jahre</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-[10px] text-text-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Kostenlos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>DSGVO</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-column layout wrapper */}
            <div className="xl:grid xl:grid-cols-[280px_1fr_280px] xl:gap-8 xl:max-w-[1600px] xl:mx-auto max-w-4xl mx-auto">
              {/* Left Sidebar - Process Info (hidden on mobile) */}
              <div className="hidden xl:block">
                <AuftragProcessSidebar />
              </div>

              {/* Main content card */}
              <div>
              <Card className="shadow-strong border-0 bg-bg-300 max-w-[950px] mx-auto">
                {/* Header with progress */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-accent-200">
                      Kostenlose Ersteinschätzung
                    </p>
                    <div className="text-sm text-text-300">
                      Schritt {currentStep} / {TOTAL_STEPS}
                    </div>
                  </div>
                  <Progress value={progress} className="w-full h-2" />
                </div>

                <CardContent className="p-6 pt-2 md:p-8 md:pt-2">
                  {/* ── Step 1: Property Type ── */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-text-100 mb-2">
                          Welchen Objekttyp möchten Sie bewerten lassen?
                        </h2>
                        <p className="text-text-200">
                          Wählen Sie den passenden Gebäudetyp aus
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                        {PROPERTY_TYPES.map((type) => {
                          const isSelected = formData.propertyType === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => updateFormData("propertyType", type.id)}
                              className={`
                                relative p-6 rounded-lg transition-all duration-200
                                flex flex-col items-center justify-center gap-3
                                min-h-[220px]
                                ${
                                  isSelected
                                    ? "border-[3px] border-[#0052A3] bg-white"
                                    : "border-2 border-[#e5e7eb] bg-white hover:border-[#0066CC]"
                                }
                              `}
                            >
                              <div className="relative overflow-hidden w-28 h-28 md:w-40 md:h-40 flex-shrink-0">
                                <Image
                                  src={type.icon}
                                  alt={type.label}
                                  fill
                                  sizes="(max-width: 768px) 112px, 160px"
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[0.82rem] md:text-sm font-medium text-center leading-tight text-text-100">
                                {type.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-8 text-center">
                        <Link
                          href="/kontakt"
                          className="text-sm text-text-300 hover:text-accent-200 transition-colors"
                        >
                          &rarr; Andere Immobilie? Wir beraten Sie gerne persönlich
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* ── Step 2: Build Year ── */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-text-100 mb-2">
                          Baujahr des Objekts
                        </h2>
                        <p className="text-text-200">
                          Wann wurde das Gebäude gebaut?
                        </p>
                      </div>

                      {/* Year display (editable) */}
                      <div className="text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={yearInput}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              setYearInput("");
                              updateFormData("buildYear", "");
                              return;
                            }
                            if (!/^\d{0,4}$/.test(raw)) return;
                            setYearInput(raw);
                            updateFormData("buildYear", raw);
                          }}
                          onBlur={() => {
                            const raw = (yearInput || "").trim();
                            if (!raw) return;
                            const parsed = parseInt(raw, 10);
                            if (Number.isNaN(parsed)) return;
                            const clamped = clampYear(parsed);
                            setYear(clamped);
                            const next = clamped.toString();
                            setYearInput(next);
                            updateFormData("buildYear", next);
                          }}
                          className="text-[3rem] leading-tight font-bold text-accent-200 text-center bg-white border-2 border-accent-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent-200 w-full max-w-[260px] mx-auto"
                        />
                        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-text-300">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <span
                              className={`relative inline-flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                                unsureYear ? "border-accent-200" : "border-text-300"
                              } bg-white`}
                            >
                              {unsureYear && (
                                <Check className="h-3 w-3 text-accent-200 stroke-[3]" />
                              )}
                            </span>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={unsureYear}
                              onChange={(e) => setUnsureYear(e.target.checked)}
                            />
                            <span>Baujahr nicht sicher</span>
                          </label>
                        </div>
                      </div>

                      {/* Slider */}
                      <div className="space-y-4">
                        <YearSlider
                          value={year}
                          onChange={(val) => {
                            const clamped = clampYear(val);
                            setYear(clamped);
                            const next = clamped.toString();
                            setYearInput(next);
                            updateFormData("buildYear", next);
                          }}
                        />
                      </div>

                      {/* Dynamic info box */}
                      {(() => {
                        const info = getYearInfo(year);
                        return (
                          <div className="transition-all duration-300 bg-white border-2 border-[#e5e7eb] rounded-xl p-6 shadow-sm space-y-3">
                            <div className="flex items-start gap-4">
                              <span className="text-[1.5rem] leading-none">
                                {info.icon}
                              </span>
                              <div>
                                <h3 className="text-[1.125rem] font-semibold text-text-100">
                                  {info.title}
                                </h3>
                                <ul className="mt-3 space-y-2 text-[0.9375rem] text-text-200">
                                  {info.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="text-accent-200 mt-[2px]">
                                        &bull;
                                      </span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* ── Step 3: Contact Details ── */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-text-100 mb-2">
                          Ihre Kontaktdaten
                        </h2>
                        <p className="text-text-200">
                          Wir melden uns innerhalb von 24 Stunden bei Ihnen
                        </p>
                      </div>

                      <div className="space-y-4 max-w-lg mx-auto">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-text-100 mb-1.5">
                            Vor- und Nachname *
                          </label>
                          <Input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) =>
                              updateFormData("customerName", e.target.value)
                            }
                            placeholder="Max Mustermann"
                            className={
                              errors.includes("customerName")
                                ? "border-red-500 ring-1 ring-red-500"
                                : ""
                            }
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-text-100 mb-1.5">
                            E-Mail-Adresse *
                          </label>
                          <Input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) =>
                              updateFormData("customerEmail", e.target.value)
                            }
                            placeholder="max@beispiel.de"
                            className={
                              errors.includes("customerEmail")
                                ? "border-red-500 ring-1 ring-red-500"
                                : ""
                            }
                          />
                        </div>

                        {/* Street */}
                        <div>
                          <label className="block text-sm font-medium text-text-100 mb-1.5">
                            Straße und Hausnummer der Immobilie *
                          </label>
                          <Input
                            type="text"
                            value={formData.street}
                            onChange={(e) =>
                              updateFormData("street", e.target.value)
                            }
                            placeholder="Musterstraße 12"
                            className={
                              errors.includes("street")
                                ? "border-red-500 ring-1 ring-red-500"
                                : ""
                            }
                          />
                        </div>

                        {/* PLZ + City */}
                        <div className="grid grid-cols-[120px_1fr] gap-3">
                          <div>
                            <label className="block text-sm font-medium text-text-100 mb-1.5">
                              PLZ *
                            </label>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={formData.postalCode}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || /^\d{0,5}$/.test(val)) {
                                  updateFormData("postalCode", val);
                                }
                              }}
                              placeholder="10115"
                              className={
                                errors.includes("postalCode")
                                  ? "border-red-500 ring-1 ring-red-500"
                                  : ""
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-100 mb-1.5">
                              Ort *
                            </label>
                            <Input
                              type="text"
                              value={formData.city}
                              onChange={(e) =>
                                updateFormData("city", e.target.value)
                              }
                              placeholder="Berlin"
                              className={
                                errors.includes("city")
                                  ? "border-red-500 ring-1 ring-red-500"
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Summary of previous steps */}
                      <div className="mt-8 p-4 bg-bg-200 rounded-lg max-w-lg mx-auto">
                        <p className="text-sm font-medium text-text-100 mb-2">Ihre Angaben:</p>
                        <div className="text-sm text-text-200 space-y-1">
                          <p>Objekttyp: <span className="font-medium text-text-100">{formData.propertyType || "–"}</span></p>
                          <p>Baujahr: <span className="font-medium text-text-100">{unsureYear ? "Nicht sicher" : formData.buildYear || "–"}</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* ── Navigation Footer ── */}
                <div className="border-t border-primary-200 px-6 py-4 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Zurück
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      onClick={handleNext}
                      className="bg-accent-200 hover:bg-accent-300 text-white flex items-center gap-1"
                    >
                      Weiter
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-accent-200 hover:bg-accent-300 text-white flex items-center gap-2 px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        "Jetzt kostenlose Ersteinschätzung erhalten"
                      )}
                    </Button>
                  )}
                </div>
              </Card>

              {/* Trust elements below card (mobile only) */}
              <div className="mt-6 text-center space-y-3 xl:hidden">
                <div className="flex items-center justify-center gap-4 text-sm text-text-300">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-success-100" />
                    Kostenlos &amp; unverbindlich
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-success-100" />
                    DSGVO-konform
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-text-300">
                  <Phone className="w-4 h-4" />
                  <span>Fragen?</span>
                  <a
                    href="tel:+4932221804909"
                    className="text-accent-200 hover:text-accent-300 font-medium"
                  >
                    +49 322 21804909
                  </a>
                </div>
              </div>
              </div>

              {/* Right Sidebar - Trust Info (hidden on mobile) */}
              <div className="hidden xl:block w-full mt-6 xl:mt-0">
                <AuftragTrustSidebar />
              </div>
            </div>

            {/* Sidebars on Mobile (stacked) */}
            <div className="xl:hidden mt-6 max-w-[950px] mx-auto space-y-4">
              <AuftragProcessSidebar />
              <AuftragTrustSidebar />
            </div>
          </div>
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
      </div>

      {/* ── Thank You Dialog ── */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-strong max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-text-100 mb-3">
              Vielen Dank!
            </h3>
            <p className="text-text-200 mb-2">
              Wir prüfen, ob Ihr Objekt für eine Bauklar Analyse geeignet ist.
            </p>
            <p className="text-sm text-text-300 mb-8">
              Sie erhalten in Kürze eine E-Mail mit einem Link zum Foto-Upload.
            </p>
            <Button
              onClick={() => {
                setShowThankYou(false);
              }}
              className="bg-accent-200 hover:bg-accent-300 text-white px-8"
            >
              Verstanden
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
