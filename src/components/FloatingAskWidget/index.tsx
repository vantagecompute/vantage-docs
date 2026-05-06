// src/components/FloatingAskWidget/index.tsx
import React from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function FloatingAskWidget(): React.JSX.Element {
  const { isOpen, toggleChat } = useChatContext();
  return (
    <div className={`${styles.wrap} ${isOpen ? styles.active : ''}`}>
      <button
        type="button"
        className={styles.bar}
        onClick={toggleChat}
        aria-label="Ask AI">
        <span className={styles.text}>Ask AI</span>
        <kbd className={styles.kbd}>⌘I</kbd>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          aria-hidden="true"
          className={isOpen ? styles.rotated : ''}>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="6 11 12 5 18 11" />
        </svg>
      </button>
    </div>
  );
}
