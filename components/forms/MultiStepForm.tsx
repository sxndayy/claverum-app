"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Check,
  X,
  Camera,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiClient';
import { compressImage } from '@/lib/imageCompression';
import { getCurrentOrderId, setCurrentOrder, getCurrentStep, setCurrentStep as saveCurrentStep, clearOrderSession } from '@/lib/orderManager';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import FunnelSidebar from '@/components/FunnelSidebar';
import ProcessSidebar from '@/components/ProcessSidebar';
import Image from 'next/image';
import YearSlider from '@/components/YearSlider';

// Types
type AreaKey = 'Fassade' | 'Dach' | 'Keller' | 'Heizung' | 'Bad' | 'Fenster' | 'Elektrik' | 'Sonstiges';

interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  area: AreaKey | null;
  status: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadId?: string;
  error?: string;
}

interface FormData {
  propertyType: string;
  buildYear: string;
  customerName: string;
  customerEmail: string;
  street: string;
  postalCode: string;
  city: string;
}

// Constants
const TOTAL_STEPS = 4;
const MIN_PHOTOS = 0;
const MAX_PHOTOS = 100;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const FORM_DATA_STORAGE_KEY = 'claverum_form_data_v2';
const DEFAULT_BUILD_YEAR = '1976';

const PROPERTY_TYPES = [
  { id: 'Einfamilienhaus', label: 'Einfamilienhaus', icon: '/Objekte/Einfamilienhaus-2.png' },
  { id: 'Eigentumswohnung', label: 'Eigentumswohnung', icon: '/Objekte/Eigentumswohnung-2.png' },
  { id: 'Reihenhaus', label: 'Reihenhaus', icon: '/Objekte/Reihenhaus-2.png' },
  { id: 'Mehrfamilienhaus', label: 'Mehrfamilienhaus', icon: '/Objekte/Mehrfamilienhaus-2.png' },
];

const DEFAULT_AREA = 'Fassade';

const PHOTO_AREA_OVERVIEW = [
  'Außenansicht / Fassade',
  'Dach (von außen, falls sichtbar)',
  'Keller (falls vorhanden)',
  'Heizung / Haustechnik',
  'Innenräume & Bäder',
  'Auffälligkeiten, die Ihnen unsicher erscheinen',
] as const;


const clampYear = (value: number) => Math.min(2024, Math.max(1900, Number.isNaN(value) ? 1900 : value));

const getYearInfo = (year: number) => {
  if (year < 1950) {
    return {
      icon: '🏛️',
      title: 'Altbau-Immobilie',
      points: [
        'Häufig Setzungsrisse und Feuchtigkeitsprobleme',
        'Oft fehlende Wärmedämmung',
        'Prüfung auf Denkmalschutz empfohlen',
      ],
    };
  }
  if (year >= 1950 && year <= 1992) {
    return {
      icon: '⚠️',
      title: 'Wichtiger Hinweis',
      points: [
        'Mögliches Asbest-Risiko bei Baujahr vor 1993',
        'Oft veraltete Elektrik und Heizung',
        'Energetische Sanierung empfehlenswert',
      ],
    };
  }
  if (year >= 1993 && year <= 2000) {
    return {
      icon: '🏗️',
      title: 'Solide Bausubstanz',
      points: [
        'Meist guter Zustand',
        'Energetische Standards bereits höher',
        'Moderate Sanierungskosten zu erwarten',
      ],
    };
  }
  return {
    icon: '✨',
    title: 'Moderne Bauweise',
    points: [
      'Gute Dämmung und Energieeffizienz',
      'Zeitgemäße Technik',
      'Geringerer Instandhaltungsbedarf',
    ],
  };
};

