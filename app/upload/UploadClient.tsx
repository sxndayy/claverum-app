"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  CheckCircle,
  X,
  Camera,
  AlertCircle,
  Upload,
  ShieldCheck,
  CreditCard,
  Star,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/apiClient";
import { compressImage } from "@/lib/imageCompression";
import StartHeader from "@/components/start/layout/StartHeader";
import StartFooter from "@/components/start/layout/StartFooter";
import CookieBanner from "@/components/layout/CookieBanner";
import { Toaster } from "@/components/ui/toaster";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "uploaded" | "failed";
  uploadId?: string;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PHOTOS = 50;
const DEFAULT_AREA = "Fassade";

const generatePhotoId = () =>
  `photo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// ─── Inner Component (needs useSearchParams) ─────────────────────────────────

function UploadClientInner() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Session state
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Upload state
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'analyse' | 'intensiv' | null>(null);

  // Validate token on mount
  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setIsValidating(false);
      setIsValid(false);
      return;
    }

    const validate = async () => {
      try {
        const result = await apiClient.validateUploadToken(token);
        if (result.success && result.orderId && result.sessionToken) {
          setOrderId(result.orderId);
          setSessionToken(result.sessionToken);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [searchParams]);

  // Upload a single photo
  const uploadPhoto = useCallback(
    async (photo: PhotoItem) => {
      if (!orderId || !sessionToken) return;

      // Mark as uploading
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, status: "uploading" } : p))
      );

      try {
        // 1. Compress image
        const compressed = await compressImage(photo.file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.8,
        });

        // 2. Get presigned URL
        const urlResponse = await apiClient.getUploadUrlWithToken(
          sessionToken,
          orderId,
          DEFAULT_AREA,
          photo.file.name,
          photo.file.type
        );

        if (!urlResponse.success) {
          throw new Error(urlResponse.error || "Failed to get upload URL");
        }

        // 3. Upload to S3
        const uploadSuccess = await apiClient.uploadToS3(
          urlResponse.uploadUrl,
          compressed
        );

        if (!uploadSuccess) {
          throw new Error("S3 upload failed");
        }

        // 4. Record in database
        const recordResponse = await apiClient.recordUploadWithToken(
          {
            orderId,
            area: DEFAULT_AREA,
            filePath: urlResponse.filePath,
            mimeType: photo.file.type,
            fileSize: compressed.size,
          },
          sessionToken
        );

        if (!recordResponse.success) {
          throw new Error(recordResponse.error || "Failed to record upload");
        }

        // Mark as uploaded
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? { ...p, status: "uploaded", uploadId: recordResponse.uploadId }
              : p
          )
        );
      } catch (error) {
        console.error("Upload error:", error);
        setPhotos((prev) =>
          prev.map((p) =>
            p.id === photo.id
              ? {
                  ...p,
                  status: "failed",
                  error: error instanceof Error ? error.message : "Upload fehlgeschlagen",
                }
              : p
          )
        );
      }
    },
    [orderId, sessionToken]
  );

  // Handle file selection
  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const currentCount = photos.length;

      if (currentCount + fileArray.length > MAX_PHOTOS) {
        toast({
          title: "Zu viele Fotos",
          description: `Maximal ${MAX_PHOTOS} Fotos erlaubt.`,
          variant: "destructive",
        });
        return;
      }

      const validFiles = fileArray.filter((file) => {
        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
          toast({
            title: "Ungültige Datei",
            description: `${file.name} ist kein gültiges Bild.`,
            variant: "destructive",
          });
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "Datei zu gross",
            description: `${file.name} ist größer als 10 MB.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      const newPhotos: PhotoItem[] = validFiles.map((file) => ({
        id: generatePhotoId(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "pending" as const,
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);

      // Start uploading each photo
      newPhotos.forEach((photo) => uploadPhoto(photo));
    },
    [photos.length, toast, uploadPhoto]
  );

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Remove photo
  const removePhoto = async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    // Revoke preview URL
    URL.revokeObjectURL(photo.previewUrl);

    // Delete from server if uploaded
    if (photo.status === "uploaded" && photo.uploadId && orderId && sessionToken) {
      try {
        await apiClient.deleteUploadWithToken(orderId, photo.uploadId, sessionToken);
      } catch (error) {
        console.error("Error deleting upload:", error);
      }
    }

    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Submit (save notes + mark as done)
  const handleSubmit = async () => {
    if (!orderId || !sessionToken) return;

    setIsSavingNotes(true);

    try {
      // Save notes if provided
      if (notes.trim()) {
        await apiClient.saveTextsWithToken(
          {
            orderId,
            area: "Sonstiges",
            content: notes.trim(),
          },
          sessionToken
        );
      }

      setIsSubmitted(true);
      toast({
        title: "Erfolgreich",
        description: "Ihre Fotos wurden erfolgreich übermittelt.",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const uploadedCount = photos.filter((p) => p.status === "uploaded").length;
  const uploadingCount = photos.filter((p) => p.status === "uploading").length;

  // ─── Loading State ─────────────────────────────────────────────────────

  if (isValidating) {
    return (
      <div className="min-h-screen bg-bg-200">
        <StartHeader />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent-200 mx-auto mb-4" />
              <p className="text-text-200">Link wird überprüft...</p>
            </div>
          </div>
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
      </div>
    );
  }

  // ─── Invalid Token State ───────────────────────────────────────────────

  if (!isValid) {
    return (
      <div className="min-h-screen bg-bg-200">
        <StartHeader />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-text-100 mb-3">
                Ungültiger Link
              </h1>
              <p className="text-text-200 mb-6">
                Dieser Upload-Link ist abgelaufen oder ungültig. Bitte verwenden Sie den
                Link aus Ihrer E-Mail oder kontaktieren Sie uns.
              </p>
              <a
                href="mailto:kontakt@bauklar.org"
                className="text-accent-200 hover:text-accent-300 font-medium"
              >
                kontakt@bauklar.org
              </a>
            </div>
          </div>
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
      </div>
    );
  }

  // ─── Payment Handler ───────────────────────────────────────────────────

  const handlePayment = async (productType: 'analyse' | 'intensiv') => {
    if (!orderId || !sessionToken || isRedirectingToPayment) return;

    setIsRedirectingToPayment(true);
    setSelectedProduct(productType);

    try {
      const response = await apiClient.createCheckoutSessionWithToken(orderId, sessionToken, productType);

      if (response.success && response.url) {
        window.location.href = response.url;
        return;
      }

      if (response.error === 'rate_limit') {
        toast({
          title: "Zu viele Anfragen",
          description: `Bitte warten Sie ${response.retryAfter || 60} Sekunden.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler",
          description: response.error || "Zahlung konnte nicht gestartet werden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Netzwerkfehler",
        description: "Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsRedirectingToPayment(false);
      setSelectedProduct(null);
    }
  };

  // ─── Success State (with Payment CTA) ──────────────────────────────────

  if (isSubmitted) {
    const baseFeatures = [
      "Technische Bauzustandsanalyse",
      "Analyse von Keller, Dach, Fassade, Heizung, Elektro, Innenräumen",
      "Strukturierter PDF-Bericht",
      "Einschätzung typischer Schadensrisiken",
      "Grobe Kostenspannen zur Orientierung",
    ];

    const intensivFeatures = [
      "Vertiefte Kosteneinschätzung mit realistischen Bandbreiten",
      "Priorisierung der Risiken (kaufentscheidend / nachrangig)",
      "Einschätzung zur Verhandlungsrelevanz",
      "Konkrete Handlungsempfehlung",
      "Persönliches Video-Gespräch (45 Min.)",
      "Schriftliche Zusammenfassung des Gesprächs",
    ];

    return (
      <div className="min-h-screen bg-bg-200">
        <StartHeader />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Confirmation */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-xl font-bold text-text-100 mb-2">
                  Fotos erfolgreich übermittelt!
                </h1>
                <p className="text-text-200">
                  Vielen Dank! Wir haben {uploadedCount} Foto{uploadedCount !== 1 ? "s" : ""} erhalten.
                </p>
              </div>

              {/* Comparison Card */}
              <Card className="shadow-strong border-0 mb-6 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 md:p-8 pb-4 text-center">
                    <h2 className="text-lg font-bold text-text-100 mb-1">
                      Unsere Leistungen im Vergleich
                    </h2>
                    <p className="text-sm text-text-200">
                      Wählen Sie das passende Paket für Ihre Immobilie
                    </p>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-t border-b border-primary-200">
                          <th className="text-left py-4 px-4 md:px-6 font-medium text-text-300 w-[50%]"></th>
                          <th className="py-4 px-3 md:px-4 text-center w-[25%]">
                            <div className="text-text-100 font-bold text-base">Analyse</div>
                            <div className="text-accent-200 font-bold text-xl mt-1">350 €</div>
                          </th>
                          <th className="py-4 px-3 md:px-4 text-center w-[25%] bg-accent-200/5">
                            <div className="inline-flex items-center gap-1 bg-accent-200 text-white text-[11px] font-bold px-2.5 py-1 rounded-full mb-1.5">
                              <Star className="w-3 h-3 fill-current" />
                              EMPFOHLEN
                            </div>
                            <div className="text-text-100 font-bold text-base">Intensiv</div>
                            <div className="text-accent-200 font-bold text-xl mt-1">790 €</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Base features - included in both */}
                        {baseFeatures.map((label, i) => (
                          <tr key={`base-${i}`} className={`border-b border-primary-200/50 ${i % 2 === 0 ? "" : "bg-bg-200/50"}`}>
                            <td className="py-3 px-4 md:px-6 text-text-200 text-[13px] leading-snug">{label}</td>
                            <td className="py-3 px-3 md:px-4 text-center">
                              <CheckCircle className="w-4.5 h-4.5 text-success-100 mx-auto" />
                            </td>
                            <td className="py-3 px-3 md:px-4 text-center bg-accent-200/5">
                              <CheckCircle className="w-4.5 h-4.5 text-success-100 mx-auto" />
                            </td>
                          </tr>
                        ))}

                        {/* Separator row */}
                        <tr className="border-b border-primary-200">
                          <td className="py-2 px-4 md:px-6">
                            <span className="text-[11px] font-semibold text-accent-200 uppercase tracking-wide">Zusätzlich bei Intensiv</span>
                          </td>
                          <td className="py-2"></td>
                          <td className="py-2 bg-accent-200/5"></td>
                        </tr>

                        {/* Intensiv-only features */}
                        {intensivFeatures.map((label, i) => (
                          <tr key={`intensiv-${i}`} className={`border-b border-primary-200/50 ${i % 2 === 0 ? "bg-accent-200/[0.02]" : "bg-bg-200/50"}`}>
                            <td className="py-3 px-4 md:px-6 text-text-200 text-[13px] leading-snug">{label}</td>
                            <td className="py-3 px-3 md:px-4 text-center">
                              <span className="text-text-300">–</span>
                            </td>
                            <td className="py-3 px-3 md:px-4 text-center bg-accent-200/5">
                              <CheckCircle className="w-4.5 h-4.5 text-success-100 mx-auto" />
                            </td>
                          </tr>
                        ))}

                        {/* Extra rows */}
                        <tr className="border-b border-primary-200/50">
                          <td className="py-3 px-4 md:px-6 text-text-200 text-[13px]">Bearbeitungszeit</td>
                          <td className="py-3 px-3 md:px-4 text-center text-text-200 text-[13px]">i.d.R. 48h</td>
                          <td className="py-3 px-3 md:px-4 text-center text-text-200 text-[13px] bg-accent-200/5">i.d.R. 48h</td>
                        </tr>
                        <tr className="border-b border-primary-200/50 bg-bg-200/50">
                          <td className="py-3 px-4 md:px-6 text-text-200 text-[13px]">100 % Geld-zurück-Garantie</td>
                          <td className="py-3 px-3 md:px-4 text-center"><CheckCircle className="w-4.5 h-4.5 text-success-100 mx-auto" /></td>
                          <td className="py-3 px-3 md:px-4 text-center bg-accent-200/5"><CheckCircle className="w-4.5 h-4.5 text-success-100 mx-auto" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* CTA Buttons */}
                  <div className="p-6 md:p-8 pt-6 grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handlePayment('analyse')}
                      disabled={isRedirectingToPayment}
                      variant="outline"
                      className="w-full py-6 text-sm md:text-base font-semibold flex items-center justify-center gap-2 border-2 border-primary-200 hover:border-accent-200 hover:text-accent-200"
                    >
                      {selectedProduct === 'analyse' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Analyse wählen
                          <span className="hidden sm:inline">— 350 €</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handlePayment('intensiv')}
                      disabled={isRedirectingToPayment}
                      className="w-full py-6 text-sm md:text-base font-semibold bg-accent-200 hover:bg-accent-300 text-white flex items-center justify-center gap-2"
                    >
                      {selectedProduct === 'intensiv' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Intensiv wählen
                          <span className="hidden sm:inline">— 790 €</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Guarantee Banner */}
              <div className="flex items-center justify-center gap-3 mb-4 py-3 px-4 bg-white rounded-lg shadow-soft">
                <div className="w-9 h-9 bg-success-100/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4.5 h-4.5 text-success-100" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-100">100 % Geld-zurück-Garantie</p>
                  <p className="text-xs text-text-300">Kein Risiko — volle Erstattung wenn Sie nicht zufrieden sind</p>
                </div>
              </div>

              {/* Trust line */}
              <div className="flex items-center justify-center gap-4 text-xs text-text-300">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SSL-verschlüsselt
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  Sichere Zahlung via Stripe
                </span>
              </div>
            </div>
          </div>
        </main>
        <StartFooter />
        <CookieBanner />
        <Toaster />
      </div>
    );
  }

  // ─── Upload UI ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg-200">
      <StartHeader />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-text-100 mb-3">
                Fotos hochladen
              </h1>
              <p className="text-text-200 max-w-lg mx-auto">
                Laden Sie Fotos Ihres Objekts hoch, damit wir Ihre Anfrage prüfen können.
                Je mehr Fotos, desto besser unsere Einschätzung.
              </p>
            </div>

            <Card className="shadow-strong border-0 mb-6">
              <CardContent className="p-6 md:p-8">
                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-[3px] border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center
                    ${
                      isDragOver
                        ? "border-accent-200 bg-accent-200/5"
                        : "border-primary-200 hover:border-accent-200 bg-white"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFiles(e.target.files);
                        e.target.value = "";
                      }
                    }}
                  />
                  <Camera className="w-12 h-12 text-accent-200 mb-4" />
                  <p className="text-text-100 font-medium mb-1">
                    Fotos hier ablegen oder klicken
                  </p>
                  <p className="text-sm text-text-300">
                    JPG, PNG oder PDF &bull; Max. 10 MB pro Datei
                  </p>
                </div>

                {/* Photo Grid */}
                {photos.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-text-100">
                        {uploadedCount} von {photos.length} Foto{photos.length !== 1 ? "s" : ""} hochgeladen
                        {uploadingCount > 0 && (
                          <span className="text-text-300 ml-2">
                            ({uploadingCount} wird hochgeladen...)
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {photos.map((photo) => (
                        <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-bg-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.previewUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />

                          {/* Upload overlay */}
                          {photo.status === "uploading" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                          )}

                          {/* Failed overlay */}
                          {photo.status === "failed" && (
                            <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                              <span className="text-white text-xs font-medium bg-red-600 px-2 py-1 rounded">
                                Fehlgeschlagen
                              </span>
                            </div>
                          )}

                          {/* Uploaded check */}
                          {photo.status === "uploaded" && (
                            <div className="absolute top-1.5 right-1.5">
                              <CheckCircle className="w-5 h-5 text-green-500 drop-shadow-md" />
                            </div>
                          )}

                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(photo.id);
                            }}
                            className="absolute top-1.5 left-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-text-100 mb-1.5">
                    Hinweise oder Anmerkungen (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Beschreiben Sie auffällige Schäden oder besondere Umstände..."
                    rows={4}
                    className="w-full rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-text-100 placeholder:text-text-300 focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-200 resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="mt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={uploadedCount === 0 || uploadingCount > 0 || isSavingNotes}
                    className="w-full bg-accent-200 hover:bg-accent-300 text-white py-6 text-base flex items-center justify-center gap-2"
                  >
                    {isSavingNotes ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Wird gesendet...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Fotos absenden ({uploadedCount} Foto{uploadedCount !== 1 ? "s" : ""})
                      </>
                    )}
                  </Button>
                  {uploadedCount === 0 && photos.length === 0 && (
                    <p className="text-sm text-text-300 text-center mt-2">
                      Laden Sie mindestens ein Foto hoch, um fortzufahren.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photo tips */}
            <Card className="shadow-soft border-0">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-text-100 mb-3">
                  Welche Fotos sind besonders hilfreich?
                </h3>
                <ul className="space-y-2 text-sm text-text-200">
                  {[
                    "Außenansicht / Fassade",
                    "Dach (von außen, falls sichtbar)",
                    "Keller (falls vorhanden)",
                    "Heizung / Haustechnik",
                    "Innenräume & Bäder",
                    "Auffälligkeiten, die Ihnen unsicher erscheinen",
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-100 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <StartFooter />
      <CookieBanner />
      <Toaster />
    </div>
  );
}

// ─── Wrapper with Suspense (required for useSearchParams in static export) ──

export default function UploadClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-200" />
        </div>
      }
    >
      <UploadClientInner />
    </Suspense>
  );
}
