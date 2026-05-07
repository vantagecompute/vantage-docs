import React, { useRef, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function ChatSidePanel(): React.JSX.Element {
  const { isOpen, toggleChat, chat } = useChatContext();
  const { messages, sendMessage, status, error, regenerate } = chat;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  const isBusy = status === 'streaming' || status === 'submitted';

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    userScrolledUpRef.current = el.scrollHeight - el.scrollTop - el.clientHeight > 10;
  };

  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    document.body.classList.toggle('chat-open', isOpen);
    return () => document.body.classList.remove('chat-open');
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) toggleChat();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleChat]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed && !isBusy) {
      userScrolledUpRef.current = false;
      sendMessage(trimmed);
      setInput('');
    }
  };

  return (
    <div className={`${styles.wrap} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Ask AI</span>
        <button type="button" className={styles.closeBtn} onClick={toggleChat} aria-label="Close chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>{error?.message || 'Sorry, something went wrong.'}</span>
          <button type="button" className={styles.retryBtn} onClick={() => regenerate()}>
            Retry
          </button>
        </div>
      )}

      <div ref={messagesContainerRef} className={styles.messages} onScroll={handleScroll} aria-live="polite">
        {messages.length === 0 ? (
          <div className={styles.emptyState}>Ask a question about Vantage Compute...</div>
        ) : (
          messages.map((m) => {
            const showDots =
              m.role === 'assistant' && !m.parts[0]?.text && status === 'streaming';
            return (
              <div
                key={m.id}
                className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                {showDots ? (
                  <div className={styles.loadingDots}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                ) : (
                  m.parts.map((part, i) => part.type === 'text' ? <span key={i}>{part.text}</span> : null)
                )}
              </div>
            );
          })
        )}
        {status === 'submitted' && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.loadingDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          placeholder="Ask a question..."
          onChange={(e) => setInput(e.target.value)}
          disabled={isBusy}
          aria-label="Ask the docs"
        />
        <button type="submit" className={styles.sendBtn} disabled={isBusy || !input.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </svg>
        </button>
      </form>
    </div>
  );
}
