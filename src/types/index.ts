export interface WhatsAppSession {
  id: string;
  name: string;
  phoneNumber: string;
  qrCode?: string;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastActivity: Date;
  createdAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  sessionId: string;
  status: 'active' | 'inactive' | 'training';
  lastActivity: Date;
  createdAt: Date;
  configuration: AgentConfiguration;
}

export interface AgentConfiguration {
  personality: string;
  responseStyle: 'formal' | 'casual' | 'friendly' | 'professional';
  language: string;
  maxResponseLength: number;
  useShopData: boolean;
  shopDataCategories: string[];
  fallbackMessage: string;
}

export interface ShopData {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  createdAt: Date;
}



export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  timestamp: Date;
  type: 'text' | 'image' | 'document';
}