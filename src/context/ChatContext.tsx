import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const ALGOLIA_URL =
  'https://mpyyynenh9.algolia.net/agent-studio/1/agents/3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df/completions?stream=true&compatibilityMode=ai-sdk-5';

const ALGOLIA_HEADERS = {
  'Content-Type': 'application/json',
  'x-algolia-application-id': 'MPYYYNENH9',
  'x-algolia-api-key': 'b3cadb2f7da0194ead335c3488237443',
};

export type TextPart = { type: 'text'; text: string };
export type Message = { id: string; role: 'user' | 'assistant'; parts: TextPart[] };
type ChatStatus = 'idle' | 'submitted' | 'streaming';

function useAlgoliaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  messagesRef.current = messages;

  const sendMessage = useCallback(async (text: string) => {
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      parts: [{ type: 'text', text }],
    };
    const history = [...messagesRef.current, userMsg];
    setMessages(history);
    setStatus('submitted');
    setError(null);

    const assistantId = Math.random().toString(36).slice(2);

    try {
      const res = await fetch(ALGOLIA_URL, {
        method: 'POST',
        headers: ALGOLIA_HEADERS,
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role,
            parts: [{ type: 'text', text: m.parts[0].text }],
          })),
        }),
        signal: abort.signal,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`API error ${res.status}: ${body.slice(0, 300)}`);
      }
      if (!res.body) throw new Error('No response body');

      setStatus('streaming');
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', parts: [{ type: 'text', text: '' }] },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split('\n');
        buf = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;

          const applyDelta = (delta: string) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, parts: [{ type: 'text', text: m.parts[0].text + delta }] }
                  : m
              )
            );
          };

          try {
            // Algolia native: { type: "text-delta", delta: "..." }
            // OpenAI SSE:     { choices: [{ delta: { content: "..." } }] }
            const event = JSON.parse(data);
            const delta =
              event.type === 'text-delta'
                ? event.delta
                : event.choices?.[0]?.delta?.content;
            if (delta) applyDelta(delta);
          } catch {
            // AI SDK v5 stream protocol: 0:"text chunk"
            if (data.startsWith('0:')) {
              try {
                const delta = JSON.parse(data.slice(2));
                if (typeof delta === 'string' && delta) applyDelta(delta);
              } catch { /* ignore */ }
            }
          }
        }
      }

      setStatus('idle');
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[ChatContext] error:', err);
        setError(err as Error);
        setStatus('idle');
      }
    }
  }, []);

  const regenerate = useCallback(() => {
    const msgs = messagesRef.current;
    const lastUserIdx = [...msgs].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;
    const idx = msgs.length - 1 - lastUserIdx;
    const text = msgs[idx].parts[0].text;
    setMessages(msgs.slice(0, idx));
    sendMessage(text);
  }, [sendMessage]);

  return { messages, sendMessage, status, error, regenerate };
}

interface ChatContextValue {
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  chat: ReturnType<typeof useAlgoliaChat>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within a ChatProvider');
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useAlgoliaChat();
  const toggleChat = useCallback(() => setIsOpen((o) => !o), []);
  const openChat = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, openChat, chat }}>
      {children}
    </ChatContext.Provider>
  );
}
