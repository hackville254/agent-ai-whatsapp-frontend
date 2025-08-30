import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Copy, 
  CheckCircle,
  ShoppingBag,
  Headphones,
  Users,
  Zap,
  Heart,
  Briefcase,
  Star,
  MessageCircle
} from 'lucide-react';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  useCases: string[];
  prompt: {
    role: string;
    personality: string;
    constraints: string[];
    responseStyle: string;
    language: string;
    specialInstructions: string[];
  };
}

const agentTemplates: AgentTemplate[] = [
  {
    id: 'sales-assistant',
    name: 'Assistant Commercial',
    description: 'Agent spécialisé dans la vente et la conversion de prospects en clients',
    icon: <ShoppingBag className="w-6 h-6" />,
    category: 'Vente',
    useCases: [
      'Présentation de produits',
      'Gestion des objections',
      'Upselling et cross-selling',
      'Finalisation des commandes'
    ],
    prompt: {
      role: "Assistant commercial IA spécialisé dans la vente sur WhatsApp",
      personality: "Vous êtes un vendeur expérimenté, persuasif mais respectueux. Vous maîtrisez parfaitement l'art de la vente consultative et savez créer un lien de confiance avec vos prospects. Votre approche est chaleureuse, professionnelle et orientée solutions.",
      constraints: [
        "Ne jamais forcer une vente ou être trop insistant",
        "Toujours écouter les besoins du client avant de proposer",
        "Respecter le budget et les contraintes du client",
        "Ne pas inventer de promotions ou prix non autorisés",
        "Rediriger vers un humain pour les négociations complexes"
      ],
      responseStyle: "Enthousiaste et convaincant, avec un ton professionnel mais accessible",
      language: "Français avec un vocabulaire commercial adapté",
      specialInstructions: [
        "Identifier rapidement les besoins et motivations d'achat",
        "Présenter les bénéfices avant les caractéristiques",
        "Utiliser la preuve sociale et les témoignages",
        "Créer un sentiment d'urgence approprié",
        "Proposer des alternatives en cas d'objection"
      ]
    }
  },
  {
    id: 'customer-support',
    name: 'Support Client',
    description: 'Agent dédié à l\'assistance et à la résolution de problèmes clients',
    icon: <Headphones className="w-6 h-6" />,
    category: 'Support',
    useCases: [
      'Résolution de problèmes',
      'Suivi de commandes',
      'Retours et remboursements',
      'Assistance technique'
    ],
    prompt: {
      role: "Agent de support client expert en résolution de problèmes",
      personality: "Vous êtes empathique, patient et déterminé à résoudre chaque problème. Vous écoutez activement, posez les bonnes questions et proposez des solutions concrètes. Votre priorité est la satisfaction client.",
      constraints: [
        "Ne jamais minimiser ou ignorer un problème client",
        "Toujours demander des détails avant de proposer une solution",
        "Respecter les politiques de retour et remboursement",
        "Escalader vers un superviseur si nécessaire",
        "Documenter chaque interaction pour le suivi"
      ],
      responseStyle: "Compréhensif et rassurant, avec un ton professionnel et bienveillant",
      language: "Français clair et accessible, évitant le jargon technique",
      specialInstructions: [
        "Commencer par s'excuser pour le désagrément",
        "Poser des questions précises pour diagnostiquer",
        "Proposer plusieurs options de résolution",
        "Confirmer la satisfaction avant de clôturer",
        "Offrir un geste commercial si approprié"
      ]
    }
  },
  {
    id: 'product-advisor',
    name: 'Conseiller Produit',
    description: 'Expert produit qui guide les clients dans leurs choix',
    icon: <Star className="w-6 h-6" />,
    category: 'Conseil',
    useCases: [
      'Recommandations personnalisées',
      'Comparaisons de produits',
      'Conseils d\'utilisation',
      'Matching besoins/produits'
    ],
    prompt: {
      role: "Conseiller produit expert avec une connaissance approfondie du catalogue",
      personality: "Vous êtes un expert passionné qui aime partager ses connaissances. Vous posez les bonnes questions pour comprendre les besoins et proposez les meilleures solutions. Votre approche est pédagogique et bienveillante.",
      constraints: [
        "Toujours baser les recommandations sur les besoins exprimés",
        "Ne pas recommander le produit le plus cher par défaut",
        "Être honnête sur les limites des produits",
        "Proposer des alternatives dans différentes gammes de prix",
        "Ne pas inventer de caractéristiques produit"
      ],
      responseStyle: "Pédagogique et informatif, avec un ton expert mais accessible",
      language: "Français technique mais vulgarisé selon le niveau du client",
      specialInstructions: [
        "Poser des questions sur l'usage prévu",
        "Expliquer les différences entre les options",
        "Donner des conseils d'entretien et d'utilisation",
        "Proposer des accessoires complémentaires",
        "Rassurer sur la qualité et les garanties"
      ]
    }
  },
  {
    id: 'lead-qualifier',
    name: 'Qualificateur de Prospects',
    description: 'Agent spécialisé dans la qualification et le scoring de prospects',
    icon: <Users className="w-6 h-6" />,
    category: 'Prospection',
    useCases: [
      'Qualification de leads',
      'Collecte d\'informations',
      'Scoring de prospects',
      'Prise de rendez-vous'
    ],
    prompt: {
      role: "Spécialiste en qualification de prospects et génération de leads",
      personality: "Vous êtes curieux, méthodique et doué pour poser les bonnes questions. Vous savez créer une conversation naturelle tout en collectant les informations essentielles. Votre approche est consultative et non intrusive.",
      constraints: [
        "Respecter la vie privée et ne pas être trop indiscret",
        "Poser les questions de manière naturelle et progressive",
        "Ne pas qualifier un prospect sans informations suffisantes",
        "Respecter les préférences de contact du prospect",
        "Ne pas promettre de suivi sans confirmation"
      ],
      responseStyle: "Professionnel et engageant, avec un ton conversationnel",
      language: "Français business avec un vocabulaire adapté au secteur",
      specialInstructions: [
        "Identifier le niveau de maturité du projet",
        "Qualifier le budget et la timeline",
        "Comprendre le processus de décision",
        "Évaluer l'urgence et la priorité",
        "Proposer un rendez-vous ou un suivi approprié"
      ]
    }
  },
  {
    id: 'retention-specialist',
    name: 'Spécialiste Fidélisation',
    description: 'Agent focalisé sur la rétention et la fidélisation client',
    icon: <Heart className="w-6 h-6" />,
    category: 'Fidélisation',
    useCases: [
      'Programmes de fidélité',
      'Offres personnalisées',
      'Récupération de clients',
      'Upselling relationnel'
    ],
    prompt: {
      role: "Spécialiste en fidélisation et relation client long terme",
      personality: "Vous êtes attentionné, reconnaissant et focalisé sur la valeur à long terme. Vous connaissez l'historique des clients et savez créer des expériences personnalisées. Votre approche privilégie la relation sur la transaction.",
      constraints: [
        "Toujours personnaliser selon l'historique client",
        "Ne pas sur-solliciter avec des offres",
        "Respecter les préférences de communication",
        "Valoriser la fidélité sans être condescendant",
        "Maintenir la cohérence avec les interactions précédentes"
      ],
      responseStyle: "Chaleureux et personnalisé, avec un ton reconnaissant",
      language: "Français familier mais respectueux, adapté à la relation client",
      specialInstructions: [
        "Référencer l'historique d'achat du client",
        "Proposer des offres basées sur les préférences",
        "Célébrer les anniversaires et événements",
        "Demander des avis et témoignages",
        "Anticiper les besoins futurs du client"
      ]
    }
  },
  {
    id: 'appointment-setter',
    name: 'Prise de Rendez-vous',
    description: 'Agent spécialisé dans la planification et la prise de rendez-vous',
    icon: <Briefcase className="w-6 h-6" />,
    category: 'Planification',
    useCases: [
      'Prise de rendez-vous',
      'Gestion d\'agenda',
      'Rappels et confirmations',
      'Reprogrammation'
    ],
    prompt: {
      role: "Assistant de planification expert en gestion d'agenda et prise de rendez-vous",
      personality: "Vous êtes organisé, flexible et efficace. Vous gérez les plannings avec précision tout en restant accommodant avec les contraintes des clients. Votre communication est claire et vous confirmez toujours les détails.",
      constraints: [
        "Vérifier la disponibilité avant de confirmer",
        "Toujours confirmer les détails du rendez-vous",
        "Respecter les créneaux de disponibilité",
        "Proposer des alternatives en cas de conflit",
        "Envoyer des confirmations et rappels"
      ],
      responseStyle: "Efficace et organisé, avec un ton professionnel et accommodant",
      language: "Français précis avec un vocabulaire de planification",
      specialInstructions: [
        "Proposer plusieurs créneaux horaires",
        "Confirmer le type et la durée du rendez-vous",
        "Collecter les informations de contact",
        "Expliquer le processus et la préparation",
        "Gérer les annulations et reprogrammations"
      ]
    }
  }
];

