import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  CreditCard, 
  Lock, 
  CheckCircle,
  AlertCircle,
  Crown,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Données simulées pour le plan d'abonnement
  const subscriptionData = {
    plan: 'Premium',
    status: 'active',
    nextBilling: '2024-02-15',
    price: '29.99€',
    features: [
      'Agents IA illimités',
      'Sessions WhatsApp illimitées',
      'Support prioritaire',
      'Analytics avancées',
      'Intégrations API'
    ]
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      // Simulation de l'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      setPasswordError('Erreur lors du changement de mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getPlanBadgeColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  return (
     <div className="space-y-6">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et votre abonnement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{user?.email || 'utilisateur@exemple.com'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Nom d'utilisateur</p>
                  <p className="text-sm text-gray-600">{user?.name || 'Utilisateur'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Membre depuis</p>
                  <p className="text-sm text-gray-600">Janvier 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan d'abonnement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span>Plan d'abonnement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{subscriptionData.plan}</h3>
                <p className="text-2xl font-bold text-gray-900">{subscriptionData.price}<span className="text-sm font-normal text-gray-600">/mois</span></p>
              </div>
              <Badge className={getPlanBadgeColor(subscriptionData.status)}>
                {subscriptionData.status === 'active' ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Fonctionnalités incluses :</p>
              <ul className="space-y-1">
                {subscriptionData.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Prochaine facturation : {subscriptionData.nextBilling}</span>
            </div>
            
            <Button variant="outline" className="w-full">
              Gérer l'abonnement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Changement de mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Sécurité</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Mot de passe modifié avec succès !
              </AlertDescription>
            </Alert>
          )}
          
          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {passwordError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="currentPassword" className="text-sm font-medium">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Mot de passe actuel"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="newPassword" className="text-sm font-medium">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Nouveau mot de passe"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>
          
          <Button 
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            className="w-full md:w-auto"
          >
            {isChangingPassword ? 'Modification...' : 'Changer le mot de passe'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};