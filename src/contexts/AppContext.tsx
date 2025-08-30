import React, { createContext, useContext, useState, useEffect } from 'react';
import type { WhatsAppSession, Agent, ShopData } from '@/types';

interface AppContextType {
  sessions: WhatsAppSession[];
  agents: Agent[];
  shopData: ShopData[];
  
  // Sessions
  createSession: (name: string, phoneNumber: string) => Promise<WhatsAppSession>;
  deleteSession: (id: string) => Promise<void>;
  connectSession: (id: string) => Promise<void>;
  
  // Agents
  createAgent: (agent: Omit<Agent, 'id' | 'createdAt'>) => Promise<Agent>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  
  // Shop Data
  addShopData: (data: Omit<ShopData, 'id' | 'createdAt'>) => Promise<ShopData>;
  updateShopData: (id: string, updates: Partial<ShopData>) => Promise<void>;
  deleteShopData: (id: string) => Promise<void>;
  
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [shopData, setShopData] = useState<ShopData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulation de données initiales
  useEffect(() => {
    const mockSessions: WhatsAppSession[] = [
      {
        id: '1',
        name: 'Session Boutique Principal',
        phoneNumber: '+33123456789',
        status: 'connected',
        lastActivity: new Date(),
        createdAt: new Date(Date.now() - 86400000)
      }
    ];
    
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Assistant Boutique',
        description: 'Agent pour répondre aux questions sur les produits',
        sessionId: '1',
        status: 'active',
        lastActivity: new Date(),
        createdAt: new Date(Date.now() - 86400000),
        configuration: {
          personality: 'Assistant commercial professionnel et amical',
          responseStyle: 'friendly',
          language: 'fr',
          maxResponseLength: 500,
          useShopData: true,
          shopDataCategories: ['electronics', 'clothing'],
          fallbackMessage: 'Je vais transférer votre demande à un conseiller humain.'
        }
      }
    ];
    
    setSessions(mockSessions);
    setAgents(mockAgents);
  }, []);

  const createSession = async (name: string, phoneNumber: string): Promise<WhatsAppSession> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSession: WhatsAppSession = {
      id: Date.now().toString(),
      name,
      phoneNumber,
      status: 'disconnected',
      lastActivity: new Date(),
      createdAt: new Date()
    };
    
    setSessions(prev => [...prev, newSession]);
    setIsLoading(false);
    return newSession;
  };

  const deleteSession = async (id: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSessions(prev => prev.filter(s => s.id !== id));
    setAgents(prev => prev.filter(a => a.sessionId !== id));
    setIsLoading(false);
  };

  const connectSession = async (id: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'connected' as const, lastActivity: new Date() } : s
    ));
    setIsLoading(false);
  };

  const createAgent = async (agentData: Omit<Agent, 'id' | 'createdAt'>): Promise<Agent> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAgent: Agent = {
      ...agentData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setAgents(prev => [...prev, newAgent]);
    setIsLoading(false);
    return newAgent;
  };

  const updateAgent = async (id: string, updates: Partial<Agent>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    setIsLoading(false);
  };

  const deleteAgent = async (id: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setAgents(prev => prev.filter(a => a.id !== id));
    setIsLoading(false);
  };

  const addShopData = async (data: Omit<ShopData, 'id' | 'createdAt'>): Promise<ShopData> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newShopData: ShopData = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setShopData(prev => [...prev, newShopData]);
    setIsLoading(false);
    return newShopData;
  };

  const updateShopData = async (id: string, updates: Partial<ShopData>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setShopData(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    setIsLoading(false);
  };

  const deleteShopData = async (id: string): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setShopData(prev => prev.filter(s => s.id !== id));
    setIsLoading(false);
  };

  const value = {
    sessions,
    agents,
    shopData,
    createSession,
    deleteSession,
    connectSession,
    createAgent,
    updateAgent,
    deleteAgent,
    addShopData,
    updateShopData,
    deleteShopData,
    isLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};