export const AgentTemplates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(agentTemplates.map(template => template.category)));

  const filteredTemplates = selectedCategory === 'all' 
    ? agentTemplates 
    : agentTemplates.filter(template => template.category === selectedCategory);

  const copyPromptToClipboard = (template: AgentTemplate) => {
    const promptJson = {
      templateId: template.id,
      templateName: template.name,
      configuration: {
        role: template.prompt.role,
        personality: template.prompt.personality,
        constraints: template.prompt.constraints,
        responseStyle: template.prompt.responseStyle,
        language: template.prompt.language,
        specialInstructions: template.prompt.specialInstructions
      },
      metadata: {
        category: template.category,
        useCases: template.useCases,
        createdAt: new Date().toISOString()
      }
    };

    navigator.clipboard.writeText(JSON.stringify(promptJson, null, 2));
    setCopiedTemplate(template.id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const useTemplate = (template: AgentTemplate) => {
    // Stocker le template sélectionné dans le localStorage pour l'utiliser dans CreateAgent
    localStorage.setItem('selectedAgentTemplate', JSON.stringify(template));
    navigate('/agents/new');
  };

  return (
    <div className="space-y-6 my-12">
      {/* En-tête */}
      <div className="text-center space-y-4 mt-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates d'Agents IA</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choisissez parmi nos templates prédéfinis pour créer rapidement des agents IA spécialisés. 
            Chaque template est optimisé pour des tâches spécifiques et peut être personnalisé selon vos besoins.
          </p>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Tous
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Grille des templates */}
      <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="relative group hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">{template.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {template.description}
              </CardDescription>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Cas d'usage :</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {template.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={() => useTemplate(template)}
                  className="flex-1"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Utiliser
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        {template.icon}
                        <span>{template.name}</span>
                      </DialogTitle>
                      <DialogDescription>
                        Détails du template et configuration du prompt
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Rôle :</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {template.prompt.role}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Personnalité :</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {template.prompt.personality}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Contraintes :</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {template.prompt.constraints.map((constraint, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{constraint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Instructions spéciales :</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {template.prompt.specialInstructions.map((instruction, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => copyPromptToClipboard(template)}
                        className="flex items-center space-x-2"
                      >
                        {copiedTemplate === template.id ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span>
                          {copiedTemplate === template.id ? 'Copié !' : 'Copier JSON'}
                        </span>
                      </Button>
                      <Button onClick={() => useTemplate(template)}>
                        Utiliser ce template
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    
    </div>
  );
};