'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  Smile,
  CheckCheck,
  Check,
  Clock,
  MoreVertical,
  Filter,
  MessageSquare
} from 'lucide-react';
// Update the import path if the file is located elsewhere, e.g.:
import { api } from '../../lib/api';

// Define Chat type here since it's not exported from '../../lib/api'
type Chat = {
  id: string;
  contact_name: string;
  phone_number: string;
  avatar_url?: string;
  last_message: string;
  timestamp: string;
  unread_count: number;
};

// Define Message type here if not exported from '../../lib/api'
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'template';
  template_name?: string;
  parameters?: Record<string, string>;
};
// Or create 'lib/api.ts' with the required exports if it doesn't exist.
import { formatDistanceToNow } from 'date-fns';
import { useWebSocket } from '@/hooks/useWebSocket';

interface ChatWithMessages extends Chat {
  messages: Message[];
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // WebSocket for real-time updates
  const { lastMessage, sendMessage: wsSendMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || ''
  );



  useEffect(() => {
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  if (lastMessage) {
    let parsedData: any = null;
    try {
      // Remove prefix if server sends "Echo: {...}"
      const jsonString = lastMessage.data.toString().replace(/^Echo:\s*/, '');
      parsedData = JSON.parse(jsonString);
    } catch (err) {
      console.warn('Received non-JSON message:', lastMessage.data);
      return; // ignore invalid message
    }

    if (parsedData.type === 'new_message') {
      handleNewMessage(parsedData.message);
    } else if (parsedData.type === 'message_status_update') {
      updateMessageStatus(parsedData.messageId, parsedData.status);
    }
  }
}, [lastMessage]);


  const loadChats = async () => {
    try {
      setLoading(true);
      const data: Chat[] = [
        {
          id: '1',
          contact_name: 'John Doe',
          phone_number: '1234567890',
          avatar_url: '',
          last_message: 'Hello!',
          timestamp: new Date().toISOString(),
          unread_count: 2,
        },
        // Add more mock chats as needed
      ];
      setChats(data);
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0]);
        loadChatHistory(data[0].phone_number);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatHistory = async (phoneNumber: string) => {
    try {
      const data: Message[] = [
        {
          id: 'm1',
          text: 'Hello!',
          sender: 'contact',
          timestamp: new Date().toISOString(),
          status: 'read',
          type: 'text',
        },
        // Add more mock messages as needed
      ];
      setMessages(data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedChat && message.sender === 'contact') {
      setMessages(prev => [...prev, message]);
      // Update chat list with new message preview
      setChats(prev => prev.map(chat => 
        chat.phone_number === selectedChat.phone_number
          ? { ...chat, last_message: message.text, timestamp: new Date().toISOString() }
          : chat
      ));
    }
  };

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || sending) return;

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    setSending(true);

    try {
      if (typeof (api as any).sendMessage === 'function') {
        await (api as any).sendMessage({
          phone_number: selectedChat.phone_number,
          message: messageInput,
          type: 'text'
        });
      } else {
        // Fallback: simulate sending (remove in production)
        await new Promise(res => setTimeout(res, 500));
      }

      // Send via WebSocket for real-time updates
      wsSendMessage(JSON.stringify({
        type: 'send_message',
        message: newMessage
      }));

      // Update chat list
      setChats(prev => prev.map(chat =>
        chat.phone_number === selectedChat.phone_number
          ? { ...chat, last_message: messageInput, timestamp: new Date().toISOString() }
          : chat
      ));
    } catch (error) {
      console.error('Failed to send message:', error);
      // Revert optimistic update on error
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    } finally {
      setSending(false);
    }
  };

  const handleSendTemplate = async (templateName: string, parameters: Record<string, string>) => {
    if (!selectedChat) return;

    try {
      if (typeof (api as any).sendMessage === 'function') {
        await (api as any).sendMessage({
          phone_number: selectedChat.phone_number,
          message: '',
          type: 'template',
          template_name: templateName,
          parameters
        });
      } else {
        // Fallback: simulate sending (remove in production)
        await new Promise(res => setTimeout(res, 500));
      }
    } catch (error) {
      console.error('Failed to send template:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.phone_number.includes(searchQuery)
  );

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Chat List */}
        <div className="w-full md:w-1/3 border-r">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Chats</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search chats..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            {loading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedChat(chat);
                    loadChatHistory(chat.phone_number);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={chat.avatar_url} />
                      <AvatarFallback>
                        {chat.contact_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{chat.contact_name}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.last_message}
                        </p>
                        {chat.unread_count > 0 && (
                          <Badge className="bg-[#25D366] text-white">
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No chats found</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Panel - Chat Messages */}
        <div className="hidden md:flex flex-col flex-1">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedChat.avatar_url} />
                    <AvatarFallback>
                      {selectedChat.contact_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedChat.contact_name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedChat.phone_number}</p>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-[#DCF8C6] rounded-tr-none'
                            : 'bg-white border rounded-tl-none'
                        }`}
                      >
                        {message.type === 'template' ? (
                          <div className="bg-gray-50 p-3 rounded border">
                            <p className="text-sm font-medium mb-1">Template: {message.template_name}</p>
                            <p className="text-sm">{message.text}</p>
                            {message.parameters && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                Parameters: {JSON.stringify(message.parameters)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">{message.text}</p>
                        )}
                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                          message.sender === 'user' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          <span>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.sender === 'user' && (
                            <span className="ml-1">
                              {getStatusIcon(message.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sending}
                    className="bg-[#25D366] hover:bg-[#1da851]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}