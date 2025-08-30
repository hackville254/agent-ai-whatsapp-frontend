import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Bot, 
  Trash2, 
  Edit, 
  Play, 
  Pause,
  Settings,
  MessageSquare,
  Activity
} from 'lucide-react';
import type { Agent, AgentConfiguration } from '@/types';

/**
 * Page de gestion des agents IA
 * Permet de créer, configurer et gérer les agents WhatsApp
 */
export const Agents = () => {
  const navigate = useNavigate();
  const { agents, sessions, createAgent, updateAgent, deleteAgent, isLoading } = useApp();
  
  // États pour la gestion des dialogues et formulaires
  const [editAgentDialog, setEditAgentDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  // États pour le formulaire d'édition d'agent
  const [agentForm, setAgentForm] = useState({
    name: '',
    description: '',
    sessionId: '',
    status: 'active' as const,
    lastActivity: new Date(),
    configuration: {
      personality: '',
      responseStyle: 'friendly' as const,
      language: 'fr',
      maxResponseLength: 500,
      useShopData: false,
      shopDataCategories: [] as string[],
      fallbackMessage: 'Je vais transférer votre demande à un conseiller humain.'
    } as AgentConfiguration
  });

  /**
   * Réinitialise le formulaire d'agent
   */
  const resetForm = () => {
    setAgentForm({
      name: '',
      description: '',
      sessionId: '',
      status: 'active',
      lastActivity: new Date(),
      configuration: {
        personality: '',
        responseStyle: 'friendly',
        language: 'fr',
        maxResponseLength: 500,
        useShopData: false,
        shopDataCategories: [],
        fallbackMessage: 'Je vais transférer votre demande à un conseiller humain.'
      }
    });
  };

  /**
   * Ouvre le dialogue d'édition avec les données de l'agent sélectionné
   */
  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setAgentForm({
      name: agent.name,
      description: agent.description,
      sessionId: agent.sessionId,
      status: agent.status,
      lastActivity: agent.lastActivity,
      configuration: agent.configuration
    });
    setEditAgentDialog(true);
  };

  /**
   * Sauvegarde les modifications de l'agent
   */
  const handleUpdateAgent = async () => {
    if (selectedAgent) {
      await updateAgent(selectedAgent.id, {
        name: agentForm.name,
        description: agentForm.description,
        configuration: agentForm.configuration
      });
      setEditAgentDialog(false);
      setSelectedAgent(null);
      resetForm();
    }
  };

  /**
   * Bascule le statut actif/inactif d'un agent
   */
  const toggleAgentStatus = async (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    await updateAgent(agent.id, { status: newStatus });
  };

  /**
   * Configuration du statut avec design minimaliste
   */
  const getStatusConfig = (status: Agent['status']) => {
    const configs = {
      active: { 
        badge: 'bg-gray-900 text-white', 
        text: 'Actif',
        dot: 'bg-gray-900'
      },
      inactive: { 
        badge: 'bg-gray-100 text-gray-700 border border-gray-300', 
        text: 'Inactif',
        dot: 'bg-gray-400'
      },
      training: { 
        badge: 'bg-gray-100 text-gray-700 border border-gray-300', 
        text: 'Formation',
        dot: 'bg-gray-600'
      }
    };
    return configs[status];
  };

  /**
   * Trouve le nom de la session associée à un agent
   */
  const getSessionName = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    return session ? session.name : 'Session inconnue';
  };

  /**
   * Formulaire de configuration d'agent (pour édition uniquement)
   */
  const AgentForm = () => (
    <div className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-900">Nom de l'agent</Label>
          <Input
            id="name"
            value={agentForm.name}
            onChange={(e) => setAgentForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: Assistant Boutique"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-900">Description</Label>
          <Textarea
            id="description"
            value={agentForm.description}
            onChange={(e) => setAgentForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Décrivez le rôle de cet agent..."
            rows={3}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="session" className="text-sm font-medium text-gray-900">Session WhatsApp</Label>
          <Select 
            value={agentForm.sessionId} 
            onValueChange={(value) => setAgentForm(prev => ({ ...prev, sessionId: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionnez une session" />
            </SelectTrigger>
            <SelectContent>
              {sessions
                .filter(session => 
                  // Filtrer les sessions déjà utilisées (sauf pour l'édition)
                  !agents.some(agent => 
                    agent.sessionId === session.id && 
                    agent.id !== selectedAgent?.id
                  )
                )
                .map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name} ({session.phoneNumber})
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Configuration avancée */}
      <Tabs defaultValue="personality" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personality">Personnalité</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personality" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="personality" className="text-sm font-medium text-gray-900">Personnalité de l'agent</Label>
            <Textarea
              id="personality"
              value={agentForm.configuration.personality}
              onChange={(e) => setAgentForm(prev => ({
                ...prev,
                configuration: { ...prev.configuration, personality: e.target.value }
              }))}
              placeholder="Décrivez la personnalité de votre agent (ex: Assistant commercial professionnel et amical)..."
              rows={4}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="responseStyle" className="text-sm font-medium text-gray-900">Style de réponse</Label>
            <Select 
              value={agentForm.configuration.responseStyle} 
              onValueChange={(value: any) => setAgentForm(prev => ({
                ...prev,
                configuration: { ...prev.configuration, responseStyle: value }
              }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formel</SelectItem>
                <SelectItem value="casual">Décontracté</SelectItem>
                <SelectItem value="friendly">Amical</SelectItem>
                <SelectItem value="professional">Professionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="language" className="text-sm font-medium text-gray-900">Langue</Label>
            <Select 
              value={agentForm.configuration.language} 
              onValueChange={(value) => setAgentForm(prev => ({
                ...prev,
                configuration: { ...prev.configuration, language: value }
              }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
                <SelectItem value="es">Espagnol</SelectItem>
                <SelectItem value="de">Allemand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="maxLength" className="text-sm font-medium text-gray-900">Longueur maximale des réponses</Label>
            <Input
              id="maxLength"
              type="number"
              value={agentForm.configuration.maxResponseLength}
              onChange={(e) => setAgentForm(prev => ({
                ...prev,
                configuration: { ...prev.configuration, maxResponseLength: parseInt(e.target.value) }
              }))}
              min={100}
              max={2000}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="fallback" className="text-sm font-medium text-gray-900">Message de fallback</Label>
            <Textarea
              id="fallback"
              value={agentForm.configuration.fallbackMessage}
              onChange={(e) => setAgentForm(prev => ({
                ...prev,
                configuration: { ...prev.configuration, fallbackMessage: e.target.value }
              }))}
              placeholder="Message envoyé quand l'agent ne peut pas répondre..."
              rows={2}
              className="mt-1"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="useShopData"
              checked={agentForm.configuration.useShopData}
              onCheckedChange={(checked) => setAgentForm(prev => ({
                ...prev,
                configuration: { ...prev.configuration, useShopData: checked }
              }))}
            />
            <Label htmlFor="useShopData" className="text-sm font-medium text-gray-900">Utiliser les données de la boutique</Label>
          </div>
          
          {agentForm.configuration.useShopData && (
            <div>
              <Label className="text-sm font-medium text-gray-900">Catégories de produits à utiliser</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['electronics', 'clothing', 'books', 'home', 'sports', 'beauty'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Switch
                      id={category}
                      checked={agentForm.configuration.shopDataCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        const categories = checked
                          ? [...agentForm.configuration.shopDataCategories, category]
                          : agentForm.configuration.shopDataCategories.filter(c => c !== category);
                        setAgentForm(prev => ({
                          ...prev,
                          configuration: { ...prev.configuration, shopDataCategories: categories }
                        }));
                      }}
                    />
                    <Label htmlFor={category} className="capitalize text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header minimaliste */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents IA</h1>
          <p className="text-gray-600 mt-1">Automatisez vos conversations WhatsApp</p>
        </div>
        
        <Button 
          onClick={() => navigate('/agents/new')}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Agent
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{agents.length}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Actifs</p>
          </CardContent>
        </Card>
      
      </div>

      {/* Liste des agents ou état vide */}
      {agents.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent IA</h3>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Créez votre premier agent IA pour automatiser vos conversations WhatsApp.
            </p>
            <Button 
              onClick={() => navigate('/agents/new')}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => {
            const statusConfig = getStatusConfig(agent.status);
            
            return (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Info principale */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900 truncate">
                            {agent.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                            <Badge className={statusConfig.badge}>
                              {statusConfig.text}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span className="truncate">{getSessionName(agent.sessionId)}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                          </div>
                          <span>•</span>
                          <span className="capitalize">{agent.configuration.responseStyle}</span>
                        </div>
                        
                        {agent.description && (
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {agent.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleAgentStatus(agent)}
                        disabled={isLoading}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {agent.status === 'active' ? (
                          <><Pause className="w-4 h-4 mr-1" />Pause</>
                        ) : (
                          <><Play className="w-4 h-4 mr-1" />Activer</>
                        )}
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-gray-700 hover:text-gray-900"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'agent</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer l'agent "{agent.name}" ? 
                              Cette action est irréversible et supprimera toutes les conversations associées.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteAgent(agent.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogue d'édition d'agent */}
      <Dialog open={editAgentDialog} onOpenChange={setEditAgentDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'agent IA</DialogTitle>
            <DialogDescription>
              Modifiez la configuration de votre assistant WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <AgentForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditAgentDialog(false);
              setSelectedAgent(null);
              resetForm();
            }}>
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateAgent} 
              disabled={isLoading}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};