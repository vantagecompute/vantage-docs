// src/components/ChatSidePanel/index.tsx
import React from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function ChatSidePanel(): React.JSX.Element {
  const { isOpen, toggleChat, chat } = useChatContext();
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = chat;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className={`${styles.wrap} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Ask AI</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={toggleChat}
          aria-label="Close chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>Sorry, something went wrong. Please try again.</span>
          <button type="button" className={styles.retryBtn} onClick={() => reload()}>
            Retry
          </button>
        </div>
      )}

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            Ask a question about Vantage Compute...
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
              {m.content}
              {m.role === 'assistant' && m.content === '' && isLoading && (
                <div className={styles.loadingDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className={styles.inputArea} onSubmit={onSubmit}>
        <input
          className={styles.input}
          value={input}
          placeholder="Ask a question..."
          onChange={handleInputChange}
          disabled={isLoading}
          aria-label="Ask the docs"
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={isLoading || !input.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </svg>
        </button>
      </form>
    </div>
  );
}
