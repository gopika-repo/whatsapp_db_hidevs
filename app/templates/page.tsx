'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  content: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([
    { id: '1', name: 'Welcome Message', content: 'Hello {{name}}, welcome to our service!' },
    { id: '2', name: 'Order Confirmation', content: 'Hi {{name}}, your order #{{order_id}} is confirmed.' },
    { id: '3', name: 'Promotion', content: 'Hey {{name}}, check out our new deals this week!' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const filteredTemplates = templates.filter(
    t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      content: newTemplateContent
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setNewTemplateName('');
    setNewTemplateContent('');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Templates</h1>
            <p className="text-muted-foreground">
              Manage your WhatsApp message templates
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Template name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              className="w-40"
            />
            <Input
              placeholder="Template content"
              value={newTemplateContent}
              onChange={(e) => setNewTemplateContent(e.target.value)}
              className="w-96"
            />
            <Button onClick={handleAddTemplate} className="bg-[#128C7E] hover:bg-[#075E54]">
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent>
            {filteredTemplates.length > 0 ? (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="p-4 border">
                    <CardTitle className="font-semibold">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{template.content}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No templates found. Create your first template to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
