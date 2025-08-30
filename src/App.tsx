import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { Dashboard } from '@/pages/Dashboard';
import { Sessions } from '@/pages/Sessions';
// Import des autres pages à créer
import { Agents } from '@/pages/Agents';
import { ShopDataPage } from './pages/ShopData';
import { CreateSession } from '@/pages/CreateSession';
import { CreateAgent } from '@/pages/CreateAgent';
import { AgentTemplates } from '@/pages/AgentTemplates';
import { Settings } from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="agents" element={<Agents />} />
              <Route path="shop-data" element={<ShopDataPage />} />
            <Route path="/sessions/new" element={<CreateSession />} />
            <Route path="/agents/new" element={<CreateAgent />} />
            <Route path="/agent-templates" element={<AgentTemplates />} />
            <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;