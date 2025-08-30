import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Bot, 
  Plus,
  ArrowRight,
  FileText
} from 'lucide-react';
import { Link } from 'react-router';

export const Dashboard = () => {
  const { sessions, agents } = useApp();

  const stats = [
    {
      title: 'Sessions WhatsApp',
      value: sessions.length,
      description: `${sessions.filter(s => s.status === 'connected').length} connectées`,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Agents IA',
      value: agents.length,
      description: `${agents.filter(a => a.status === 'active').length} actifs`,
      icon: Bot,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const recentAgents = agents.slice(-3).reverse();
  const recentSessions = sessions.slice(-3).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de vos agents IA WhatsApp</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link to="/sessions">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Session
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/agents">
              <Bot className="w-4 h-4 mr-2" />
              Nouvel Agent
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agents Récemment Créés */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agents Récemment Créés</CardTitle>
                <CardDescription>Vos derniers agents IA</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/agents">
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAgents.length > 0 ? (
                recentAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-gray-600">{agent.description}</p>
                      </div>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucun agent créé</p>
                  <Button asChild className="mt-3">
                    <Link to="/agents">Créer votre premier agent</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sessions Récemment Créées */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sessions Récemment Créées</CardTitle>
                <CardDescription>Vos dernières connexions WhatsApp</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sessions">
                  Gérer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        session.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <MessageSquare className={`w-4 h-4 ${
                          session.status === 'connected' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{session.name}</p>
                        <p className="text-sm text-gray-600">{session.phoneNumber}</p>
                      </div>
                    </div>
                    <Badge variant={
                      session.status === 'connected' ? 'default' : 
                      session.status === 'disconnected' ? 'destructive' : 'secondary'
                    }>
                      {session.status === 'connected' ? 'Connectée' : 
                       session.status === 'disconnected' ? 'Déconnectée' : 'En attente'}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Aucune session créée</p>
                  <Button asChild className="mt-3">
                    <Link to="/sessions">Créer une session</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Templates d'Agents</span>
          </CardTitle>
          <CardDescription>
            Utilisez nos templates prêts à l'emploi pour créer rapidement vos agents IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Découvrir les Templates</p>
                <p className="text-sm text-gray-600">Assistant boutique, support client, et plus encore</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/agent-templates">
                Parcourir
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};