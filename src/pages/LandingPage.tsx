import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Smartphone, 
  TrendingUp, 
  Globe, 
  Headphones,
  Crown,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: "IA Conversationnelle Avancée",
      description: "Agents IA qui comprennent et répondent naturellement à vos clients 24h/24"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      title: "Intégration WhatsApp Native",
      description: "Connectez directement vos numéros WhatsApp Business en quelques clics"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Réponses Instantanées",
      description: "Temps de réponse < 2 secondes pour une expérience client optimale"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Analytics Détaillées",
      description: "Suivez les performances, conversions et satisfaction client en temps réel"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Sécurité Entreprise",
      description: "Chiffrement end-to-end et conformité RGPD garantie"
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "Multi-Agents",
      description: "Gérez plusieurs agents spécialisés pour différents services"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "19",
      period: "mois",
      description: "Parfait pour débuter",
      features: [
        "1 Agent IA",
        "1 Session WhatsApp",
        "1000 messages/mois",
        "Support email",
        "Templates de base"
      ],
      popular: false,
      cta: "Commencer gratuitement"
    },
    {
      name: "Premium",
      price: "49",
      period: "mois",
      description: "Le plus populaire",
      features: [
        "5 Agents IA",
        "3 Sessions WhatsApp",
        "10000 messages/mois",
        "Support prioritaire",
        "Templates avancés",
        "Analytics détaillées",
        "Intégrations avancées"
      ],
      popular: true,
      cta: "Essai gratuit 14 jours"
    },
    {
      name: "Enterprise",
      price: "149",
      period: "mois",
      description: "Pour les grandes équipes",
      features: [
        "Agents IA illimités",
        "Sessions illimitées",
        "Messages illimités",
        "Support dédié 24/7",
        "Templates personnalisés",
        "Analytics avancées",
        "Intégrations personnalisées",
        "Formation équipe"
      ],
      popular: false,
      cta: "Contactez-nous"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice E-commerce",
      company: "Fashion Store",
      content: "Nos ventes ont augmenté de 40% depuis l'implémentation. L'IA gère 80% des demandes clients automatiquement.",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Fondateur",
      company: "TechStart",
      content: "Incroyable ! Nous économisons 15h/semaine sur le support client. L'IA est si naturelle que les clients ne voient pas la différence.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Responsable Marketing",
      company: "BeautyBrand",
      content: "ROI de 300% en 3 mois. L'outil s'est payé dès le premier mois grâce à l'augmentation des conversions.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10k+", label: "Entreprises actives" },
    { number: "2M+", label: "Messages traités" },
    { number: "95%", label: "Satisfaction client" },
    { number: "40%", label: "Augmentation ventes" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">WhatsApp AI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Témoignages</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Connexion</Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Essai gratuit</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Nouveau : IA GPT-4 intégrée
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Automatisez votre 
                  <span className="text-blue-600"> WhatsApp Business </span>
                   avec l'IA
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transformez vos conversations WhatsApp en machine à ventes avec des agents IA qui répondent 24h/24, qualifient vos prospects et convertissent automatiquement.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                    Démarrer gratuitement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  Voir la démo
                  <Smartphone className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Essai gratuit 14 jours</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Agent IA - Sarah</p>
                      <p className="text-sm text-green-600">En ligne</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Bonjour ! Je cherche une robe pour un mariage</p>
                    </div>
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">Parfait ! J'ai plusieurs modèles élégants à vous proposer. Quelle est votre taille et votre budget ?</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Taille 38, budget 150€ maximum</p>
                    </div>
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">Excellent ! Voici 3 robes parfaites dans votre budget. La robe bleue marine est très demandée ✨</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir WhatsApp AI ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution complète pour automatiser et optimiser vos conversations WhatsApp Business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tarifs transparents, sans surprise
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-xl scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Crown className="w-4 h-4 mr-1" />
                      Plus populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <p className="text-gray-600">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="block">
                    <Button className={`w-full mt-6 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez comment nos clients transforment leur business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} - {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Prêt à transformer votre WhatsApp Business ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez plus de 10 000 entreprises qui automatisent déjà leurs ventes
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 mx-auto">
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">WhatsApp AI</span>
              </div>
              <p className="text-gray-400">
                La solution IA pour automatiser vos conversations WhatsApp Business
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WhatsApp AI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};