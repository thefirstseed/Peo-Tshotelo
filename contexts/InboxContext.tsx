import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { Conversation } from '../types';
import { useAuth } from '../hooks/useAuth';
import { fetchConversations } from '../api/api';

interface InboxContextType {
  conversations: Conversation[];
  unreadCount: number;
  isLoading: boolean;
  markConversationAsRead: (conversationId: string) => void;
}

export const InboxContext = createContext<InboxContextType | undefined>(undefined);

export const InboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      return;
    }

    setIsLoading(true);
    fetchConversations(user.id)
      .then(setConversations)
      .catch(err => {
        console.error("Failed to fetch conversations:", err);
        setConversations([]);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const unreadCount = useMemo(() => {
    return conversations.filter(c => c.unread && c.lastMessage.senderId !== user?.id).length;
  }, [conversations, user]);

  const markConversationAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unread: false } : c))
    );
    // In a real app, this would also make an API call:
    // api.markConversationAsRead(conversationId);
  };

  const value = {
    conversations,
    unreadCount,
    isLoading,
    markConversationAsRead,
  };

  return (
    <InboxContext.Provider value={value}>
      {children}
    </InboxContext.Provider>
  );
};

export const useInbox = () => {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
};