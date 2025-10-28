import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { MapPin, Home, Camera, ChevronLeft, ChevronRight, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AreaUpload from '@/components/AreaUpload';
import UploadStatus from '@/components/UploadStatus';
import { apiClient } from '@/utils/apiClient';
import { uploadQueue } from '@/utils/uploadQueue';
import { getCurrentOrderId, setCurrentOrder, hasActiveOrder } from '@/utils/orderManager';

interface FormData {
  // Step 1: Objekt-Basics
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  propertyType: string;
  buildYear: string;
  
  // Steps 2-7: Building Areas
  keller: { photos: string[]; files: File[]; text: string; };
  elektro: { photos: string[]; files: File[]; text: string; };
  heizung: { photos: string[]; files: File[]; text: string; };
  fassade: { photos: string[]; files: File[]; text: string; };
  dach: { photos: string[]; files: File[]; text: string; };
  innenraeume: { photos: string[]; files: File[]; text: string; };

  // Step 8: Produkt & Checkout
  selectedProduct: string;
  selectedPackage: string;
}

const MultiStepForm: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    propertyType: '',
    buildYear: '',
    keller: { photos: [], files: [], text: '' },
    elektro: { photos: [], files: [], text: '' },
    heizung: { photos: [], files: [], text: '' },
    fassade: { photos: [], files: [], text: '' },
    dach: { photos: [], files: [], text: '' },
    innenraeume: { photos: [], files: [], text: '' },
    selectedProduct: '',
    selectedPackage: '',
  });

  // Initialize order on component mount
  useEffect(() => {
    const initializeOrder = async () => {
      // Check if order already exists in session
      const existingOrderId = getCurrentOrderId();
      
      if (existingOrderId) {
        console.log('Using existing order:', existingOrderId);
        setOrderId(existingOrderId);
      } else {
        // Create new order
        console.log('Creating new order...');
        const response = await apiClient.createOrder();
        
        if (response.success) {
          console.log('Order created:', response.orderId);
          setOrderId(response.orderId);
          setCurrentOrder(response.orderId, response.sessionToken);
        } else {
          toast({
            variant: 'destructive',
            title: 'Fehler',
            description: response.error || 'Fehler beim Erstellen des Auftrags'
          });
        }
      }
      
      setIsInitializing(false);
    };

    initializeOrder();
  }, [toast]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Map area name to key
  const getAreaKey = (step: number): keyof FormData | null => {
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

  // Save current step data before navigating
  const saveCurrentStepData = async () => {
    if (!orderId) return;

    // Step 1: Save basic info
    if (currentStep === 1) {
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
    const areaKey = getAreaKey(currentStep);
    if (!areaKey) return;

    const areaData = formData[areaKey] as { photos: string[]; files: File[]; text: string; };
    
    // Queue uploads in background
    if (areaData.files.length > 0) {
      const areaName = areaKey.charAt(0).toUpperCase() + areaKey.slice(1);
      uploadQueue.addMultipleUploads(orderId, areaName, areaData.files);
    }

    // Save text if provided
    if (areaData.text.trim()) {
      const areaName = areaKey.charAt(0).toUpperCase() + areaKey.slice(1);
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

    try {
      const response = await apiClient.createCheckoutSession(orderId);
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        toast({
          variant: 'destructive',
          title: 'Fehler',
          description: response.error || 'Fehler beim Erstellen der Zahlung'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: 'Fehler beim Weiterleiten zur Zahlung'
      });
    }
  };

  const nextStep = async () => {
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
      if (!formData.street || !formData.city || !formData.propertyType || !formData.buildYear) {
        toast({
          variant: 'destructive',
          title: 'Fehlende Angaben',
          description: 'Bitte füllen Sie alle Pflichtfelder aus.',
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      // Save current step data in background
      await saveCurrentStepData();

      // Navigate immediately (don't wait for uploads)
      if (currentStep < 8) {
        setCurrentStep(prev => prev + 1);
        
        // Show toast for background processing
        const areaKey = getAreaKey(currentStep);
        if (areaKey) {
          const areaData = formData[areaKey] as { files: File[] };
          if (areaData.files.length > 0) {
            toast({
              title: 'Speichern läuft',
              description: 'Ihre Daten werden im Hintergrund gespeichert.',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error saving step:', error);
      toast({
        variant: 'destructive',
        title: 'Speicherfehler',
        description: 'Daten konnten nicht gespeichert werden.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
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
    'Bungalow',
    'Sonstiges'
  ];

  const products = [
    {
      id: 'basic',
      name: 'Basis-Bewertung',
      description: 'Grundlegende Bauschadensbewertung',
      price: '299',
      features: ['Visuelle Inspektion', 'Schadensdokumentation', 'Bewertungsbericht']
    },
    {
      id: 'premium',
      name: 'Premium-Bewertung',
      description: 'Umfassende Bauschadensbewertung mit Empfehlungen',
      price: '499',
      features: ['Detaillierte Analyse', 'Sanierungsempfehlungen', 'Kostenschätzung', 'Prioritätenliste']
    }
  ];


  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Initialisiere Auftrag...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6" id="bewertung-starten">
        <Card className="shadow-strong">
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
                      areaName="Keller"
                      areaDescription="Dokumentieren Sie den Kellerbereich mit Fotos"
                      photos={formData.keller.photos}
                      files={formData.keller.files}
                      text={formData.keller.text}
                      onPhotosChange={(photos) => setFormData(prev => ({ 
                        ...prev, 
                        keller: { ...prev.keller, photos } 
                      }))}
                      onFilesChange={(files) => setFormData(prev => ({ 
                        ...prev, 
                        keller: { ...prev.keller, files } 
                      }))}
                      onTextChange={(text) => setFormData(prev => ({ 
                        ...prev, 
                        keller: { ...prev.keller, text } 
                      }))}
                      maxPhotos={20}
                      maxWords={200}
                    />
                  )}

          {/* Step 3: Elektro */}
          {currentStep === 3 && (
            <AreaUpload
              areaName="Elektro"
              areaDescription="Dokumentieren Sie die Elektroinstallation mit Fotos"
              photos={formData.elektro.photos}
              files={formData.elektro.files}
              text={formData.elektro.text}
              onPhotosChange={(photos) => setFormData(prev => ({ 
                ...prev, 
                elektro: { ...prev.elektro, photos } 
              }))}
              onFilesChange={(files) => setFormData(prev => ({ 
                ...prev, 
                elektro: { ...prev.elektro, files } 
              }))}
              onTextChange={(text) => setFormData(prev => ({ 
                ...prev, 
                elektro: { ...prev.elektro, text } 
              }))}
              maxPhotos={20}
              maxWords={200}
            />
          )}

          {/* Step 4: Heizung */}
          {currentStep === 4 && (
            <AreaUpload
              areaName="Heizung"
              areaDescription="Dokumentieren Sie die Heizungsanlage mit Fotos"
              photos={formData.heizung.photos}
              files={formData.heizung.files}
              text={formData.heizung.text}
              onPhotosChange={(photos) => setFormData(prev => ({ 
                ...prev, 
                heizung: { ...prev.heizung, photos } 
              }))}
              onFilesChange={(files) => setFormData(prev => ({ 
                ...prev, 
                heizung: { ...prev.heizung, files } 
              }))}
              onTextChange={(text) => setFormData(prev => ({ 
                ...prev, 
                heizung: { ...prev.heizung, text } 
              }))}
              maxPhotos={20}
              maxWords={200}
            />
          )}

          {/* Step 5: Fassade */}
          {currentStep === 5 && (
            <AreaUpload
              areaName="Fassade"
              areaDescription="Dokumentieren Sie die Fassade mit Fotos"
              photos={formData.fassade.photos}
              files={formData.fassade.files}
              text={formData.fassade.text}
              onPhotosChange={(photos) => setFormData(prev => ({ 
                ...prev, 
                fassade: { ...prev.fassade, photos } 
              }))}
              onFilesChange={(files) => setFormData(prev => ({ 
                ...prev, 
                fassade: { ...prev.fassade, files } 
              }))}
              onTextChange={(text) => setFormData(prev => ({ 
                ...prev, 
                fassade: { ...prev.fassade, text } 
              }))}
              maxPhotos={20}
              maxWords={200}
            />
          )}

          {/* Step 6: Dach */}
          {currentStep === 6 && (
            <AreaUpload
              areaName="Dach"
              areaDescription="Dokumentieren Sie das Dach mit Fotos"
              photos={formData.dach.photos}
              files={formData.dach.files}
              text={formData.dach.text}
              onPhotosChange={(photos) => setFormData(prev => ({ 
                ...prev, 
                dach: { ...prev.dach, photos } 
              }))}
              onFilesChange={(files) => setFormData(prev => ({ 
                ...prev, 
                dach: { ...prev.dach, files } 
              }))}
              onTextChange={(text) => setFormData(prev => ({ 
                ...prev, 
                dach: { ...prev.dach, text } 
              }))}
              maxPhotos={20}
              maxWords={200}
            />
          )}

          {/* Step 7: Innenräume */}
          {currentStep === 7 && (
            <AreaUpload
              areaName="Innenräume"
              areaDescription="Dokumentieren Sie die Innenräume mit Fotos"
              photos={formData.innenraeume.photos}
              files={formData.innenraeume.files}
              text={formData.innenraeume.text}
              onPhotosChange={(photos) => setFormData(prev => ({ 
                ...prev, 
                innenraeume: { ...prev.innenraeume, photos } 
              }))}
              onFilesChange={(files) => setFormData(prev => ({ 
                ...prev, 
                innenraeume: { ...prev.innenraeume, files } 
              }))}
              onTextChange={(text) => setFormData(prev => ({ 
                ...prev, 
                innenraeume: { ...prev.innenraeume, text } 
              }))}
              maxPhotos={20}
              maxWords={200}
            />
          )}

          {/* Step 8: Produkt & Checkout */}
          {currentStep === 8 && (
            <div className="form-step form-step-active">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Produktauswahl</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <span className="text-lg font-bold text-primary">{product.price}€</span>
                      </div>
                      <p className="text-sm text-text-200 mb-3">{product.description}</p>
                      <ul className="text-sm text-text-200 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {feature}
                          </li>
                                ))}
                              </ul>
                      <Button
                        className={`w-full mt-4 ${formData.selectedProduct === product.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}
                        onClick={() => updateFormData('selectedProduct', product.id)}
                      >
                        {formData.selectedProduct === product.id ? 'Ausgewählt' : 'Auswählen'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="flex justify-between p-6">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1 || isSaving}
            className="flex items-center gap-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>
            
            {currentStep === 8 ? (
              <Button
                onClick={handleCheckout}
                disabled={!formData.selectedProduct || isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Weiterleitet...
                  </>
                ) : (
                  <>
                    Weiter zur Zahlung
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
      </Card>
    </div>
      
      {/* Upload Status Indicator */}
      <UploadStatus />
    </>
  );
};

export default MultiStepForm;