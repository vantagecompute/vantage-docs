import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const algoliaProvider = createOpenAICompatible({
  baseURL: 'https://mpyyynenh9.algolia.net/agent-studio/1/agents/3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df/completions?compatibilityMode=ai-sdk-5',
  headers: {
    'x-algolia-application-id': 'MPYYYNENH9',
    'x-algolia-api-key': 'b3cadb2f7da0194ead335c3488237443',
  },
});

interface ChatContextValue {
  isOpen: boolean;
  toggleChat: () => void;
  chat: ReturnType<typeof useChat>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat({
    model: algoliaProvider(''),
  });

  const toggleChat = useCallback(() => {
    setIsOpen((o) => !o);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        toggleChat();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleChat]);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, chat }}>
      {children}
    </ChatContext.Provider>
  );
}
