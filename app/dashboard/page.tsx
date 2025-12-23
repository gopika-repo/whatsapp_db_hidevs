'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Megaphone, TrendingUp, AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { apiClient } from '@/lib/api-client';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardStats {
  total_contacts: number;
  active_chats: number;
  campaigns: number;
  messages_sent: number;
  contacts_change: string;
  chats_change: string;
  campaigns_change: string;
  messages_change: string;
}

interface Activity {
  id: string;
  type: 'message' | 'campaign' | 'contact';
  action: string;
  contact_name?: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard:', isAuthenticated, isLoading);
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'message',
      action: 'Message sent to John Doe',
      contact_name: 'John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'success'
    },
    {
      id: '2',
      type: 'campaign',
      action: 'Campaign "Summer Sale" launched',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'success'
    },
    {
      id: '3',
      type: 'contact',
      action: '10 new contacts imported',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'success'
    },
    {
      id: '4',
      type: 'message',
      action: 'Failed to send message to +1234567890',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'error'
    }
  ]);

  const messageData = [
    { day: 'Mon', sent: 120, delivered: 115, read: 98 },
    { day: 'Tue', sent: 150, delivered: 145, read: 125 },
    { day: 'Wed', sent: 180, delivered: 175, read: 155 },
    { day: 'Thu', sent: 200, delivered: 195, read: 180 },
    { day: 'Fri', sent: 220, delivered: 215, read: 195 },
    { day: 'Sat', sent: 180, delivered: 175, read: 160 },
    { day: 'Sun', sent: 140, delivered: 135, read: 120 }
  ];

  const campaignData = [
    { name: 'Completed', value: 12 },
    { name: 'Running', value: 5 },
    { name: 'Scheduled', value: 3 },
    { name: 'Failed', value: 1 }
  ];

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get<DashboardStats>('/dashboard/stats');
      setStats(data);
    } catch (error) {
      setError('Failed to load dashboard data');
      // Mock data for demo
      setStats({
        total_contacts: 2543,
        active_chats: 156,
        campaigns: 23,
        messages_sent: 12845,
        contacts_change: '+12.5%',
        chats_change: '+8.2%',
        campaigns_change: '+3.1%',
        messages_change: '+23.5%'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your WhatsApp Business.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Export Report</Button>
            <Button className="bg-[#128C7E] hover:bg-[#075E54]">
              <TrendingUp className="mr-2 h-4 w-4" />
              Quick Campaign
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : stats ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_contacts.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.contacts_change}</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active_chats}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.chats_change}</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
                  <Megaphone className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.campaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.campaigns_change}</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.messages_sent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stats.messages_change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="col-span-4 text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message Analytics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Message Analytics</CardTitle>
              <CardDescription>Message performance over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sent" stroke="#8884d8" />
                    <Line type="monotone" dataKey="delivered" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="read" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Status */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
              <CardDescription>Distribution of campaigns by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaignData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {campaignData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in your account</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{activity.action}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          {activity.contact_name && (
                            <span className="text-xs text-muted-foreground">
                              {activity.contact_name}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                <span>New Message</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Add Contact</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <Megaphone className="h-6 w-6" />
                <span>Create Campaign</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}