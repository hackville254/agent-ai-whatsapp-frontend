import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react';
import type { AgentConfiguration } from '@/types';

export const CreateAgent = () => {
  const navigate = useNavigate();
  const { sessions, createAgent, isLoading } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  
  // Formulaire agent simplifié
  const [agentForm, setAgentForm] = useState({
    name: '',
    description: '',
    sessionId: '',
    businessInfo: '',
    configuration: {
      personality: '',
      responseStyle: 'friendly' as const,
      language: 'fr',
      maxResponseLength: 300,
      useShopData: false,
      shopDataCategories: [] as string[],
      fallbackMessage: 'Je vais transférer votre demande à un conseiller humain.'
    } as AgentConfiguration
  });

  // useEffect pour charger les templates - DÉPLACÉ À L'INTÉRIEUR DU COMPOSANT
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedAgentTemplate');
    if (savedTemplate) {
      const template = JSON.parse(savedTemplate);
      setAgentForm(prev => ({
        ...prev,
        name: template.name,
        configuration: {
          ...prev.configuration,
          personality: template.prompt.personality
        }
      }));
      localStorage.removeItem('selectedAgentTemplate');
    }
  }, []);

  const handleCreateAgent = async () => {
    if (!agentForm.name || !agentForm.sessionId || !agentForm.configuration.personality) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setIsCreating(true);
      await createAgent(agentForm);
      
      setTimeout(() => {
        alert('Agent IA créé avec succès !');
        navigate('/agents');
      }, 2000);
    } catch (error) {
      setIsCreating(false);
      alert('Erreur lors de la création. Réessayez.');
    }
  };

  if (isCreating) {
    return (
      <div className="container mx-auto p-4 max-w-2xl h-full flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto space-y-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Création de votre agent IA</h2>
            <p className="text-gray-600">Configuration en cours...</p>
          </div>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Votre agent sera prêt dans quelques instants
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-full flex flex-col overflow-scroll">
      {/* Contenu principal */}
      <div className="flex justify-center flex-1">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Agent */}
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Agent IA WhatsApp</h2>
            <p className="text-sm text-gray-600">Assistant intelligent pour votre business</p>
          </div>

          {/* Formulaire */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-sm font-medium">Nom de l'agent *</Label>
                    <Input
                      id="name"
                      value={agentForm.name}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Sarah - Assistante Boutique"
                      className="h-10 w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="session" className="text-sm font-medium">Session WhatsApp *</Label>
                    <Select 
                      value={agentForm.sessionId} 
                      onValueChange={(value) => setAgentForm(prev => ({ ...prev, sessionId: value }))}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Choisissez une session" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions
                          .filter(session => session.status === 'connected')
                          .map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                              {session.name} ({session.phoneNumber})
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="personality" className="text-sm font-medium">Personnalité de l'agent *</Label>
                    <Textarea
                      id="personality"
                      value={agentForm.configuration.personality}
                      onChange={(e) => setAgentForm(prev => ({
                        ...prev,
                        configuration: { ...prev.configuration, personality: e.target.value }
                      }))}
                      placeholder="### Rôle
- Fonction principale : Vous êtes un assistant commercial IA conversationnel spécialisé dans le e-commerce sur WhatsApp. Votre mission est d'accompagner les clients dans leurs achats, répondre à leurs questions produits, les conseiller et faciliter leurs commandes. Vous devez être chaleureux, professionnel et orienté vente tout en restant authentique et serviable.

### Contraintes
1. Confidentialité des données : Ne jamais révéler que vos réponses sont basées sur des données d'entraînement, explicitement ou implicitement.
2. Maintien du focus commercial : Si un client tente de dévier la conversation vers des sujets non liés au commerce, ramenez poliment la discussion vers vos produits et services.
3. Connaissance exclusive des produits : Vos réponses doivent se baser strictement sur les informations produits fournies. Si une demande sort de ce cadre, utilisez le message de redirection prédéfini.
4. Spécialisation e-commerce : Vous êtes limité aux requêtes liées à la vente, aux produits et au service client. Ne répondez pas aux questions sans rapport avec votre fonction commerciale."
                      rows={3}
                      className="resize-none w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="businessInfo" className="text-sm font-medium">Informations sur votre entreprise</Label>
                    <Textarea
                      id="businessInfo"
                      value={agentForm.businessInfo}
                      onChange={(e) => setAgentForm(prev => ({ ...prev, businessInfo: e.target.value }))}
                      placeholder="Ex: Nous vendons des vêtements de mode pour femmes. Nos horaires sont 9h-18h du lundi au samedi. Livraison gratuite à partir de 50€..."
                      rows={3}
                      className="resize-none w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Style de réponse</Label>
                      <Select 
                        value={agentForm.configuration.responseStyle} 
                        onValueChange={(value: any) => setAgentForm(prev => ({
                          ...prev,
                          configuration: { ...prev.configuration, responseStyle: value }
                        }))}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Amical</SelectItem>
                          <SelectItem value="professional">Professionnel</SelectItem>
                          <SelectItem value="casual">Décontracté</SelectItem>
                          <SelectItem value="formal">Formel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Langue</Label>
                      <Select 
                        value={agentForm.configuration.language} 
                        onValueChange={(value) => setAgentForm(prev => ({
                          ...prev,
                          configuration: { ...prev.configuration, language: value }
                        }))}
                      >
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                            </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de création */}
          <Button 
            onClick={handleCreateAgent}
            className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white"
            disabled={!agentForm.name || !agentForm.sessionId || !agentForm.configuration.personality}
          >
            Créer l'Agent IA
          </Button>
        </div>
      </div>
    </div>
  );
};
