// Simple mock API and Campaign type for development
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'failed' | 'deleted';

export interface Campaign {
  id: string;
  name: string;
  template: string;
  contacts_count: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  status: CampaignStatus;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
}

export interface DashboardStats {
  total_contacts: number;
  active_chats: number;
  campaigns: number;
  messages_sent: number;
  contacts_change: string;
  chats_change: string;
  campaigns_change: string;
  messages_change: string;
}
export interface CreateCampaignPayload {
  name: string;
  template: string;
  contacts_sheet?: string;
  scheduled_for?: Date;
}

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    // Replace this with your actual API call if needed
    return {
      total_contacts: 2543,
      active_chats: 156,
      campaigns: 23,
      messages_sent: 12845,
      contacts_change: '+12.5%',
      chats_change: '+8.2%',
      campaigns_change: '+3.1%',
      messages_change: '+23.5%'
    };
  },
  
  async getCampaigns(): Promise<Campaign[]> {
    // Mock data
    return [
      {
        id: '1',
        name: 'Summer Sale',
        template: 'Sales Announcement',
        contacts_count: 150,
        sent_count: 120,
        delivered_count: 110,
        read_count: 90,
        status: 'draft',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Product Launch',
        template: 'Event Invite',
        contacts_count: 200,
        sent_count: 180,
        delivered_count: 175,
        read_count: 150,
        status: 'running',
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: '3',
        name: 'Welcome Series',
        template: 'Sales Announcement',
        contacts_count: 300,
        sent_count: 300,
        delivered_count: 295,
        read_count: 280,
        status: 'completed',
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];
  },
  
  async getTemplates(): Promise<Template[]> {
    return [
      { id: '1', name: 'Sales Announcement' },
      { id: '2', name: 'Event Invite' },
      { id: '3', name: 'Welcome Email' },
      { id: '4', name: 'Newsletter' },
      { id: '5', name: 'Abandoned Cart' }
    ];
  },
  
  async createCampaign(data: CreateCampaignPayload): Promise<Campaign> {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    template: data.template,
    contacts_count: 0,
    sent_count: 0,
    delivered_count: 0,
    read_count: 0,
    status: 'draft',
    created_at: new Date().toISOString()
  };
},
  
  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find(c => c.id === id) || {} as Campaign;
    
    return {
      ...campaign,
      ...data,
      id
    };
  },
  
  async deleteCampaign(id: string): Promise<boolean> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 500);
    });
  },
  
  async startCampaign(id: string): Promise<Campaign> {
    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find(c => c.id === id) || {} as Campaign;
    
    return {
      ...campaign,
      status: 'running'
    };
  },
  
  async stopCampaign(id: string): Promise<Campaign> {
    const campaigns = await this.getCampaigns();
    const campaign = campaigns.find(c => c.id === id) || {} as Campaign;
    
    return {
      ...campaign,
      status: 'completed'
    };
  }
};