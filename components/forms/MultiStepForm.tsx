"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { MapPin, Home, Camera, ChevronLeft, ChevronRight, CreditCard, Loader2, CheckCircle, Mail, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AreaUpload from '@/components/forms/AreaUpload';
import UploadStatus from '@/components/forms/UploadStatus';
import { apiClient } from '@/lib/apiClient';
import { compressImage } from '@/lib/imageCompression';
import { AreaUploadItem, UploadableFile } from '@/types/uploads';
import { getCurrentOrderId, setCurrentOrder, hasActiveOrder, getCurrentStep, setCurrentStep as saveCurrentStep } from '@/lib/orderManager';

type AreaKey = 'keller' | 'elektro' | 'heizung' | 'fassade' | 'dach' | 'innenraeume';

type AreaUploadsState = Record<AreaKey, AreaUploadItem[]>;

interface AreaContent {
  text: string;
}

interface FormData {
  // Step 1: Objekt-Basics
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  propertyType: string;
  buildYear: string;
  
  // Steps 2-7: Building Areas
  keller: AreaContent;
  elektro: AreaContent;
  heizung: AreaContent;
  fassade: AreaContent;
  dach: AreaContent;
  innenraeume: AreaContent;

  // Step 8: Produkt & Checkout
  selectedProduct: string;
  selectedPackage: string;
}

const AREA_KEYS: AreaKey[] = ['keller', 'elektro', 'heizung', 'fassade', 'dach', 'innenraeume'];
const FORM_DATA_STORAGE_KEY = 'claverum_form_data';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES_PER_AREA = 20;
const generateUploadId = (areaKey: AreaKey) => {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10);
  return `${areaKey}-${Date.now()}-${randomPart}`;
};

const createEmptyArea = (): AreaContent => ({
  text: '',
});

const createEmptyAreaUploads = (): AreaUploadsState => ({
  keller: [],
  elektro: [],
  heizung: [],
  fassade: [],
  dach: [],
  innenraeume: [],
});

const createEmptyFormData = (): FormData => ({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    propertyType: '',
    buildYear: '',
  keller: createEmptyArea(),
  elektro: createEmptyArea(),
  heizung: createEmptyArea(),
  fassade: createEmptyArea(),
  dach: createEmptyArea(),
  innenraeume: createEmptyArea(),
    selectedProduct: '',
    selectedPackage: '',
  });

const mergeStoredArea = (area: any): AreaContent => ({
  text: typeof area?.text === 'string' ? area.text : '',
});

const loadStoredFormData = (): FormData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(FORM_DATA_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const empty = createEmptyFormData();
    return {
      ...empty,
      ...parsed,
      keller: mergeStoredArea(parsed?.keller),
      elektro: mergeStoredArea(parsed?.elektro),
      heizung: mergeStoredArea(parsed?.heizung),
      fassade: mergeStoredArea(parsed?.fassade),
      dach: mergeStoredArea(parsed?.dach),
      innenraeume: mergeStoredArea(parsed?.innenraeume),
    };
  } catch (error) {
    console.error('Error loading stored form data:', error);
    return null;
  }
};

const saveFormDataToStorage = (data: FormData) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data to sessionStorage:', error);
  }
};

const clearStoredFormData = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(FORM_DATA_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored form data:', error);
  }
};


const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(file.name);
};

const isPdfFile = (file: File): boolean => {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif', 'application/pdf'];

const validateFile = (file: File, allowPdf: boolean = false): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Ungültiger Dateityp. Nur Bilder' + (allowPdf ? ' und PDFs' : '') + ' sind erlaubt.';
  }
  if (file.type === 'application/pdf' && !allowPdf) {
    return 'PDFs sind für diesen Bereich nicht erlaubt.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Datei zu groß (max. 10 MB).';
  }
  return null;
};

const AREA_PDF_SUPPORT: Record<AreaKey, boolean> = {
  keller: true,
  elektro: false,
  heizung: true,
  fassade: false,
  dach: false,
  innenraeume: false,
};



const MultiStepForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  // Initialize currentStep from sessionStorage immediately
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedStep = getCurrentStep();
      return savedStep >= 1 && savedStep <= 8 ? savedStep : 1;
    }
    return 1;
  });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== 'undefined') {
      const hasExistingOrder = !!getCurrentOrderId();
      if (hasExistingOrder) {
        const stored = loadStoredFormData();
        if (stored) {
          return stored;
        }
      }
    }
    return createEmptyFormData();
  });
  const [areaUploads, setAreaUploads] = useState<AreaUploadsState>(() => {
    return createEmptyAreaUploads();
  });
  const uploadFilesRef = useRef<Record<string, UploadableFile>>({});
  const itemAreaMapRef = useRef<Record<string, AreaKey>>({});
  const prevUploadsRef = useRef<AreaUploadsState | null>(null);
  const fetchedUrlsRef = useRef<Set<string>>(new Set()); // Track which uploadIds already have URLs fetched
  
  // Fetch presigned URLs for uploads loaded from backend
  useEffect(() => {
    if (!orderId) return;

    const fetchPresignedUrls = async () => {
      const uploadsToFetch: Array<{ itemId: string; areaKey: AreaKey; uploadId: string }> = [];

      // Collect all uploads that need presigned URLs
      Object.entries(areaUploads).forEach(([areaKey, items]) => {
        items.forEach(item => {
          // Check if item needs a presigned URL: uploaded, has uploadId, no remoteUrl, and not already fetched
          if (
            item.status === 'uploaded' && 
            item.uploadId && 
            (!item.remoteUrl || item.remoteUrl === '') &&
            !fetchedUrlsRef.current.has(item.uploadId)
          ) {
            uploadsToFetch.push({
              itemId: item.id,
              areaKey: areaKey as AreaKey,
              uploadId: item.uploadId,
            });
            fetchedUrlsRef.current.add(item.uploadId); // Mark as being fetched
          }
        });
      });

      if (uploadsToFetch.length === 0) return;

      console.log(`[PRESIGNED] Fetching ${uploadsToFetch.length} presigned URLs...`);

      // Fetch presigned URLs in parallel
      const urlPromises = uploadsToFetch.map(async ({ itemId, areaKey, uploadId }) => {
        try {
          const response = await apiClient.getDownloadUrl(orderId, uploadId);
          if (response.success && response.downloadUrl) {
            console.log(`[PRESIGNED] Successfully fetched URL for upload ${uploadId}`);
            return { itemId, areaKey, url: response.downloadUrl };
          }
          // Remove from fetched set if failed, so we can retry later
          fetchedUrlsRef.current.delete(uploadId);
          console.error(`[PRESIGNED] Failed to get download URL for ${uploadId}:`, response.error);
          return null;
        } catch (error) {
          // Remove from fetched set if failed, so we can retry later
          fetchedUrlsRef.current.delete(uploadId);
          console.error(`[PRESIGNED] Error fetching presigned URL for upload ${uploadId}:`, error);
          return null;
        }
      });

      const results = await Promise.all(urlPromises);

      // Update state with presigned URLs
      setAreaUploads(prev => {
        const updated = { ...prev };
        let hasChanges = false;
        
        results.forEach(result => {
          if (result) {
            const items = updated[result.areaKey];
            const index = items.findIndex(item => item.id === result.itemId);
            if (index !== -1 && (!items[index].remoteUrl || items[index].remoteUrl === '')) {
              updated[result.areaKey] = [...items];
              updated[result.areaKey][index] = {
                ...items[index],
                previewUrl: result.url,
                remoteUrl: result.url,
              };
              hasChanges = true;
            }
          }
        });
        
        return hasChanges ? updated : prev;
      });
    };

    fetchPresignedUrls();
  }, [orderId, areaUploads]); // React to changes in areaUploads to fetch URLs for newly loaded uploads

  const revokePreviewUrl = useCallback((url?: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const registerLocalFile = useCallback((areaKey: AreaKey, file: File): AreaUploadItem => {
    const id = generateUploadId(areaKey);
    const isPdf = isPdfFile(file);
    const previewUrl = isPdf ? '' : URL.createObjectURL(file);
    uploadFilesRef.current[id] = file as UploadableFile;
    itemAreaMapRef.current[id] = areaKey;

    return {
      id,
      name: file.name,
      size: file.size,
      mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
      kind: isPdf ? 'pdf' : 'image',
      previewUrl,
      status: 'uploading', // Start immediately as uploading
    };
  }, []);

  const cleanupItemResources = useCallback(
    (itemId: string, previewUrl?: string) => {
      revokePreviewUrl(previewUrl);
      delete uploadFilesRef.current[itemId];
      delete itemAreaMapRef.current[itemId];
    },
    [revokePreviewUrl],
  );

  // Simple upload function - uploads immediately without queue
  const uploadFileImmediately = useCallback(
    async (file: File, itemId: string, areaKey: AreaKey, orderId: string) => {
      try {
        // Map area key to backend area name
        const areaMap: Record<string, string> = {
          'keller': 'Keller',
          'elektro': 'Elektro',
          'heizung': 'Heizung',
          'fassade': 'Fassade',
          'dach': 'Dach',
          'innenraeume': 'Innenräume'
        };
        const areaName = areaMap[areaKey] || areaKey.charAt(0).toUpperCase() + areaKey.slice(1);
        const isPdf = isPdfFile(file);

        // Step 1: Compress image (skip for PDFs)
        let fileToUpload = file;
        if (!isPdf) {
          fileToUpload = await compressImage(file, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.8,
          });
        }

        // Step 2: Get presigned URL
        const urlResponse = await apiClient.getUploadUrl(
          orderId,
          areaName,
          fileToUpload.name,
          fileToUpload.type
        );

        if (!urlResponse.success) {
          throw new Error(urlResponse.error || 'Failed to get upload URL');
        }

        // Step 3: Upload to S3
        const uploadSuccess = await apiClient.uploadToS3(urlResponse.uploadUrl, fileToUpload);

        if (!uploadSuccess) {
          throw new Error('Failed to upload to storage');
        }

        // Step 4: Record upload in database
        const recordResponse = await apiClient.recordUpload({
          orderId,
          area: areaName,
          filePath: urlResponse.filePath,
          mimeType: fileToUpload.type,
          fileSize: fileToUpload.size,
        });

        if (!recordResponse.success) {
          throw new Error(recordResponse.error || 'Failed to record upload');
        }

        // Step 5: Get presigned download URL (bucket is private)
        const downloadUrlResponse = await apiClient.getDownloadUrl(
          orderId,
          recordResponse.uploadId
        );

        // Use presigned URL if available, fallback to publicUrl
        const displayUrl = downloadUrlResponse.success && downloadUrlResponse.downloadUrl
          ? downloadUrlResponse.downloadUrl
          : recordResponse.publicUrl;

        // Step 6: Update UI with success
        setAreaUploads(prev => {
          const items = prev[areaKey];
          const index = items.findIndex(item => item.id === itemId);
          if (index === -1) return prev;

          const updatedItems = [...items];
          const previousPreview = updatedItems[index].previewUrl;
          updatedItems[index] = {
            ...updatedItems[index],
            status: 'uploaded',
            remoteUrl: displayUrl,
            previewUrl: displayUrl,
          };

          // Cleanup blob URL if it was a local preview
          cleanupItemResources(itemId, previousPreview);

          return {
            ...prev,
            [areaKey]: updatedItems,
          };
        });
      } catch (error) {
        console.error(`[UPLOAD] Upload failed for ${file.name}:`, error);
        
        // Update UI with error
        setAreaUploads(prev => {
          const items = prev[areaKey];
          const index = items.findIndex(item => item.id === itemId);
          if (index === -1) return prev;

          const updatedItems = [...items];
          updatedItems[index] = {
            ...updatedItems[index],
            status: 'failed',
            error: error instanceof Error ? error.message : 'Upload failed',
          };

          return {
            ...prev,
            [areaKey]: updatedItems,
          };
        });
      }
    },
    [cleanupItemResources],
  );

  useEffect(() => {
    saveFormDataToStorage(formData);
  }, [formData]);


  const handleAreaFilesSelected = useCallback(
    (areaKey: AreaKey, files: File[]) => {
      if (!files.length) return;

      const existingOrderId = orderId || getCurrentOrderId();
      if (!existingOrderId) {
        toast({
          variant: 'destructive',
          title: 'Fehler',
          description: 'Bitte erstellen Sie zuerst eine Bestellung.',
        });
        return;
      }

      const existingCount = areaUploads[areaKey].length;
      const remainingSlots = MAX_FILES_PER_AREA - existingCount;

      if (remainingSlots <= 0) {
        toast({
          variant: 'destructive',
          title: 'Limit erreicht',
          description: `Sie können maximal ${MAX_FILES_PER_AREA} Dateien hochladen.`,
        });
        return;
      }

      const allowPdf = AREA_PDF_SUPPORT[areaKey] ?? false;
      const validFiles: File[] = [];
      files.forEach(file => {
        const error = validateFile(file, allowPdf);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Datei ungültig',
            description: `${file.name}: ${error}`,
          });
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length === 0) {
        return;
      }

      const limitedFiles = validFiles.slice(0, remainingSlots);
      const newItems = limitedFiles.map(file => registerLocalFile(areaKey, file));

      // Add items to UI immediately
      setAreaUploads(prev => ({
        ...prev,
        [areaKey]: [...prev[areaKey], ...newItems],
      }));

      // Start upload immediately for each file
      limitedFiles.forEach((file, index) => {
        const itemId = newItems[index].id;
        uploadFileImmediately(file, itemId, areaKey, existingOrderId).catch(error => {
          console.error(`[UPLOAD] Failed to start upload for ${file.name}:`, error);
        });
      });
    },
    [areaUploads, toast, registerLocalFile, uploadFileImmediately, orderId],
  );

  const handleRemoveItem = useCallback(
    async (areaKey: AreaKey, itemId: string) => {
      const items = areaUploads[areaKey];
      const index = items.findIndex(item => item.id === itemId);
      if (index === -1) return;
      
      const target = items[index];
      if (target.status === 'uploading') {
        toast({
          variant: 'destructive',
          title: 'Upload läuft',
          description: 'Bitte warten Sie bis der Upload abgeschlossen ist.',
        });
        return;
      }

      // Extract upload ID from item ID (format: areaKey-uploadId or areaKey-timestamp-random)
      const uploadIdMatch = target.id.match(/^[^-]+-(.+)$/);
      const uploadId = uploadIdMatch ? uploadIdMatch[1] : null;
      const existingOrderId = orderId || getCurrentOrderId();

      // Remove from UI immediately
      cleanupItemResources(itemId, target.previewUrl);
      setAreaUploads(prev => {
        const updatedItems = [...prev[areaKey].slice(0, index), ...prev[areaKey].slice(index + 1)];
        return {
          ...prev,
          [areaKey]: updatedItems,
        };
      });

      // Delete from database if it was uploaded
      if (target.status === 'uploaded' && uploadId && existingOrderId) {
        try {
          const deleteResponse = await apiClient.deleteUpload(existingOrderId, uploadId);
          
          if (!deleteResponse.success) {
            console.error('Failed to delete upload:', deleteResponse.error);
            toast({
              variant: 'destructive',
              title: 'Fehler',
              description: 'Datei konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.',
            });
            // Optionally reload uploads from DB to restore the item
          }
        } catch (error) {
          console.error('Error deleting upload:', error);
          toast({
            variant: 'destructive',
            title: 'Fehler',
            description: 'Datei konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.',
          });
        }
      }
    },
    [areaUploads, cleanupItemResources, orderId, toast],
  );

  // Initialize order on component mount - non-blocking
  useEffect(() => {
    const initializeOrder = async () => {
      // Check if we're returning from Stripe payment
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      
      if (sessionId) {
        // Redirect to separate success page
        router.push(`/success?session_id=${sessionId}`);
        return;
      }
      
      // Check if order already exists in session
      const existingOrderId = getCurrentOrderId();
      
      if (existingOrderId) {
        console.log('Using existing order:', existingOrderId);
        setOrderId(existingOrderId);
        
        // Step is already restored via useState initializer, but ensure it's set correctly
        const savedStep = getCurrentStep();
        if (savedStep >= 1 && savedStep <= 8) {
          setCurrentStep(savedStep);
          saveCurrentStep(savedStep); // Ensure it's saved
        }
        
        // Load order data from backend in background
        apiClient.getOrderDetails(existingOrderId)
          .then(orderResponse => {
            if (orderResponse.success && orderResponse.order) {
              // Load form data from backend
              loadFormDataFromOrder(orderResponse.order);
            }
          })
          .catch(error => {
            console.error('Error loading order data:', error);
            // Continue anyway - form will be empty but user can continue
          });
      } else {
        // Create new order in background (non-blocking, no UI feedback)
        clearStoredFormData();
        setFormData(createEmptyFormData());
        setAreaUploads(createEmptyAreaUploads());
        uploadFilesRef.current = {};
        itemAreaMapRef.current = {};
        
        // Silent retry in background - no UI feedback
        apiClient.createOrder()
          .then(response => {
            if (response.success) {
              setOrderId(response.orderId);
              setCurrentOrder(response.orderId, response.sessionToken);
              setCurrentStep(1);
              saveCurrentStep(1);
            }
            // Silently fail - user can continue filling form, order will be created on next step if needed
          })
          .catch(error => {
            // Silent fail - no UI feedback
            console.error('Order creation error:', error);
          });
      }
    };

    initializeOrder();
  }, [toast]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Map area name to key
  const getAreaKey = (step: number): AreaKey | null => {
    switch (step) {
      case 2: return 'keller';
      case 3: return 'elektro';
      case 4: return 'heizung';
      case 5: return 'fassade';
      case 6: return 'dach';
      case 7: return 'innenraeume';
      default: return null;
    }
  };

  // Map area key to correct backend area name
  const getAreaNameForAPI = (areaKey: string): string => {
    const areaMap: Record<string, string> = {
      'keller': 'Keller',
      'elektro': 'Elektro',
      'heizung': 'Heizung',
      'fassade': 'Fassade',
      'dach': 'Dach',
      'innenraeume': 'Innenräume' // Special case: needs ä instead of ae
    };
    return areaMap[areaKey] || areaKey.charAt(0).toUpperCase() + areaKey.slice(1);
  };

  // Map backend area name to frontend area key
  const getAreaKeyFromAPI = (areaName: string): AreaKey | null => {
    const areaMap: Record<string, AreaKey> = {
      'Keller': 'keller',
      'Elektro': 'elektro',
      'Heizung': 'heizung',
      'Fassade': 'fassade',
      'Dach': 'dach',
      'Innenräume': 'innenraeume',
      'Innenraeume': 'innenraeume' // Fallback for old data
    };
    return areaMap[areaName] || null;
  };

const buildUploadsFromOrder = (uploads: any[], orderId: string | null): AreaUploadsState => {
  const state = createEmptyAreaUploads();
  if (!Array.isArray(uploads)) {
    return state;
  }

  uploads.forEach(upload => {
    const areaKey = getAreaKeyFromAPI(upload.area);
    if (!areaKey) return;

    const mimeType = upload.mime_type || 'image/jpeg';
    const isPdf = mimeType === 'application/pdf';
    const kind: 'image' | 'pdf' = isPdf ? 'pdf' : 'image';

    // Store upload ID for fetching presigned URL later
    // Don't set previewUrl/remoteUrl yet - will be fetched asynchronously
    const item: AreaUploadItem = {
      id: upload.id ? `${areaKey}-${upload.id}` : generateUploadId(areaKey),
      name: upload.file_path?.split('/').pop() || upload.area || 'Datei',
      size: upload.file_size || 0,
      mimeType: mimeType,
      kind: kind,
      previewUrl: '', // Will be set via presigned URL
      status: 'uploaded',
      remoteUrl: '', // Will be set via presigned URL
      uploadId: upload.id, // Store upload ID for fetching presigned URL
    };

    state[areaKey].push(item);
  });

  return state;
};

  // Load form data from backend order data
  const loadFormDataFromOrder = (order: any) => {
    const newFormData: FormData = {
      street: order.street || '',
      houseNumber: order.house_number || '',
      postalCode: order.postal_code || '',
      city: order.city || '',
      propertyType: order.property_type || '',
      buildYear: order.build_year || '',
      keller: createEmptyArea(),
      elektro: createEmptyArea(),
      heizung: createEmptyArea(),
      fassade: createEmptyArea(),
      dach: createEmptyArea(),
      innenraeume: createEmptyArea(),
      selectedProduct: '',
      selectedPackage: '',
    };

    // Load texts by area
    if (order.texts && Array.isArray(order.texts)) {
      order.texts.forEach((text: any) => {
        const areaKey = getAreaKeyFromAPI(text.area);
        if (areaKey && newFormData[areaKey]) {
          const areaData = newFormData[areaKey] as AreaContent;
          areaData.text = text.content || '';
        }
      });
    }

    setFormData(newFormData);
    const uploadsFromOrder = buildUploadsFromOrder(order.uploads || [], orderId);
    setAreaUploads(uploadsFromOrder);
    uploadFilesRef.current = {};
    itemAreaMapRef.current = {};
    // Reset fetched URLs ref so presigned URLs are fetched for newly loaded uploads
    fetchedUrlsRef.current = new Set();
  };

  // Save current step data before navigating
  const saveCurrentStepData = async (stepToSave: number) => {
    if (!orderId) {
      console.warn('Cannot save step data: no orderId');
      return;
    }

    // Step 1: Save basic info
    if (stepToSave === 1) {
      if (formData.street || formData.city) {
        await apiClient.updateOrder(orderId, {
          street: formData.street,
          houseNumber: formData.houseNumber,
          postalCode: formData.postalCode,
          city: formData.city,
          propertyType: formData.propertyType,
          buildYear: formData.buildYear,
        });
      }
      return;
    }

    // Steps 2-7: Handle area uploads and texts
    const areaKey = getAreaKey(stepToSave);
    if (!areaKey) return;

    const areaData = formData[areaKey] as AreaContent;
    const itemsForArea = areaUploads[areaKey] || [];
    
    // Queue ALL pending uploads in background - but delay to avoid blocking UI
    const pendingItems = itemsForArea.filter(item => item.status === 'local');
    if (pendingItems.length > 0) {
      // Uploads are now started immediately when files are selected
      // No need to trigger uploads here - they're already running in the background
    }

    // Save text if provided
    if (areaData.text.trim()) {
      const areaName = getAreaNameForAPI(areaKey);
      apiClient.saveTexts({
        orderId,
        area: areaName,
        content: areaData.text,
      }).catch(error => {
        console.error('Error saving text:', error);
        // Don't block navigation on text save error
      });
    }
  };

  const handleCheckout = async () => {
    if (!orderId || !formData.selectedProduct) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Bitte wählen Sie ein Produkt aus'
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await apiClient.createCheckoutSession(orderId);
      
      if (response.success && response.url) {
        // Store the checkout URL (for potential redirect back)
        localStorage.setItem('claverum_checkout_url', response.url);
        window.location.href = response.url;
      } else {
        // Check if it's a rate limit error
        if (response.error === 'rate_limit' || response.statusCode === 429) {
          const retryAfter = response.retryAfter || 60;
          toast({
            variant: 'destructive',
            title: 'Zu viele Anfragen',
            description: `Bitte warten Sie ${retryAfter} Sekunden, bevor Sie es erneut versuchen.`
          });
      } else {
        toast({
          variant: 'destructive',
          title: 'Fehler',
          description: response.error || 'Fehler beim Erstellen der Zahlung'
        });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Fehler beim Weiterleiten zur Zahlung'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = async () => {
    // If we're on step 1 and order is still being created, wait a bit (silent)
    if (currentStep === 1 && !orderId) {
      // Wait up to 2 seconds for order creation (silent)
      let waited = 0;
      while (!orderId && waited < 2000) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waited += 100;
      }
      
      // If still no order, try to create one silently before proceeding
      if (!orderId) {
        // Silent retry - no UI feedback
        apiClient.createOrder()
          .then(response => {
            if (response.success) {
              setOrderId(response.orderId);
              setCurrentOrder(response.orderId, response.sessionToken);
            }
          })
          .catch(() => {
            // Silent fail
          });
      }
    }

    if (!orderId && currentStep > 1) {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Kein aktiver Auftrag.',
      });
      return;
    }

    // Validate step 1
    if (currentStep === 1) {
      if (!formData.street || !formData.city || !formData.propertyType) {
        toast({
          variant: 'destructive',
          title: 'Fehlende Angaben',
          description: 'Bitte füllen Sie alle Pflichtfelder aus.',
        });
        return;
      }
    }

    // Save current step data in background (don't await - let it run async)
    // Pass currentStep before it changes
    const stepToSave = currentStep;
    saveCurrentStepData(stepToSave).catch(error => {
      console.error('Error saving step data:', error);
      // Don't show error toast - let user continue
    });

    // Navigate immediately (don't wait for uploads or API calls)
    if (currentStep < 8) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      saveCurrentStep(nextStepNum); // Persist current step between reloads
      
      // Show toast for background processing
      const areaKey = getAreaKey(stepToSave);
      if (areaKey) {
        const pendingItems =
          areaUploads[areaKey]?.filter(item => item.status === 'local' || item.status === 'uploading') || [];
        if (pendingItems.length > 0) {
          toast({
            title: 'Speichern läuft',
            description: 'Ihre Daten werden im Hintergrund gespeichert.',
          });
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      saveCurrentStep(prevStepNum); // Save step to sessionStorage
    }
  };

  const progress = (currentStep / 8) * 100;

  const propertyTypes = [
    'Eigentumswohnung',
    'Einfamilienhaus',
    'Zweifamilienhaus',
    'Mehrfamilienhaus',
    'Reihenhaus',
    'Doppelhaushälfte',
    'Gewerbeobjekt',
    'Sonstiges'
  ];

  const products = [
    {
      id: 'all-in-one',
      name: 'All-in-one',
      description: 'Fachgerechte Prüfung und Bewertung für verlässliche Entscheidungen',
      price: '350',
      features: [
        'Alle Basisleistungen',
        'Prüfung durch erfahrene Sachverständige',
        'Klare Handlungsempfehlungen',
        'Kostenschätzung für Reparaturen',
        'Priorisierung nach Dringlichkeit',
        'Bewertungsbericht (14–16 Seiten)',
        'Ergebnis innerhalb 48 Stunden',
        'Telefonischer Support'
      ]
    }
  ];

  // Auto-select product when entering step 8
  useEffect(() => {
    if (currentStep === 8 && !formData.selectedProduct && products.length > 0) {
      updateFormData('selectedProduct', products[0].id);
    }
  }, [currentStep, formData.selectedProduct]);

  return (
    <>
      <div className="max-w-6xl mx-auto p-6" id="bewertung-starten">
        <Card className="shadow-strong">
        {/* Header */}
        {(
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-text-100">
                Bauschadensbewertung starten
              </CardTitle>
              <div className="mt-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-text-200 mt-2">Schritt {currentStep} von 8</p>
              </div>
              {orderId && (
                <p className="text-xs text-muted-foreground mt-2">
                  Auftrag: {orderId.slice(0, 8)}...
                </p>
              )}
            </CardHeader>
          )}
        
        <CardContent className="space-y-6">
          {/* Step 1: Objekt-Basics */}
          {currentStep === 1 && (
            <div className="form-step form-step-active">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Objekt-Grunddaten</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street">Straße, Hausnummer *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-text-200" />
                    <Input
                      id="street"
                      placeholder="Musterstraße 123"
                      value={formData.street || ''}
                      onChange={(e) => {
                        updateFormData('street', e.target.value);
                      }}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="postalCode">PLZ, Ort *</Label>
                  <Input
                    id="postalCode"
                    placeholder="12345 Musterstadt"
                    value={formData.city || ''}
                    onChange={(e) => {
                      updateFormData('city', e.target.value);
                    }}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="propertyType">Art des Objektes *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => updateFormData('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Objektart wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="buildYear">Baujahr *</Label>
                    <Input
                      id="buildYear"
                      type="number"
                      min="1850"
                      max={new Date().getFullYear()}
                    placeholder="z.B. 1995"
                      value={formData.buildYear}
                      onChange={(e) => updateFormData('buildYear', e.target.value)}
                      required
                    />
                  <p className="text-xs text-text-200 mt-1">
                    Baujahr schätzen? Lassen Sie "unbekannt" und wir erkennen es aus Dokumenten.
                  </p>
                </div>
              </div>
            </div>
          )}

                  {/* Step 2: Keller */}
          {currentStep === 2 && (
            <AreaUpload
              areaName="Keller + Grundrisse"
              areaDescription="Dokumentieren Sie den Kellerbereich mit Fotos und laden Sie ergänzend Grundrisse hoch."
              items={areaUploads.keller}
              text={formData.keller.text}
              onFilesSelected={(files) => handleAreaFilesSelected('keller', files)}
              onRemoveItem={(id) => handleRemoveItem('keller', id)}
              onTextChange={(text) =>
                setFormData(prev => ({
                  ...prev,
                  keller: { ...prev.keller, text },
                }))
              }
              allowPdf
              maxPhotos={MAX_FILES_PER_AREA}
              maxWords={200}
              textPlaceholder="Wenn möglich, bitte geben Sie an, in welchem Jahr der Keller saniert wurde und erläutern sie weitere relevante Punkte."
            />
          )}

          {/* Step 3: Elektro */}
          {currentStep === 3 && (
            <AreaUpload
              areaName="Elektro"
              areaDescription="Dokumentieren Sie die Elektroinstallation mit Fotos"
              items={areaUploads.elektro}
              text={formData.elektro.text}
              onFilesSelected={(files) => handleAreaFilesSelected('elektro', files)}
              onRemoveItem={(id) => handleRemoveItem('elektro', id)}
              onTextChange={(text) =>
                setFormData(prev => ({
                  ...prev,
                  elektro: { ...prev.elektro, text },
                }))
              }
              maxPhotos={MAX_FILES_PER_AREA}
              maxWords={200}
              textPlaceholder="Wenn möglich, bitte geben Sie an, in welchem Jahr die Elektrik erneuert wurde und erläutern sie weitere relevante Punkte."
            />
          )}

          {/* Step 4: Heizung */}
          {currentStep === 4 && (
            <AreaUpload
              areaName="Heizung + Energieausweis"
              areaDescription="Dokumentieren Sie die Heizungsanlage mit Fotos und laden Sie ergänzend den Energieausweis hoch."
              items={areaUploads.heizung}
              text={formData.heizung.text}
              onFilesSelected={(files) => handleAreaFilesSelected('heizung', files)}
              onRemoveItem={(id) => handleRemoveItem('heizung', id)}
              onTextChange={(text) =>
                setFormData(prev => ({
                  ...prev,
                  heizung: { ...prev.heizung, text },
                }))
              }
              allowPdf
              maxPhotos={MAX_FILES_PER_AREA}
              maxWords={200}
              textPlaceholder="Wenn möglich, bitte geben Sie an, in welchem Jahr die Heizung erneuert wurde und erläutern sie weitere relevante Punkte."
            />
          )}

          {/* Step 5: Fassade */}
          {currentStep === 5 && (
            <AreaUpload
              areaName="Fassade"
              areaDescription="Dokumentieren Sie die Fassade mit Fotos"
              items={areaUploads.fassade}
              text={formData.fassade.text}
              onFilesSelected={(files) => handleAreaFilesSelected('fassade', files)}
              onRemoveItem={(id) => handleRemoveItem('fassade', id)}
              onTextChange={(text) =>
                setFormData(prev => ({
                  ...prev,
                  fassade: { ...prev.fassade, text },
                }))
              }
              maxPhotos={MAX_FILES_PER_AREA}
              maxWords={200}
              textPlaceholder="Wenn möglich, bitte geben Sie an, in welchem Jahr die Fassade saniert und ggf. gedämmt wurde und erläutern sie weitere relevante Punkte."
            />
          )}

          {/* Step 6: Dach */}
          {currentStep === 6 && (
            <AreaUpload
              areaName="Dach"
              areaDescription="Dokumentieren Sie das Dach mit Fotos"
              items={areaUploads.dach}
              text={formData.dach.text}
              onFilesSelected={(files) => handleAreaFilesSelected('dach', files)}
              onRemoveItem={(id) => handleRemoveItem('dach', id)}
              onTextChange={(text) =>
                setFormData(prev => ({
                  ...prev,
                  dach: { ...prev.dach, text },
                }))
              }
              maxPhotos={MAX_FILES_PER_AREA}
              maxWords={200}
              textPlaceholder="Wenn möglich, bitte geben Sie an, in welchem Jahr das Dach saniert wurde und erläutern sie weitere relevante Punkte."
            />
          )}

          {/* Step 7: Innenräume */}
          {currentStep === 7 && (
            <AreaUpload
              areaName="Innenräume + Bäder"
              areaDescription="Dokumentieren Sie die Innenräume und Bäder mit Fotos"
              items={areaUploads.innenraeume}
              text={formData.innenraeume.text}
              onFilesSelected={(files) => handleAreaFilesSelected('innenraeume', files)}
              onRemoveItem={(id) => handleRemoveItem('innenraeume', id)}
              onTextChange={(text) =>
                setFormData(prev => ({
                  ...prev,
                  innenraeume: { ...prev.innenraeume, text },
                }))
              }
              maxPhotos={MAX_FILES_PER_AREA}
              maxWords={200}
              textPlaceholder="Wenn möglich, bitte geben Sie an, in welchem Jahr ca. Sanierungen der Innenräume und Bäder stattgefunden haben und erläutern sie weitere relevante Punkte."
            />
          )}

          {/* Step 8: Produkt & Checkout */}
          {currentStep === 8 && (
            <div className="form-step form-step-active">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Ihr Paket</h3>
              </div>
              
              <div className="flex justify-center">
                <div className="max-w-2xl w-full">
                  {products.map((product) => (
                    <Card 
                      key={product.id} 
                      className="relative border-2 border-primary shadow-lg hover-lift transition-smooth"
                    >
                      <CardHeader className="text-center pb-4">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                          <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                            Ausgewählt
                          </span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-text-100 mb-4">
                          {product.name}
                        </CardTitle>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-primary">{product.price}€</span>
                          <span className="text-text-200 text-sm ml-1">inkl. MwSt.</span>
                        </div>
                        <p className="text-text-200 text-sm max-w-xl mx-auto">
                          {product.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <ul className="space-y-3 mb-6">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-text-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

        </CardContent>

        {/* Navigation Buttons */}
        {(
          <div className="flex justify-between p-6">
            {currentStep > 1 && (
            <Button
              onClick={prevStep}
                disabled={isSaving}
                className="flex items-center gap-2 border border-primary text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>
            )}
            {currentStep === 1 && <div />}
            
            {currentStep === 8 ? (
              <Button
                onClick={handleCheckout}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Weiterleitet...
                  </>
                ) : (
                  <>
                    Zur Zahlung
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={currentStep === 8 || isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Speichert...
                  </>
                ) : (
                  <>
                    Weiter
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
      
      {/* Upload Status Indicator */}
      <UploadStatus />
    </>
  );
};

export default MultiStepForm;
