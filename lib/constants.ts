export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'WhatsApp Business Dashboard';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  contacts: {
    list: '/contacts',
    create: '/contacts',
    get: (id: string) => `/contacts/${id}`,
    update: (id: string) => `/contacts/${id}`,
    delete: (id: string) => `/contacts/${id}`,
  },
  chats: {
    list: '/chats',
    get: (id: string) => `/chats/${id}`,
    messages: (id: string) => `/chats/${id}/messages`,
    sendMessage: (id: string) => `/chats/${id}/messages`,
  },
  campaigns: {
    list: '/campaigns',
    create: '/campaigns',
    get: (id: string) => `/campaigns/${id}`,
    update: (id: string) => `/campaigns/${id}`,
    delete: (id: string) => `/campaigns/${id}`,
    start: (id: string) => `/campaigns/${id}/start`,
    pause: (id: string) => `/campaigns/${id}/pause`,
  },
  templates: {
    list: '/templates',
    create: '/templates',
    get: (id: string) => `/templates/${id}`,
    update: (id: string) => `/templates/${id}`,
    delete: (id: string) => `/templates/${id}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
  },
};

export const WHATSAPP_COLORS = {
  primary: '#128C7E',
  secondary: '#25D366',
  light: '#DCF8C6',
  dark: '#075E54',
  background: '#ECE5DD',
};

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  contacts: '/contacts',
  chats: '/chats',
  campaigns: '/campaigns',
  templates: '/templates',
  settings: '/settings',
};

export const STORAGE_KEYS = {
  token: 'auth_token',
  user: 'auth_user',
};
