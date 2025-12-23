export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  tags: string[];
  notes?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'template';
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  mediaUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface Chat {
  id: string;
  contactId: string;
  contact: Contact;
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'archived' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  targetAudience: string[];
  scheduledAt?: string;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  content: string;
  variables: string[];
  headerType?: 'text' | 'image' | 'video' | 'document';
  headerContent?: string;
  footerText?: string;
  buttons?: TemplateButton[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateButton {
  type: 'url' | 'phone' | 'quick_reply';
  text: string;
  value?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DashboardStats {
  totalContacts: number;
  totalChats: number;
  activeChats: number;
  totalCampaigns: number;
  activeCampaigns: number;
  messagesSent: number;
  messagesDelivered: number;
  messagesRead: number;
}
