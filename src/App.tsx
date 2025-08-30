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
import { Agents } from '@/pages/Agents';
import { ShopDataPage } from './pages/ShopData';
import { CreateSession } from '@/pages/CreateSession';
import { CreateAgent } from '@/pages/CreateAgent';
import { AgentTemplates } from '@/pages/AgentTemplates';
import { Settings } from './pages/Settings';
import { LandingPage } from '@/pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard/home" replace />} />
              <Route path="home" element={<Dashboard />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="agents" element={<Agents />} />
              <Route path="shop-data" element={<ShopDataPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/sessions/new" element={<CreateSession />} />
            <Route path="/agents/new" element={<CreateAgent />} />
            <Route path="/agent-templates" element={<AgentTemplates />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;