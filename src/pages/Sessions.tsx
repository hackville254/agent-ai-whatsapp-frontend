import { useNavigate } from 'react-router';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Power, 
  QrCode,
  Phone,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import type { WhatsAppSession } from '@/types';

export const Sessions = () => {
  const navigate = useNavigate();
  const { sessions, deleteSession, connectSession, isLoading } = useApp();

  const getStatusConfig = (status: WhatsAppSession['status']) => {
    const configs = {
      connected: { 
        badge: 'bg-green-100 text-green-700', 
        text: 'Connectée',
        icon: Wifi,
        iconColor: 'text-green-600',
        dot: 'bg-green-500'
      },
      connecting: { 
        badge: 'bg-yellow-100 text-yellow-700', 
        text: 'Connexion...',
        icon: Clock,
        iconColor: 'text-yellow-600',
        dot: 'bg-yellow-500'
      },
      disconnected: { 
        badge: 'bg-gray-100 text-gray-700', 
        text: 'Déconnectée',
        icon: WifiOff,
        iconColor: 'text-gray-500',
        dot: 'bg-gray-400'
      },
      error: { 
        badge: 'bg-red-100 text-red-700', 
        text: 'Erreur',
        icon: WifiOff,
        iconColor: 'text-red-600',
        dot: 'bg-red-500'
      }
    };
    return configs[status];
  };

  return (
    <div className="space-y-6">
      {/* Header Simple */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions WhatsApp</h1>
          <p className="text-gray-600 mt-1">Gérez vos connexions WhatsApp Business</p>
        </div>
        
        <Button onClick={() => navigate('/sessions/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Session
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'connected').length}
            </div>
            <p className="text-sm text-gray-600">Connectées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-500">
              {sessions.filter(s => s.status === 'disconnected').length}
            </div>
            <p className="text-sm text-gray-600">Déconnectées</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session</h3>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Créez votre première session WhatsApp pour commencer.
            </p>
            <Button onClick={() => navigate('/sessions/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const statusConfig = getStatusConfig(session.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Info principale */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900 truncate">
                            {session.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                            <Badge variant="secondary" className={statusConfig.badge}>
                              {statusConfig.text}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{session.phoneNumber}</span>
                          </div>
                          <span>•</span>
                          <span>Créée le {session.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {session.status === 'disconnected' && (
                        <Button 
                          size="sm" 
                          onClick={() => connectSession(session.id)}
                          disabled={isLoading}
                        >
                          <Power className="w-4 h-4 mr-1" />
                          Connecter
                        </Button>
                      )}
                      
                      {session.status === 'connected' && (
                        <Button size="sm" variant="outline">
                          <QrCode className="w-4 h-4 mr-1" />
                          QR Code
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer la session</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteSession(session.id)}
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
    </div>
  );
};