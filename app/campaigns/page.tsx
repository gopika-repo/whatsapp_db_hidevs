'use client';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Progress } from '../../components/ui/progress';
import { Textarea } from '../../components/ui/textarea';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../components/ui/dropdown-menu';
import { api, Campaign } from '../../lib/api';
import type { CampaignStatus } from '../../lib/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Trash2,
  Eye,
  MoreVertical,
  CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
  ChevronRight,
  Download,
  Megaphone
} from 'lucide-react';

interface CampaignFormData {
  name: string;
  template: string;
  contacts_sheet: string;
  scheduled_for?: Date;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    template: '',
    contacts_sheet: ''
  });
  const [templates, setTemplates] = useState<any[]>([]);
  const [sheets, setSheets] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    loadCampaigns();
    loadTemplates();
    loadSheets();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await api.getCampaigns?.() ?? [];
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await api.getTemplates?.() ?? [];
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadSheets = async () => {
    try {
      // This would call your sheets API endpoint
      // const data = await api.getSheets();
      // setSheets(data);
      
      // Mock data for now
      setSheets([
        { id: '1', name: 'Customers List' },
        { id: '2', name: 'VIP Contacts' },
        { id: '3', name: 'Newsletter Subscribers' }
      ]);
    } catch (error) {
      console.error('Failed to load sheets:', error);
    }
  };

  const handleCreateCampaign = async () => {
  try {
    const campaign = await api.createCampaign?.({
      name: formData.name,
      template: formData.template,
      contacts_sheet: formData.contacts_sheet,
      scheduled_for: selectedDate
    });

    if (!campaign) return;

    setCampaigns(prev => [campaign, ...prev]);
    setFormData({ name: '', template: '', contacts_sheet: '' });
    setSelectedDate(undefined);
    setShowCreateDialog(false);
  } catch (error) {
    console.error('Failed to create campaign:', error);
  }
};


  const handleCampaignAction = async (campaignId: string, action: 'start' | 'pause' | 'delete') => {
    try {
      // Call API to update campaign status
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.id === campaignId) {
          if (action === 'delete') {
            return { ...campaign, status: 'deleted' };
          }
          if (action === 'start') {
            return { ...campaign, status: 'running' };
          }
          // 'pause' is not a valid CampaignStatus, so keep status unchanged or handle as needed
        }
        return campaign;
      }));
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const getStatusBadge = (status: CampaignStatus) => {
    const variants = {
      draft: 'outline',
      scheduled: 'secondary',
      running: 'default',
      completed: 'default',
      failed: 'destructive',
      deleted: 'destructive'
    } as const;

    const icons = {
      draft: <Clock className="h-3 w-3" />,
      scheduled: <CalendarIcon className="h-3 w-3" />,
      running: <Play className="h-3 w-3" />,
      completed: <CheckCircle className="h-3 w-3" />,
      failed: <XCircle className="h-3 w-3" />,
      deleted: <Trash2 className="h-3 w-3" />
    };

    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      running: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      failed: 'bg-red-100 text-red-800',
      deleted: 'bg-red-200 text-red-800'
    };

    const safeStatus: keyof typeof variants = status in variants ? status as keyof typeof variants : 'draft';
    return (
      <Badge variant={variants[safeStatus]} className={`gap-1 ${colors[safeStatus]}`}>
        {icons[safeStatus]}
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </Badge>
    );
  };

  const getProgressPercentage = (campaign: Campaign) => {
    if (campaign.contacts_count === 0) return 0;
    return Math.round((campaign.sent_count / campaign.contacts_count) * 100);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage your WhatsApp marketing campaigns
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#128C7E] hover:bg-[#075E54]">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-150">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Summer Sale Announcement"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contacts-sheet">Contacts Sheet *</Label>
                    <Select
                      value={formData.contacts_sheet}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, contacts_sheet: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sheet" />
                      </SelectTrigger>
                      <SelectContent>
                        {sheets.map((sheet) => (
                          <SelectItem key={sheet.id} value={sheet.id}>
                            {sheet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">WhatsApp Template *</Label>
                    <Select
                      value={formData.template}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Schedule (Optional)</Label>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <Input
                          type="time"
                          className="w-full"
                          onChange={(e) => {
                            if (selectedDate && e.target.value) {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(selectedDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              setSelectedDate(newDate);
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preview">Template Preview</Label>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sales Announcement</span>
                          <Badge variant="outline" className="text-xs">
                            Approved
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {"Hello {{1}}, check out our new summer collection with 30% off! Visit {{2}} to shop now."}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {"{{1}}: Customer Name"}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {"{{2}}: Website URL"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-800">Campaign Summary</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>~150 contacts from selected sheet</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3" />
                          <span>Template will be sent to all contacts</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {selectedDate
                              ? `Scheduled for ${format(selectedDate, "PPP 'at' p")}`
                              : 'Will start immediately'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} className="bg-[#128C7E] hover:bg-[#075E54]">
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold">
                    {campaigns.filter(c => c.status === 'running').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold">
                    {campaigns.reduce((sum, c) => sum + c.sent_count, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Read Rate</p>
                  <p className="text-2xl font-bold">
                    {campaigns.length > 0
                      ? Math.round(
                          (campaigns.reduce((sum, c) => sum + c.read_count, 0) /
                            campaigns.reduce((sum, c) => sum + c.sent_count, 1)) *
                            100
                        ) + '%'
                      : '0%'}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search campaigns..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Campaigns Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Contacts</TableHead>
                    <TableHead>Sent/Delivered/Read</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => {
                      const progress = getProgressPercentage(campaign);
                      
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{campaign.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Template: {campaign.template}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(campaign.status)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Progress value={progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                {progress}% complete
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{campaign.contacts_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-xs">Sent: {campaign.sent_count}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-xs">Delivered: {campaign.delivered_count}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-xs">Read: {campaign.read_count}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(campaign.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {campaign.status === 'draft' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleCampaignAction(campaign.id, 'start')}
                                  title="Start Campaign"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {campaign.status === 'running' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                  title="Pause Campaign"
                                >
                                  <Pause className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Export Report"
                              >
                                <Download className="h-4 w-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    Contact List
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Campaign
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No campaigns found</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setShowCreateDialog(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Campaign
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}