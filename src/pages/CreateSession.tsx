import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  QrCode, 
  ArrowLeft,
  MessageSquare,
  Copy,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface PairCodeResponse {
  code: number;
  data: {
    details: string;
    events: string;
    jid: string;
    pairCode: string;
    webhook: string;
  };
  success: boolean;
}

export const CreateSession = () => {
  const navigate = useNavigate();
  const { createSession, isLoading } = useApp();
  const [sessionName, setSessionName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeTab, setActiveTab] = useState('qr');
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [isWaitingQR, setIsWaitingQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateWithPhone = async () => {
    if (!sessionName.trim()) {
      alert('Veuillez saisir un nom pour la session');
      return;
    }
    if (!phoneNumber.trim()) {
      alert('Veuillez saisir un numéro de téléphone');
      return;
    }
    
    try {
      // Simulation de l'appel API qui retourne le code de pairage
      const response: PairCodeResponse = {
        code: 200,
        data: {
          details: "Connected!",
          events: "All",
          jid: "",
          pairCode: "TFFH-8DQ3",
          webhook: ""
        },
        success: true
      };
      
      if (response.success && response.data.pairCode) {
        setPairCode(response.data.pairCode);
      }
    } catch (error) {
      alert('Erreur lors de la création. Réessayez.');
    }
  };

  const handleCreateWithQR = async () => {
    if (!sessionName.trim()) {
      alert('Veuillez saisir un nom pour la session');
      return;
    }
    
    try {
      setIsWaitingQR(true);
      await createSession(sessionName, 'QR_CODE_METHOD');
      // Simulation d'attente du scan
      setTimeout(() => {
        alert('QR Code scanné avec succès !');
        navigate('/sessions');
      }, 10000); // 10 secondes pour la démo
    } catch (error) {
      setIsWaitingQR(false);
      alert('Erreur lors de la création. Réessayez.');
    }
  };

  const copyPairCode = () => {
    if (pairCode) {
      navigator.clipboard.writeText(pairCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const confirmPairCode = () => {
    alert('Session créée avec succès !');
    navigate('/sessions');
  };

  return (
    <div className="container mx-auto max-w-2xl h-screen flex flex-col overflow-y-auto">
      {/* Contenu principal */}
      <div className="flex justify-center flex-1 overflow-hidden">
        <div className="w-full max-w-md space-y-4">
          {/* Logo WhatsApp */}
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">WhatsApp Business</h2>
            <p className="text-sm text-gray-600">Connectez votre compte</p>
          </div>

          {/* Formulaire */}
          <Card className="shadow-lg">
            <CardContent className="p-4 space-y-4">
              {/* Nom de la session */}
              <div className="space-y-1">
                <Label htmlFor="sessionName" className="text-sm">Nom de la session</Label>
                <Input
                  id="sessionName"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Ex: Mon Business"
                  className="h-10"
                  disabled={pairCode !== null || isWaitingQR}
                />
              </div>

              {/* Méthodes de connexion */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="qr" disabled={pairCode !== null}>
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </TabsTrigger>
                  <TabsTrigger value="phone" disabled={isWaitingQR}>
                    <Phone className="w-4 h-4 mr-2" />
                    Numéro
                  </TabsTrigger>
                </TabsList>

                {/* QR Code */}
                <TabsContent value="qr" className="space-y-3 mt-4">
                  {!isWaitingQR ? (
                    <>
                      <div className="text-center space-y-3">
                        <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mx-auto">
                          <QrCode className="w-16 h-16 text-gray-400" />
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="font-medium">1. Ouvrez WhatsApp sur votre téléphone</p>
                          <p className="text-gray-600">2. Menu → Appareils liés → Scannez ce code</p>
                        </div>
                      </div>

                      <Button 
                        onClick={handleCreateWithQR}
                        disabled={isLoading || !sessionName}
                        className="w-full h-10 bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? 'Génération...' : 'Générer QR Code'}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-32 h-32 bg-white border-2 border-green-200 rounded-lg flex items-center justify-center mx-auto">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                      </div>
                      <Alert className="py-2">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          En attente du scan du QR code...
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </TabsContent>

                {/* Numéro de téléphone */}
                <TabsContent value="phone" className="space-y-3 mt-4">
                  {!pairCode ? (
                    <>
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <Phone className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Connexion par code de pairage</p>
                          <p className="text-xs text-gray-600">Un code sera généré pour votre numéro</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-sm">Numéro de téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="h-10 text-center"
                        />
                      </div>

                      <Button 
                        onClick={handleCreateWithPhone}
                        disabled={isLoading || !sessionName || !phoneNumber}
                        className="w-full h-10 bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? 'Génération...' : 'Générer le code'}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      
                      <Alert className="py-2">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Code de pairage généré avec succès !
                        </AlertDescription>
                      </Alert>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Votre code de pairage :</p>
                        <div className="flex items-center justify-center space-x-2">
                          <code className="text-xl font-mono font-bold text-green-600 bg-white px-3 py-1 rounded border">
                            {pairCode}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyPairCode}
                          >
                            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="text-left space-y-1 text-xs text-gray-600">
                        <p className="font-medium">Instructions :</p>
                        <p>1. WhatsApp → Paramètres → Appareils liés</p>
                        <p>2. "Lier un appareil" → Saisissez : <strong>{pairCode}</strong></p>
                      </div>

                      <Button 
                        onClick={confirmPairCode}
                        className="w-full h-10 bg-green-600 hover:bg-green-700"
                      >
                        Confirmer la connexion
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Vos messages personnels sont chiffrés de bout en bout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};