// Helper functions
const generatePhotoId = () => {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createEmptyFormData = (): FormData => ({
  propertyType: '',
  buildYear: DEFAULT_BUILD_YEAR,
  customerName: '',
  customerEmail: '',
  street: '',
  postalCode: '',
  city: '',
});

const loadStoredFormData = (): FormData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(FORM_DATA_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveFormDataToStorage = (data: FormData) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

const clearStoredFormData = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(FORM_DATA_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
};

// Main Component
const MultiStepForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [checkoutErrors, setCheckoutErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(createEmptyFormData());
  const [year, setYear] = useState<number>(() => clampYear(parseInt(DEFAULT_BUILD_YEAR, 10)));
  const [yearInput, setYearInput] = useState<string>(DEFAULT_BUILD_YEAR);
  const [unsureYear, setUnsureYear] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [showPhotoTips, setShowPhotoTips] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Progress calculation
  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Restore persisted UI state after mount (avoid hydration mismatch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedStep = getCurrentStep();
    if (savedStep >= 1 && savedStep <= TOTAL_STEPS) {
      setCurrentStep(savedStep);
    }

    const stored = loadStoredFormData();
    if (stored) {
      const merged: FormData = {
        ...createEmptyFormData(),
        ...stored,
        buildYear: stored.buildYear?.trim() ? stored.buildYear : DEFAULT_BUILD_YEAR,
      };
      setFormData(merged);
    }
  }, []);

  // Always scroll to top on step change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use anchor if present, fallback to window scroll
    const anchor = document.getElementById('bewertung-starten');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Initialize order on mount
  useEffect(() => {
    const initializeOrder = async () => {
      // Check for Stripe redirect
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        router.push(`/success?session_id=${sessionId}`);
        return;
      }
      
      const existingOrderId = getCurrentOrderId();
      
      if (existingOrderId) {
        setOrderId(existingOrderId);
        
        // Load order data from backend
        try {
          const orderResponse = await apiClient.getOrderDetails(existingOrderId);
          if (orderResponse.success && orderResponse.order) {
            loadFormDataFromOrder(orderResponse.order);
          }
        } catch (error) {
          console.error('Error loading order:', error);
        }
      } else {
        // Create new order
        clearStoredFormData();
        setFormData(createEmptyFormData());
        setPhotos([]);
        
        try {
          const response = await apiClient.createOrder();
          if (response.success) {
            setOrderId(response.orderId);
            setCurrentOrder(response.orderId, response.sessionToken);
            setCurrentStep(1);
            saveCurrentStep(1);
          }
        } catch (error) {
          console.error('Error creating order:', error);
        }
      }
    };

    initializeOrder();
  }, [router]);

  // Save form data to storage when it changes
  useEffect(() => {
    saveFormDataToStorage(formData);
  }, [formData]);

  useEffect(() => {
    setYearInput(formData.buildYear || '');

    const raw = (formData.buildYear || '').trim();
    // Only sync the slider when we have a complete year (prevents "1900 jump" while typing)
    if (raw.length !== 4) return;
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    setYear(clampYear(parsed));
  }, [formData.buildYear]);

  // Load form data from backend order
  const loadFormDataFromOrder = (order: any) => {
    const backendBuildYearRaw = order?.build_year;
    const backendBuildYear =
      backendBuildYearRaw === null || backendBuildYearRaw === undefined || `${backendBuildYearRaw}`.trim() === ''
        ? DEFAULT_BUILD_YEAR
        : `${backendBuildYearRaw}`;

    setFormData({
      propertyType: order.property_type || '',
      buildYear: backendBuildYear,
      customerName: order.customer_name || '',
      customerEmail: order.customer_email || '',
      street: order.street || '',
      postalCode: order.postal_code || '',
      city: order.city || '',
    });

    // Load existing uploads
    if (order.uploads && Array.isArray(order.uploads)) {
      const loadedPhotos: PhotoItem[] = order.uploads.map((upload: any) => ({
        id: upload.id || generatePhotoId(),
        file: null as any, // No file for loaded uploads
        previewUrl: '', // Will be fetched
        area: upload.area as AreaKey || null,
        status: 'uploaded' as const,
        uploadId: upload.id,
      }));
      setPhotos(loadedPhotos);
      
      // Fetch presigned URLs for thumbnails
      loadedPhotos.forEach(async (photo) => {
        if (photo.uploadId && orderId) {
          try {
            const response = await apiClient.getDownloadUrl(orderId, photo.uploadId);
          if (response.success && response.downloadUrl) {
              setPhotos(prev => prev.map(p => 
                p.id === photo.id ? { ...p, previewUrl: response.downloadUrl! } : p
              ));
          }
        } catch (error) {
            console.error('Error fetching download URL:', error);
          }
        }
      });
    }
  };

  // Update form field
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // File handling
  const handleFilesSelected = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = MAX_PHOTOS - photos.length;
    
    if (remainingSlots <= 0) {
      toast({
        variant: 'destructive',
        title: 'Limit erreicht',
        description: `Maximal ${MAX_PHOTOS} Fotos erlaubt.`,
      });
      return;
    }

    const validFiles: PhotoItem[] = [];
    
    fileArray.slice(0, remainingSlots).forEach(file => {
      // Validate file
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Ungültiger Dateityp',
          description: `${file.name}: Nur Bilder oder PDFs sind erlaubt.`,
        });
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          title: 'Datei zu groß',
          description: `${file.name}: Maximal 10 MB.`,
        });
        return;
      }

      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      
      validFiles.push({
        id: generatePhotoId(),
        file,
        previewUrl,
        area: DEFAULT_AREA,
        status: 'pending',
      });
    });

    if (validFiles.length > 0) {
      setPhotos(prev => [...prev, ...validFiles]);
      
      // Start uploads immediately
      validFiles.forEach(photo => {
        uploadPhoto(photo);
      });
    }
  }, [photos.length, toast]);

  // Upload single photo
  const uploadPhoto = async (photo: PhotoItem) => {
    const currentOrderId = orderId || getCurrentOrderId();
    if (!currentOrderId) {
      console.error('No order ID for upload');
      return;
    }

    // Mark as uploading
    setPhotos(prev => prev.map(p => 
      p.id === photo.id ? { ...p, status: 'uploading' } : p
    ));

    try {
      // Compress image
      let fileToUpload = photo.file;
      if (photo.file.type.startsWith('image/')) {
        fileToUpload = await compressImage(photo.file, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.8,
          });
        }

      // Get presigned URL
      const areaName = photo.area || DEFAULT_AREA;
        const urlResponse = await apiClient.getUploadUrl(
        currentOrderId,
          areaName,
          fileToUpload.name,
          fileToUpload.type
        );

        if (!urlResponse.success) {
          throw new Error(urlResponse.error || 'Failed to get upload URL');
        }

      // Upload to S3
        const uploadSuccess = await apiClient.uploadToS3(urlResponse.uploadUrl, fileToUpload);
        if (!uploadSuccess) {
          throw new Error('Failed to upload to storage');
        }

      // Record upload
        const recordResponse = await apiClient.recordUpload({
        orderId: currentOrderId,
          area: areaName,
          filePath: urlResponse.filePath,
          mimeType: fileToUpload.type,
          fileSize: fileToUpload.size,
        });

        if (!recordResponse.success) {
          throw new Error(recordResponse.error || 'Failed to record upload');
        }

      // Get download URL for preview
      const downloadResponse = await apiClient.getDownloadUrl(currentOrderId, recordResponse.uploadId);

      // Update photo status
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { 
          ...p, 
            status: 'uploaded',
          uploadId: recordResponse.uploadId,
          previewUrl: downloadResponse.success ? downloadResponse.downloadUrl! : p.previewUrl
        } : p
      ));
    } catch (error) {
      console.error('Upload error:', error);
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { 
          ...p, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Upload fehlgeschlagen' 
        } : p
      ));
    }
  };

  // Remove photo
  const handleRemovePhoto = async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    // Revoke blob URL
    if (photo.previewUrl && photo.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photo.previewUrl);
    }

    // Remove from UI
    setPhotos(prev => prev.filter(p => p.id !== photoId));

    // Delete from backend if uploaded
    if (photo.status === 'uploaded' && photo.uploadId && orderId) {
      try {
        await apiClient.deleteUpload(orderId, photo.uploadId);
      } catch (error) {
        console.error('Error deleting upload:', error);
      }
    }
  };

  // Drag and drop handlers
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
    handleFilesSelected(e.dataTransfer.files);
  };

  // Save step data
  const saveStepData = async () => {
    if (!orderId) return;

    try {
      if (currentStep === 1 || currentStep === 2) {
        await apiClient.updateOrder(orderId, {
          propertyType: formData.propertyType,
          buildYear: unsureYear ? undefined : (formData.buildYear || undefined),
        });
      }
    } catch (error) {
      console.error('Error saving step data:', error);
    }
  };

  // Auto-save Step 4 fields (name, email, address) with debounce
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentStep !== 4 || !orderId) return;

    // Only auto-save if at least name or email has been entered
    if (!formData.customerName && !formData.customerEmail) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await apiClient.updateOrder(orderId, {
          customerName: formData.customerName || undefined,
          customerEmail: formData.customerEmail || undefined,
          street: formData.street || undefined,
          postalCode: formData.postalCode || undefined,
          city: formData.city || undefined,
        });
      } catch (error) {
        console.error('Error auto-saving step 4 data:', error);
      }
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [currentStep, orderId, formData.customerName, formData.customerEmail, formData.street, formData.postalCode, formData.city]);

  // Navigation
  const nextStep = async () => {
    // Validation
    if (currentStep === 1 && !formData.propertyType) {
        toast({
          variant: 'destructive',
        title: 'Bitte wählen',
        description: 'Bitte wählen Sie einen Objekttyp aus.',
        });
        return;
      }

    if (currentStep === 2) {
      if (!formData.buildYear && !unsureYear) {
          toast({
            variant: 'destructive',
          title: 'Fehlende Angaben',
          description: 'Bitte geben Sie das Baujahr an.',
          });
          return;
        }
    }

    if (currentStep === 3) {
      const uploadedPhotos = photos.filter(p => p.status === 'uploaded');
      if (uploadedPhotos.length < MIN_PHOTOS) {
        toast({
          variant: 'destructive',
          title: 'Mehr Fotos benötigt',
          description: `Bitte laden Sie mindestens ${MIN_PHOTOS} Fotos hoch.`,
        });
        return;
      }
    }

    // Save data
    await saveStepData();

    // Navigate
    if (currentStep < TOTAL_STEPS) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      saveCurrentStep(nextStepNum);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      saveCurrentStep(prevStepNum);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= currentStep) {
      setCurrentStep(step);
      saveCurrentStep(step);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!orderId) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Kein aktiver Auftrag gefunden.',
      });
      return;
    }

    const errors: string[] = [];
    if (!formData.customerName) errors.push('customerName');
    if (!formData.customerEmail) errors.push('customerEmail');
    if (!formData.street) errors.push('street');
    if (!formData.postalCode) errors.push('postalCode');
    if (!formData.city) errors.push('city');

    if (errors.length > 0) {
      setCheckoutErrors(errors);
      toast({
        variant: 'destructive',
        title: 'Fehlende Angaben',
        description: 'Bitte füllen Sie alle markierten Felder aus.',
      });
      return;
    }

    setCheckoutErrors([]);

    setIsSaving(true);

    try {
      await apiClient.updateOrder(orderId, {
        propertyType: formData.propertyType,
        buildYear: unsureYear ? undefined : (formData.buildYear || undefined),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
      });

      const response = await apiClient.createCheckoutSession(orderId);
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        if (response.statusCode === 429) {
          toast({
            variant: 'destructive',
            title: 'Zu viele Anfragen',
            description: `Bitte warten Sie ${response.retryAfter || 60} Sekunden.`,
          });
      } else {
        toast({
          variant: 'destructive',
          title: 'Fehler',
            description: response.error || 'Fehler beim Erstellen der Zahlung',
        });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Fehler beim Weiterleiten zur Zahlung',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Count photos by status
  const uploadedCount = photos.filter(p => p.status === 'uploaded').length;
  const uploadingCount = photos.filter(p => p.status === 'uploading').length;

  return (
    <div className="w-full p-4 md:p-6" id="bewertung-starten">
      {/* Mobile Trust Strip — only visible on small screens */}
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
              <RefreshCw className="w-3 h-3" />
              <span>Geld zurück</span>
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
        {/* Left Sidebar - Process Info (visible on all steps, hidden on mobile) */}
        <div className="hidden xl:block">
          <ProcessSidebar />
        </div>
        
        {/* Main content card - centered */}
        <div className="">
          <Card className="shadow-strong bg-bg-300 w-full max-w-[950px] mx-auto">
        {/* Header */}
        <div className={`border-b border-primary-200 ${currentStep === 1 ? 'p-8' : 'p-6'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-text-300">
              {orderId && `Auftrag: #${orderId.slice(0, 8)}...`}
              </div>
            <div className="text-sm text-text-200">
              Schritt {currentStep} / {TOTAL_STEPS}
            </div>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>

        <CardContent className={currentStep === 1 ? 'p-8' : 'p-6'}>
          {/* Step 1: Property Type Selection */}
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
                      onClick={() => updateFormData('propertyType', type.id)}
                      className={`
                        relative p-6 rounded-lg transition-all duration-200
                        flex flex-col items-center justify-center gap-3
                        min-h-[220px]
                        ${isSelected 
                          ? 'border-[3px] border-[#0052A3] bg-white' 
                          : 'border-2 border-[#e5e7eb] bg-white hover:border-[#0066CC]'
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
                  → Andere Immobilie? Wir beraten Sie gerne persönlich
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Baujahr */}
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
                    if (raw === '') {
                      setYearInput('');
                      updateFormData('buildYear', '');
                      return;
                    }
                    if (!/^\d{0,4}$/.test(raw)) return;
                    setYearInput(raw);
                    updateFormData('buildYear', raw);
                  }}
                  onBlur={() => {
                    const raw = (yearInput || '').trim();
                    if (!raw) return;
                    const parsed = parseInt(raw, 10);
                    if (Number.isNaN(parsed)) return;
                    const clamped = clampYear(parsed);
                    setYear(clamped);
                    const next = clamped.toString();
                    setYearInput(next);
                    updateFormData('buildYear', next);
                  }}
                  className="text-[3rem] leading-tight font-bold text-accent-200 text-center bg-white border-2 border-accent-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent-200 w-full max-w-[260px] mx-auto"
                    />
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-text-300">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span
                      className={`relative inline-flex h-4 w-4 items-center justify-center rounded-[4px] border ${unsureYear ? 'border-accent-200' : 'border-text-300'} bg-white`}
                    >
                      {unsureYear && <Check className="h-3 w-3 text-accent-200 stroke-[3]" />}
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
                    updateFormData('buildYear', next);
                  }}
                  />
                </div>
                
              {/* Dynamic info box */}
              {(() => {
                const info = getYearInfo(year);
                return (
                  <div className="transition-all duration-300 bg-white border-2 border-[#e5e7eb] rounded-xl p-6 shadow-sm space-y-3">
                    <div className="flex items-start gap-4">
                      <span className="text-[1.5rem] leading-none">{info.icon}</span>
                <div>
                        <h3 className="text-[1.125rem] font-semibold text-text-100">{info.title}</h3>
                        <ul className="mt-3 space-y-2 text-[0.9375rem] text-text-200">
                          {info.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-accent-200 mt-[2px]">•</span>
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

          {/* Step 3: Unified Photo Upload */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-text-100 mb-2">
                  Fotos hochladen
                </h2>
                <p className="text-text-200">
                  Je mehr Fotos, desto genauer die Bewertung. Sie können auch später ergänzen.
                </p>
                <p className="text-xs text-text-300 mt-1">
                  Ihre Daten sind sicher — 256-Bit-TLS-Verschlüsselung
                </p>
                </div>

              {/* Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-[3px] border-dashed rounded-2xl p-10 text-center cursor-pointer
                  transition-all duration-200 min-h-[300px] flex flex-col items-center justify-center gap-3
                  ${isDragOver 
                    ? 'border-accent-200 bg-accent-200/10' 
                    : 'border-[#d1d5db] bg-white hover:border-accent-200 hover:bg-bg-300'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
                  className="hidden"
                />
                <Camera className={`w-12 h-12 ${isDragOver ? 'text-accent-200' : 'text-text-300'}`} />
                <div>
                  <p className="text-lg font-semibold text-text-100">Fotos hier ablegen oder klicken</p>
                  <p className="text-sm text-text-300">
                    Bis zu {MAX_PHOTOS} Fotos • Max 10MB pro Foto • JPG, PNG, HEIC, PDFs
                  </p>
                </div>
              </div>

              {/* Upload Status */}
              {photos.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-bg-200 rounded-lg">
                  <div className="flex items-center gap-4 text-sm md:text-base">
                    <span className="text-text-100 font-medium">
                      {photos.length} von bis zu {MAX_PHOTOS} Fotos hochgeladen
                    </span>
                    {uploadingCount > 0 && (
                      <span className="text-accent-200 flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {uploadingCount} wird hochgeladen...
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-text-300">{uploadedCount} fertig</span>
                </div>
              )}

              {/* Photo Grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative rounded-lg overflow-hidden border-2 border-primary-200 bg-white transition-transform duration-150 hover:scale-[1.01]"
                    >
                      {/* Preview */}
                      <div className="aspect-square bg-bg-200 relative">
                        {photo.previewUrl ? (
                          <img
                            src={photo.previewUrl}
                            alt={photo.file?.name || 'Foto'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-text-300" />
                          </div>
                        )}

                        {/* Status overlay */}
                        {photo.status === 'uploading' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                        {photo.status === 'failed' && (
                          <div className="absolute top-1 left-1 rounded-full bg-red-500 text-white text-[11px] font-medium px-2 py-[2px] shadow-sm">
                            Fehlgeschlagen
                          </div>
                        )}

                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(photo.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-white/90 rounded-full hover:bg-white shadow"
                        >
                          <X className="w-4 h-4 text-text-100" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* Minimum photos hint */}
              {uploadedCount < MIN_PHOTOS && (
                <div className="text-center text-sm text-text-300">
                  Noch {MIN_PHOTOS - uploadedCount} Foto(s) benötigt (mindestens {MIN_PHOTOS})
                </div>
              )}

              {/* Quick guide (2 columns) */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white border border-primary-200 rounded-lg p-4">
                  <div className="font-semibold text-text-100 mb-2 text-[15px] md:text-base md:whitespace-nowrap">
                    Welche Fotos helfen uns bei der Bewertung?
                  </div>
                  <div className="text-sm text-text-200 mb-2">
                    Wenn möglich, fotografieren Sie bitte:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-200">
                    {PHOTO_AREA_OVERVIEW.map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-primary-200 rounded-lg p-4">
                  <div className="font-semibold text-text-100 mb-2">
                    (Optional) Hilfreiche Detailaufnahmen:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-text-200">
                    <li>Dachziegel, Regenrinnen, Schornstein</li>
                    <li>Sicherungskasten der Elektrik</li>
                    <li>Risse, Feuchtigkeit, Schimmelstellen</li>
                  </ul>
                </div>
              </div>

              <div className="text-center text-sm text-text-200 -mt-6 -mb-6">
                <div className="font-semibold text-text-100 mb-1">Keine Sorge</div>
                <div>
                  Schon wenige aussagekräftige Fotos reichen aus.
                  <br />
                  Fehlende Bilder können jederzeit nachgereicht werden.
                </div>
              </div>

              {/* Photo Tips (Expandable) */}
              <div className="border border-primary-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowPhotoTips(!showPhotoTips)}
                  className="w-full p-4 flex items-center justify-between bg-bg-200 hover:bg-bg-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-accent-200" />
                    <span className="font-medium text-text-100">Freiwillige Tipps</span>
                  </div>
                  {showPhotoTips ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                {showPhotoTips && (
                  <div className="p-4 bg-white text-sm text-text-200 space-y-4">
                    <div>
                      <div className="font-medium text-text-100 mb-1">Wenn es für Sie einfach möglich ist:</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Fotografieren Sie bei ausreichendem Tageslicht</li>
                        <li>Machen Sie ein paar Übersichts- und ggf. Detailaufnahmen</li>
                        <li>Auffällige Stellen gern aus etwas Abstand und näher</li>
                      </ul>
                    </div>

                    <div>
                      <div className="font-medium text-text-100 mb-1">Zur Heizung (falls gut zugänglich):</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ein Foto vom Typenschild ist hilfreich</li>
                      </ul>
                    </div>

                    <div className="text-text-300">
                      Schon wenige Fotos reichen für eine erste Einschätzung.
                      <br />
                      Weitere Bilder erhöhen die Genauigkeit.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Summary + Checkout */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-100 mb-2">
                  Zusammenfassung
                </h2>
                <p className="text-text-200">
                  Überprüfen Sie Ihre Angaben
                </p>
              </div>
              
              {/* Summary Card */}
              <div className="bg-white rounded-xl border border-primary-200 p-6 space-y-4">
                <div className="space-y-3 border-b border-primary-200 pb-3">
                  <Input
                    placeholder="Name *"
                    value={formData.customerName}
                    onChange={(e) => { updateFormData('customerName', e.target.value); setCheckoutErrors(prev => prev.filter(f => f !== 'customerName')); }}
                    className={`h-11 ${checkoutErrors.includes('customerName') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                  <Input
                    placeholder="E-Mail-Adresse *"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => { updateFormData('customerEmail', e.target.value); setCheckoutErrors(prev => prev.filter(f => f !== 'customerEmail')); }}
                    className={`h-11 ${checkoutErrors.includes('customerEmail') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                </div>
                <div className="space-y-3 border-b border-primary-200 pb-3">
                  <Input
                    placeholder="Straße und Hausnummer *"
                    value={formData.street}
                    onChange={(e) => { updateFormData('street', e.target.value); setCheckoutErrors(prev => prev.filter(f => f !== 'street')); }}
                    className={`h-11 ${checkoutErrors.includes('street') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="PLZ *"
                      value={formData.postalCode}
                      onChange={(e) => { updateFormData('postalCode', e.target.value); setCheckoutErrors(prev => prev.filter(f => f !== 'postalCode')); }}
                      className={`h-11 ${checkoutErrors.includes('postalCode') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    />
                    <Input
                      placeholder="Ort *"
                      value={formData.city}
                      onChange={(e) => { updateFormData('city', e.target.value); setCheckoutErrors(prev => prev.filter(f => f !== 'city')); }}
                      className={`h-11 ${checkoutErrors.includes('city') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-primary-200">
                  <span className="text-text-200">Objekttyp</span>
                  <span className="font-medium text-text-100">{formData.propertyType}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-primary-200">
                  <span className="text-text-200">Baujahr</span>
                  <span className="font-medium text-text-100">{formData.buildYear}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-text-200">Fotos</span>
                  <span className="font-medium text-text-100">{uploadedCount} hochgeladen</span>
                </div>

                <button
                  onClick={() => goToStep(1)}
                  className="w-full text-center text-sm text-accent-200 hover:underline mt-2"
                >
                  Angaben ändern
                </button>
              </div>

              {/* Package Card */}
              <div className="bg-white rounded-xl border-2 border-accent-200 p-6 relative">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="inline-flex items-center justify-center bg-accent-200 text-white px-4 py-1.5 rounded-full text-sm font-medium leading-none whitespace-nowrap">
                    All-in-One Paket
                          </span>
                        </div>

                <div className="mt-4 mb-6 space-y-3">
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-4xl font-bold text-accent-200">87,50 €</span>
                      <span className="text-text-200">Anzahlung (25%)</span>
                    </div>
                  </div>
                  <div className="bg-bg-200 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between text-text-200">
                      <span>Gesamtpreis inkl. MwSt.</span>
                      <span className="font-medium text-text-100">350,00 €</span>
                    </div>
                    <div className="flex justify-between text-text-200">
                      <span>Heute fällig (25%)</span>
                      <span className="font-medium text-accent-200">87,50 €</span>
                    </div>
                    <div className="flex justify-between text-text-200">
                      <span>Nach Lieferung</span>
                      <span className="text-text-100">262,50 €</span>
                    </div>
                  </div>
                </div>
                      
                        <ul className="space-y-3 mb-6">
                  {[
                    'Prüfung durch Diplom-Sachverständigen (DIA)',
                    'Bewertungsbericht (14-16 Seiten)',
                    'Kostenschätzung für Reparaturen',
                    'Priorisierung nach Dringlichkeit',
                    'Ergebnis innerhalb 48 Stunden',
                    'Telefonischer Support'
                  ].map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success-100 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-text-200">{feature}</span>
                            </li>
                          ))}
                        </ul>

                <Button
                  onClick={handleCheckout}
                  disabled={isSaving}
                  className="w-full h-12 text-lg bg-accent-200 hover:bg-accent-300"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Weiterleitung...
                    </>
                  ) : (
                    'Zum Checkout'
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-text-300">
                  <div className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>14 Tage Geld zurück</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Sichere Zahlung</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        <div className={`border-t border-primary-200 flex justify-between ${currentStep === 1 ? 'p-8' : 'p-6'}`}>
          {currentStep > 1 ? (
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex items-center gap-2"
                disabled={isSaving}
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>
          ) : (
            <div />
            )}
            
          {currentStep < TOTAL_STEPS && (
              <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-accent-200 hover:bg-accent-300"
                disabled={isSaving}
            >
                    Weiter
                    <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
      </Card>
    </div>
      
        {/* Right Sidebar - Expert Info (visible on all steps, hidden on mobile) */}
        <div className="hidden xl:block w-full mt-6 xl:mt-0">
          <FunnelSidebar />
        </div>
      </div>

      {/* Sidebars on Mobile (stacked) */}
      <div className="xl:hidden mt-6 max-w-[950px] mx-auto space-y-4">
        <ProcessSidebar />
        <FunnelSidebar />
      </div>
    </div>
  );
};

export default MultiStepForm;


