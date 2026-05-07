// src/components/AskAIButton/index.tsx
import React from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function AskAIButton({ onClick }: { onClick?: () => void } = {}): React.JSX.Element {
  const { isOpen, toggleChat } = useChatContext();
  return (
    <div className={`${styles.wrap} ${isOpen ? styles.active : ''}`} data-navbar-ask-ai>
      <button
        type="button"
        className={styles.btn}
        onClick={onClick ?? toggleChat}
        aria-expanded={isOpen}
        aria-haspopup="dialog">
        <svg
          className={styles.spark}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2">
          <path d="M12 3l1.9 5.7L19.6 10l-5.7 1.3L12 17l-1.9-5.7L4.4 10l5.7-1.3z" />
        </svg>
        <span>Ask AI</span>
      </button>
    </div>
  );
}
