import { create } from 'zustand';
import { Chat, Message } from '@/types';

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  setSelectedChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  isLoading: false,

  setChats: (chats) => set({ chats }),
  
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  
  updateMessageStatus: (messageId, status) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === messageId ? { ...msg, status } : msg
    ),
  })),
  
  clearMessages: () => set({ messages: [] }),
}));
