import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Upload, Clock, Phone } from 'lucide-react';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const orderNumber = 'BC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const expectedDelivery = new Date();
  expectedDelivery.setDate(expectedDelivery.getDate() + 1);

  return (
    <>
      <SEO 
        title="Auftrag erfolgreich übermittelt" 
        description="Ihr Auftrag wurde erfolgreich übermittelt. Wir beginnen sofort mit der Analyse Ihres Objekts."
        canonical="/success"
        noindex={true}
      />
      <div className="min-h-screen bg-bg-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-strong">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-brand-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-100 mb-2">
              Auftrag erfolgreich übermittelt!
            </h1>
            <p className="text-text-200">
              Vielen Dank für Ihr Vertrauen. Wir beginnen sofort mit der Analyse Ihres Objekts.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Order Details */}
            <div className="bg-bg-200 rounded-lg p-4">
              <h3 className="font-semibold text-text-100 mb-3">Auftragsdaten</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-200">Bestellnummer:</span>
                  <span className="font-mono font-medium ml-2">{orderNumber}</span>
                </div>
                <div>
                  <span className="text-text-200">Voraussichtliche Lieferung:</span>
                  <span className="font-medium ml-2 text-primary">
                    {expectedDelivery.toLocaleDateString('de-DE', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold text-text-100 mb-4">Wie es weitergeht:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-100">Bestätigungs-E-Mail</h4>
                    <p className="text-sm text-text-200">
                      Sie erhalten in wenigen Minuten eine Bestätigung mit allen Details per E-Mail.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-100">Dokumente nachreichen</h4>
                    <p className="text-sm text-text-200">
                      Falls Sie weitere Fotos oder Dokumente haben, können Sie diese noch bis zu 24 Stunden nachreichen.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-100">Analyse & Bewertung</h4>
                    <p className="text-sm text-text-200">
                      Unsere Experten analysieren Ihr Objekt. Sie erhalten das Ergebnis innerhalb von 48 Stunden.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-brand-100 rounded-lg p-4">
              <h3 className="font-semibold text-text-100 mb-3">💡 Tipps für bessere Ergebnisse</h3>
              <ul className="text-sm text-text-200 space-y-2">
                <li>• Reichen Sie fehlende Kellerfotos oder Außenaufnahmen nach</li>
                <li>• Bei Fragen stehen wir Ihnen jederzeit zur Verfügung</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center pt-4 border-t">
              <h3 className="font-semibold text-text-100 mb-3">Fragen zu Ihrem Auftrag?</h3>
              <div className="flex justify-center gap-4">
                <a 
                  href="mailto:kontakt@bauklar.org" 
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  kontakt@bauklar.org
                </a>
                <a 
                  href="tel:015143170757" 
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  015143170757
                </a>
              </div>
              <p className="text-xs text-text-200 mt-2">
                Montag bis Freitag, 9:00 - 18:00 Uhr
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Zur Startseite
              </Button>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => navigate('/evaluation')}
              >
                Weitere Dokumente hochladen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Success;